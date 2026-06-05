import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase"; 

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

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitationPage({ params }: PageProps) {
  const { token } = await params;

  // 1. RÉCUPÉRATION DE L'INVITATION ET DE SON ÉVÉNEMENT AVEC LE TEMPLATE
  // (Plus besoin de faire "await createClient()", on utilise directement "supabase")
  const { data: invitation, error } = await supabase
    .from("event_guests")
    .select(`
      id,
      guest_name,
      status,
      events (
        id,
        name,
        event_type,
        event_date,
        place,
        description,
        metadata,
        event_templates (
          web_template_key
        )
      )
    `)
    .eq("token", token)
    .single();

  // Si l'invitation n'existe pas ou qu'il y a une erreur, on renvoie une 404
  if (error || !invitation || !invitation.events) {
    notFound();
  }

  const event = invitation.events as any;
  const templateKey = event.event_templates?.web_template_key;

  // 2. ADAPTATEUR / FORMATAGE DES DONNÉES UNIFIÉES
  const dateObj = new Date(event.event_date);
  
  const formattedData = {
    name: event.name,
    event_type: event.event_type,
    place: event.place,
    description: event.description || "",
    date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    heure: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    
    // Métadonnées pour les champs personnalisés
    metadata: event.metadata || {},
    customField1Label: event.metadata?.customField1Label,
    customField1Value: event.metadata?.customField1Value,
    customField2Label: event.metadata?.customField2Label,
    customField2Value: event.metadata?.customField2Value,
  };

  // 3. SERVER ACTION CORRIGÉE
  const handleConfirm = async (status: "accepted" | "declined", comment?: string) => {
    "use server";
    
    // On réutilise directement la même instance globale
    await supabase
      .from("event_guests")
      .update({ 
        status: status,
      })
      .eq("token", token);
  };

  // 4. RENDU DYNAMIQUE DU TEMPLATE
  return (
    <>
      {/* Anniversaires */}
      {templateKey === "anniversaire-colore" && (
        <AnniversaireFeteColoree data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "neon-birthday" && (
        <AnniversaireNeonBirthday data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Autre */}
      {templateKey === "simple-other" && (
        <TemplateSimpleOther data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Baptêmes */}
      {templateKey === "bapteme-celeste" && (
        <BaptemeDouceurCeleste data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "sacred-lilies" && (
        <BaptemeSacredLilies data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Corporate */}
      {templateKey === "african-tech" && (
        <CorporateAfricanTech data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "executive-summit" && (
        <CorporateExecutiveSummit data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Mariages */}
      {templateKey === "mariage-dore" && (
        <MariageEleganceDoree data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-romance" && (
        <MariageMidnightRomance data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Soirées VIP */}
      {templateKey === "golden-gala" && (
        <SoireeGoldenGala data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-accra" && (
        <SoireeMidnightAccra data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}

      {/* Sécurité */}
      {!templateKey && (
        <TemplateSimpleOther data={formattedData} guestName={invitation.guest_name} onConfirmParams={handleConfirm} />
      )}
    </>
  );
}