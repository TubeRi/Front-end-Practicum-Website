import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/integrations";
const AccountContext = createContext(null);
const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  addressExtra: "",
  city: "",
  postalCode: "",
  country: "",
  hobbies: "",
  bio: "",
  travelStyle: "A mix of everything",
};
export function AccountProvider({ children }) {
  const { user } = useAuth();
  return (
    <AccountState key={user?.id || "guest"} user={user}>
      {children}
    </AccountState>
  );
}
function AccountState({ user, children }) {
  const [data, setData] = useState({
    profile: {
      ...emptyProfile,
      name: user?.name || "",
      email: user?.email || "",
    },
    trips: [],
    reviews: [],
    paymentMethods: [],
    defaultPaymentId: "",
  });
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");
  async function refreshAccount() {
    const result = await api("/account");
    setData({ ...result, profile: { ...emptyProfile, ...result.profile } });
    setError("");
  }
  useEffect(() => {
    if (!user) return;
    let active = true;
    api("/account")
      .then((result) => {
        if (active)
          setData({
            ...result,
            profile: { ...emptyProfile, ...result.profile },
          });
      })
      .catch((issue) => {
        if (active) setError(issue.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);
  async function change(path, method, body) {
    await api(path, {
      method,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    await refreshAccount();
  }
  const saveProfile = (values) => change("/profile", "PUT", values);
  const addPaymentMethod = (type, label) =>
    change("/payment-preferences", "POST", {
      type,
      label:
        label.trim() ||
        {
          card: "Credit / debit card",
          paypal: "PayPal",
          "apple-pay": "Apple Pay",
          "google-pay": "Google Pay",
          "bank-transfer": "Bank transfer",
        }[type],
    });
  const removePaymentMethod = (id) =>
    change("/payment-preferences/" + id, "DELETE");
  const setPreferredPayment = (id) =>
    change("/payment-preferences/" + id + "/default", "PUT");
  return (
    <AccountContext.Provider
      value={{
        ...data,
        loading,
        error,
        refreshAccount,
        saveProfile,
        addPaymentMethod,
        removePaymentMethod,
        setPreferredPayment,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
export function useAccount() {
  return useContext(AccountContext);
}
