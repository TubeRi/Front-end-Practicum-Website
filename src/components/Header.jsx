import { Link, NavLink } from 'react-router';

const container = 'mx-auto w-[calc(100%-48px)] max-w-[1200px] min-[901px]:w-[calc(100%-96px)]';

export default function Header({ onPlan }) {
  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-white/10 bg-[#14211e] text-white">
      <div className={`${container} flex min-h-20 flex-wrap items-stretch gap-0 min-[651px]:flex-nowrap min-[651px]:gap-3 min-[901px]:gap-6`}>
        <Link to="/" aria-label="TravelPoint home" className="mr-auto flex h-[66px] items-center font-display text-2xl min-[651px]:h-auto min-[651px]:text-[26px]">TravelPoint</Link>
        <nav aria-label="Main navigation" className="order-3 flex min-h-14 w-full justify-between text-[10px] font-bold tracking-[1.5px] uppercase min-[651px]:order-none min-[651px]:w-auto min-[651px]:text-[11px]">
          {['About', 'Destinations', 'Stories'].map(label => <NavLink key={label} to={`/${label.toLowerCase()}`} className={({ isActive }) => `flex items-center border-b-2 px-2.5 py-4 min-[651px]:px-3.5 min-[901px]:px-6 hover:bg-white/5 hover:text-white ${isActive ? 'border-gold bg-[#31584c25] text-white' : 'border-transparent text-white/65'}`}>{label}</NavLink>)}
        </nav>
        <button type="button" onClick={onPlan} className="my-[15px] flex h-9 items-center gap-[18px] border border-gold/60 bg-gold px-3 text-[9px] font-bold tracking-[0.6px] text-[#14211e] uppercase transition hover:bg-[#f1ca70] min-[651px]:my-4 min-[651px]:h-auto min-[651px]:text-[11px] min-[901px]:px-5">Plan your trip <span aria-hidden="true">↗</span></button>
      </div>
    </header>
  );
}
