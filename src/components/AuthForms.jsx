import { useState } from "react";
import { authenticate } from "../services/integrations";

const fieldClass =
  "mt-2 h-12 w-full border border-line bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-moss focus:ring-1 focus:ring-moss"

export default function AuthForms() {
  const [mode, setMode] = useState("login")
  const [state, setState] = useState({});
  const [pending, setPending] = useState(false);
  const isLogin = mode === 'login';
  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setState({});
    try {
      const result = await authenticate(mode, Object.fromEntries(new FormData(event.currentTarget)));
      setState({error: result.message});
    } catch {
      setState({error: 'Account access is unavailable. Please try again later.'});
    } finally { setPending(false); }
  }

  return (
    <div className="bg-canvas p-6 sm:p-9">
      <div
        className="mb-8 flex border-b border-line"
        role="tablist"
        aria-label="Account access"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isLogin}
          onClick={() => { setMode("login"); setState({}); }}
          className={`flex-1 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-widest ${
            isLogin ? "border-moss text-ink" : "border-transparent text-muted"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isLogin}
          onClick={() => { setMode("signup"); setState({}); }}
          className={`flex-1 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-widest ${
            !isLogin ? "border-moss text-ink" : "border-transparent text-muted"
          }`}
        >
          Create account
        </button>
      </div>

      <p className="mb-5 text-sm text-muted">Frontend preview: accounts are not connected. Details are not sent or saved.</p>
      <form onSubmit={submit} key={mode}>
        {!isLogin && (
          <label className="block text-sm font-bold">
            Your name
            <input
              className={fieldClass}
              name="name"
              autoComplete="name"
              required
            />
          </label>
        )}
        <label
          className={`${isLogin ? "block" : "mt-5 block"} text-sm font-bold`}
        >
          Email address
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="mt-5 block text-sm font-bold">
          Password
          <input
            className={fieldClass}
            name="password"
            type="password"
            minLength={8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
        </label>

        {state.error && (
          <p
            className="mt-4 border-l-2 border-red-700 pl-3 text-sm text-red-800"
            role="alert"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-7 w-full bg-ink px-6 py-4 font-bold text-white transition-colors hover:bg-moss disabled:cursor-wait disabled:opacity-60"
        >
          {pending
            ? "Please wait…"
            : isLogin
              ? "Log in to TravelPoint"
              : "Create my account"}
        </button>
      </form>
    </div>
  )
}
