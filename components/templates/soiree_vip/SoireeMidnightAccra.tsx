"use client";
import RSVPSection from "@/components/RSVPSection";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : badge VIP en rotation 3D, lasers dorés et halo luxe pulsant.

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
      <motion.button whileHover={{ scale: 1.08, y: -4, boxShadow: "0 0 44px rgba(245,190,80,0.72)" }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 520, damping: 15 }} onClick={() => respond("accepted")} className="rounded-full bg-gradient-to-r from-[#A66A12] via-[#F5BE50] to-[#FFF0A5] px-4 py-3 text-sm font-black text-black shadow-[0_18px_46px_rgba(245,190,80,0.35)]">
        {loading === "accepted" ? "Validation..." : "Accéder"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 520, damping: 15 }} onClick={() => respond("declined")} className="rounded-full border border-[#F5BE50]/35 bg-white/8 px-4 py-3 text-sm font-black text-[#FCE8A6] backdrop-blur">
        {loading === "declined" ? "Envoi..." : "Décliner"}
      </motion.button>
    </div>
  );
}

function KenteWatermark() {
  const rows = useMemo(() => Array.from({ length: 9 }, (_, y) => Array.from({ length: 7 }, (_, x) => ({ x, y }))).flat(), []);
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.13]" viewBox="0 0 390 760" aria-hidden="true">
      {rows.map((cell, i) => (
        <g key={i} transform={`translate(${cell.x * 64 - 18} ${cell.y * 92 - 20})`}>
          <path d="M0 32 L32 0 L64 32 L32 64Z" fill="none" stroke="#F5BE50" strokeWidth="2" />
          <path d="M16 32 H48 M32 16 V48" stroke="#F5BE50" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }} className="rounded-2xl border border-[#F5BE50]/18 bg-white/[0.055] p-4 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <p className="text-[9px] uppercase tracking-[0.28em] text-[#F5BE50]">{label}</p>
      <p className="mt-1 text-sm font-bold text-white/90">{value}</p>
    </motion.div>
  );
}

export default function SoireeMidnightAccra({ data, guestName, onConfirmParams }: TemplateProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.15rem] bg-[#050505] p-6 text-white shadow-[0_42px_110px_rgba(0,0,0,0.92)]" style={{ perspective: 1300, fontFamily: "Poppins, Inter, sans-serif" }}>
        <KenteWatermark />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(245,190,80,0.24),transparent_33%),radial-gradient(circle_at_30%_85%,rgba(166,106,18,0.25),transparent_36%)]" />
        {[0, 1].map((i) => (
          <motion.div key={i} className="absolute h-[2px] w-64 origin-left bg-gradient-to-r from-transparent via-[#F5BE50] to-transparent blur-[0.3px]" style={{ top: i ? "64%" : "28%", left: "-60%", rotate: i ? -18 : 16 }} animate={{ x: [0, 700], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.1, delay: i * 1.2, ease: "easeInOut" }} />
        ))}

        <div className="relative z-10 pt-8 text-center">
          <motion.p initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] uppercase tracking-[0.45em] text-[#F5BE50]">Midnight Accra</motion.p>
          <motion.div
            className="mx-auto mt-8 flex h-36 w-36 items-center justify-center rounded-full border border-[#F5BE50]/60 bg-gradient-to-br from-[#201308] via-[#090909] to-[#3D250A] shadow-[0_0_66px_rgba(245,190,80,0.45)]"
            animate={{ rotateY: [0, 360], boxShadow: ["0 0 36px rgba(245,190,80,0.28)", "0 0 80px rgba(245,190,80,0.72)", "0 0 36px rgba(245,190,80,0.28)"] }}
            transition={{ rotateY: { duration: 8, repeat: Infinity, ease: "linear" }, boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } }}
          >
            <div className="text-center">
              <p className="text-5xl font-black tracking-tighter text-[#FCE8A6]">VIP</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.36em] text-[#F5BE50]">Pass</p>
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-7 text-sm text-white/60">Accès privé pour <span className="font-bold text-[#FCE8A6]">{guestName}</span></motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.8 }} className="mt-4 text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white">
            {data.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }} className="mx-auto mt-5 max-w-xs text-sm leading-7 text-white/66">
            {data.description || "Une nuit privée, sélective et brillante. Présence limitée, énergie premium, souvenir impérial."}
          </motion.p>

          <div className="mt-7 grid gap-3">
            <Info label="Date" value={data.date} />
            <Info label="Heure" value={data.heure} />
            <Info label="place" value={data.place} />
          </div>

          {(data.customField1Value || data.customField2Value) && (
            <div className="mt-4 rounded-3xl border border-[#F5BE50]/20 bg-[#F5BE50]/8 p-4 text-left text-sm text-white/78 backdrop-blur">
              {data.customField1Value && <p><span className="font-black text-[#F5BE50]">{data.customField1Label || "Dress code"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2"><span className="font-black text-[#F5BE50]">{data.customField2Label || "Table"} :</span> {data.customField2Value}</p>}
            </div>
          )}
          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-[#F5BE50]/45 bg-white p-2 shadow-[0_0_34px_rgba(245,190,80,0.35)]"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          <p className="mt-7 text-[10px] text-white/28">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
