"use client";
import RSVPSection from "@/components/RSVPSection";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Animations clés : nuages flottants en boucle, étoiles dorées scintillantes et entrées aériennes.

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
      <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 260, damping: 17 }} onClick={() => respond("accepted")} className="rounded-full bg-[#77A9C6] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(119,169,198,0.32)]">
        {loading === "accepted" ? "Confirmation..." : "Je viens"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 260, damping: 17 }} onClick={() => respond("declined")} className="rounded-full border border-[#B9DDEE] bg-white/55 px-4 py-3 text-sm font-semibold text-[#5F8FA8] backdrop-blur">
        {loading === "declined" ? "Envoi..." : "Je décline"}
      </motion.button>
    </div>
  );
}

function Cloud({ top, delay, duration, scale }: { top: number; delay: number; duration: number; scale: number }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute h-20 w-44 rounded-full bg-white/70 blur-[0.2px]"
      style={{ top, scale }}
      initial={{ x: 430 }}
      animate={{ x: -230 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute -top-8 left-9 h-20 w-20 rounded-full bg-white/80" />
      <span className="absolute -top-12 left-24 h-28 w-28 rounded-full bg-white/75" />
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="rounded-[1.6rem] border border-white/70 bg-white/55 p-4 text-left shadow-[0_14px_32px_rgba(118,169,198,0.14)] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#D0A040]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#426C82]">{value}</p>
    </motion.div>
  );
}

export default function BaptemeDouceurCeleste({ data, guestName, onConfirmParams, initialStatus }: TemplateProps) {
  const stars = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ left: (i * 47) % 100, top: 8 + ((i * 37) % 68), delay: i * 0.17 })), []);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#DDF4FF] px-4 py-8">
      <section className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#CDEFFF] via-[#F9FCFF] to-[#FFF5E4] p-7 text-center shadow-[0_35px_90px_rgba(95,143,168,0.24)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <Cloud top={78} delay={0} duration={28} scale={0.9} />
        <Cloud top={220} delay={6} duration={34} scale={0.7} />
        <Cloud top={520} delay={3} duration={30} scale={0.65} />
        {stars.map((s, i) => (
          <motion.span key={i} className="absolute text-[#D0A040]" style={{ left: `${s.left}%`, top: `${s.top}%` }} animate={{ opacity: [0.2, 1, 0.25], scale: [0.8, 1.25, 0.8] }} transition={{ duration: 2.2, repeat: Infinity, delay: s.delay }}>
            ✦
          </motion.span>
        ))}

        <div className="relative z-10 pt-10">
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 110, damping: 12 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-white/70 bg-white/55 text-4xl shadow-[0_20px_50px_rgba(119,169,198,0.22)] backdrop-blur">
            🕊️
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }} className="text-[11px] uppercase tracking-[0.35em] text-[#D0A040]">Douce célébration</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3 text-sm text-[#5F8FA8]">Invitation pour {guestName}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.8 }} className="mt-7 text-5xl leading-[0.98] text-[#365C70]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {data.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46 }} className="mx-auto mt-6 max-w-xs text-sm leading-7 text-[#5F7887]">
            {data.description || "Une parenthèse céleste, tendre et lumineuse pour célébrer ce jour de grâce entouré des personnes aimées."}
          </motion.p>

          <div className="mt-8 grid gap-3">
            <Detail label="Date" value={data.date} />
            <Detail label="Heure" value={data.heure} />
            <Detail label="place" value={data.place} />
          </div>

          {(data.customField1Value || data.customField2Value) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-5 rounded-[1.8rem] border border-white/60 bg-white/50 p-4 text-left text-sm text-[#426C82] backdrop-blur">
              {data.customField1Value && <p><span className="font-semibold text-[#D0A040]">{data.customField1Label || "Famille"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2"><span className="font-semibold text-[#D0A040]">{data.customField2Label || "Note"} :</span> {data.customField2Value}</p>}
            </motion.div>
          )}

          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl border border-white/80 bg-white p-2"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPSection initialStatus={initialStatus ?? "brouillon"} onConfirm={onConfirmParams ?? (async () => {})} wrapperClassName="mt-7 grid grid-cols-2 gap-3" />
          <p className="mt-7 text-[10px] text-[#426C82]/45">Créé avec INVYRA</p>
        </div>
      </section>
    </main>
  );
}
