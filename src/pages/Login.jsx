import AuthForms from '../components/AuthForms';
export default function Login() {
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
                This frontend preview does not create accounts or store credentials.
              </p>
            </div>
            <AuthForms />
          </div>
        </section>

      </main>
    </>
  )
}
