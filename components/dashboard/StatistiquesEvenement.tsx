"use client";

import { motion } from "framer-motion";

interface StatsProps {
  totalVues: number;
  totalPresents: number;
  totalAbsents: number;
  totalInvites: number;
}

export default function StatistiquesEvenement({ totalVues, totalPresents, totalAbsents, totalInvites }: StatsProps) {
  // Calcul du taux de réponse
  const totalReponses = totalPresents + totalAbsents;
  const tauxReponse = totalInvites > 0 ? Math.round((totalReponses / totalInvites) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFCFC] min-h-screen text-[#1F1F1F]">
      
      {/* En-tête du Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#5B21B6]">Tableau de Bord INVYRA</h1>
        <p className="text-gray-500 text-sm">Suivi en temps réel de vos invitations</p>
      </div>

      {/* Grille des statistiques avec animation Framer Motion */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Carte : Total Invités */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">👥 Invités Totaux</span>
          <span className="text-3xl font-black text-gray-800 mt-2">{totalInvites}</span>
        </div>

        {/* Carte : Total Vues */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">👁️ Total Vues</span>
          <span className="text-3xl font-black text-blue-600 mt-2">{totalVues}</span>
        </div>

        {/* Carte : Présents */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">✅ Présents</span>
          <span className="text-3xl font-black text-green-600 mt-2">{totalPresents}</span>
        </div>

        {/* Carte : Absents */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">❌ Absents</span>
          <span className="text-3xl font-black text-red-500 mt-2">{totalAbsents}</span>
        </div>
      </motion.div>

      {/* Barre de progression du taux de réponse */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-2 text-sm font-semibold text-gray-700">
          <span>Taux de réponse des invités</span>
          <span className="text-[#5B21B6]">{tauxReponse}%</span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${tauxReponse}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-[#5B21B6] to-[#D4A017] h-full rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {totalReponses} réponses sur {totalInvites} invités attendus.
        </p>
      </div>

    </div>
  );
}