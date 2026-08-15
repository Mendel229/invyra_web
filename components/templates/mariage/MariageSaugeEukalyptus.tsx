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
  customization?: Record<string, unknown>;
  primaryColor?: string;
}

export interface TemplateProps {
  data: InvitationData;
  guestName: string;
  initialStatus?: string;
  onConfirmParams?: (status: "accepted" | "declined", comment?: string) => Promise<void>;
}

// ─── Couleurs par défaut ──────────────────────────────────────────────────────
const DEFAULT_GREEN = "#6b8055";

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

// ─── Déco florale SVG ─────────────────────────────────────────────────────────
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
function WaxSeal({ letter = "M", color = "#c8a84b" }: { letter?: string; color?: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: color }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30" style={{ background: color, filter: "brightness(0.88)" }}>
          <span className="font-serif text-white text-lg font-bold tracking-wider">{letter}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Enveloppe animée ─────────────────────────────────────────────────────────
function EnvelopeOpening({ onComplete, primaryColor }: { onComplete: () => void; primaryColor: string }) {
  const [opened, setOpened] = useState(false);
  const handleOpen = () => {
    if (!opened) { setOpened(true); setTimeout(onComplete, 900); }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen w-full cursor-pointer select-none"
      style={{ background: "#f5f2eb", backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(181,201,160,0.18) 0%, transparent 70%)" }}
      onClick={handleOpen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none"><FloralTopLeft /></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none"><FloralBottomRight /></div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="mb-2">
        <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-white/70 backdrop-blur" style={{ borderColor: primaryColor + "60" }}>
          <span className="font-serif text-xl font-bold tracking-widest" style={{ color: primaryColor }}>MA</span>
        </div>
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
        className="text-3xl text-center mb-1" style={{ fontFamily: "'Dancing Script', cursive, serif", color: "#5a6b4a" }}>
        Cher Invité
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-sm text-center mb-8" style={{ color: "#7a8a6a" }}>
        Nous avons une invitation spéciale pour vous !
      </motion.p>

      <motion.div className="relative w-64" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 80 }}>
        <div className="relative w-full h-40 bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
          <AnimatePresence>
            {!opened && (
              <motion.div className="absolute top-0 left-0 right-0 h-20 origin-top"
                style={{ background: "linear-gradient(160deg, #f0ece0 60%, #e8e2ce 100%)", clipPath: "polygon(0 0, 100% 0, 50% 80%)", zIndex: 10 }}
                exit={{ rotateX: -180, opacity: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 border-2 border-[#e0dac8] rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f0e4] to-transparent" />
        </div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <WaxSeal letter="A" color={primaryColor} />
        </div>
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-xs mt-4" style={{ color: primaryColor }}>
          {opened ? "Ouverture..." : "Appuyez pour ouvrir ✉"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ─── Galerie photos ───────────────────────────────────────────────────────────
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
];

function PhotoGrid({ logoUrl, customization }: { logoUrl?: string; customization?: Record<string, unknown> }) {
  const customImages = customization?.images as string[] | undefined;
  const rawSources = customImages?.length ? customImages : logoUrl ? [logoUrl] : DEMO_IMAGES;
  const count = rawSources.length;
  if (count === 0) return null;

  if (count === 1) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden" style={{ height: 220 }}>
      <img src={rawSources[0]} alt="" className="w-full h-full object-cover" />
    </motion.div>
  );

  if (count === 2) return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden" style={{ height: 180 }}>
      {rawSources.map((src, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }} className="overflow-hidden rounded-xl">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );

  if (count === 3) return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden" style={{ height: 220 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row-span-2 overflow-hidden rounded-xl">
        <img src={rawSources[0]} alt="" className="w-full h-full object-cover" />
      </motion.div>
      {rawSources.slice(1).map((src, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (i + 1) * 0.07 }} className="overflow-hidden rounded-xl" style={{ height: 107 }}>
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden">
      {[{ span: "col-span-2", height: "h-36" }, { span: "col-span-1", height: "h-28" }, { span: "col-span-1", height: "h-28" }, { span: "col-span-2", height: "h-28" }]
        .map((pos, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, duration: 0.45 }}
            className={`${pos.span} ${pos.height} overflow-hidden rounded-xl`}>
            <img src={rawSources[i % rawSources.length]} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
interface TimelineItem { time: string; label: string }

function Timeline({ items, color }: { items: TimelineItem[]; color: string }) {
  return (
    <div className="flex flex-col gap-0">
      {items.map(({ time, label }, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
            {i > 0 && <div className="w-px flex-shrink-0" style={{ height: 14, background: color + "40" }} />}
            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ background: i === 0 ? "white" : color, border: i === 0 ? `2px solid ${color}50` : "none" }} />
            {i < items.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: color + "40" }} />}
          </div>
          <div className="pb-4 pt-0.5 flex-1">
            {time && <p className="text-[11px] font-bold tracking-widest" style={{ color: color + "99" }}>{time}</p>}
            <p className="text-sm font-semibold" style={{ color: "#3a4a2a" }}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Contenu invitation ───────────────────────────────────────────────────────
function InvitationContent({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const primaryColor = (data.primaryColor as string | undefined) || DEFAULT_GREEN;
  const countdown = useCountdown(data.eventDateIso || new Date(Date.now() + 90 * 86400000).toISOString());
  const couple = data.nomCouple || data.name;

  // Palette couleurs personnalisée
  const paletteColors = (data.customization?.paletteColors as string[] | undefined) ?? ["#d4c98a", "#a8bf90", "#6b8055"];
  const paletteVisible = data.customization?.paletteColors_visible !== false;

  // Timeline
  const timelineVisible = data.customization?.timeline_visible !== false;
  const customTimeline = data.customization?.timeline as Array<{ time: string; label: string }> | undefined;
  const timelineItems: TimelineItem[] = timelineVisible
    ? (customTimeline?.length
        ? customTimeline
        : [
            { time: data.heure || "14:00", label: "Cérémonie civile" },
            { time: "", label: "Cérémonie religieuse" },
            { time: "", label: "Vin d'honneur" },
            { time: "", label: "Dîner & soirée" },
          ])
    : [];

  // Dress code
  const dresscodeText = data.customization?.dresscodeText as string | undefined;
  const dresscodeVisible = data.customization?.dresscodeText_visible !== false;

  // Maps
  const mapsUrl = data.customization?.mapsUrl as string | undefined;
  const mapsVisible = data.customization?.mapsUrl_visible !== false;

  // Description
  const description = (data.customization?.description as string | undefined) || data.description;
  const descriptionVisible = data.customization?.description_visible !== false;

  // Images galerie
  const imagesVisible = data.customization?.images_visible !== false;

  // Guide invité personnalisé
  const guideItems = (data.customization?.guideItems as Array<{ icon: string; text: string }> | undefined) ?? [
    { icon: "⏰", text: "Arrivez quelques minutes à l'avance" },
    { icon: "🥂", text: "Trinquons ! Laissez-nous faire !" },
    { icon: "📸", text: "Montrez votre plus beau sourire" },
    { icon: "🎶", text: "Profitez de chaque instant !" },
  ];
  const guideVisible = data.customization?.guideItems_visible !== false;

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const } },
  });

  return (
    <motion.div className="w-full min-h-screen" initial="hidden" animate="visible" style={{ background: "#f5f2eb", fontFamily: "Georgia, serif" }}>

      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-56 h-56 rounded-full blur-3xl" style={{ background: primaryColor + "20" }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-2xl" style={{ background: primaryColor + "25" }} />
        </div>
        <div className="absolute top-0 left-0 w-44 h-44 pointer-events-none"><FloralTopLeft /></div>
        <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none scale-x-[-1]"><FloralTopLeft /></div>

        <div className="relative z-10 flex flex-col items-center pt-10 pb-8 px-6">
          <motion.div variants={fadeUp(0.1)} className="mb-3">
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-white/80 shadow-sm" style={{ borderColor: primaryColor + "70" }}>
              <span className="font-serif text-xl font-bold tracking-widest" style={{ color: primaryColor }}>
                {couple.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "MA"}
              </span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp(0.2)} className="text-4xl text-center leading-tight"
            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#4a5e38" }}>
            {couple}
          </motion.h1>

          <motion.p variants={fadeUp(0.35)} className="text-sm mt-1 tracking-wider uppercase" style={{ color: "#7a8a6a" }}>
            {data.heure ? `${data.date} · ${data.heure}` : data.date}
          </motion.p>

          <motion.div variants={fadeUp(0.45)} className="mt-4 px-5 py-2 rounded-sm text-sm font-semibold shadow-md text-white" style={{ background: primaryColor }}>
            Save the Date
          </motion.div>

          <motion.p variants={fadeUp(0.55)} className="mt-3 text-sm italic" style={{ color: "#5a6b4a" }}>
            Pour : <span className="font-semibold not-italic">{guestName}</span>
          </motion.p>
        </div>
      </div>

      <div className="px-5 pb-12 flex flex-col gap-6">

        {/* ── Description / citation ── */}
        {descriptionVisible && description && description.trim() && (
          <motion.div variants={fadeUp(0.05)} className="rounded-xl p-4 text-white text-sm text-center italic shadow-md" style={{ background: primaryColor + "e8" }}>
            "{description}"
          </motion.div>
        )}

        {/* ── Countdown ── */}
        <motion.div variants={fadeUp(0.1)} className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Chaque seconde nous rapproche de notre "oui"</p>
          <div className="flex justify-center gap-3">
            {[{ v: countdown.days, l: "Jours" }, { v: countdown.hours, l: "Heures" }, { v: countdown.minutes, l: "Min" }, { v: countdown.seconds, l: "Sec" }]
              .map(({ v, l }, i) => (
                <div key={l} className="flex items-end gap-1">
                  {i > 0 && <span className="text-xl font-bold mb-4" style={{ color: primaryColor }}>:</span>}
                  <div className="flex flex-col items-center">
                    <motion.span key={v} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                      className="text-3xl font-bold tabular-nums w-10 text-center" style={{ color: "#4a5e38" }}>
                      {String(v).padStart(2, "0")}
                    </motion.span>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: primaryColor }}>{l}</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* ── Lieu ── */}
        {mapsVisible && (
          <motion.div variants={fadeUp(0.15)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: primaryColor + "20" }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <p className="font-serif text-xl italic" style={{ color: "#4a5e38" }}>Lieu</p>
            </div>
            <p className="font-semibold text-center" style={{ color: "#3a4a2a" }}>{data.place}</p>
            {mapsUrl ? (
              <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 block w-full py-2.5 rounded-full text-xs font-bold text-center tracking-wider border"
                style={{ borderColor: primaryColor + "55", color: primaryColor }}>
                Ouvrir sur la carte →
              </motion.a>
            ) : (
              <p className="mt-2 text-xs text-center italic" style={{ color: "#8a9e72" }}>Ajoutez un lien Maps dans la personnalisation</p>
            )}
          </motion.div>
        )}

        {/* ── Galerie photos ── */}
        {imagesVisible && (
          <motion.div variants={fadeUp(0.2)}>
            <PhotoGrid logoUrl={data.logoUrl} customization={data.customization} />
          </motion.div>
        )}

        {/* ── Palette de couleurs ── */}
        {paletteVisible && (
          <motion.div variants={fadeUp(0.22)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <p className="font-serif text-lg italic mb-3" style={{ color: "#4a5e38" }}>Palette du Mariage</p>
            <div className="flex items-center gap-3 mb-3">
              {paletteColors.map((c, i) => (
                <motion.div key={i} whileHover={{ scale: 1.15, y: -3 }}
                  className="w-8 h-8 rounded-full shadow-sm" style={{ background: c }} />
              ))}
            </div>
            {dresscodeVisible && dresscodeText && (
              <div className="text-white text-xs px-3 py-1.5 rounded inline-block" style={{ background: primaryColor }}>
                Tenue souhaitée : {dresscodeText}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Dress code seul (si palette masquée) ── */}
        {!paletteVisible && dresscodeVisible && dresscodeText && (
          <motion.div variants={fadeUp(0.22)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <p className="font-serif text-lg italic mb-2" style={{ color: "#4a5e38" }}>Tenue souhaitée</p>
            <div className="text-white text-sm px-4 py-2 rounded-lg inline-block" style={{ background: primaryColor }}>
              {dresscodeText}
            </div>
          </motion.div>
        )}

        {/* ── Timeline programme ── */}
        {timelineItems.length > 0 && (
          <motion.div variants={fadeUp(0.25)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <p className="font-serif text-lg italic mb-4" style={{ color: "#4a5e38" }}>Programme du Jour</p>
            <Timeline items={timelineItems} color={primaryColor} />
          </motion.div>
        )}

        {/* ── Guide de l'invité ── */}
        {guideVisible && (
          <motion.div variants={fadeUp(0.28)} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0dac8]">
            <p className="font-serif text-lg italic mb-4" style={{ color: "#4a5e38" }}>Guide de l'Invité</p>
            <div className="flex flex-col gap-3">
              {guideItems.map(({ icon, text }, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm" style={{ color: "#5a6b4a" }}>
                  <span className="text-xl">{icon}</span>
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QR Code ── */}
        {data.qrCodeUrl && (
          <motion.div variants={fadeUp(0.32)} className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-wider" style={{ color: "#8a9e72" }}>Votre invitation numérique</p>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#e0dac8]">
              <img src={data.qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-lg" />
            </div>
            <p className="text-[10px] italic" style={{ color: "#8a9e72" }}>{guestName}</p>
          </motion.div>
        )}

        {/* ── RSVP ── */}
        <motion.div variants={fadeUp(0.36)} className="rounded-2xl p-5 border" style={{ background: primaryColor + "10", borderColor: primaryColor + "30" }}>
          <p className="font-serif text-center text-lg italic mb-4" style={{ color: "#4a5e38" }}>Confirmez votre Présence</p>
          <RSVPSection
            initialStatus={initialStatus ?? "brouillon"}
            onConfirm={onConfirmParams ?? (async () => {})}
            acceptClassName="w-full rounded-full py-3 text-sm font-semibold text-white shadow-md"
            declineClassName="w-full rounded-full border py-3 text-sm font-semibold"
            acceptLabel="Je confirme ma présence ✓"
            declineLabel="Je ne pourrai pas venir"
            wrapperClassName="flex flex-col gap-3"
            acceptStyle={{ background: primaryColor }}
            declineStyle={{ borderColor: primaryColor + "50", color: primaryColor }}
          />
        </motion.div>

        <div className="flex justify-center opacity-60 mt-2">
          <div className="w-40 h-20"><FloralBottomRight /></div>
        </div>
        <p className="text-center text-[10px]" style={{ color: "#8a9e7260" }}>Créé avec INVYRA</p>
      </div>
    </motion.div>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────
export default function MariageSaugeEukalyptus({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const primaryColor = (data.primaryColor as string | undefined) || DEFAULT_GREEN;
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <main className="min-h-screen w-full" style={{ background: "#f5f2eb" }}>
      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <motion.div key="envelope" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
            <EnvelopeOpening onComplete={() => setEnvelopeOpened(true)} primaryColor={primaryColor} />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <InvitationContent data={data} guestName={guestName} initialStatus={initialStatus} onConfirmParams={onConfirmParams} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
