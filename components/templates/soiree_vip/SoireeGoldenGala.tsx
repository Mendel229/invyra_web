"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";

// Animations clés : glassmorphisme, reflets qui suivent la souris et brillance satinée animée.

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
      <motion.button whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 380, damping: 15 }} onClick={() => respond("accepted")} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#2D0A5E] shadow-[0_18px_44px_rgba(255,255,255,0.24)]">
        {loading === "accepted" ? "Confirmation..." : "Réserver ma place"}
      </motion.button>
      <motion.button whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 380, damping: 15 }} onClick={() => respond("declined")} className="rounded-full border border-white/35 bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur-xl">
        {loading === "declined" ? "Envoi..." : "Décliner"}
      </motion.button>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl">
      <p className="text-[9px] uppercase tracking-[0.28em] text-[#FFE7A3]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white/92">{value}</p>
    </motion.div>
  );
}

export default function SoireeGoldenGala({ data, guestName, onConfirmParams }: TemplateProps) {
  const [spot, setSpot] = useState({ x: 55, y: 18 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#17062F] px-4 py-8">
      <section onMouseMove={handleMouseMove} className="relative min-h-[720px] w-full max-w-md overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#2D0A5E] via-[#6E2EA6] to-[#D4A017] p-6 text-white shadow-[0_38px_95px_rgba(45,10,94,0.42)]" style={{ fontFamily: "Inter, sans-serif" }}>
        <motion.div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 5, repeat: Infinity }} />
        <motion.div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#FFE7A3]/25 blur-3xl" animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.62, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.34), transparent 28%)` }} />

        <motion.div initial={{ opacity: 0, y: 28, rotateX: -16 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 min-h-[670px] rounded-[1.9rem] border border-white/25 bg-white/10 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_80px_rgba(45,10,94,0.24)] backdrop-blur-2xl">
          <motion.div aria-hidden="true" className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" animate={{ opacity: [0.2, 1, 0.2], x: [-40, 40, -40] }} transition={{ duration: 3.8, repeat: Infinity }} />

          <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center" style={{ clipPath: "polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)", background: "linear-gradient(135deg,#FFE7A3,#D4A017,#8B5E0A)" }}>
            <div className="flex h-[4.45rem] w-[4.45rem] items-center justify-center bg-[#2D0A5E]/80 text-3xl">
              {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="h-full w-full object-cover" /> : "✦"}
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="mt-6 text-[10px] uppercase tracking-[0.38em] text-[#FFE7A3]">Golden Gala</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3 text-sm text-white/75">Invitation nominative : {guestName}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-7 text-5xl leading-[0.95] text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {data.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46 }} className="mx-auto mt-6 max-w-xs text-sm leading-7 text-white/75">
            {data.description || "Une soirée raffinée, lumineuse et sélective où chaque détail est pensé pour créer une expérience mémorable."}
          </motion.p>

          <div className="mt-7 grid gap-3">
            <Info label="Date" value={data.date} />
            <Info label="Heure" value={data.heure} />
            <Info label="place" value={data.place} />
          </div>

          {(data.customField1Value || data.customField2Value) && (
            <div className="mt-4 rounded-3xl border border-white/20 bg-white/12 p-4 text-left text-sm text-white/82 backdrop-blur-xl">
              {data.customField1Value && <p><span className="font-bold text-[#FFE7A3]">{data.customField1Label || "Dress code"} :</span> {data.customField1Value}</p>}
              {data.customField2Value && <p className="mt-2"><span className="font-bold text-[#FFE7A3]">{data.customField2Label || "Note"} :</span> {data.customField2Value}</p>}
            </div>
          )}
          {data.qrCodeUrl && <div className="mx-auto mt-6 h-24 w-24 rounded-2xl bg-white p-2"><img src={data.qrCodeUrl} alt="QR code" className="h-full w-full rounded-xl object-cover" /></div>}
          <RSVPButtons onConfirmParams={onConfirmParams} />
          <p className="mt-7 text-[10px] text-white/42">Créé avec INVYRA</p>
        </motion.div>
      </section>
    </main>
  );
}
