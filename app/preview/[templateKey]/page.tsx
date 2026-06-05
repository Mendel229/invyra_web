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

  
  const demoData = {
    name: "Mariage de Démonstration",
    event_type: "mariage" as const, 
    event_date: "2026-10-24T18:00:00Z",
    date: "Samedi 24 Octobre 2026",
    heure: "18h00",
    place: "Hôtel Azalaï, Salon Prestige",
    nomCouple: "Mariame & Ibrahim",
    description: "Ceci est un aperçu en temps réel de votre invitation haut de gamme.",
    logoUrl: undefined,
    qrCodeUrl: undefined,
    metadata: {
      customField1Label: "Dress Code",
      customField1Value: "Blanc et Doré",
    }
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
      onConfirmParams={handleDemoConfirm}
    />
  );
}