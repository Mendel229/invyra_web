"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animations clés : enveloppe 3D interactive, ciel étoilé scintillant et pétales qui dérivent lentement.

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
    <div className="mt-6 grid grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.06, y: -3, boxShadow: "0 0 32px rgba(244,114,182,0.55)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 430, damping: 17 }}
        onClick={() => respond("accepted")}
        className="rounded-full bg-gradient-to-r from-[#F6C56F] via-[#F472B6] to-[#7C3AED] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_44px_rgba(124,58,237,0.35)]"
      >
        {loading === "accepted" ? "Magie en cours..." : "J'accepte"}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.06, y: -3, borderColor: "rgba(244,114,182,0.9)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 430, damping: 17 }}
        onClick={() => respond("declined")}
        className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-xl"
      >
        {loading === "declined" ? "Envoi..." : "Je décline"}
      </motion.button>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
      <p className="text-[9px] uppercase tracking-[0.28em] text-[#F7C56A]/80">{label}</p>
      <p className="mt-1 text-sm font-medium text-white/90">{value}</p>
    </div>
  );
}

export default function MariageMidnightRomance({ data, guestName, onConfirmParams }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const stars = useMemo(() => Array.from({ length: 42 }, (_, i) => ({ left: (i * 37) % 100, top: (i * 53) % 100, size: 1 + (i % 4), delay: (i % 9) * 0.21 })), []);
  const petals = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ left: (i * 19) % 100, delay: i * 0.35, duration: 8 + (i % 5) })), []);

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050408] px-4 py-8 text-white">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.2rem] bg-[#09080E] shadow-[0_40px_110px_rgba(0,0,0,0.85)]" style={{ perspective: 1400, fontFamily: "Inter, sans-serif" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(109,40,217,0.45),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(244,114,182,0.22),transparent_35%)]" />

        {stars.map((star) => (
          <motion.span
            key={`star-${star.left}-${star.top}`}
            className="absolute rounded-full bg-white"
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size }}
            animate={{ opacity: [0.15, 1, 0.2], scale: [0.7, 1.4, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
          />
        ))}

        {petals.map((petal, i) => (
          <motion.span
            key={`petal-${i}`}
            className="absolute -top-10 h-5 w-3 rounded-[60%_10%_60%_10%] bg-gradient-to-br from-[#FFD1E8] to-[#B31352] opacity-70 blur-[0.2px]"
            style={{ left: `${petal.left}%` }}
            animate={{ y: [0, 780], x: [0, i % 2 ? 36 : -28, i % 3 ? -16 : 24], rotate: [0, 160, 320] }}
            transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
          />
        ))}

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              className="relative z-10 flex min-h-[720px] flex-col items-center justify-center px-8 text-center"
              initial={{ opacity: 0, rotateX: -12 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateX: 18, transition: { duration: 0.5 } }}
            >
              <motion.div
                className="relative h-72 w-full max-w-[330px] cursor-pointer rounded-3xl border border-[#F7C56A]/45 bg-gradient-to-br from-[#17101F] via-[#2B1537] to-[#09080E] shadow-[0_28px_80px_rgba(109,40,217,0.45)]"
                onClick={() => setOpened(true)}
                whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1/2 w-full origin-top rounded-t-3xl border-b border-[#F7C56A]/30 bg-gradient-to-br from-[#3B1D50] to-[#0B0810]"
                  style={{ clipPath: "polygon(0 0,100% 0,50% 100%)" }}
                  animate={{ rotateX: [0, -7, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                  <motion.div
                    className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#F7C56A]/50 bg-[#F7C56A]/10 text-4xl shadow-[0_0_45px_rgba(247,197,106,0.35)]"
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ✉️
                  </motion.div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#F7C56A]">Invitation scellée</p>
                  <p className="mt-3 text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{guestName}</p>
                  <p className="mt-5 text-sm text-white/60">Touchez l'enveloppe pour révéler la carte</p>
                </div>
              </motion.div>
              <p className="mt-8 text-[10px] text-white/30">Créé avec INVYRA</p>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              className="relative z-10 min-h-[720px] px-6 py-7 text-center"
              initial={{ opacity: 0, rotateY: 70, scale: 0.82 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 rounded-full bg-[#6D28D9]/35 blur-3xl"
                animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#F7C56A]/40 bg-white/10 p-1 backdrop-blur">
                  {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-full w-full rounded-full object-cover" /> : <span className="text-3xl">🌹</span>}
                </div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-[#F7C56A]">Vous êtes invité(e)</p>
                <h1 className="mt-6 text-5xl leading-none text-white drop-shadow-[0_0_26px_rgba(124,58,237,0.8)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {data.nomCouple || data.name}
                </h1>
                <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-white/68">{data.description || "Une nuit d'amour, de lumière et de promesses. Votre présence rendra ce moment inoubliable."}</p>
                <div className="mt-7 grid gap-3">
                  <Field label="Date" value={data.date} />
                  <Field label="Heure" value={data.heure} />
                  <Field label="place" value={data.place} />
                </div>
                {(data.customField1Value || data.customField2Value) && (
                  <div className="mt-4 rounded-3xl border border-[#F7C56A]/20 bg-[#F7C56A]/10 p-4 text-left text-sm text-white/75">
                    {data.customField1Value && <p><span className="text-[#F7C56A]">{data.customField1Label || "Détail"} :</span> {data.customField1Value}</p>}
                    {data.customField2Value && <p className="mt-2"><span className="text-[#F7C56A]">{data.customField2Label || "Info"} :</span> {data.customField2Value}</p>}
                  </div>
                )}
                {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl bg-white p-2"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
                <RSVPButtons onConfirmParams={onConfirmParams} />
                <p className="mt-6 text-[10px] text-white/30">Créé avec INVYRA</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
