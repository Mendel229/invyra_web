"use client";
import RSVPSection from "@/components/RSVPSection";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

// ─── Couleurs ─────────────────────────────────────────────────────────────────
const PINK = "#e8547a";
const PINK_LIGHT = "#fce8ed";
const PINK_BORDER = "#f7c4d0";

// ─── Images libres de droits Unsplash (démo quand pas de photo utilisateur) ───
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
];

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

// ─── Étoile animée ────────────────────────────────────────────────────────────
function StarDot({ size = 11 }: { size?: number }) {
  return (
    <motion.span
      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      style={{ color: PINK, fontSize: size, display: "inline-block" }}
    >
      ✦
    </motion.span>
  );
}

function StarRow() {
  return (
    <div className="flex justify-center gap-3 my-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          style={{ color: PINK, fontSize: i % 2 === 0 ? 8 : 11 }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

// ─── Titre de section (style bold uppercase + script sous-titre) ──────────────
function SectionTitle({ main, sub }: { main: string; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        <StarDot />
        <h2
          className="text-2xl font-black tracking-[0.06em] leading-none"
          style={{ color: PINK, fontFamily: "Impact, 'Arial Black', sans-serif" }}
        >
          {main}
        </h2>
      </div>
      {sub && (
        <p
          className="text-xs italic text-gray-300 ml-5"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Mini calendrier (jours en français) ─────────────────────────────────────
function MiniCalendar({ dateIso, dateLabel }: { dateIso?: string | null; dateLabel: string }) {
  let month = "Octobre";
  let targetDay = 14;
  let year = 2026;
  let offset = 1;

  if (dateIso) {
    try {
      const d = new Date(dateIso);
      month = d.toLocaleDateString("fr-FR", { month: "long" });
      month = month.charAt(0).toUpperCase() + month.slice(1);
      targetDay = d.getDate();
      year = d.getFullYear();
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
      offset = (firstDay.getDay() + 6) % 7;
    } catch (_) {}
  }

  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <p className="text-center text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">
        {month} {year}
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((d) => (
          <span key={d} className="text-[9px] text-gray-400 font-semibold pb-1">{d}</span>
        ))}
        {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const isTarget = day === targetDay;
          return (
            <motion.span
              key={day}
              className={`text-[10px] mx-auto w-5 h-5 flex items-center justify-center rounded-full font-medium ${
                isTarget ? "font-black text-white shadow-sm" : "text-gray-500"
              }`}
              style={isTarget ? { background: PINK } : {}}
              animate={isTarget ? { scale: [1, 1.2, 1] } : {}}
              transition={isTarget ? { duration: 2, repeat: Infinity } : {}}
            >
              {day}
            </motion.span>
          );
        })}
      </div>
      <div className="flex justify-center mt-3">
        <span className="text-[10px] italic text-gray-400">{dateLabel}</span>
      </div>
    </div>
  );
}

// ─── Grille photos moodboard 2×2 ─────────────────────────────────────────────
function PhotoGrid({ logoUrl }: { logoUrl?: string }) {
  const sources = logoUrl
    ? Array(4).fill(logoUrl)
    : DEMO_IMAGES;

  const positions = [
    { span: "col-span-2", height: "h-36" },
    { span: "col-span-1", height: "h-28" },
    { span: "col-span-1", height: "h-28" },
    { span: "col-span-2", height: "h-28" },
  ];

  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07, duration: 0.45 }}
          className={`${pos.span} ${pos.height} overflow-hidden rounded-xl`}
        >
          <img
            src={sources[i]}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: i === 1 ? "brightness(0.9) saturate(1.15)" : "none" }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Timeline verticale ───────────────────────────────────────────────────────
