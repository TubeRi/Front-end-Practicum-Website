import { demoLoginEnabled } from '../services/demoAuth';
import AuthForms from '../components/AuthForms';
import { useSearchParams, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getAuthReturnPath } from '../services/authNavigation';
export default function Login() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const returnPath = getAuthReturnPath(searchParams.get('returnTo'));
  const storyRequested = returnPath === '/stories#write-review';
  const bookingRequested = returnPath.startsWith('/book/');
  if (user) return <Navigate replace to={getAuthReturnPath(searchParams.get('returnTo'))} />;
  return (
    <>
      <main className="min-h-screen bg-canvas text-ink">

        <section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-5xl overflow-hidden bg-ink shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between p-8 text-white sm:p-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sun">
                  Traveler account
                </p>
                <h1 className="mt-5 max-w-md font-display text-5xl leading-none sm:text-6xl">
                  Keep your next journey close.
                </h1>
                <p className="mt-6 max-w-md leading-relaxed text-white/65">
                  Preview your TravelPoint sign-in experience, or create an
                  account when account services are connected.
                </p>
              </div>
              <p className="mt-14 border-t border-white/15 pt-6 text-sm text-white/55">
                {demoLoginEnabled ? 'Temporary demo access is available while running the development server. It unlocks frontend previews only.' : 'This frontend preview does not create accounts or store credentials.'}
              </p>
            </div>
            <div>
              {bookingRequested && <p role="status" className="border-b border-line bg-sand px-6 py-5 text-sm font-bold text-ink sm:px-9">Please log in to book your trip. Your selected journey and traveler count are kept in the return link. {demoLoginEnabled ? 'Use the demo admin credentials below to continue.' : 'Account services are not connected yet, so booking remains unavailable in this preview.'}</p>}
              {storyRequested && <p role="status" className="border-b border-line bg-sand px-6 py-5 text-sm font-bold text-ink sm:px-9">Please log in to write your testimonial. After login, you’ll return to the story form. {demoLoginEnabled ? 'Use the demo admin credentials below to continue.' : 'Account services are not connected yet, so writing remains unavailable in this preview.'}</p>}
              <AuthForms />
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
