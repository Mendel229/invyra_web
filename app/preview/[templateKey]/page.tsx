import { notFound } from "next/navigation";
import MariageEleganceDoree from "@/components/templates/mariage/MariageEleganceDoree";

interface PreviewPageProps {
  params: Promise<{ templateKey: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { templateKey } = await params;

  // Liste temporaire pour vérifier que le template demandé existe dans notre catalogue
  const validTemplates = ["mariage-dore"];
  if (!validTemplates.includes(templateKey)) {
    notFound();
  }

  // Fausses données premium pour la démonstration dans l'application mobile
  const demoData = {
    nomEvenement: "Mariage de Démonstration",
    eventType: "mariage",
    date: "Samedi 24 Octobre 2026",
    heure: "18h00",
    lieu: "Hôtel Azalaï, Salon Prestige",
    nomCouple: "Mariame & Ibrahim",
    message: "Ceci est un aperçu en temps réel de votre invitation haut de gamme.",
  };

  // Action RSVP vide pour le mode Démo (on ne veut pas écrire en base lors d'un simple aperçu)
  const handleDemoConfirm = async () => {
    "use server";
    // Mode démo : aucune action en base de données.
  };

  return (
    <MariageEleganceDoree
      data={demoData}
      guestName="Invité Démo (Exemple)"
      token="PREVIEW_MODE_TOKEN"
      onConfirm={handleDemoConfirm}
    />
  );
}