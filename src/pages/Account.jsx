import MyReviews from "../components/account/MyReviews";
import { useAccount } from "../context/AccountContext";
import ProfileForm from "../components/account/ProfileForm";
import TripHistory from "../components/account/TripHistory";
import PaymentPreferences from "../components/account/PaymentPreferences";

export default function Account() {
  const { profile, loading, error, refreshAccount } = useAccount();
  if (loading) return <main className="px-6 py-24">Loading your profile…</main>;
  if (error)
    return (
      <main className="px-6 py-24">
        <p role="alert">{error}</p>
        <button
          onClick={() => refreshAccount().catch(() => {})}
          className="mt-4 underline"
        >
          Try again
        </button>
      </main>
    );
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="bg-canvas text-ink">
      <section className="border-b border-line bg-ink px-5 py-12 text-white sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center">
          <span
            aria-hidden="true"
            className="grid size-20 shrink-0 place-items-center rounded-full bg-sun font-display text-3xl text-ink"
          >
            {initials || "TP"}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-sun">
              Your TravelPoint
            </p>
            <h1 className="mt-3 break-words font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Welcome, {profile.name.split(" ")[0] || "traveler"}.
            </h1>
            <p className="mt-4 text-white/65">
              Your details, your journeys, your way of traveling.
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-10 lg:py-14">
        <p className="mb-8 border-l-2 border-sun bg-sand/50 p-4 text-sm text-muted">
          Your details, bookings, and reviews are saved to your account. Use
          Stripe test checkout to pay for saved trips with fake money.
        </p>
        <nav
          aria-label="Profile sections"
          className="mb-8 flex flex-wrap gap-3 text-sm font-bold"
        >
          {[
            ["personal-details", "Personal details"],
            ["my-trips", "My trips"],
            ["payment-methods", "Payment preferences"],
            ["my-reviews", "My reviews"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={"#" + id}
              className="border border-line bg-white px-4 py-3 transition-colors hover:border-ink hover:bg-sand"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <ProfileForm />
          <div className="min-w-0 space-y-7">
            <TripHistory />
            <PaymentPreferences />
            <MyReviews />
          </div>
        </div>
      </div>
    </main>
  );
}
