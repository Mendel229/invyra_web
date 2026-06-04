"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md bg-white p-8 rounded-3xl shadow-2xl border-b-8 border-[#5B21B6]"
      >
        <span className="text-4xl block mb-4">✉️</span>
        <h1 className="text-2xl font-bold text-gray-950 mb-2 font-serif">Invitation Introuvable</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Ce lien d'invitation n'est pas valide, a été désactivé ou l'événement n'existe plus. 
          Veuillez vérifier le lien reçu ou contacter l'organisateur.
        </p>
        
        <div className="text-xs text-gray-400 font-medium uppercase tracking-widest pt-4 border-t border-gray-100">
          Sécurisé par <span className="font-bold text-[#5B21B6]">INVYRA</span>
        </div>
      </motion.div>
    </div>
  );
}