"use client";
import RSVPSection from "@/components/RSVPSection";

import { useState } from "react";
import { motion } from "framer-motion";

// Animations clés : apparition séquentielle propre des blocs avec stagger professionnel.

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

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const} },
};

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
      <motion.button whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 340, damping: 18 }} onClick={() => respond("accepted")} className="rounded-xl bg-[#243B8F] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(36,59,143,0.22)]">
        {loading === "accepted" ? "Confirmation..." : "Confirmer"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 340, damping: 18 }} onClick={() => respond("declined")} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
        {loading === "declined" ? "Envoi..." : "Décliner"}
      </motion.button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div variants={item} className="flex items-start gap-3 border-b border-slate-200/80 pb-4 last:border-b-0">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#243B8F]" />
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </motion.div>
  );
}

export default function CorporateExecutiveSummit({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-8">
      <motion.section initial="hidden" animate="visible" variants={container} className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[#FCFCFC] p-7 text-slate-900 shadow-[0_28px_75px_rgba(15,23,42,0.12)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-full w-full rounded-2xl object-cover" /> : <span className="text-2xl text-[#243B8F]">◆</span>}
          </div>
          <div className="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Executive</div>
        </motion.div>

        <motion.div variants={item} className="mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#243B8F]">Invitation professionnelle</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight text-[#14214D]">{data.name}</h1>
          {data.customField1Value && <p className="mt-4 text-base font-semibold text-slate-600">{data.customField1Value}</p>}
        </motion.div>

        <motion.div variants={item} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Invité</p>
          <p className="mt-2 text-xl font-black text-[#14214D]">{guestName}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">{data.description || "Nous avons le plaisir de vous inviter à cet événement stratégique réunissant décideurs, partenaires et acteurs clés."}</p>
        </motion.div>

        <motion.div variants={container} className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Detail label="Date" value={data.date} />
          <Detail label="Heure" value={data.heure} />
          <Detail label="place" value={data.place} />
          {data.customField2Value && <Detail label={data.customField2Label || "Intervenant"} value={data.customField2Value} />}
        </motion.div>

        <motion.div variants={item} className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
            {data.qrCodeUrl ? <img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-lg object-cover" /> : <span className="text-4xl text-slate-300">▦</span>}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#14214D]">Accès rapide</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Présentez ce QR code à l'entrée pour fluidifier votre accueil.</p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
        </motion.div>
        <motion.p variants={item} className="mt-7 text-center text-[10px] text-slate-400">Créé avec INVYRA</motion.p>
      </motion.section>
    </main>
  );
}
