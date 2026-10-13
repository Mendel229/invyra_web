"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, ExternalLink, LayoutDashboard, LogOut, Menu, Palette, Users, X, type LucideIcon } from "lucide-react";
import { logoutAdminAction } from "@/lib/admin-auth-actions";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/templates", label: "Templates", icon: Palette },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/events", label: "Événements", icon: CalendarDays },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function SidebarNav({ pathname, layoutId, onNavigate }: { pathname: string; layoutId: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "text-white" : "text-noir-doux/60 hover:bg-beige-creme-alt hover:text-noir-doux",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-royal to-violet-royal-alt shadow-lg shadow-violet-royal/30"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative size-[18px] transition-transform group-hover:scale-110" />
            <span className="relative flex-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Encart en bas de la barre latérale, lien vers le site public. */
function SiteCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-nuit to-violet-royal p-4 text-white">
      <div aria-hidden className="absolute -top-8 -right-8 size-24 rounded-full bg-or-africain/30 blur-2xl" />
      <div aria-hidden className="absolute -bottom-10 -left-6 size-24 rounded-full bg-violet-royal/50 blur-2xl" />
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <ExternalLink className="size-4" />
      </span>
      <p className="relative mt-3 text-sm font-semibold">Le site public</p>
      <p className="relative mt-0.5 text-xs text-white/60">Vois ce que voient tes visiteurs.</p>
      <Link href="/" target="_blank" className="relative mt-3 flex h-9 items-center justify-center rounded-xl bg-or-africain text-xs font-semibold text-noir-doux transition-colors hover:bg-or-africain-alt">
        Ouvrir Invyra
      </Link>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = NAV_ITEMS.find((item) => isActive(pathname, item.href));

  return (
    <div className="min-h-dvh bg-page-bg lg:grid lg:grid-cols-[272px_1fr] lg:gap-2 lg:p-4">
      {/* Barre latérale flottante (ordinateur) */}
      <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] flex-col rounded-3xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-black/5 lg:flex">
        <Link href="/admin" className="flex items-center px-2">
          <Image src="/invyra_full.png" alt="Invyra" width={184} height={80} className="h-16 w-auto" priority />
        </Link>
        <div className="mt-8 flex-1 overflow-y-auto">
          <SidebarNav pathname={pathname} layoutId="admin-nav" />
        </div>
        <div className="pt-4">
          <SiteCard />
        </div>
      </aside>

      {/* Menu mobile (overlay plein écran) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[84%] max-w-xs bg-white p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center" onClick={() => setMenuOpen(false)}>
                <Image src="/invyra_full.png" alt="Invyra" width={184} height={80} className="h-12 w-auto" />
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex size-9 items-center justify-center rounded-full hover:bg-beige-creme-alt" aria-label="Fermer">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <SidebarNav pathname={pathname} layoutId="admin-nav-mobile" onNavigate={() => setMenuOpen(false)} />
            </div>
            <SiteCard />
          </div>
        </div>
      )}

      <div className="min-w-0">
        {/* Barre du haut */}
        <header className="sticky top-0 z-30 border-b border-black/5 bg-page-bg/85 backdrop-blur">
          <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setMenuOpen(true)}
                className="flex size-10 items-center justify-center rounded-full bg-white text-noir-doux ring-1 ring-black/5 lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-noir-doux lg:text-xl">{current?.label ?? "Admin"}</p>
              </div>
            </div>

            <form action={logoutAdminAction}>
              <button type="submit" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-noir-doux/60 transition-colors hover:bg-beige-creme-alt hover:text-brand-error">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </form>
          </div>
        </header>

        <main className="w-full px-4 py-4 pb-10 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
