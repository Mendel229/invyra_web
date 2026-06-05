"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : circuits kente animés par vagues et flux lumineux de données.

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
      <motion.button whileHover={{ scale: 1.06, y: -3, boxShadow: "0 0 34px rgba(212,160,23,0.58)" }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 420, damping: 17 }} onClick={() => respond("accepted")} className="rounded-full bg-[#D4A017] px-4 py-3 text-sm font-black text-[#16032D] shadow-[0_18px_42px_rgba(212,160,23,0.3)]">
        {loading === "accepted" ? "Synchronisation..." : "Confirmer"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 420, damping: 17 }} onClick={() => respond("declined")} className="rounded-full border border-[#D4A017]/35 bg-white/8 px-4 py-3 text-sm font-black text-white backdrop-blur-xl">
        {loading === "declined" ? "Envoi..." : "Décliner"}
      </motion.button>
    </div>
  );
}

function CircuitBoard() {
  const nodes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ x: 22 + ((i * 47) % 335), y: 70 + ((i * 61) % 610), delay: i * 0.06 })), []);
  const paths = [
    "M28 92 H128 V164 H220 V96 H344",
    "M38 258 H118 V318 H214 V274 H352",
    "M48 450 H162 V526 H286 V488 H354",
    "M30 640 H120 V600 H202 V670 H342",
    "M88 40 V150 H44 V250 H118 V390",
    "M310 80 V180 H260 V300 H330 V610",
  ];
  return (
    <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 390 760" aria-hidden="true">
      <path d="M206 116 C140 154 112 236 130 310 C78 352 80 442 136 484 C148 570 230 626 310 596 C342 522 330 430 280 382 C322 314 292 194 206 116Z" fill="#D4A017" opacity="0.06" />
      {paths.map((d, i) => (
        <motion.path key={d} d={d} fill="none" stroke={i % 2 ? "#D4A017" : "#8B5CF6"} strokeWidth="2" strokeLinecap="round" strokeDasharray="24 16" animate={{ strokeDashoffset: [80, 0, -80], opacity: [0.15, 0.95, 0.15] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r="4" fill={i % 2 ? "#D4A017" : "#A78BFA"} animate={{ opacity: [0.2, 1, 0.2], r: [3, 6, 3] }} transition={{ duration: 2.4, repeat: Infinity, delay: n.delay }} />
      ))}
    </svg>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="rounded-2xl border border-[#D4A017]/18 bg-[#D4A017]/8 p-4 text-left backdrop-blur-xl">
      <p className="text-[9px] uppercase tracking-[0.28em] text-[#D4A017]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white/90">{value}</p>
    </motion.div>
  );
}

export default function CorporateAfricanTech({ data, guestName, onConfirmParams }: TemplateProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#090111] px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.2rem] bg-[#1A0533] p-6 text-white shadow-[0_40px_105px_rgba(26,5,51,0.62)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <CircuitBoard />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(139,92,246,0.35),transparent_35%),radial-gradient(circle_at_70%_90%,rgba(212,160,23,0.2),transparent_36%)]" />

        <div className="relative z-10 pt-7">
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4A017]/30 bg-white/8 p-1 backdrop-blur-xl">
              {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-full w-full rounded-xl object-cover" /> : <span className="text-3xl text-[#D4A017]">⌬</span>}
            </div>
            <div className="rounded-full border border-[#D4A017]/25 bg-[#D4A017]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Tech Pass</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.75 }} className="mt-12">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#D4A017]">African innovation</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tighter text-white">{data.name}</h1>
            {data.customField1Value && <p className="mt-5 text-lg font-semibold text-[#D4A017]">{data.customField1Value}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="mt-7 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Accès nominatif</p>
            <p className="mt-2 text-2xl font-black text-white">{guestName}</p>
            <p className="mt-4 text-sm leading-7 text-white/68">{data.description || "Connectez-vous à un événement où technologie, vision africaine et opportunités internationales convergent."}</p>
          </motion.div>

          <div className="mt-7 grid gap-3">
            <Info label="Date" value={data.date} />
            <Info label="Heure" value={data.heure} />
            <Info label="place" value={data.place} />
            {data.customField2Value && <Info label={data.customField2Label || "Speaker"} value={data.customField2Value} />}
          </div>

          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-[#D4A017]/35 bg-white p-2 shadow-[0_0_34px_rgba(212,160,23,0.25)]"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPButtons onConfirmParams={onConfirmParams} />
          <p className="mt-7 text-center text-[10px] text-white/30">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
