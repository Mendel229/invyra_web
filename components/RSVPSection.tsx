"use client";

import { useState } from "react";

interface RSVPSectionProps {
  initialStatus: string;
  onConfirm: (status: "accepted" | "declined") => Promise<void>;
  acceptClassName?: string;
  declineClassName?: string;
  acceptLabel?: string;
  declineLabel?: string;
  wrapperClassName?: string;
  acceptStyle?: React.CSSProperties;
  declineStyle?: React.CSSProperties;
}

export default function RSVPSection({
  initialStatus,
  onConfirm,
  acceptClassName = "rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white",
  declineClassName = "rounded-full border border-gray-300 bg-white/60 px-4 py-3 text-sm font-semibold text-gray-700",
  acceptLabel = "Je participe",
  declineLabel = "Je décline",
  wrapperClassName = "mt-7 grid grid-cols-2 gap-3",
  acceptStyle,
  declineStyle,
}: RSVPSectionProps) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);
  const [showConfirm, setShowConfirm] = useState<"accepted" | "declined" | null>(null);

  const hasResponded = status === "accepted" || status === "declined"
    || status === "confirme" || status === "decline";
  const isAcceptedFinal = status === "accepted" || status === "confirme";
  async function handleConfirmed() {
    if (!showConfirm) return;
    setLoading(showConfirm);
    setShowConfirm(null);
    try {
      await onConfirm(showConfirm);
      setStatus(showConfirm);
    } finally {
      setLoading(null);
    }
  }

  // Affichage si déjà répondu
  if (hasResponded) {
    return (
      <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur">
        <p className="text-sm font-bold text-white">
          {isAcceptedFinal ? "✓ Vous avez confirmé votre présence" : "✗ Vous avez décliné cette invitation"}
        </p>
        <p className="mt-1 text-xs text-white/60">
          Votre réponse a été enregistrée.
        </p>
      </div>
    );
  }

  // Dialog de confirmation
  if (showConfirm) {
    const isAccepting = showConfirm === "accepted";
    return (
      <div className="mt-7 rounded-2xl border border-white/20 bg-black/40 px-4 py-5 text-center backdrop-blur">
        <p className="text-sm font-bold text-white mb-1">
          {isAccepting ? "Confirmer votre présence ?" : "Décliner cette invitation ?"}
        </p>
        <p className="text-xs text-white/60 mb-4">
          {isAccepting
            ? "Votre hôte sera informé de votre participation."
            : "Votre hôte sera informé que vous ne pourrez pas venir."}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowConfirm(null)}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmed}
            disabled={loading !== null}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
              isAccepting ? "bg-green-500" : "bg-red-500"
            } disabled:opacity-60`}
          >
            {loading ? "Envoi..." : "Confirmer"}
          </button>
        </div>
      </div>
    );
  }

  // Boutons normaux
  return (
    <div className={wrapperClassName}>
      <button
        onClick={() => setShowConfirm("accepted")}
        disabled={loading !== null}
        className={`${acceptClassName} disabled:opacity-60`}
        style={acceptStyle}
      >
        {loading === "accepted" ? "Envoi..." : acceptLabel}
      </button>
      <button
        onClick={() => setShowConfirm("declined")}
        disabled={loading !== null}
        className={`${declineClassName} disabled:opacity-60`}
        style={declineStyle}
      >
        {loading === "declined" ? "Envoi..." : declineLabel}
      </button>
    </div>
  );
}
