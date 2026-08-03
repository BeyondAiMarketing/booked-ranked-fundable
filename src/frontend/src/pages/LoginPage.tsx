import { Link } from "@tanstack/react-router";
import { Building2, LockKeyhole, PlayCircle, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/85 p-6 md:p-10 shadow-2xl backdrop-blur">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
          BRF
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Booked Ranked Fundable
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Secure account access is being connected to the new BRF identity and
            database system. The previous browser-stored credentials have been
            removed for your protection.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={22} />
              <h2 className="font-semibold text-white">Secure access</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Owner, agency, and client logins will use authenticated accounts
              rather than passwords embedded in the website code.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-5">
            <div className="flex items-center gap-3">
              <Building2 className="text-indigo-400" size={22} />
              <h2 className="font-semibold text-white">Client onboarding</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              New organizations will receive isolated workspaces for their
              leads, bookings, ranked assessments, and funding-readiness
              workflows.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="w-full bg-indigo-600 hover:bg-indigo-500 sm:w-auto"
          >
            <Link to="/demo">
              <PlayCircle className="mr-2" size={18} />
              Try the live demo
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-slate-600 text-slate-200 sm:w-auto"
          >
            <Link to="/">
              <LockKeyhole className="mr-2" size={18} />
              Return to website
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
