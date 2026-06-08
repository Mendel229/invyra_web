"use client";
import RSVPSection from "@/components/RSVPSection";

import { useState } from "react";
import { motion } from "framer-motion";

// Animations clés : entrée poétique en fade-up, ornements dorés tracés progressivement et halo lumineux subtil.

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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as const},
  }),
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
      <motion.button
        whileHover={{ scale: 1.035, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 360, damping: 18 }}
        onClick={() => respond("accepted")}
        className="rounded-full bg-[#B88922] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(184,137,34,0.32)]"
      >
        {loading === "accepted" ? "Confirmation..." : "Je participe"}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.035, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 360, damping: 18 }}
        onClick={() => respond("declined")}
        className="rounded-full border border-[#D7B46A]/60 bg-white/60 px-4 py-3 text-sm font-semibold text-[#7B4A16] backdrop-blur"
      >
        {loading === "declined" ? "Envoi..." : "Je décline"}
      </motion.button>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: string; label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 rounded-2xl border border-[#E8D2A2]/80 bg-white/55 px-4 py-3 shadow-[0_10px_24px_rgba(127,86,26,0.08)] backdrop-blur"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3D5] text-lg text-[#B88922]">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#B88922]" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </p>
        <p className="text-sm font-medium text-[#3D2714]" style={{ fontFamily: "Inter, sans-serif" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function CornerOrnaments() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 390 760" fill="none" aria-hidden="true">
      {[
        "M34 74 C34 46 48 34 75 34 M55 34 C55 54 42 55 42 72 M34 55 C54 55 55 42 72 42",
        "M356 74 C356 46 342 34 315 34 M335 34 C335 54 348 55 348 72 M356 55 C336 55 335 42 318 42",
        "M34 686 C34 714 48 726 75 726 M55 726 C55 706 42 705 42 688 M34 705 C54 705 55 718 72 718",
        "M356 686 C356 714 342 726 315 726 M335 726 C335 706 348 705 348 688 M356 705 C336 705 335 718 318 718",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#D4A017"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.3, delay: 0.25 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}

export default function MariageEleganceDoree({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#EFE4D2] px-4 py-8">
      <motion.section
        initial="hidden"
        animate="visible"
        className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2rem] border border-[#D8B05D]/70 bg-[#FFF8ED] p-7 text-center shadow-[0_30px_80px_rgba(78,45,12,0.22)]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <CornerOrnaments />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-[#F4D68A]/30 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          <motion.div variants={fadeUp} custom={0.05} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4A017]/60 bg-white/60 p-1 shadow-[0_12px_34px_rgba(212,160,23,0.24)]">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo de l'événement" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl text-[#B88922]">❦</span>
            )}
          </motion.div>

          <motion.p variants={fadeUp} custom={0.12} className="text-[11px] uppercase tracking-[0.32em] text-[#B88922]">
            Invitation personnelle pour
          </motion.p>
          <motion.p variants={fadeUp} custom={0.18} className="mt-2 text-sm font-semibold text-[#5B3518]">
            {guestName}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={0.26}
            className="mt-8 text-5xl leading-[0.98] text-[#3A2413]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {data.nomCouple || data.name}
          </motion.h1>

          <motion.div variants={fadeUp} custom={0.34} className="mx-auto my-7 flex w-56 items-center justify-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4A017] to-[#D4A017]" />
            <motion.span
              className="text-[#D4A017]"
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4A017] to-[#D4A017]" />
          </motion.div>

          <motion.p variants={fadeUp} custom={0.42} className="mx-auto max-w-[18rem] text-sm leading-7 text-[#5B4630]">
            {data.description || "Nous serions honorés de vous compter parmi nous pour célébrer ce moment unique."}
          </motion.p>

          <motion.div variants={fadeUp} custom={0.52} className="mt-7 grid gap-3 text-left">
            <Detail icon="📅" label="Date" value={data.date} />
            <Detail icon="🕊️" label="Heure" value={data.heure} />
            <Detail icon="📍" label="place" value={data.place} />
          </motion.div>

          {(data.customField1Value || data.customField2Value) && (
            <motion.div variants={fadeUp} custom={0.64} className="mt-5 rounded-3xl border border-[#E6C676]/60 bg-[#FFF1CF]/55 p-4 text-left">
              {data.customField1Value && <p className="text-sm text-[#5B3518]"><span className="font-semibold text-[#A87416]">{data.customField1Label || "Note"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2 text-sm text-[#5B3518]"><span className="font-semibold text-[#A87416]">{data.customField2Label || "Info"} :</span> {data.customField2Value}</p>}
            </motion.div>
          )}

          {data.qrCodeUrl && (
            <motion.div variants={fadeUp} custom={0.72} className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-[#D4A017]/50 bg-white p-2 shadow-inner">
              <img src={data.qrCodeUrl} alt="QR code invitation" className="h-full w-full rounded-xl object-cover" />
            </motion.div>
          )}

          <motion.div variants={fadeUp} custom={0.8}>
            <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          </motion.div>

          <motion.p variants={fadeUp} custom={0.88} className="mt-7 text-[10px] text-[#7B4A16]/45">
            Créé avec INVYRA
          </motion.p>
        </div>
      </motion.section>
    </main>
  );
}
