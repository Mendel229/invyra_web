import { loginAdminAction } from "@/lib/admin-auth-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        action={loginAdminAction}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-gray-900">Administration Invyra</h1>
        <p className="text-sm text-gray-500">Connectez-vous pour gérer les templates.</p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            Mot de passe incorrect.
          </p>
        )}

        <input type="hidden" name="next" value={next ?? "/admin/templates"} />

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
