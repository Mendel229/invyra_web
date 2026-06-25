"use client";
import RSVPSection from "@/components/RSVPSection";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

export interface TemplateProps {
  data: InvitationData;
  guestName: string;
  initialStatus?: string;
  onConfirmParams?: (status: "accepted" | "declined", comment?: string) => Promise<void>;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(dateStr: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(dateStr).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return t;
}

// ─── SVG déco feuilles olive ──────────────────────────────────────────────────
function OliveLeaves({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="40" rx="22" ry="10" fill="#6b7c5a" opacity="0.6" transform="rotate(-30 60 40)" />
      <ellipse cx="85" cy="25" rx="18" ry="8" fill="#8a9e72" opacity="0.5" transform="rotate(-15 85 25)" />
      <ellipse cx="40" cy="65" rx="16" ry="7" fill="#7a8e62" opacity="0.55" transform="rotate(-45 40 65)" />
      <ellipse cx="110" cy="35" rx="20" ry="9" fill="#6b7c5a" opacity="0.45" transform="rotate(-5 110 35)" />
      <ellipse cx="130" cy="55" rx="14" ry="6" fill="#8a9e72" opacity="0.4" transform="rotate(15 130 55)" />
      <line x1="60" y1="40" x2="110" y2="90" stroke="#6b7c5a" strokeWidth="1.2" opacity="0.35" />
      <line x1="85" y1="25" x2="95" y2="80" stroke="#8a9e72" strokeWidth="1" opacity="0.3" />
      <ellipse cx="95" cy="80" rx="12" ry="5" fill="#7a8e62" opacity="0.4" transform="rotate(20 95 80)" />
      <ellipse cx="75" cy="90" rx="10" ry="4" fill="#6b7c5a" opacity="0.35" transform="rotate(-10 75 90)" />
    </svg>
  );
}

// ─── Sceau cire vert ──────────────────────────────────────────────────────────
function WaxSeal({ initials }: { initials: string }) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#4a5e38] shadow-[0_6px_24px_rgba(74,94,56,0.55)]" />
      <div className="absolute inset-1.5 rounded-full bg-[#5a7040] border border-[#7a9055]/40" />
      <div className="absolute inset-3 rounded-full border border-[#a0b880]/30" />
      <span
        className="relative text-white text-2xl font-bold tracking-widest"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {initials}
      </span>
    </div>
  );
}

// ─── Divider fleuri ───────────────────────────────────────────────────────────
function FloralDivider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-[#6b7c5a]/30" />
      <span className="text-[#6b7c5a] text-lg">✦</span>
      <div className="flex-1 h-px bg-[#6b7c5a]/30" />
    </div>
  );
}

