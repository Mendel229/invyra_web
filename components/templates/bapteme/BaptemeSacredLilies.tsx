"use client";
import RSVPSection from "@/components/RSVPSection";

import { useState } from "react";
import { motion } from "framer-motion";

// Animations clés : fondu doux, lys révélés progressivement et ambiance calme par transitions lentes.

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
      <motion.button whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} onClick={() => respond("accepted")} className="rounded-full bg-[#B79B57] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(183,155,87,0.28)]">
        {loading === "accepted" ? "Confirmation..." : "Je serai présent"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} onClick={() => respond("declined")} className="rounded-full border border-[#D9C8EA] bg-white px-4 py-3 text-sm font-semibold text-[#7B6092]">
        {loading === "declined" ? "Envoi..." : "Je décline"}
      </motion.button>
    </div>
  );
}

function LilyOrnaments() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-70" viewBox="0 0 390 760" fill="none" aria-hidden="true">
      {[{ x: 34, y: 42, r: 0 }, { x: 356, y: 42, r: 90 }, { x: 34, y: 718, r: -90 }, { x: 356, y: 718, r: 180 }].map((p, i) => (
        <motion.g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.12, duration: 0.8 }}>
          <path d="M0 0 C18 -24 36 -24 46 2 C24 -6 12 5 0 0Z" fill="#F8F5FF" stroke="#D9C8EA" />
          <path d="M0 0 C4 -31 22 -42 42 -25 C20 -20 15 -4 0 0Z" fill="#FFFFFF" stroke="#D9C8EA" />
          <path d="M0 0 C-8 -27 4 -43 28 -40 C12 -28 8 -10 0 0Z" fill="#FFFFFF" stroke="#D9C8EA" />
          <path d="M0 0 C14 10 22 24 22 42" stroke="#B79B57" strokeWidth="1.4" strokeLinecap="round" />
        </motion.g>
      ))}
    </svg>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="rounded-2xl border border-[#E8DDF2] bg-white/80 p-4 text-left shadow-[0_12px_28px_rgba(105,80,132,0.08)]">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#A88945]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#48354F]">{value}</p>
    </motion.div>
  );
}

export default function BaptemeSacredLilies({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F7F3FB] px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.1rem] border border-[#E5D5F2] bg-[#FFFDFE] p-7 text-center shadow-[0_30px_80px_rgba(117,91,142,0.18)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <LilyOrnaments />
        <div className="absolute inset-4 rounded-[1.65rem] border border-[#E8D5F5]" />
        <div className="absolute inset-7 rounded-[1.35rem] border border-[#F3EAF8]" />
        <motion.div className="absolute left-1/2 top-20 h-36 w-36 -translate-x-1/2 rounded-full bg-[#E8D5F5]/40 blur-3xl" animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.55, 0.25] }} transition={{ duration: 5, repeat: Infinity }} />

        <div className="relative z-10 pt-8">
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#B79B57]/40 bg-[#FFF9EC] text-3xl text-[#B79B57] shadow-sm">
            ✝
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="text-[11px] uppercase tracking-[0.35em] text-[#B79B57]">Sainte invitation</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3 text-sm text-[#6A5574]">Cher/chère {guestName}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.75 }} className="mt-7 text-5xl leading-[0.98] text-[#4A315C]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {data.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mx-auto mt-6 max-w-xs text-sm leading-7 text-[#6A5574]">
            {data.description || "Avec joie et gratitude, nous vous invitons à partager ce moment de foi, de bénédiction et de douceur."}
          </motion.p>

          <div className="mt-8 grid gap-3">
            <Detail label="Date" value={data.date} />
            <Detail label="Heure" value={data.heure} />
            <Detail label="place" value={data.place} />
          </div>

          {(data.customField1Value || data.customField2Value) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-5 rounded-3xl border border-[#E8D5F5] bg-[#FAF7FF] p-4 text-left text-sm text-[#5F486B]">
              {data.customField1Value && <p><span className="font-semibold text-[#A88945]">{data.customField1Label || "Parents"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2"><span className="font-semibold text-[#A88945]">{data.customField2Label || "Parrain/Marraine"} :</span> {data.customField2Value}</p>}
            </motion.div>
          )}

          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-[#E8D5F5] bg-white p-2"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          <p className="mt-7 text-[10px] text-[#6A5574]/45">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
