"use client";
import RSVPSection from "@/components/RSVPSection";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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
  eventDateIso?: string | null;
  customization?: Record<string, unknown>;
  primaryColor?: string;
}

export interface TemplateProps {
  data: InvitationData;
  guestName: string;
  initialStatus?: string;
  onConfirmParams?: (status: "accepted" | "declined", comment?: string) => Promise<void>;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(targetDateStr: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);

  return time;
}

// ─── Fleurs SVG déco ──────────────────────────────────────────────────────────
function FloralTopLeft() {
  return (
    <svg viewBox="0 0 160 160" fill="none" className="w-full h-full" aria-hidden="true">
      <ellipse cx="30" cy="20" rx="18" ry="28" fill="#b5c9a0" opacity="0.55" transform="rotate(-20 30 20)" />
      <ellipse cx="55" cy="10" rx="14" ry="22" fill="#c8d9b5" opacity="0.45" transform="rotate(10 55 10)" />
      <ellipse cx="15" cy="55" rx="12" ry="20" fill="#a8bf90" opacity="0.5" transform="rotate(-35 15 55)" />
      <circle cx="40" cy="38" r="10" fill="#f0ebe0" opacity="0.9" />
      <circle cx="40" cy="38" r="6" fill="#e8e0cc" opacity="0.9" />
      <circle cx="62" cy="28" r="8" fill="#f5f0e8" opacity="0.85" />
      <circle cx="22" cy="70" r="7" fill="#f0ebe0" opacity="0.8" />
      <line x1="40" y1="48" x2="40" y2="90" stroke="#8a9e72" strokeWidth="1.5" opacity="0.6" />
      <line x1="62" y1="36" x2="55" y2="75" stroke="#8a9e72" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="48" cy="75" rx="8" ry="14" fill="#b5c9a0" opacity="0.4" transform="rotate(15 48 75)" />
      <ellipse cx="35" cy="85" rx="6" ry="11" fill="#c8d9b5" opacity="0.4" transform="rotate(-10 35 85)" />
    </svg>
  );
}

function FloralBottomRight() {
  return (
    <svg viewBox="0 0 160 160" fill="none" className="w-full h-full" aria-hidden="true">
      <ellipse cx="130" cy="140" rx="18" ry="28" fill="#b5c9a0" opacity="0.55" transform="rotate(160 130 140)" />
      <ellipse cx="105" cy="150" rx="14" ry="22" fill="#c8d9b5" opacity="0.45" transform="rotate(190 105 150)" />
      <ellipse cx="145" cy="105" rx="12" ry="20" fill="#a8bf90" opacity="0.5" transform="rotate(145 145 105)" />
      <circle cx="120" cy="122" r="10" fill="#f0ebe0" opacity="0.9" />
      <circle cx="120" cy="122" r="6" fill="#e8e0cc" opacity="0.9" />
      <circle cx="98" cy="132" r="8" fill="#f5f0e8" opacity="0.85" />
      <circle cx="138" cy="90" r="7" fill="#f0ebe0" opacity="0.8" />
      <line x1="120" y1="112" x2="120" y2="70" stroke="#8a9e72" strokeWidth="1.5" opacity="0.6" />
      <line x1="98" y1="124" x2="105" y2="85" stroke="#8a9e72" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="112" cy="85" rx="8" ry="14" fill="#b5c9a0" opacity="0.4" transform="rotate(195 112 85)" />
      <ellipse cx="125" cy="75" rx="6" ry="11" fill="#c8d9b5" opacity="0.4" transform="rotate(170 125 75)" />
    </svg>
  );
}