// ─── Écran d'intro ────────────────────────────────────────────────────────────
function IntroScreen({ couple, initials, logoUrl, onEnter }: {
  couple: string; initials: string; logoUrl?: string; onEnter: () => void;
}) {
  return (
    <motion.div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: "linear-gradient(160deg, #3d4f2d 0%, #4a5e38 40%, #6b7c5a 100%)" }}
      onClick={onEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      {/* Feuilles décoratives */}
      <div className="absolute top-0 left-0 w-48 h-32 opacity-30 pointer-events-none">
        <OliveLeaves className="w-full h-full" />
      </div>
      <div className="absolute top-0 right-0 w-48 h-32 opacity-30 pointer-events-none">
        <OliveLeaves className="w-full h-full" flip />
      </div>
      <div className="absolute bottom-16 left-0 w-40 h-28 opacity-25 pointer-events-none">
        <OliveLeaves className="w-full h-full" />
      </div>

      {/* Photo couple en fond flou */}
      {logoUrl && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${logoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8">
        {/* Monogramme / sceau */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <WaxSeal initials={initials} />
        </motion.div>

        {/* Nom couple */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white text-4xl text-center leading-tight"
          style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontStyle: "italic" }}
        >
          {couple}
        </motion.h1>

        {/* Corde décorative */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="w-48 h-0.5 bg-[#c8a84b]/60"
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#c8a84b] text-3xl"
          >
            ↓
          </motion.div>
          <span
            className="text-white/90 text-lg"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            Appuyez ici
          </span>
        </motion.div>

        {/* Anneaux déco */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex gap-1 mt-2"
        >
          {["💍", "💍"].map((r, i) => (
            <span key={i} className="text-2xl">{r}</span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Timeline programme ───────────────────────────────────────────────────────
function Timeline() {
  const events = [
    { time: "09h00", label: "Cérémonie", icon: "💍" },
    { time: "11h30", label: "Cocktail", icon: "🥂" },
    { time: "12h00", label: "Réception", icon: "🎊" },
    { time: "13h00", label: "Fête", icon: "🍽️" },
  ];

  return (
    <div className="flex flex-col gap-0">
      {events.map(({ time, label, icon }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 + 0.2 }}
          className="flex items-center gap-3"
        >
          {/* Ligne verticale + point */}
          <div className="flex flex-col items-center" style={{ width: 24 }}>
            {i > 0 && <div className="w-0.5 h-4 bg-[#6b7c5a]/40" />}
            <div className="w-4 h-4 rounded-full bg-[#4a5e38] border-2 border-[#8a9e72] flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            {i < events.length - 1 && <div className="w-0.5 h-4 bg-[#6b7c5a]/40" />}
          </div>
          {/* Contenu */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-sm">{icon}</span>
            <div>
              <p className="text-[10px] text-[#8a9e72] font-semibold">{time}</p>
              <p className="text-sm text-[#3d4f2d] font-semibold">{label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Contenu principal ────────────────────────────────────────────────────────
function InvitationContent({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const couple = data.nomCouple || data.name;
  const initials = couple.split(/[\s&]+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "AM";
  const countdown = useCountdown(data.eventDateIso || data.date);

  const section = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const } },
  });

  return (
    <motion.div
      className="w-full min-h-screen"
      style={{ background: "#f7f5ef", fontFamily: "Georgia, 'Times New Roman', serif" }}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header vert foncé ── */}
      <div className="relative bg-[#4a5e38] pt-8 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-24 opacity-20 pointer-events-none">
          <OliveLeaves className="w-full h-full" flip />
        </div>
        <div className="absolute top-0 left-0 w-40 h-24 opacity-20 pointer-events-none">
          <OliveLeaves className="w-full h-full" />
        </div>

        {/* Photo couple */}
        {data.logoUrl && (
          <motion.div
            variants={section(0.1)}
            className="flex justify-center mb-4"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-3 border-white/30 shadow-lg">
              <img src={data.logoUrl} alt="Couple" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}

        {/* Monogramme */}
        <motion.div variants={section(0.2)} className="text-center">
          <p
            className="text-white/70 text-xs uppercase tracking-[0.3em] mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {data.date}
          </p>
          <h1
            className="text-white text-6xl leading-none"
            style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontStyle: "italic" }}
          >
            {initials}
          </h1>
        </motion.div>
      </div>

      {/* ── Corps principal ── */}
      <div className="px-5 py-6 flex flex-col gap-6 -mt-6">

        {/* Carte blanche principale */}
        <motion.div
          variants={section(0.1)}
          className="bg-white rounded-2xl shadow-md px-6 py-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-20 opacity-15 pointer-events-none">
            <OliveLeaves className="w-full h-full" flip />
          </div>

          {/* Noms */}
          <h2
            className="text-4xl text-center text-[#3d4f2d] leading-tight mb-1"
            style={{ fontStyle: "italic" }}
          >
            {couple}
          </h2>

          <FloralDivider />

          {/* Description */}
          {data.description && (
            <p className="text-[#6b7c5a] text-sm text-center leading-relaxed mt-3 italic">
              {data.description}
            </p>
          )}

          {/* Date mise en avant */}
          <div className="mt-4 text-center">
            <p className="text-[#8a9e72] text-xs uppercase tracking-widest">
              {data.date.split(" ")[0]}
            </p>
            <p className="text-[#3d4f2d] text-5xl font-bold">
              {data.date.split(" ")[1] || "06"}
            </p>
            <p className="text-[#6b7c5a] text-sm uppercase tracking-wider">
              {data.date.split(" ")[2] || "Juin"}
            </p>
          </div>
        </motion.div>

        {/* ── Photo couple 2 ── */}
        {data.logoUrl && (
          <motion.div variants={section(0.15)}>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={data.logoUrl} alt="Couple" className="w-full aspect-video object-cover" />
            </div>
            <div className="mt-2 text-center">
              <OliveLeaves className="w-32 h-12 mx-auto opacity-60" />
            </div>
          </motion.div>
        )}

        {/* ── Citation bénédiction ── */}
        <motion.div
          variants={section(0.2)}
          className="bg-[#4a5e38] rounded-2xl px-6 py-5 text-white text-center shadow-md"
        >
          <p className="text-sm italic leading-relaxed opacity-90">
            "Avec la bénédiction de Dieu et de nos parents, nous avons l'honneur de vous inviter à notre mariage."
          </p>
        </motion.div>

        {/* ── Countdown ── */}
        <motion.div variants={section(0.25)} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex justify-center gap-4">
            {[
              { v: countdown.d, l: "Jours" },
              { v: countdown.h, l: "Heures" },
              { v: countdown.m, l: "Min" },
              { v: countdown.s, l: "Sec" },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#4a5e38] text-xl font-bold mb-3">:</span>}
                <div className="flex flex-col items-center">
                  <motion.span
                    key={v}
                    initial={{ opacity: 0.5, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-bold text-[#3d4f2d] tabular-nums w-10 text-center"
                  >
                    {String(v).padStart(2, "0")}
                  </motion.span>
                  <span className="text-[9px] text-[#8a9e72] uppercase tracking-wider">{l}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Local ── */}
        <motion.div variants={section(0.3)} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
          <p className="font-bold text-[#3d4f2d] text-lg italic mb-1">Lieu :</p>
          <p className="text-[#4a5e38] font-semibold">{data.place}</p>
          {data.heure && (
            <p className="text-[#6b7c5a] text-sm mt-1">{data.heure}</p>
          )}
          {data.customField1Value && (
            <p className="text-[#6b7c5a] text-sm mt-1">{data.customField1Value}</p>
          )}
          <button className="mt-3 bg-[#4a5e38] text-white text-xs px-4 py-1.5 rounded-full">
            Voir sur la carte →
          </button>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div variants={section(0.35)} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#4a5e38]/15 flex items-center justify-center">
              <span className="text-[#4a5e38] text-sm font-bold italic">{initials}</span>
            </div>
            <p className="text-[#3d4f2d] font-bold italic text-lg">Programme de la Journée</p>
          </div>
          <Timeline />
        </motion.div>

        {/* ── Dress code ── */}
        {data.customField2Value && (
          <motion.div variants={section(0.4)} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
            <p className="text-[#3d4f2d] font-bold italic text-lg mb-3">
              {data.customField2Label || "Code Vestimentaire"}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">👗</span>
              <div className="bg-[#4a5e38]/10 px-4 py-2 rounded-xl">
                <p className="text-[#4a5e38] text-sm font-semibold">{data.customField2Value}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── QR Code ── */}
        {data.qrCodeUrl && (
          <motion.div variants={section(0.45)} className="bg-white rounded-2xl px-6 py-5 shadow-sm text-center">
            <p className="text-[#8a9e72] text-xs uppercase tracking-widest mb-3">SCAN ME!</p>
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-[#e0dac8] inline-block">
                <img src={data.qrCodeUrl} alt="QR Code" className="w-28 h-28 rounded-lg" />
              </div>
            </div>
            <p className="text-[#6b7c5a] text-xs mt-2 italic">
              Votre invitation numérique — {guestName}
            </p>
          </motion.div>
        )}

        {/* ── El gran día — calendrier mini ── */}
        <motion.div
          variants={section(0.5)}
          className="bg-[#4a5e38] rounded-2xl px-6 py-5 shadow-md"
        >
          <p className="text-white text-center text-lg font-bold italic mb-3">Le Grand Jour</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <span key={i} className="text-white/50 text-[10px] font-bold">{d}</span>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3; // décalage pour commencer au bon jour
              const isHighlight = day === 6; // jour J simulé
              return day > 0 && day <= 30 ? (
                <motion.span
                  key={i}
                  className={`text-xs py-0.5 rounded-full ${isHighlight ? "bg-white text-[#4a5e38] font-bold" : "text-white/70"}`}
                  animate={isHighlight ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {day}
                </motion.span>
              ) : <span key={i} />;
            })}
          </div>
        </motion.div>

        {/* ── RSVP ── */}
        <motion.div
          variants={section(0.55)}
          className="bg-white rounded-2xl px-6 py-6 shadow-sm"
        >
          <p className="text-[#3d4f2d] text-center font-bold italic text-xl mb-4">Confirmez votre Présence</p>
          <FloralDivider />
          <div className="mt-4">
            <RSVPSection
              initialStatus={initialStatus ?? "brouillon"}
              onConfirm={onConfirmParams ?? (async () => {})}
              acceptClassName="w-full rounded-full bg-[#4a5e38] py-3 text-sm font-semibold text-white shadow-md"
              declineClassName="w-full rounded-full border border-[#4a5e38]/40 bg-white py-3 text-sm font-semibold text-[#4a5e38]"
              acceptLabel="Je confirme ma présence ✓"
              declineLabel="Je ne pourrai pas venir"
              wrapperClassName="flex flex-col gap-3"
            />
          </div>
        </motion.div>

        {/* Pied déco */}
        <div className="flex justify-center opacity-50">
          <OliveLeaves className="w-40 h-16" />
        </div>
        <p className="text-center text-[10px] text-[#8a9e72]/60">Créé avec INVYRA</p>
      </div>
    </motion.div>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────
export default function MariageOliveElegant({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const [started, setStarted] = useState(false);
  const couple = data.nomCouple || data.name;
  const initials = couple.split(/[\s&]+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "AM";

  return (
    <main className="min-h-screen w-full bg-[#4a5e38]">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="intro" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45 }}>
            <IntroScreen
              couple={couple}
              initials={initials}
              logoUrl={data.logoUrl}
              onEnter={() => setStarted(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
