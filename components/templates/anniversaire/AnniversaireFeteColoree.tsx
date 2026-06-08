"use client";
import RSVPSection from "@/components/RSVPSection";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : apparition pop festive, motifs wax dessinés en fond et ballons flottants très légers.

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
      <motion.button whileHover={{ scale: 1.07, rotate: -1 }} whileTap={{ scale: 0.93 }} transition={{ type: "spring", stiffness: 420, damping: 14 }} onClick={() => respond("accepted")} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#A81D37] shadow-[0_18px_34px_rgba(0,0,0,0.22)]">
        {loading === "accepted" ? "Yes..." : "Je viens 🎉"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.07, rotate: 1 }} whileTap={{ scale: 0.93 }} transition={{ type: "spring", stiffness: 420, damping: 14 }} onClick={() => respond("declined")} className="rounded-2xl border border-white/35 bg-white/15 px-4 py-3 text-sm font-black text-white backdrop-blur-md">
        {loading === "declined" ? "Envoi..." : "Pas dispo"}
      </motion.button>
    </div>
  );
}

function WaxPattern() {
  const shapes = useMemo(() => Array.from({ length: 15 }, (_, i) => ({ left: (i * 23) % 100, top: (i * 31) % 100, rotate: i * 17 })), []);
  return (
    <div className="absolute inset-0 opacity-[0.16]" aria-hidden="true">
      {shapes.map((s, i) => (
        <motion.svg key={i} className="absolute h-24 w-24" style={{ left: `${s.left}%`, top: `${s.top}%`, rotate: `${s.rotate}deg` }} viewBox="0 0 100 100" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.04, type: "spring" }}>
          <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="6" />
          <path d="M20 50 Q50 12 80 50 Q50 88 20 50Z" fill="white" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="5" />
        </motion.svg>
      ))}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="rounded-3xl border border-white/25 bg-white/18 px-4 py-3 text-left backdrop-blur-xl">
      <p className="text-[9px] uppercase tracking-[0.25em] text-yellow-200">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </motion.div>
  );
}

export default function AnniversaireFeteColoree({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  const age = data.customField1Value?.match(/\d{1,3}/)?.[0];

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#18070C] px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#FF7A18] via-[#D72A50] to-[#601A4B] p-6 text-white shadow-[0_35px_90px_rgba(96,26,75,0.45)]" style={{ fontFamily: "Poppins, Inter, sans-serif" }}>
        <WaxPattern />
        <motion.div className="absolute -right-20 top-14 h-52 w-52 rounded-full bg-yellow-300/30 blur-3xl" animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="absolute -bottom-20 -left-14 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" animate={{ scale: [1, 1.16, 1], opacity: [0.25, 0.55, 0.25] }} transition={{ duration: 5, repeat: Infinity }} />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur">Birthday Vibes</div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">🎂</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.75, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.18 }} className="mt-10 text-center">
            {age && <div className="mx-auto mb-2 text-[8.5rem] font-black leading-none tracking-[-0.09em] text-white drop-shadow-[0_14px_0_rgba(0,0,0,0.13)]">{age}</div>}
            <p className="text-xs uppercase tracking-[0.38em] text-yellow-200">Invitation spéciale pour</p>
            <p className="mt-2 text-lg font-black text-white">{guestName}</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]">{data.name}</h1>
            <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-white/82">{data.description || "Préparez votre meilleure énergie : une célébration colorée, joyeuse et inoubliable vous attend."}</p>
          </motion.div>

          <div className="mt-8 grid gap-3">
            <InfoPill label="Date" value={data.date} />
            <InfoPill label="Heure" value={data.heure} />
            <InfoPill label="place" value={data.place} />
          </div>

          {data.customField2Value && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-4 rounded-[1.8rem] bg-black/18 p-4 text-sm font-semibold text-white/90 backdrop-blur">
              <span className="text-yellow-200">{data.customField2Label || "Dress code"} :</span> {data.customField2Value}
            </motion.div>
          )}

          <div className="pointer-events-none absolute bottom-7 left-4 flex gap-2 opacity-95" aria-hidden="true">
            {["#FDE047", "#FFFFFF", "#A7F3D0"].map((color, i) => (
              <motion.div key={color} className="relative h-16 w-11 rounded-full" style={{ background: color }} animate={{ y: [0, -10, 0], rotate: [0, i % 2 ? -3 : 3, 0] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}>
                <span className="absolute left-1/2 top-full h-10 w-px -translate-x-1/2 bg-white/55" />
              </motion.div>
            ))}
          </div>

          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-3xl bg-white p-2 shadow-xl"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-2xl object-cover" /></div>}
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          <p className="mt-7 text-center text-[10px] text-white/45">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
