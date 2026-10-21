import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Link } from "react-router"


const navigation = [
  { label: "Countries", to: "/destinations", key: "destinations" },
  { label: "Stories", to: "/stories", key: "stories" },
]

function Header() {
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
              className="hidden items-stretch text-xs font-bold uppercase tracking-widest lg:flex"
              aria-label="Primary navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  className={`flex items-center px-5 outline-none transition-colors focus-visible:bg-white/10 focus-visible:text-white ${
                    active === item.key
                      ? "border-x border-b-2 border-x-tide/35 border-b-sun bg-tide/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  to={item.to}
                  aria-current={active === item.key ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link to="/login" className="px-3 py-3 text-xs font-bold uppercase tracking-widest hover:text-sun">Log in</Link>

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
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-2 py-4 text-sm font-bold uppercase tracking-widest">Log in</Link>
          </nav>
        )}
      </header>
      <div className="h-20" aria-hidden="true" />
    </>
  )
}

export default Header
