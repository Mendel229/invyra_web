"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, QrCode } from "lucide-react";
import { DOWNLOAD_URL, EVENT_TYPES, STEPS } from "@/lib/landing-content";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-noir-doux/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <a href="#top" className="flex items-center">
          <Image src="/invyra_full_white.png" alt="Invyra" width={377} height={100} className="h-8 w-auto sm:h-10 lg:h-12" priority />
        </a>
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-or-africain px-3.5 py-2 text-xs font-bold text-noir-doux transition-colors hover:bg-or-africain-alt sm:px-4"
        >
          <Download className="size-3.5" />
          Télécharger
        </a>
      </div>
    </header>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
      className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none"
    >
      <Image
        src="/img5-08.png"
        alt="Des invités célèbrent en consultant leur invitation Invyra"
        width={2000}
        height={1194}
        className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
        priority
      />

      {/* Voile sombre au bas de l'image : garde le titre lisible quand il chevauche l'image (mobile) */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-noir-doux to-transparent lg:hidden" />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-2 bottom-[44%] flex items-center gap-1.5 rounded-xl bg-white/95 px-2.5 py-2 shadow-xl backdrop-blur sm:left-0 sm:gap-2 sm:rounded-2xl sm:px-3.5 sm:py-2.5 lg:bottom-[6%]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-brand-success/15 text-brand-success sm:size-7">
          <CheckCircle2 className="size-3.5 sm:size-4" />
        </span>
        <div className="leading-none">
          <p className="text-[11px] font-bold text-noir-doux sm:text-xs">RSVP confirmé</p>
          <p className="mt-0.5 text-[9px] text-noir-doux/50 sm:text-[10px]">À l&apos;instant</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-2 bottom-[28%] flex items-center gap-1.5 rounded-xl bg-white/95 px-2.5 py-2 shadow-xl backdrop-blur sm:right-0 sm:gap-2 sm:rounded-2xl sm:px-3.5 sm:py-2.5 lg:bottom-[2%]"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-violet-royal/10 text-violet-royal sm:size-7">
          <QrCode className="size-3.5 sm:size-4" />
        </span>
        <div className="leading-none">
          <p className="text-[11px] font-bold text-noir-doux sm:text-xs">Accès scanné</p>
          <p className="mt-0.5 text-[9px] text-noir-doux/50 sm:text-[10px]">Entrée validée</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
      <div aria-hidden className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-violet-royal/25 blur-[130px] rounded-full pointer-events-none" />
      <div aria-hidden className="absolute bottom-[-80px] right-[8%] w-[320px] h-[320px] bg-or-africain/15 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-10">
        <div className="relative z-10 order-2 -mt-24 text-center lg:order-none lg:mt-0 lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
            className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-6xl"
          >
            Invitez en grand, <span className="text-or-africain">célébrez sans limites</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-6 max-w-lg text-justify text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
          >
            Créez des invitations numériques somptueuses pour vos mariages, anniversaires, baptêmes et soirées —
            avec RSVP en temps réel, QR code d&apos;accès et suivi de vos invités, le tout depuis votre téléphone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-or-africain px-6 py-3.5 text-sm font-bold text-noir-doux shadow-lg shadow-or-africain/20 transition-colors hover:bg-or-africain-alt"
            >
              <Download className="size-4" />
              Télécharger l&apos;application
            </a>
            <a
              href="#comment-ca-marche"
              className="hidden items-center gap-1.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white/80 ring-1 ring-white/15 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Comment ça marche
              <ArrowRight className="size-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          >
            {EVENT_TYPES.map((type) => (
              <span
                key={type}
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/50 ring-1 ring-white/10"
              >
                {type}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="order-1 lg:order-none">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Comment ça marche</h2>
          <p className="mt-4 text-white/55">Invitez. Célébrez. Rassemblez. En quatre étapes simples.</p>
        </FadeUp>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <FadeUp key={step.title} delay={index * 0.1} className="relative text-center lg:text-left">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-or-africain to-or-africain-alt text-base font-extrabold text-noir-doux shadow-lg shadow-or-africain/20">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{step.description}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24">
      <FadeUp className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-royal via-violet-royal to-violet-royal-alt px-6 py-14 text-center shadow-2xl shadow-violet-royal/30 sm:px-14">
        <div className="relative">
          <span aria-hidden className="absolute -top-20 -right-10 size-48 rounded-full bg-or-africain/25 blur-3xl" />
          <span aria-hidden className="absolute -bottom-16 -left-10 size-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Votre prochain événement mérite une entrée inoubliable
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Téléchargez Invyra et créez votre première invitation en quelques minutes. Gratuit pour commencer.
            </p>
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-or-africain px-7 py-3.5 text-sm font-bold text-noir-doux shadow-lg transition-colors hover:bg-or-africain-alt"
            >
              <Download className="size-4" />
              Télécharger l&apos;application
            </a>
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-white/40">
              Disponible sur Android · iOS bientôt disponible
            </p>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-5 py-8 sm:px-8">
      <p className="text-center text-xs text-white/35">
        © {new Date().getFullYear()} Invyra. Tous droits réservés.
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-noir-doux text-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </div>
  );
}