// ─── Sceau cire ───────────────────────────────────────────────────────────────
function WaxSeal({ letter = "M" }: { letter?: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#c8a84b] shadow-[0_4px_14px_rgba(200,168,75,0.5)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#b8983c] flex items-center justify-center border-2 border-[#d4b55a]/40">
          <span className="font-serif text-white text-lg font-bold tracking-wider">{letter}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Enveloppe animée ─────────────────────────────────────────────────────────
function EnvelopeOpening({ onComplete }: { onComplete: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!opened) { setOpened(true); setTimeout(onComplete, 900); }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#f5f2eb] cursor-pointer select-none"
      style={{ backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(181,201,160,0.18) 0%, transparent 70%)" }}
      onClick={handleOpen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Fleurs haut gauche */}
      <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none">
        <FloralTopLeft />
      </div>
      {/* Fleurs bas droite */}
      <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none">
        <FloralBottomRight />
      </div>

      {/* Monogramme */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mb-2"
      >
        <div className="w-16 h-16 rounded-full border-2 border-[#8a9e72]/60 flex items-center justify-center bg-white/70 backdrop-blur">
          <span className="font-serif text-[#8a9e72] text-xl font-bold tracking-widest">MA</span>
        </div>
      </motion.div>

      {/* Texte intro */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="font-serif text-3xl text-[#5a6b4a] text-center mb-1"
        style={{ fontFamily: "'Dancing Script', cursive, serif" }}
      >
        Cher Invité
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[#7a8a6a] text-sm text-center mb-8"
      >
        Nous avons une invitation spéciale pour vous !
      </motion.p>

      {/* Enveloppe */}
      <motion.div
        className="relative w-64"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
      >
        {/* Corps enveloppe */}
        <div className="relative w-full h-40 bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Rabat avant ouverture */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-20 origin-top"
                style={{
                  background: "linear-gradient(160deg, #f0ece0 60%, #e8e2ce 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 80%)",
                  zIndex: 10,
                }}
                exit={{ rotateX: -180, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>
          {/* Lignes enveloppe */}
          <div className="absolute inset-0 border-2 border-[#e0dac8] rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f0e4] to-transparent" />
        </div>

        {/* Sceau */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <WaxSeal letter="A" />
        </div>

        {/* Indicateur tap */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-[#8a9e72] text-xs mt-4"
        >
          {opened ? "Ouverture..." : "Appuyez pour ouvrir ✉"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ─── Contenu principal ────────────────────────────────────────────────────────
function InvitationContent({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const eventDateRaw = data.eventDateIso || data.date;
  const countdown = useCountdown(eventDateRaw);
  const couple = data.nomCouple || data.name;

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } },
  });

  return (
    <motion.div
      className="w-full bg-[#f5f2eb] min-h-screen"
      initial="hidden"
      animate="visible"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
        {/* Fond aquarelle vert */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-56 h-56 rounded-full bg-[#b5c9a0]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[#c8d9b5]/25 blur-2xl" />
        </div>
        {/* Fleurs */}
        <div className="absolute top-0 left-0 w-44 h-44 pointer-events-none"><FloralTopLeft /></div>
        <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none scale-x-[-1]"><FloralTopLeft /></div>

        <div className="relative z-10 flex flex-col items-center pt-10 pb-8 px-6">
          {/* Monogramme */}
          <motion.div variants={fadeUp(0.1)} className="mb-3">
            <div className="w-16 h-16 rounded-full border-2 border-[#8a9e72]/70 flex items-center justify-center bg-white/80 shadow-sm">
              <span className="font-serif text-[#6b8055] text-xl font-bold tracking-widest">
                {couple.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "MA"}
              </span>
            </div>
          </motion.div>

          {/* Nom couple */}
          <motion.h1
            variants={fadeUp(0.2)}
            className="text-4xl text-center text-[#4a5e38] leading-tight"
            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
          >
            {couple}
          </motion.h1>

          <motion.p variants={fadeUp(0.35)} className="text-[#7a8a6a] text-sm mt-1 tracking-wider uppercase">
            {data.heure ? `${data.date} · ${data.heure}` : data.date}
          </motion.p>

          {/* Save the date tag */}
          <motion.div
            variants={fadeUp(0.45)}
            className="mt-4 bg-[#6b8055] text-white px-5 py-2 rounded-sm text-sm font-semibold shadow-md"
          >
            Save the Date
          </motion.div>

          {/* Nom invité */}
          <motion.p variants={fadeUp(0.55)} className="mt-3 text-[#5a6b4a] text-sm italic">
            Pour : <span className="font-semibold not-italic">{guestName}</span>
          </motion.p>
        </div>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-6">

        {/* ── Citation / description ── */}
        {data.description && (
          <motion.div variants={fadeUp(0.1)} className="bg-[#6b8055]/90 rounded-xl p-4 text-white text-sm text-center italic shadow-md">
            "{data.description}"
          </motion.div>
        )}

        {/* ── Countdown ── */}
        <motion.div variants={fadeUp(0.15)} className="text-center">
          <p className="text-[#8a9e72] text-xs uppercase tracking-[0.2em] mb-3">Chaque seconde nous rapproche de notre "oui"</p>
          <div className="flex justify-center gap-3">
            {[
              { v: countdown.days, l: "Jours" },
              { v: countdown.hours, l: "Heures" },
              { v: countdown.minutes, l: "Minutes" },
              { v: countdown.seconds, l: "Secondes" },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex flex-col items-center">
                {i > 0 && <span className="text-[#6b8055] text-2xl font-bold absolute mt-0.5">:</span>}
                <motion.span
                  key={v}
                  initial={{ scale: 1.15, color: "#6b8055" }}
                  animate={{ scale: 1, color: "#4a5e38" }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-[#4a5e38] tabular-nums w-12 text-center"
                >
                  {String(v).padStart(2, "0")}
                </motion.span>
                <span className="text-[10px] text-[#8a9e72] uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Local ── */}
        <motion.div
          variants={fadeUp(0.2)}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#6b8055]/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#6b8055]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
              </svg>
            </div>
            <p className="font-serif text-xl text-[#4a5e38] italic">Lieu</p>
          </div>
          <p className="font-semibold text-[#3a4a2a] text-center">{data.place}</p>
          {data.customField1Value && (
            <p className="text-[#7a8a6a] text-sm text-center mt-1">{data.customField1Value}</p>
          )}
          {/* Déco nœud */}
          <div className="flex justify-end mt-2">
            <span className="text-3xl">🎀</span>
          </div>
        </motion.div>

        {/* ── Dress code / palette ── */}
        {data.customField2Value && (
          <motion.div variants={fadeUp(0.25)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <p className="font-serif text-lg text-[#4a5e38] italic mb-3">Palette du Mariage</p>
            <div className="flex items-center gap-3 mb-3">
              {["#d4c98a", "#a8bf90", "#6b8055"].map((c) => (
                <div key={c} className="w-8 h-8 rounded-full shadow-sm" style={{ background: c }} />
              ))}
            </div>
            <div className="bg-[#6b8055] text-white text-xs px-3 py-1 rounded inline-block mb-2">
              {data.customField2Label || "Tenue"}: {data.customField2Value}
            </div>
          </motion.div>
        )}

        {/* ── Manuel do Convidado ── */}
        <motion.div variants={fadeUp(0.3)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
          <p className="font-serif text-lg text-[#4a5e38] italic mb-4">Guide de l'Invité</p>
          <div className="flex flex-col gap-3">
            {[
              { icon: "⏰", text: "Arrivez quelques minutes à l'avance" },
              { icon: "🥂", text: "Trinquons ! Laissez-nous faire !" },
              { icon: "📸", text: "Montrez votre plus beau sourire" },
              { icon: "🎶", text: "Ne coupez pas le chemin du photographe !" },
            ].map(({ icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-[#5a6b4a]"
              >
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Photo du couple ── */}
        {data.logoUrl && (
          <motion.div
            variants={fadeUp(0.35)}
            className="relative"
          >
            <div className="bg-white p-3 shadow-lg rounded-sm rotate-[-1deg] mx-auto max-w-[220px]">
              <img src={data.logoUrl} alt="Couple" className="w-full aspect-[4/3] object-cover rounded-sm" />
              <p className="text-center text-[#8a9e72] text-xs italic mt-2 font-serif">Je t'aime ♡</p>
            </div>
          </motion.div>
        )}

        {/* ── QR Code ── */}
        {data.qrCodeUrl && (
          <motion.div variants={fadeUp(0.4)} className="flex flex-col items-center gap-2">
            <p className="text-[#8a9e72] text-xs uppercase tracking-wider">Votre invitation numérique</p>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#e0dac8]">
              <img src={data.qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-lg" />
            </div>
          </motion.div>
        )}

        {/* ── RSVP ── */}
        <motion.div variants={fadeUp(0.45)} className="bg-[#6b8055]/10 rounded-2xl p-5 border border-[#6b8055]/20">
          <p className="font-serif text-center text-lg text-[#4a5e38] italic mb-4">Confirmez votre Présence</p>
          <RSVPSection
            initialStatus={initialStatus ?? "brouillon"}
            onConfirm={onConfirmParams ?? (async () => {})}
            acceptClassName="w-full rounded-full bg-[#6b8055] py-3 text-sm font-semibold text-white shadow-md"
            declineClassName="w-full rounded-full border border-[#6b8055]/50 bg-white py-3 text-sm font-semibold text-[#6b8055]"
            acceptLabel="Je confirme ma présence ✓"
            declineLabel="Je ne pourrai pas venir"
            wrapperClassName="flex flex-col gap-3"
          />
        </motion.div>

        {/* Fleurs bas */}
        <div className="flex justify-center opacity-60 mt-2">
          <div className="w-40 h-20"><FloralBottomRight /></div>
        </div>

        <p className="text-center text-[10px] text-[#8a9e72]/60">Créé avec INVYRA</p>
      </div>
    </motion.div>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────
export default function MariageSaugeEukalyptus({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[#f5f2eb]">
      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <motion.div key="envelope" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
            <EnvelopeOpening onComplete={() => setEnvelopeOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <InvitationContent
              data={data}
              guestName={guestName}
              initialStatus={initialStatus}
              onConfirmParams={onConfirmParams}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
