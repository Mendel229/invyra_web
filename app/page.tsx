"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#5B21B6]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#D4A017]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* En-tête avec ton LOGO */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4 relative z-10">
        <div className="relative h-10 w-32">
          <Image 
            src="/logo.png" 
            alt="INVYRA Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest font-semibold">
          Premium Digital Cards
        </span>
      </header>

      {/* Contenu Principal (Hero Section + Mascotte Welcom) */}
      <main className="w-full max-w-3xl mx-auto text-center my-auto relative z-10 space-y-8 py-8 flex flex-col items-center">
        
        {/* Ta Mascotte WELCOM animée (effet flottant doux) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-40 w-40 mb-2"
        >
          <Image 
            src="/welcom.png" 
            alt="Welcom - La Mascotte INVYRA" 
            fill
            className="object-contain"
            priority
          />
        </motion.div>


        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-serif"
        >
          Créez des invitations <br />
          <span className="bg-gradient-to-r from-[#D4A017] via-amber-200 to-[#5B21B6] bg-clip-text text-transparent">
            animées et inoubliables
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Envoyez des invitations numériques haut de gamme avec RSVP intégré et suivi en temps réel. Vos invités vont adorer avant même d'arriver.
        </motion.p>

        {/* Bouton Android Désactivé (Bientôt disponible) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-xs pt-4"
        >
          <div className="bg-white/5 border border-white/10 text-gray-400 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-not-allowed">
            <span className="text-sm font-bold flex items-center gap-2 text-gray-300">
              Application Android
            </span>
          </div>
        </motion.div>

      </main>

      {/* Pied de page */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 relative z-10">
        <p>© {new Date().getFullYear()} INVYRA. Tous droits réservés.</p>
        <p className="tracking-widest uppercase">L'art d'inviter avec élégance</p>
      </footer>

    </div>
  );
}