import { notFound } from "next/navigation";

// Imports de tous les composants de templates
import AnniversaireFeteColoree from "@/components/templates/anniversaire/AnniversaireFeteColoree";
import AnniversaireNeonBirthday from "@/components/templates/anniversaire/AnniversaireNeonBirthday";
import TemplateSimpleOther from "@/components/templates/autre/TemplateSimpleOther";
import BaptemeDouceurCeleste from "@/components/templates/bapteme/BaptemeDouceurCeleste";
import BaptemeSacredLilies from "@/components/templates/bapteme/BaptemeSacredLilies";
import CorporateAfricanTech from "@/components/templates/corporate/CorporateAfricanTech";
import CorporateExecutiveSummit from "@/components/templates/corporate/CorporateExecutiveSummit";
import MariageEleganceDoree from "@/components/templates/mariage/MariageEleganceDoree";
import MariageMidnightRomance from "@/components/templates/mariage/MariageMidnightRomance";
import SoireeGoldenGala from "@/components/templates/soiree_vip/SoireeGoldenGala";
import SoireeMidnightAccra from "@/components/templates/soiree_vip/SoireeMidnightAccra";

interface PreviewPageProps {
  params: Promise<{ templateKey: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { templateKey } = await params;

  // 1. Liste stricte des 11 clés de templates valides
  const validTemplates = [
    "anniversaire-colore",
    "neon-birthday",
    "simple-other",
    "bapteme-celeste",
    "sacred-lilies",
    "african-tech",
    "executive-summit",
    "mariage-dore",
    "midnight-romance",
    "golden-gala",
    "midnight-accra"
  ];

  if (!validTemplates.includes(templateKey)) {
    notFound();
  }

  // 2. Définition dynamique du type d'événement pour le mock selon la clé demandée
  // Cela permet d'avoir le bon design de base selon l'aperçu choisi
  let currentEventType: "mariage" | "anniversaire" | "bapteme" | "soiree_vip" | "corporate" | "autre" = "autre";
  
  if (templateKey.startsWith("mariage")) currentEventType = "mariage";
  else if (templateKey.startsWith("anniversaire") || templateKey === "neon-birthday") currentEventType = "anniversaire";
  else if (templateKey.startsWith("bapteme") || templateKey === "sacred-lilies") currentEventType = "bapteme";
  else if (templateKey === "golden-gala" || templateKey.startsWith("midnight-accra")) currentEventType = "soiree_vip";
  else if (templateKey === "african-tech" || templateKey === "executive-summit") currentEventType = "corporate";

  // 3. Données de démonstration typées pour correspondre à l'interface 'InvitationData'
  const demoData = {
    name: "Célébration de Démonstration",
    nomEvenement: "Célébration de Démonstration",
    event_type: currentEventType,
    eventType: currentEventType,
    place: "Hôtel Azalaï, Salon Prestige",
    lieu: "Hôtel Azalaï, Salon Prestige",
    description: "Ceci est un aperçu en temps réel de votre invitation haut de gamme.",
    message: "Ceci est un aperçu en temps réel de votre invitation haut de gamme.",
    date: "Samedi 24 Octobre 2026",
    heure: "18h00",
    nomCouple: "Mariame & Ibrahim",
    metadata: {
      customField1Label: "Dress Code",
      customField1Value: "Blanc et Doré",
    },
    customField1Label: "Dress Code",
    customField1Value: "Blanc et Doré",
  };

  // 4. Action RSVP Démo vide
  const handleDemoConfirm = async () => {
    "use server";
    // Mode démo : aucune action en base de données.
  };

  // 5. Rendu conditionnel sécurisé (on passe le "as any" uniquement sur la fonction RSVP si nécessaire)
  return (
    <div className="w-full min-h-screen">
      {/* Anniversaires */}
      {templateKey === "anniversaire-colore" && (
        <AnniversaireFeteColoree data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "neon-birthday" && (
        <AnniversaireNeonBirthday data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}

      {/* Autre */}
      {templateKey === "simple-other" && (
        <TemplateSimpleOther data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}

      {/* Baptêmes */}
      {templateKey === "bapteme-celeste" && (
        <BaptemeDouceurCeleste data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "sacred-lilies" && (
        <BaptemeSacredLilies data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}

      {/* Corporate */}
      {templateKey === "african-tech" && (
        <CorporateAfricanTech data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "executive-summit" && (
        <CorporateExecutiveSummit data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}

      {/* Mariages */}
      {templateKey === "mariage-dore" && (
        <MariageEleganceDoree data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "midnight-romance" && (
        <MariageMidnightRomance data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}

      {/* Soirées VIP */}
      {templateKey === "golden-gala" && (
        <SoireeGoldenGala data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "midnight-accra" && (
        <SoireeMidnightAccra data={demoData as any} guestName="Invité Démo (Exemple)" onConfirmParams={handleDemoConfirm as any} />
      )}
    </div>
  );
}