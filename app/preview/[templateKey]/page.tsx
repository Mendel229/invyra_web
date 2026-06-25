import { notFound } from "next/navigation";

import AnniversaireFeteColoree from "@/components/templates/anniversaire/AnniversaireFeteColoree";
import AnniversaireNeonBirthday from "@/components/templates/anniversaire/AnniversaireNeonBirthday";
import TemplateSimpleOther from "@/components/templates/autre/TemplateSimpleOther";
import BaptemeDouceurCeleste from "@/components/templates/bapteme/BaptemeDouceurCeleste";
import BaptemeSacredLilies from "@/components/templates/bapteme/BaptemeSacredLilies";
import CorporateAfricanTech from "@/components/templates/corporate/CorporateAfricanTech";
import CorporateExecutiveSummit from "@/components/templates/corporate/CorporateExecutiveSummit";
import MariageEleganceDoree from "@/components/templates/mariage/MariageEleganceDoree";
import MariageMidnightRomance from "@/components/templates/mariage/MariageMidnightRomance";
import MariageSaugeEukalyptus from "@/components/templates/mariage/MariageSaugeEukalyptus";
import MariageOliveElegant from "@/components/templates/mariage/MariageOliveElegant";
import SoireeGoldenGala from "@/components/templates/soiree_vip/SoireeGoldenGala";
import SoireeMidnightAccra from "@/components/templates/soiree_vip/SoireeMidnightAccra";

interface PreviewPageProps {
  params: Promise<{ templateKey: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { templateKey } = await params;
  const sp = await searchParams;

  const validTemplates = [
    "anniversaire-colore", "neon-birthday", "simple-other",
    "bapteme-celeste", "sacred-lilies", "african-tech",
    "executive-summit", "mariage-dore", "midnight-romance",
    "golden-gala", "midnight-accra", "sauge-eukalyptus", "olive-elegant",
  ];

  if (!validTemplates.includes(templateKey)) {
    notFound();
  }

  // Détecter le type d'event selon le templateKey
  let currentEventType: "mariage" | "anniversaire" | "bapteme" | "soiree_vip" | "corporate" | "autre" = "autre";
  if (templateKey.startsWith("mariage") || templateKey === "midnight-romance") currentEventType = "mariage";
  else if (templateKey.startsWith("anniversaire") || templateKey === "neon-birthday") currentEventType = "anniversaire";
  else if (templateKey.startsWith("bapteme") || templateKey === "sacred-lilies") currentEventType = "bapteme";
  else if (templateKey === "golden-gala" || templateKey === "midnight-accra") currentEventType = "soiree_vip";
  else if (templateKey === "african-tech" || templateKey === "executive-summit") currentEventType = "corporate";

  // Helper pour lire un query param string
  const str = (key: string, fallback: string) => {
    const v = sp[key];
    return typeof v === "string" && v.trim() ? v.trim() : fallback;
  };

  // Formater la date si fournie, sinon démo
  let formattedDate = "Samedi 24 Octobre 2026";
  let formattedHeure = "18h00";
  const rawDate = sp["event_date"];
  if (typeof rawDate === "string" && rawDate) {
    try {
      const d = new Date(rawDate);
      formattedDate = d.toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      formattedHeure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } catch (_) {}
  }

  // QR code de démo — sans logique réelle derrière
  const demoQrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=APERCU_DEMO&format=png&margin=4";

  const previewData = {
    name: str("name", "Célébration de Démonstration"),
    event_type: currentEventType,
    place: str("place", "Hôtel Azalaï, Salon Prestige"),
    description: str("description", "Ceci est un aperçu en temps réel de votre invitation."),
    date: formattedDate,
    heure: formattedHeure,
    logoUrl: str("logo_url", "") || undefined,
    qrCodeUrl: demoQrCode,
    nomCouple: str("name", ""),
    metadata: {},
    customField1Label: str("cf1_label", "") || undefined,
    customField1Value: str("cf1_value", "") || undefined,
    customField2Label: str("cf2_label", "") || undefined,
    customField2Value: str("cf2_value", "") || undefined,
  };

  const guestName = "Prénom Nom (Aperçu)";

  // RSVP vide en mode aperçu
  const handleDemoConfirm = async () => { "use server"; };

  return (
    <div className="w-full min-h-screen">
      {templateKey === "anniversaire-colore" && (
        <AnniversaireFeteColoree data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "neon-birthday" && (
        <AnniversaireNeonBirthday data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "simple-other" && (
        <TemplateSimpleOther data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "bapteme-celeste" && (
        <BaptemeDouceurCeleste data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "sacred-lilies" && (
        <BaptemeSacredLilies data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "african-tech" && (
        <CorporateAfricanTech data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "executive-summit" && (
        <CorporateExecutiveSummit data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "mariage-dore" && (
        <MariageEleganceDoree data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "midnight-romance" && (
        <MariageMidnightRomance data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "golden-gala" && (
        <SoireeGoldenGala data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "midnight-accra" && (
        <SoireeMidnightAccra data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "sauge-eukalyptus" && (
        <MariageSaugeEukalyptus data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
      {templateKey === "olive-elegant" && (
        <MariageOliveElegant data={previewData as any} guestName={guestName} onConfirmParams={handleDemoConfirm as any} />
      )}
    </div>
  );
}
