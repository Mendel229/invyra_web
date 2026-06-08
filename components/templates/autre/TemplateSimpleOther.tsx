"use client";
import RSVPSection from "@/components/RSVPSection";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : transition asymétrique moderne, micro-particules discrètes et RSVP spring.

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
      <motion.button whileHover={{ scale: 1.045, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 340, damping: 18 }} onClick={() => respond("accepted")} className="rounded-2xl bg-[#111827] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_32px_rgba(17,24,39,0.24)]">
        {loading === "accepted" ? "Confirmation..." : "Je participe"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.045, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 340, damping: 18 }} onClick={() => respond("declined")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">
        {loading === "declined" ? "Envoi..." : "Je décline"}
      </motion.button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-2xl bg-slate-50 p-4 text-left">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </motion.div>
  );
}

export default function TemplateSimpleOther({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  const dots = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ left: (i * 29) % 100, top: (i * 43) % 100, delay: i * 0.12 })), []);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#E9EDF2] px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-6 text-slate-900 shadow-[0_32px_85px_rgba(15,23,42,0.16)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#DDE5FF]" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#FFF0D8]" />
        {dots.map((d, i) => (
          <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-slate-300" style={{ left: `${d.left}%`, top: `${d.top}%` }} animate={{ opacity: [0.18, 0.65, 0.18], y: [0, -8, 0] }} transition={{ duration: 2.8, delay: d.delay, repeat: Infinity }} />
        ))}

        <div className="relative z-10 flex min-h-[670px] flex-col">
          <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
              {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">✦</div>}
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Invitation</div>
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.75 }} className="mt-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-slate-400">Bonjour {guestName}</p>
            <h1 className="mt-5 max-w-[20rem] text-5xl font-black leading-[0.95] tracking-tighter text-slate-950">{data.name}</h1>
            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-600">{data.description || "Vous êtes cordialement invité(e) à partager ce moment avec nous. Une rencontre simple, belle et mémorable."}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }} className="mt-9 grid gap-3">
            <Detail label="Date" value={data.date} />
            <Detail label="Heure" value={data.heure} />
            <Detail label="place" value={data.place} />
          </motion.div>

          {(data.customField1Value || data.customField2Value) && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }} className="mt-4 rounded-3xl border border-slate-200 bg-white/75 p-4 text-left text-sm text-slate-600 shadow-sm backdrop-blur">
              {data.customField1Value && <p><span className="font-bold text-slate-900">{data.customField1Label || "Détail"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2"><span className="font-bold text-slate-900">{data.customField2Label || "Info"} :</span> {data.customField2Value}</p>}
            </motion.div>
          )}

          <div className="mt-auto">
            {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
            <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
            <p className="mt-7 text-center text-[10px] text-slate-400">Créé avec INVYRA</p>
          </div>
        </div>
      </section>
    </main>
  );
}
