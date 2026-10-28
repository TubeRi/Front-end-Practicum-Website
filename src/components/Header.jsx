import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Link } from "react-router"


const navigation = [
  { label: "Countries", to: "/destinations", key: "destinations" },
  { label: "Stories", to: "/stories", key: "stories" },
]

function Header() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const active = pathname.startsWith("/destinations") ? "destinations" : pathname.startsWith("/stories") ? "stories" : "";
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-night/95 text-white backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-stretch justify-between px-5 sm:px-6 lg:px-10">
          <Link
            to="/"
            className="flex shrink-0 items-center font-display text-2xl tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sun"
            aria-label="TravelPoint home"
            onClick={() => setMenuOpen(false)}
          >
            TravelPoint
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav
              className="hidden self-stretch items-stretch gap-2 py-3 text-xs font-bold uppercase tracking-widest lg:flex"
              aria-label="Primary navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  className={`flex items-center justify-center border-x border-b-2 px-6 py-4 outline-none transition-colors duration-200 focus-visible:bg-white/10 focus-visible:text-white motion-reduce:transition-none ${
                    active === item.key
                      ? "border-x-tide/35 border-b-sun bg-tide/10 text-white hover:bg-tide/20"
                      : "border-x-transparent border-b-transparent text-white/60 hover:border-b-sun/60 hover:bg-white/5 hover:text-white"
                  }`}
                  to={item.to}
                  aria-current={active === item.key ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user && (
              <Link to="/account" aria-label="My profile" title="My profile" aria-current={pathname === '/account' ? 'page' : undefined} onClick={() => setMenuOpen(false)} className={'flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors hover:border-sun hover:bg-tide/20 hover:text-sun focus-visible:ring-2 focus-visible:ring-sun ' + (pathname === '/account' ? 'border-sun bg-tide/20 text-sun' : 'border-white/25 text-white/80')}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
              </Link>
            )}

            {user ? <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="hidden border-b-2 border-transparent px-3 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:border-sun hover:bg-white/5 hover:text-sun lg:block lg:px-6" aria-label="Log out of demo account">Log out</button> : <Link to="/login" className="flex items-center justify-center border-x border-b-2 border-x-transparent border-b-transparent px-3 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:border-b-sun/60 hover:bg-white/5 hover:text-sun focus-visible:bg-white/10 focus-visible:text-sun motion-reduce:transition-none lg:px-6">Log in</Link>}

            <button
              type="button"
              className="flex size-11 cursor-pointer items-center justify-center border border-white/20 outline-none transition-colors hover:border-sun hover:text-sun focus-visible:ring-2 focus-visible:ring-sun lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span className="text-xl" aria-hidden="true">
                {menuOpen ? "×" : "≡"}
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="border-t border-white/10 bg-night px-5 pb-5 pt-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-white/10 px-2 py-4 text-sm font-bold uppercase tracking-widest outline-none transition-colors hover:text-sun focus-visible:text-sun ${
                  active === item.key ? "text-sun" : "text-white/75"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="block w-full border-b border-white/10 px-2 py-4 text-left text-sm font-bold uppercase tracking-widest hover:text-sun">Log out</button> : <Link to="/login" onClick={() => setMenuOpen(false)} className="block border-b border-white/10 px-2 py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-200 hover:border-sun/60 hover:bg-white/5 hover:text-sun focus-visible:bg-white/10 focus-visible:text-sun motion-reduce:transition-none">Log in</Link>}
          </nav>
        )}
      </header>
      <div className="h-20" aria-hidden="true" />
    </>
  )
}

export default Header
