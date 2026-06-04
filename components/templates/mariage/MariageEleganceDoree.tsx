"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface InvitationData {
  nomEvenement: string;
  eventType: string;
  date: string;
  lieu: string;
  heure?: string;
  nomCouple?: string;
  message?: string;
}

interface TemplateProps {
  data: InvitationData;
  guestName: string;
  token: string;
  onConfirm: (status: "accepted" | "declined") => Promise<void>;
}

export default function MariageEleganceDoree({ data, guestName, token, onConfirm }: TemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  const handleResponse = async (status: "accepted" | "declined") => {
    setLoading(true);
    try {
      await onConfirm(status);
      setHasResponded(true);
      setIsOpen(false);
    } catch (e) {
      alert("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1F1F1F] flex items-center justify-center p-0 sm:p-4 relative">
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md min-h-screen sm:min-h-[850px] bg-[#FFF8ED] text-[#1F1F1F] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden border-t-8 border-[#D4A017]"
      >
        {/* En-tête */}
        <div className="text-center mt-4">
          <span className="text-[#D4A017] tracking-[0.25em] text-xs font-semibold uppercase block mb-2">
            Invitation Personnelle
          </span>
          <h2 className="text-gray-500 text-sm font-medium">Pour</h2>
          <h3 className="text-xl font-semibold text-gray-800 mt-1 font-serif italic">{guestName}</h3>
        </div>

        {/* Corps */}
        <div className="text-center my-6 space-y-4">
          <h1 className="text-3xl font-extrabold text-[#5B21B6] font-serif tracking-wide">
            {data.nomCouple || data.nomEvenement}
          </h1>
          <div className="w-16 h-[1px] bg-[#D4A017] mx-auto" />
          <p className="text-base font-medium text-gray-900">📅 {data.date} {data.heure && `à ${data.heure}`}</p>
          <p className="text-gray-600 italic">📍 {data.lieu}</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-100 flex flex-col items-center max-w-[220px] mx-auto my-2 text-center">
          <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase mb-3">Billet d'Entrée Unique</span>
          <QRCodeSVG value={token} size={140} fgColor="#1F1F1F" bgColor="#FFFFFF" level="M" />
        </div>

        {/* Bouton d'action RSVP MVP */}
        <div className="space-y-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={hasResponded}
            className={`w-full py-4 font-semibold rounded-xl shadow-lg uppercase tracking-wider text-xs transition-colors ${
              hasResponded ? "bg-green-600 text-white" : "bg-[#5B21B6] text-white hover:bg-[#4c1d95]"
            }`}
            onClick={() => !hasResponded && setIsOpen(true)}
          >
            {hasResponded ? "✓ Présence Confirmée" : "Confirmer ma présence"}
          </motion.button>
          <p className="text-center text-[10px] tracking-widest text-gray-400 uppercase">Créé avec <span className="font-bold text-[#5B21B6]">INVYRA</span></p>
        </div>
      </motion.div>

      {/* Fenêtre Modal Animée (MVP Confirmation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900">Serez-vous présent(e) ?</h3>
              <p className="text-gray-500 text-sm">Veuillez valider votre réponse pour l'organisation de l'événement.</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={loading}
                  onClick={() => handleResponse("accepted")}
                  className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {loading ? "..." : "👍 Oui, je viens"}
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleResponse("declined")}
                  className="py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  {loading ? "..." : "👎 Non, désolé"}
                </button>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-xs text-gray-400 hover:text-gray-600 font-medium underline"
              >
                Annuler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}