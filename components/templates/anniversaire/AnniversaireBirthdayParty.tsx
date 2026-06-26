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

// ─── Étoiles décoratives ──────────────────────────────────────────────────────
function Stars({ count = 6, color = "#e879a0" }: { count?: number; color?: string }) {
  return (
    <div className="flex gap-1 justify-center my-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          style={{ color, fontSize: 10 }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

// ─── Mini calendrier ──────────────────────────────────────────────────────────
function MiniCalendar({ dateIso, dateLabel }: { dateIso?: string | null; dateLabel: string }) {
  let month = "Octobre";
  let targetDay = 14;

  if (dateIso) {
    try {
      const d = new Date(dateIso);
      month = d.toLocaleDateString("fr-FR", { month: "long" });
      month = month.charAt(0).toUpperCase() + month.slice(1);
      targetDay = d.getDate();
    } catch (_) {}
  }

  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  const offset = 1; // décalage début mois (lundi=1)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
      <p className="text-center text-[#e879a0] text-xs font-semibold uppercase tracking-widest mb-2">{month}</p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((d) => (
          <span key={d} className="text-[9px] text-gray-400 font-bold pb-1">{d}</span>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - offset + 1;
          const isTarget = day === targetDay;
          return day > 0 && day <= 31 ? (
            <motion.span
              key={i}
              className={`text-[10px] py-0.5 rounded-full mx-auto w-5 h-5 flex items-center justify-center ${
                isTarget ? "bg-[#e879a0] text-white font-bold shadow-sm" : "text-gray-500"
              }`}
              animate={isTarget ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {day}
            </motion.span>
          ) : <span key={i} />;
        })}
      </div>
      <p className="text-center text-[#e879a0] text-[10px] mt-2 italic">{dateLabel}</p>
    </div>
  );
}

// ─── Collage Polaroid ─────────────────────────────────────────────────────────
function PolaroidCollage({ logoUrl }: { logoUrl?: string }) {
  if (!logoUrl) return null;

  const rotations = [-3, 2, -1.5, 3, -2];

  return (
    <div className="relative h-64 w-full">
      {rotations.map((rot, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, rotate: rot - 5 }}
          animate={{ opacity: 1, scale: 1, rotate: rot }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
          className="absolute bg-white p-2 shadow-md"
          style={{
            width: i === 0 ? 120 : 90,
            height: i === 0 ? 140 : 110,
            left: `${[10, 35, 60, 15, 50][i]}%`,
            top: `${[5, 20, 5, 50, 45][i]}%`,
            zIndex: i,
          }}
        >
          <img src={logoUrl} alt="" className="w-full object-cover" style={{ height: "85%" }} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ heure }: { heure?: string }) {
  const baseHour = heure ? parseInt(heure.split(":")[0], 10) : 15;
  const events = [
    { time: `${String(baseHour).padStart(2, "0")}:00`, label: "Accueil des invités", dot: "empty" },
    { time: `${String(baseHour).padStart(2, "0")}:15`, label: "Séance photo", dot: "filled" },
    { time: `${String(baseHour + 1).padStart(2, "0")}:00`, label: "Animation & surprises", desc: "La soirée se déroulera dans un format totalement nouveau. Nous ferons des activités à la main — quelque chose de très mignon !", dot: "filled" },
  ];

  return (
    <div className="flex flex-col">
      {events.map(({ time, label, desc, dot }, i) => (
        <div key={i} className="flex gap-3">
          {/* Ligne + point */}
          <div className="flex flex-col items-center" style={{ minWidth: 16 }}>
            {i > 0 && <div className="w-px flex-1 bg-gray-200 mb-1" />}
            <motion.div
              className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1 ${dot === "filled" ? "bg-[#e879a0]" : "border-2 border-gray-300 bg-white"}`}
              animate={dot === "filled" ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {i < events.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
          </div>
          {/* Texte */}
          <div className="pb-4">
            <p className="text-[10px] text-[#e879a0] font-bold">{time}</p>
            <p className="text-sm text-gray-700 font-semibold">{label}</p>
            {desc && <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function AnniversaireBirthdayParty({ data, guestName, initialStatus, onConfirmParams }: TemplateProps) {
  const countdown = useCountdown(data.eventDateIso || data.date);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const } },
  });

  const pinkPalette = ["#f9c8d9", "#f0a0c0", "#e879a0", "#d44b80"];

  return (
    <main
      className="w-full min-h-screen"
      style={{ background: "linear-gradient(180deg, #fff5f8 0%, #ffffff 40%)", fontFamily: "Georgia, serif" }}
    >
      <motion.div initial="hidden" animate="visible" className="flex flex-col">

        {/* ── Hero — fond photo avec overlay ── */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
          {data.logoUrl && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${data.logoUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "brightness(0.55)",
              }}
            />
          )}
          {/* Overlay dégradé blanc en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fff5f8] to-transparent" />

          <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-10 px-6">
            <motion.div
              variants={fadeUp(0.1)}
              className="text-center"
            >
              <h1
                className="text-6xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(232,121,160,0.6)]"
                style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#fff" }}
              >
                Birthday
              </h1>
              <h2
                className="text-3xl font-black uppercase tracking-[0.18em] text-white mt-1"
                style={{ letterSpacing: "0.3em" }}
              >
                PARTY
              </h2>
            </motion.div>

            <Stars count={5} color="#ffd6e8" />

            <motion.p variants={fadeUp(0.3)} className="text-white/90 text-sm mt-2 italic text-center">
              Pour : <span className="font-bold not-italic">{guestName}</span>
            </motion.p>
          </div>
        </div>

        {/* ── Corps ── */}
        <div className="px-5 pb-12 flex flex-col gap-6 -mt-2">

          {/* Nom + date */}
          <motion.div variants={fadeUp(0.05)} className="text-center">
            <h3
              className="text-3xl text-[#e879a0]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {data.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{data.heure ? `${data.date} · ${data.heure}` : data.date}</p>
          </motion.div>

          {/* Mini calendrier */}
          <motion.div variants={fadeUp(0.1)}>
            <MiniCalendar dateIso={data.eventDateIso} dateLabel={data.date} />
          </motion.div>

          {/* Collage polaroid */}
          {data.logoUrl && (
            <motion.div variants={fadeUp(0.12)}>
              <PolaroidCollage logoUrl={data.logoUrl} />
            </motion.div>
          )}

          {/* Countdown */}
          <motion.div variants={fadeUp(0.14)} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
            <p className="text-center text-[#e879a0] text-xs uppercase tracking-widest mb-3">Compte à rebours</p>
            <div className="flex justify-center gap-2">
              {[
                { v: countdown.d, l: "Jours" },
                { v: countdown.h, l: "Heures" },
                { v: countdown.m, l: "Min" },
                { v: countdown.s, l: "Sec" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[#e879a0] text-lg font-bold mb-3">:</span>}
                  <div className="flex flex-col items-center">
                    <motion.span
                      key={v}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-black text-[#e879a0] tabular-nums w-9 text-center"
                    >
                      {String(v).padStart(2, "0")}
                    </motion.span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeUp(0.16)} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#e879a0] text-lg">✦</span>
              <p className="text-[#e879a0] font-black uppercase tracking-[0.2em] text-sm">Timing</p>
              <span className="text-gray-300 text-xs italic">timeline</span>
            </div>
            <Timeline heure={data.heure} />
          </motion.div>

          {/* Dress code */}
          <motion.div variants={fadeUp(0.18)} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#e879a0] text-lg">✦</span>
              <p className="text-[#e879a0] font-black uppercase tracking-[0.2em] text-sm">Dress-Code</p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              {data.customField1Value ||
                "Un photographe sera présent. Adoptez une tenue colorée et lumineuse — les codes roses et vifs sont les bienvenus !"}
            </p>
            {/* Palette de couleurs */}
            <div className="flex gap-2 mb-1">
              {pinkPalette.map((c) => (
                <motion.div
                  key={c}
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-8 h-8 rounded-full shadow-sm cursor-pointer"
                  style={{ background: c }}
                />
              ))}
            </div>
          </motion.div>

          {/* Cadeau */}
          <motion.div variants={fadeUp(0.2)} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#e879a0] text-lg">✦</span>
              <p className="text-[#e879a0] font-black uppercase tracking-[0.2em] text-sm">Cadeau</p>
              <span className="text-gray-300 text-xs italic">present</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              {data.customField2Value ||
                "Je sais qu'il est difficile de choisir un cadeau. Une enveloppe avec un petit mot me touchera autant que n'importe quel présent. Si vous souhaitez tout de même m'offrir quelque chose de spécial, je serai ravie de le chérir longtemps."}
            </p>
          </motion.div>

          {/* Description / message perso */}
          {data.description && (
            <motion.div
              variants={fadeUp(0.22)}
              className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-5 border border-pink-100"
            >
              <p className="text-gray-600 text-sm italic text-center leading-relaxed">
                "{data.description}"
              </p>
            </motion.div>
          )}

          {/* Localisation */}
          <motion.div variants={fadeUp(0.24)} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#e879a0] text-lg">✦</span>
              <p className="text-[#e879a0] font-black uppercase tracking-[0.2em] text-sm">Localisation</p>
              <span className="text-gray-300 text-xs italic">location</span>
            </div>
            <p className="text-gray-700 text-sm font-semibold">{data.place}</p>
            {data.heure && (
              <p className="text-gray-400 text-xs mt-1">À partir de {data.heure}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full py-2 rounded-full border border-[#e879a0] text-[#e879a0] text-xs font-semibold"
            >
              Ouvrir sur la carte →
            </motion.button>
          </motion.div>

          {/* QR Code */}
          {data.qrCodeUrl && (
            <motion.div variants={fadeUp(0.26)} className="flex flex-col items-center gap-2">
              <Stars count={4} />
              <p className="text-gray-400 text-xs uppercase tracking-widest">Votre invitation</p>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-pink-100">
                <img src={data.qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-xl" />
              </div>
              <p className="text-gray-400 text-[10px] italic">{guestName}</p>
            </motion.div>
          )}

          {/* RSVP */}
          <motion.div variants={fadeUp(0.28)} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
            <Stars count={5} />
            <p
              className="text-2xl text-[#e879a0] text-center mb-4"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Confirmez votre présence
            </p>
            <RSVPSection
              initialStatus={initialStatus ?? "brouillon"}
              onConfirm={onConfirmParams ?? (async () => {})}
              acceptClassName="w-full rounded-full bg-[#e879a0] py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,121,160,0.4)]"
              declineClassName="w-full rounded-full border border-[#e879a0]/40 bg-white py-3 text-sm font-semibold text-[#e879a0]"
              acceptLabel="Je serai là ! 🎉"
              declineLabel="Je ne pourrai pas venir"
              wrapperClassName="flex flex-col gap-3"
            />
          </motion.div>

          <Stars count={6} />
          <p className="text-center text-[10px] text-gray-300">Créé avec INVYRA</p>
        </div>
      </motion.div>
    </main>
  );
}