interface TimelineItem { time: string; label: string; desc?: string }

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map(({ time, label, desc }, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
            {i > 0 && <div className="w-px bg-gray-200 mb-1" style={{ minHeight: 14 }} />}
            <motion.div
              className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 ${
                i === 0 ? "border-2 border-gray-300 bg-white" : ""
              }`}
              style={i > 0 ? { background: PINK } : {}}
              animate={i > 0 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            />
            {i < items.length - 1 && <div className="w-px bg-gray-200 mt-1 flex-1" />}
          </div>
          <div className="pb-5 pt-0.5 flex-1">
            {time && <p className="text-[11px] font-black text-gray-400 tracking-widest">{time}</p>}
            <p className="text-sm font-bold text-gray-800 mt-0.5">{label}</p>
            {desc && <p className="text-xs text-gray-400 leading-relaxed mt-1">{desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function AnniversaireBirthdayParty({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const countdown = useCountdown(
    data.eventDateIso || new Date(Date.now() + 90 * 86400000).toISOString()
  );

  const timelineItems: TimelineItem[] = [
    { time: data.heure || "15:00", label: "Accueil des invités" },
    { time: "", label: "Séance photo" },
    {
      time: "",
      label: "Atelier créatif",
      desc: "La soirée se déroulera dans un format totalement nouveau. Nous ferons des activités à la main — quelque chose de très mignon !",
    },
  ];

  const dresscodeColors = ["#f9c8d9", "#f0a0c0", PINK, "#d44b80"];

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    },
  });

  return (
    <main className="w-full min-h-screen bg-white" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <motion.div initial="hidden" animate="visible" className="flex flex-col">

        {/* ── HERO ── */}
        <div className="relative w-full overflow-hidden bg-gray-100" style={{ minHeight: 420 }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${data.logoUrl || DEMO_IMAGES[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "55%",
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9) 70%, #ffffff)",
            }}
          />
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <motion.div variants={fadeUp(0.2)}>
              <h1
                style={{
                  fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                  color: PINK,
                  fontSize: 58,
                  lineHeight: 1,
                  textShadow: "0 2px 16px rgba(232,84,122,0.18)",
                }}
              >
                Birthday
              </h1>
              <h2
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  color: PINK,
                  fontSize: 28,
                  letterSpacing: "0.22em",
                  marginTop: 2,
                }}
              >
                PARTY
              </h2>
            </motion.div>
            <motion.p variants={fadeUp(0.35)} className="text-sm text-gray-600 mt-2 italic">
              Pour <span className="font-bold not-italic" style={{ color: PINK }}>{guestName}</span>
            </motion.p>
          </div>
        </div>

        {/* ── CORPS ── */}
        <div className="px-5 pb-14 flex flex-col gap-7 bg-white">

          {/* Nom & date */}
          <motion.div variants={fadeUp(0.0)} className="pt-2 text-center">
            <h3 className="text-2xl font-black tracking-tight" style={{ color: PINK }}>
              {data.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 tracking-wider">
              {data.heure ? `${data.date} · ${data.heure}` : data.date}
            </p>
          </motion.div>

          {/* Calendrier */}
          <motion.div variants={fadeUp(0.05)}>
            <MiniCalendar dateIso={data.eventDateIso} dateLabel={data.date} />
          </motion.div>

          {/* Grille photos 1 */}
          <motion.div variants={fadeUp(0.08)}>
            <PhotoGrid logoUrl={data.logoUrl} />
            <StarRow />
          </motion.div>

          {/* Dress-Code */}
          <motion.div variants={fadeUp(0.1)}>
            <SectionTitle main="DRESS-CODE" sub="code vestimentaire" />
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              {data.customField1Value ||
                "Un photographe sera présent toute la soirée. Soyez photogénique — adoptez une tenue colorée et vive, les teintes roses et joyeuses sont les bienvenues !"}
            </p>
            <div className="flex gap-3">
              {dresscodeColors.map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="rounded-full shadow-sm cursor-pointer"
                  style={{ background: c, width: 36, height: 36, flexShrink: 0 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Cadeau */}
          <motion.div variants={fadeUp(0.12)}>
            <SectionTitle main="CADEAU" sub="présent" />
            <p className="text-xs text-gray-500 leading-relaxed">
              {data.customField2Value ||
                "Je sais qu'il est difficile de choisir un cadeau. Une enveloppe avec un petit mot me touchera autant que n'importe quel présent. Si vous souhaitez tout de même m'offrir quelque chose de spécial, je serai ravie de le chérir longtemps."}
            </p>
          </motion.div>

          {/* Grille photos 2 */}
          <motion.div variants={fadeUp(0.14)}>
            <PhotoGrid logoUrl={data.logoUrl} />
          </motion.div>

          {/* Timing */}
          <motion.div variants={fadeUp(0.16)}>
            <div className="flex items-center gap-2 mb-3">
              <StarDot />
              <h2
                className="text-2xl font-black tracking-[0.06em]"
                style={{ color: PINK, fontFamily: "Impact, 'Arial Black', sans-serif" }}
              >
                TIMING
              </h2>
              <span className="text-xs italic text-gray-300" style={{ fontFamily: "Georgia, serif" }}>
                programme
              </span>
            </div>
            <Timeline items={timelineItems} />
          </motion.div>

          {/* Description */}
          {data.description && (
            <motion.div
              variants={fadeUp(0.18)}
              className="rounded-2xl p-4 border"
              style={{ background: PINK_LIGHT, borderColor: PINK_BORDER }}
            >
              <p className="text-sm italic text-gray-600 text-center leading-relaxed">
                "{data.description}"
              </p>
            </motion.div>
          )}

          {/* Localisation */}
          <motion.div variants={fadeUp(0.2)}>
            <SectionTitle main="LOCALISATION" sub="lieu de la fête" />
            <p className="text-sm font-bold text-gray-800">{data.place}</p>
            {data.heure && (
              <p className="text-xs text-gray-400 mt-0.5">À partir de {data.heure}</p>
            )}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-3 block w-full py-2.5 rounded-full text-xs font-bold text-center tracking-wider border"
              style={{ borderColor: PINK_BORDER, color: PINK }}
            >
              Ouvrir sur la carte →
            </motion.a>
          </motion.div>

          {/* Countdown */}
          <motion.div
            variants={fadeUp(0.22)}
            className="rounded-2xl p-4 border"
            style={{ background: PINK_LIGHT, borderColor: PINK_BORDER }}
          >
            <p className="text-center text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: PINK }}>
              Compte à rebours
            </p>
            <div className="flex justify-center items-end gap-1">
              {[
                { v: countdown.d, l: "Jours" },
                { v: countdown.h, l: "Heures" },
                { v: countdown.m, l: "Min" },
                { v: countdown.s, l: "Sec" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-end gap-1">
                  {i > 0 && <span className="text-xl font-black mb-4" style={{ color: PINK }}>:</span>}
                  <div className="flex flex-col items-center">
                    <motion.span
                      key={v}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-black tabular-nums w-10 text-center"
                      style={{ color: PINK }}
                    >
                      {String(v).padStart(2, "0")}
                    </motion.span>
                    <span className="text-[9px] tracking-wider text-gray-400 uppercase">{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* QR Code */}
          {data.qrCodeUrl && (
            <motion.div variants={fadeUp(0.24)} className="flex flex-col items-center gap-2">
              <StarRow />
              <p className="text-xs tracking-widest text-gray-400 uppercase">Votre invitation</p>
              <div className="bg-white p-3 rounded-2xl shadow-sm border" style={{ borderColor: PINK_BORDER }}>
                <img src={data.qrCodeUrl} alt="QR Code" className="w-28 h-28 rounded-xl" />
              </div>
              <p className="text-gray-400 text-[10px] italic">{guestName}</p>
            </motion.div>
          )}

          {/* RSVP */}
          <motion.div
            variants={fadeUp(0.26)}
            className="rounded-2xl p-6 border"
            style={{ borderColor: PINK_BORDER }}
          >
            <StarRow />
            <p
              className="text-xl text-center font-bold mb-5 mt-2"
              style={{ color: PINK, fontFamily: "'Dancing Script', cursive", fontSize: 24 }}
            >
              Confirmez votre présence
            </p>
            <RSVPSection
              initialStatus={initialStatus ?? "brouillon"}
              onConfirm={onConfirmParams ?? (async () => {})}
              acceptClassName="w-full rounded-full py-3 text-sm font-bold text-white"
              declineClassName="w-full rounded-full border py-3 text-sm font-bold"
              acceptLabel="Je serai là ! 🎉"
              declineLabel="Je ne pourrai pas venir"
              wrapperClassName="flex flex-col gap-3"
              acceptStyle={{ background: PINK }}
              declineStyle={{ borderColor: PINK_BORDER, color: PINK }}
            />
          </motion.div>

          <StarRow />
          <p className="text-center text-[10px] text-gray-300 tracking-widest pb-4">INVYRA</p>
        </div>
      </motion.div>
    </main>
  );
}
