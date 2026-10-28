import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useState } from "react";
import { useAccount } from "../context/AccountContext";
import BookingModal from "../components/BookingModal";
import { useCatalog } from "../context/CatalogContext";

export default function Booking() {
  const { destinations, destinationCategories } = useCatalog();
  const { loading, error } = useAccount();
  const { destinationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = destinations.find((item) => item.id === destinationId);
  const [travelers, setTravelers] = useState(() =>
    Math.min(
      10,
      Math.max(1, Math.floor(Number(searchParams.get("travelers"))) || 1),
    ),
  );

  if (loading) return <main className="px-6 py-24">Loading your account…</main>;
  if (error)
    return (
      <main className="px-6 py-24" role="alert">
        {error}
      </main>
    );
  if (!destination) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20">
        <h1 className="font-display text-4xl">Journey not found</h1>
        <Link to="/destinations" className="mt-6 inline-block underline">
          Explore destinations
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh]">
      <BookingModal
        destination={destination}
        travelers={travelers}
        onTravelersChange={setTravelers}
        onClose={() => navigate("/destinations", { replace: true })}
      />
    </main>
  );
}
