"use client";
import RSVPSection from "@/components/RSVPSection";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : cadre néon pulsant, particules lumineuses et glitch contrôlé sur le titre.

export interface InvitationData {
  name: string;
  event_type: "mariage" | "anniversaire" | "bapteme" | "soiree_vip" | "corporate" | "autre";
  date: string;
  place: string;
  heure?: string;
  nomCouple?: string;
  description?: string;
  logoUrl?: string;
  qrCodeUrl?: string;
  customField1Label?: string;
  customField1Value?: string;
  customField2Label?: string;
  customField2Value?: string;
}

export interface TemplateProps {
  data: InvitationData;
  guestName: string;
  initialStatus?: string;
  onConfirmParams?: (status: "accepted" | "declined", comment?: string) => Promise<void>;
}

function RSVPButtons({ onConfirmParams }: Pick<TemplateProps, "onConfirmParams">) {
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);
  async function respond(status: "accepted" | "declined") {
    if (!onConfirmParams) return;
    setLoading(status);
    try {
      await onConfirmParams(status);
    } finally {
      setLoading(null);
    }
  }
  return (
    <div className="mt-7 grid grid-cols-2 gap-3">
      <motion.button whileHover={{ scale: 1.07, y: -4, boxShadow: "0 0 36px rgba(168,85,247,0.75)" }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 520, damping: 18 }} onClick={() => respond("accepted")} className="rounded-full border border-fuchsia-300/60 bg-fuchsia-500/20 px-4 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(168,85,247,0.45)] backdrop-blur">
        {loading === "accepted" ? "Loading..." : "J'entre 🔥"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.07, y: -4, boxShadow: "0 0 30px rgba(34,211,238,0.55)" }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 520, damping: 18 }} onClick={() => respond("declined")} className="rounded-full border border-cyan-200/40 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 backdrop-blur">
        {loading === "declined" ? "Envoi..." : "Pas cette fois"}
      </motion.button>
    </div>
  );
}

function NeonParticleField() {
  const dots = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ left: (i * 41) % 100, top: (i * 29) % 100, delay: (i % 10) * 0.18 })), []);
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_14px_rgba(217,70,239,0.95)]"
          style={{ left: `${d.left}%`, top: `${d.top}%` }}
          animate={{ y: [0, -22, 0], x: [0, i % 2 ? 12 : -12, 0], opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 4 + (i % 5) * 0.4, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20, rotateX: -16 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      <p className="text-[9px] uppercase tracking-[0.27em] text-cyan-200">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </motion.div>
  );
}

export default function AnniversaireNeonBirthday({ data, guestName, onConfirmParams }: TemplateProps) {
  const age = data.customField1Value?.match(/\d{1,3}/)?.[0];

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.1rem] bg-[#090814] p-6 text-white shadow-[0_0_80px_rgba(124,58,237,0.35)]" style={{ perspective: 1200, fontFamily: "Poppins, Inter, sans-serif" }}>
        <NeonParticleField />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.38),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.22),transparent_32%)]" />
        <motion.div className="absolute inset-4 rounded-[1.7rem] border border-fuchsia-400/55" animate={{ opacity: [0.45, 1, 0.45], boxShadow: ["0 0 18px rgba(217,70,239,0.35)", "0 0 54px rgba(217,70,239,0.8)", "0 0 18px rgba(217,70,239,0.35)"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute inset-7 rounded-[1.3rem] border border-cyan-300/35" animate={{ opacity: [1, 0.35, 1], boxShadow: ["0 0 16px rgba(34,211,238,0.6)", "0 0 44px rgba(34,211,238,0.22)", "0 0 16px rgba(34,211,238,0.6)"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative z-10 px-2 pt-10 text-center">
          <motion.p initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase tracking-[0.35em] text-cyan-200">Club Invitation</motion.p>
          <motion.h2
            className="mt-7 text-4xl font-black uppercase leading-none text-white"
            style={{ textShadow: "0 0 10px #22d3ee, 0 0 28px #a855f7, 0 0 44px #ec4899" }}
            animate={{ x: [0, -2, 3, 0, 0], skewX: [0, -4, 5, 0, 0], opacity: [1, 0.78, 1, 0.9, 1] }}
            transition={{ duration: 0.32, repeat: Infinity, repeatDelay: 4.7 }}
          >
            VOUS ÊTES INVITÉ(E)
          </motion.h2>

          <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22, type: "spring", stiffness: 110 }} className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-fuchsia-300/55 bg-fuchsia-400/10 shadow-[0_0_45px_rgba(217,70,239,0.55)]">
            <span className="text-5xl font-black text-white">{age || "🎉"}</span>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 text-sm text-cyan-100/80">Accès spécial pour <span className="font-black text-white">{guestName}</span></motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-4 text-5xl font-black leading-[0.92] tracking-tighter text-white">
            {data.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mx-auto mt-5 max-w-xs text-sm leading-7 text-white/70">
            {data.description || "Une soirée électrique, élégante et mémorable. Lumières, musique et énergie premium au programme."}
          </motion.p>

          <div className="mt-7 grid gap-3">
            <Info label="Date" value={data.date} />
            <Info label="Heure" value={data.heure} />
            <Info label="place" value={data.place} />
          </div>

          {data.customField2Value && <div className="mt-4 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-4 text-sm text-fuchsia-50"><span className="font-black text-cyan-200">{data.customField2Label || "Dress code"} :</span> {data.customField2Value}</div>}
          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-cyan-300/50 bg-white p-2 shadow-[0_0_36px_rgba(34,211,238,0.35)]"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          <p className="mt-7 text-[10px] text-white/30">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
