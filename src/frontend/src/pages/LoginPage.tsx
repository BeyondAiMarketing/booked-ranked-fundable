import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Crown, PlayCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";

// App Owner / Platform Super Admin
const ADMIN_USERNAME = "admin123";
const ADMIN_EMAIL = "daree1933@gmail.com";
const ADMIN_PASSWORD = "admin123";

// White Label Agency Admin
const AGENCY_USERNAME = "agencyAdmin";
const AGENCY_PASSWORD = "agency123";

const CLIENT_CREDS: Record<string, { tenantId: string }> = {
  "plumbing@demo.com": { tenantId: "tenant-plumbing" },
  "medspa@demo.com": { tenantId: "tenant-medspa" },
  "oceanside@demo.com": { tenantId: "tenant-oceanside" },
};

type Path = "superAdmin" | "agency" | "client" | null;

export default function LoginPage() {
  const [activePath, setActivePath] = useState<Path>(null);

  // Pre-select card from ?role= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") as Path;
    if (role && ["superAdmin", "agency", "client"].includes(role)) {
      setActivePath(role);
    }
  }, []);

  // Super Admin fields
  const [adminUser, setAdminUser] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  // Agency Admin fields
  const [agencyUser, setAgencyUser] = useState("");
  const [agencyPass, setAgencyPass] = useState("");
  const [agencyError, setAgencyError] = useState("");

  // Client fields
  const [clientEmail, setClientEmail] = useState("");
  const [clientPass, setClientPass] = useState("");
  const [clientError, setClientError] = useState("");

  const { login, onboardingComplete, agencyOnboardingComplete } = useApp();
  const navigate = useNavigate();

  const handleSuperAdminLogin = () => {
    if (
      adminUser === ADMIN_USERNAME &&
      adminEmail === ADMIN_EMAIL &&
      adminPass === ADMIN_PASSWORD
    ) {
      // Super Admin always skips onboarding and goes straight to /admin
      login("superAdmin", "platform", true);
      navigate({ to: "/admin" });
    } else {
      setAdminError("Invalid platform admin credentials.");
    }
  };

  const handleAgencyLogin = () => {
    if (agencyUser === AGENCY_USERNAME && agencyPass === AGENCY_PASSWORD) {
      login("agency", "tenant-agency", true);
      if (!agencyOnboardingComplete) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } else {
      setAgencyError("Invalid agency credentials.");
    }
  };

  const handleClientLogin = () => {
    const match = CLIENT_CREDS[clientEmail.toLowerCase()];
    if (match && clientPass === "demo123") {
      login("client", match.tenantId, false);
      if (!onboardingComplete[match.tenantId]) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } else {
      setClientError("Invalid email or password.");
    }
  };

  const toggle = (path: Path) =>
    setActivePath((prev) => (prev === path ? null : path));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          BRF
        </div>
        <h1 className="text-3xl font-bold text-white">
          Booked Ranked Fundable
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Choose your access path to the platform
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ── Super Admin / Platform Owner Card ── */}
        <div
          className={`bg-slate-800/80 backdrop-blur border rounded-2xl p-5 shadow-xl transition-all ${
            activePath === "superAdmin"
              ? "border-amber-400 shadow-amber-500/20"
              : "border-slate-700"
          }`}
        >
          <button
            type="button"
            className="flex items-center gap-3 mb-4 w-full text-left"
            onClick={() => toggle("superAdmin")}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Crown size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                App Owner / Platform Admin
              </h2>
              <p className="text-slate-400 text-xs">Full platform control</p>
            </div>
          </button>

          {activePath === "superAdmin" ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Username
                </Label>
                <Input
                  value={adminUser}
                  onChange={(e) => {
                    setAdminUser(e.target.value);
                    setAdminError("");
                  }}
                  placeholder="admin username"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 h-9 text-sm"
                  data-ocid="superadmin.username.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Email
                </Label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    setAdminError("");
                  }}
                  placeholder="admin email"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 h-9 text-sm"
                  data-ocid="superadmin.email.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Password
                </Label>
                <Input
                  type="password"
                  value={adminPass}
                  onChange={(e) => {
                    setAdminPass(e.target.value);
                    setAdminError("");
                  }}
                  placeholder="password"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 h-9 text-sm"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSuperAdminLogin()
                  }
                  data-ocid="superadmin.password.input"
                />
              </div>
              {adminError && (
                <p
                  className="text-red-400 text-xs"
                  data-ocid="superadmin.login.error_state"
                >
                  {adminError}
                </p>
              )}
              <Button
                onClick={handleSuperAdminLogin}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold h-9 text-sm"
                data-ocid="superadmin.login.submit_button"
              >
                Sign In as Platform Owner
              </Button>
            </div>
          ) : (
            <p className="text-slate-500 text-xs">Click to expand login</p>
          )}
        </div>

        {/* ── White Label Agency Admin Card ── */}
        <div
          className={`bg-slate-800/80 backdrop-blur border rounded-2xl p-5 shadow-xl transition-all ${
            activePath === "agency"
              ? "border-violet-500 shadow-violet-500/20"
              : "border-slate-700"
          }`}
        >
          <button
            type="button"
            className="flex items-center gap-3 mb-4 w-full text-left"
            onClick={() => toggle("agency")}
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                White Label Partner
              </h2>
              <p className="text-slate-400 text-xs">Agency admin access</p>
            </div>
          </button>

          {activePath === "agency" ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Username
                </Label>
                <Input
                  value={agencyUser}
                  onChange={(e) => {
                    setAgencyUser(e.target.value);
                    setAgencyError("");
                  }}
                  placeholder="agency username"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-violet-500 h-9 text-sm"
                  data-ocid="agency.username.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Password
                </Label>
                <Input
                  type="password"
                  value={agencyPass}
                  onChange={(e) => {
                    setAgencyPass(e.target.value);
                    setAgencyError("");
                  }}
                  placeholder="password"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-violet-500 h-9 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleAgencyLogin()}
                  data-ocid="agency.password.input"
                />
              </div>
              {agencyError && (
                <p
                  className="text-red-400 text-xs"
                  data-ocid="agency.login.error_state"
                >
                  {agencyError}
                </p>
              )}
              <Button
                onClick={handleAgencyLogin}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold h-9 text-sm"
                data-ocid="agency.login.submit_button"
              >
                Sign In as Agency
              </Button>
              <p className="text-slate-500 text-[10px] text-center">
                Want to become a partner?{" "}
                <Link
                  to="/agency-partners"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Learn more
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-xs">Click to expand login</p>
          )}
        </div>

        {/* ── Client Dashboard Card ── */}
        <div
          className={`bg-slate-800/80 backdrop-blur border rounded-2xl p-5 shadow-xl transition-all ${
            activePath === "client"
              ? "border-indigo-500 shadow-indigo-500/20"
              : "border-slate-700"
          }`}
        >
          <button
            type="button"
            className="flex items-center gap-3 mb-4 w-full text-left"
            onClick={() => toggle("client")}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                Client Dashboard
              </h2>
              <p className="text-slate-400 text-xs">For active subscribers</p>
            </div>
          </button>

          {activePath === "client" ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Email
                </Label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => {
                    setClientEmail(e.target.value);
                    setClientError("");
                  }}
                  placeholder="your@email.com"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 h-9 text-sm"
                  data-ocid="client.email.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-300 mb-1 block">
                  Password
                </Label>
                <Input
                  type="password"
                  value={clientPass}
                  onChange={(e) => {
                    setClientPass(e.target.value);
                    setClientError("");
                  }}
                  placeholder="Password"
                  className="bg-slate-700/60 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 h-9 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleClientLogin()}
                  data-ocid="client.password.input"
                />
              </div>
              {clientError && (
                <p
                  className="text-red-400 text-xs"
                  data-ocid="client.login.error_state"
                >
                  {clientError}
                </p>
              )}
              <Button
                onClick={handleClientLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 text-sm"
                data-ocid="client.login.submit_button"
              >
                Sign In
              </Button>
              <p className="text-slate-500 text-xs text-center pt-1">
                Not a client yet?{" "}
                <Link
                  to="/pricing"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  View plans
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-xs">Click to expand login</p>
          )}
        </div>

        {/* ── Demo Card ── */}
        <div className="relative bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur border border-purple-500/60 rounded-2xl p-5 shadow-xl shadow-purple-500/10 ring-1 ring-purple-500/20">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              No Login Required
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
              <PlayCircle size={18} className="text-purple-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                Try the Platform Live
              </h2>
              <p className="text-purple-300 text-xs">
                See your business on the platform
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed mb-5">
            Enter your business details and we'll generate a live, personalized
            simulation of your dashboard in 60 seconds.
          </p>
          <Link to="/demo-login">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold h-10 text-sm shadow-lg shadow-purple-700/30"
              data-ocid="demo.launch.button"
            >
              Launch My Demo →
            </Button>
          </Link>
          <p className="text-purple-400/60 text-[10px] text-center mt-3">
            No credit card · No account · Takes 60 seconds
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600 mt-8">
        &copy; {new Date().getFullYear()} Booked Ranked Fundable. Built on
        Internet Computer infrastructure.
      </p>
    </div>
  );
}
