import Image from "next/image";
import { loginAdminAction } from "@/lib/admin-auth-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg px-4">
      <form
        action={loginAdminAction}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-8 flex flex-col gap-4"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/invyra_full.png" alt="Invyra" width={184} height={80} className="h-9 w-auto" priority />
          <div>
            <h1 className="text-lg font-bold text-noir-doux">Administration</h1>
            <p className="text-sm text-noir-doux/50">Connecte-toi pour gérer le backoffice.</p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-brand-error bg-brand-error/10 rounded-xl px-3 py-2">
            Identifiants incorrects.
          </p>
        )}

        <input type="hidden" name="next" value={next ?? "/admin/templates"} />

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-xs font-semibold text-noir-doux/50">
            Nom d&apos;utilisateur
          </label>
          <input
            id="username"
            type="text"
            name="username"
            required
            autoFocus
            autoComplete="username"
            className="w-full ring-1 ring-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-royal bg-white text-noir-doux transition-shadow"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-xs font-semibold text-noir-doux/50">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full ring-1 ring-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-royal bg-white text-noir-doux transition-shadow"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-violet-royal hover:bg-violet-royal-alt text-white font-semibold py-2.5 text-sm transition-colors shadow-sm shadow-violet-royal/20"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
