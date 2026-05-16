import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  ChevronDown,
  Crown,
  DollarSign,
  Globe,
  LayoutGrid,
  Menu,
  PlayCircle,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const INDUSTRIES = [
  { label: "Plumbing", href: "/plumbing", icon: "🔧" },
  { label: "Restoration", href: "/restoration", icon: "💧" },
  { label: "HVAC", href: "/hvac", icon: "❄️" },
  { label: "Carpet Cleaning", href: "/carpet-cleaning", icon: "✨" },
  { label: "Roofing", href: "/roofing", icon: "🏠" },
  { label: "Med Spa", href: "/med-spa", icon: "💆" },
  { label: "Real Estate Agents/Brokers", href: "/real-estate", icon: "🏡" },
  { label: "Mortgage Brokers", href: "/mortgage", icon: "🏦" },
  { label: "Chiropractors", href: "/chiropractor", icon: "⚕️" },
  { label: "Dental Practices", href: "/dental", icon: "🦷" },
];

function ExploreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-ocid="nav.explore.toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10 min-h-[44px]"
      >
        <LayoutGrid size={14} className="text-purple-400" />
        Explore
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            data-ocid="nav.explore.dropdown_menu"
          >
            {/* Pages section */}
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Pages
              </p>
            </div>
            <div className="pb-1">
              {[
                { label: "Home", href: "/", Icon: Globe },
                { label: "Pricing", href: "/pricing", Icon: DollarSign },
                { label: "Free Audit", href: "/free-audit", Icon: BarChart3 },
                {
                  label: "Agency Partners",
                  href: "/agency-partners",
                  Icon: Users,
                },
                { label: "See The Live Demo", href: "/demo", Icon: PlayCircle },
              ].map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  to={href as any}
                  onClick={() => setOpen(false)}
                  data-ocid="nav.explore.page.link"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
                >
                  <Icon
                    size={14}
                    className="text-slate-500 group-hover:text-purple-400 transition-colors shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Industries section */}
            <div className="border-t border-white/8 px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Industries We Serve
              </p>
            </div>
            <div className="grid grid-cols-2 gap-0.5 px-2 pb-3">
              {INDUSTRIES.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  to={href as any}
                  onClick={() => setOpen(false)}
                  data-ocid="nav.explore.industry.link"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IndustriesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-ocid="nav.industries.toggle"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
        aria-expanded={open}
      >
        Industries
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute top-full left-0 mt-2 w-52 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            data-ocid="nav.industries.dropdown_menu"
          >
            {INDUSTRIES.map(({ label, href, icon }) => (
              <Link
                key={label}
                to={href as any}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                data-ocid="nav.industries.link"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                  {label}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LOGIN_PATHS = [
  {
    role: "superAdmin",
    label: "App Owner / Admin",
    description: "Full platform control",
    icon: Crown,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    accentColor: "group-hover:text-amber-300",
  },
  {
    role: "agency",
    label: "Agency / Partner",
    description: "White-label reseller access",
    icon: ShieldCheck,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    accentColor: "group-hover:text-violet-300",
  },
  {
    role: "client",
    label: "Client Login",
    description: "Your business dashboard",
    icon: Building2,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    accentColor: "group-hover:text-indigo-300",
  },
  {
    role: "demo",
    label: "Demo Access",
    description: "No account needed",
    icon: PlayCircle,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    accentColor: "group-hover:text-purple-300",
  },
] as const;

function LoginDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleSelect = (role: string) => {
    setOpen(false);
    const dest = role === "demo" ? "/demo-login" : `/login?role=${role}`;
    navigate({ to: dest as any });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-ocid="nav.login.toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
      >
        Login
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            data-ocid="nav.login.dropdown_menu"
          >
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Choose Access Path
              </p>
            </div>
            {LOGIN_PATHS.map(
              ({
                role,
                label,
                description,
                icon: Icon,
                iconColor,
                iconBg,
                accentColor,
              }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelect(role)}
                  data-ocid={`nav.login.${role}.button`}
                  className="group flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={15} className={iconColor} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium text-slate-200 ${accentColor} transition-colors`}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {description}
                    </p>
                  </div>
                </button>
              ),
            )}
            <div className="px-4 py-3 border-t border-white/5">
              <p className="text-[10px] text-slate-600 text-center">
                New here?{" "}
                <Link
                  to="/free-audit"
                  onClick={() => setOpen(false)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Start with a free audit
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileIndustriesOpen(false);
    setMobileLoginOpen(false);
  };

  const handleMobileLoginSelect = (role: string) => {
    closeMobile();
    const dest = role === "demo" ? "/demo-login" : `/login?role=${role}`;
    navigate({ to: dest as any });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/97 backdrop-blur-md border-b border-white/10 shadow-2xl"
            : "bg-slate-900/85 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-lg">
              BRF
            </div>
            <span className="font-semibold text-white text-sm hidden sm:block">
              Booked Ranked Fundable
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              data-ocid="nav.home.link"
              className="text-sm font-medium text-slate-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <IndustriesDropdown />
            <Link
              to="/pricing"
              data-ocid="nav.pricing.link"
              className="text-sm font-medium text-slate-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/free-audit"
              data-ocid="nav.free_audit.link"
              className="text-sm font-medium text-slate-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Free Audit
            </Link>
            <Link
              to="/agency-partners"
              data-ocid="nav.partners.link"
              className="text-sm font-medium text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors"
            >
              Partners
            </Link>
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-2">
            <ExploreDropdown />
            <LoginDropdown />
            <Link to="/free-audit">
              <Button
                data-ocid="nav.get_audit.button"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50 font-semibold"
              >
                Get Free Audit
              </Button>
            </Link>
            {/* ── Prominent Demo Button ── */}
            <Link to="/demo">
              <Button
                data-ocid="nav.live_demo.button"
                size="sm"
                className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/60 border-0 px-4 animate-nav-pulse"
              >
                <Zap size={13} className="mr-1.5" />
                See The Live Demo Now
                {/* Pulse ring */}
                <span className="absolute -inset-px rounded-md ring-1 ring-purple-500/50 animate-ping opacity-30" />
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            data-ocid="nav.mobile_menu.toggle"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 w-full"
              onClick={closeMobile}
              aria-label="Close menu"
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-white/10 overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold text-xs">
                    BRF
                  </div>
                  <span className="font-semibold text-white text-sm">Menu</span>
                </div>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {/* ── Mobile Primary Demo CTA — top of menu ── */}
                <Link to="/demo" onClick={closeMobile}>
                  <button
                    type="button"
                    data-ocid="nav.mobile_demo_primary.button"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-3 rounded-xl mb-3 shadow-lg shadow-purple-900/50 transition-all duration-200 text-sm"
                  >
                    <Zap size={15} />
                    See The Live Demo Now
                  </button>
                </Link>

                <Link
                  to="/"
                  onClick={closeMobile}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium text-white">Home</span>
                </Link>

                {/* Industries expandable */}
                <div>
                  <button
                    type="button"
                    data-ocid="nav.mobile_industries.toggle"
                    onClick={() => setMobileIndustriesOpen((o) => !o)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm font-medium text-white">
                      Industries
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-200 transition-transform duration-200 ${
                        mobileIndustriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileIndustriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-1 space-y-0.5">
                          {INDUSTRIES.map(({ label, href, icon }) => (
                            <Link
                              key={label}
                              to={href as any}
                              onClick={closeMobile}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <span className="text-base">{icon}</span>
                              <span className="text-sm text-slate-200">
                                {label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/pricing"
                  onClick={closeMobile}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium text-white">
                    Pricing
                  </span>
                </Link>

                <Link
                  to="/agency-partners"
                  onClick={closeMobile}
                  data-ocid="nav.mobile_partners.link"
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <span className="text-sm font-medium text-purple-300">
                    Partners
                  </span>
                </Link>

                <Link
                  to="/free-audit"
                  onClick={closeMobile}
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium text-white">
                    Free Audit
                  </span>
                </Link>

                <Link
                  to="/demo"
                  onClick={closeMobile}
                  data-ocid="nav.mobile_live_demo.link"
                  className="flex items-center px-3 py-2.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                >
                  <span className="text-sm font-medium text-indigo-400">
                    See The Live Demo
                  </span>
                </Link>

                {/* Mobile Explore expandable */}
                <div>
                  <button
                    type="button"
                    data-ocid="nav.mobile_explore.toggle"
                    onClick={() => setMobileOpen((o) => o)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm font-medium text-purple-300">
                      Explore All Pages
                    </span>
                    <LayoutGrid size={14} className="text-purple-400" />
                  </button>
                  <div className="pl-3 py-1 space-y-0.5">
                    {[
                      { label: "Pricing", href: "/pricing" },
                      { label: "Free Audit", href: "/free-audit" },
                      { label: "Agency Partners", href: "/agency-partners" },
                      { label: "Live Demo", href: "/demo" },
                    ].map(({ label, href }) => (
                      <Link
                        key={href}
                        to={href as any}
                        onClick={closeMobile}
                        data-ocid="nav.mobile_explore.link"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span className="text-sm text-slate-300">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 my-3 pt-3 space-y-2">
                  <Link to="/free-audit" onClick={closeMobile}>
                    <Button
                      data-ocid="nav.mobile_get_audit.button"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                      Get Free Audit
                    </Button>
                  </Link>

                  {/* Mobile Login expandable */}
                  <div>
                    <button
                      type="button"
                      data-ocid="nav.mobile_login.toggle"
                      onClick={() => setMobileLoginOpen((o) => !o)}
                      className="flex items-center justify-between w-full border border-white/20 text-white hover:bg-white/10 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Login
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${mobileLoginOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileLoginOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                          data-ocid="nav.mobile_login.dropdown_menu"
                        >
                          <div className="mt-1 bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
                            {LOGIN_PATHS.map(
                              ({
                                role,
                                label,
                                description,
                                icon: Icon,
                                iconColor,
                                iconBg,
                              }) => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => handleMobileLoginSelect(role)}
                                  data-ocid={`nav.mobile_login.${role}.button`}
                                  className="group flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
                                  >
                                    <Icon size={14} className={iconColor} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-200">
                                      {label}
                                    </p>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {description}
                                    </p>
                                  </div>
                                </button>
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
