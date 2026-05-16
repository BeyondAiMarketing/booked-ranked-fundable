import { Link } from "@tanstack/react-router";

export default function PublicFooter() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs">
              BRF
            </div>
            <span className="font-semibold text-white text-sm">
              Booked Ranked Fundable
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-xs">
            Built for local service businesses that need more bookings, better
            rankings, and a stronger foundation for growth.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
            Industries
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/plumbing"
                className="hover:text-white transition-colors"
              >
                Plumbing
              </Link>
            </li>
            <li>
              <Link
                to="/restoration"
                className="hover:text-white transition-colors"
              >
                Restoration
              </Link>
            </li>
            <li>
              <Link to="/hvac" className="hover:text-white transition-colors">
                HVAC
              </Link>
            </li>
            <li>
              <Link
                to="/carpet-cleaning"
                className="hover:text-white transition-colors"
              >
                Carpet Cleaning
              </Link>
            </li>
            <li>
              <Link
                to="/roofing"
                className="hover:text-white transition-colors"
              >
                Roofing
              </Link>
            </li>
            <li>
              <Link
                to="/med-spa"
                className="hover:text-white transition-colors"
              >
                Med Spa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
            Platform
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/free-audit"
                className="hover:text-white transition-colors"
              >
                Free Business Audit
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Dashboard Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
            Company
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>
          &copy; {year} Booked Ranked Fundable. Built on Internet Computer
          Protocol.
        </p>
        <p>
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
