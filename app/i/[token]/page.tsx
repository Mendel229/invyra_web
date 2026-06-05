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
  const { token } = await params; // Ici, 'token' correspond au 'public_token' de la table invitations

  // 1. RÉCUPÉRATION DE L'INVITATION VIA public_token, avec join vers qr_codes, guests et events
  const { data: invitationRecord, error } = await supabase
    .from("invitations")
    .select(`
      id,
      status,
      public_token,
      qr_codes (
        code
      ),
      guests (
        full_name
      ),
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
    .eq("public_token", token)
    .single();

  // Si le token n'existe pas ou qu'il y a une erreur, on renvoie une 404
  if (error || !invitationRecord || !(invitationRecord as any).events) {
    notFound();
  }

  const invitation = invitationRecord as any;
  const event = invitation.events;
  const guest = invitation.guests;
  const templateKey = event.event_templates?.web_template_key;

  // Le code QR vient du join qr_codes — peut être null si pas encore généré
  const qrCode = Array.isArray(invitation.qr_codes)
    ? invitation.qr_codes[0]?.code ?? null
    : invitation.qr_codes?.code ?? null;

  // 2. ADAPTATEUR / FORMATAGE DES DONNÉES UNIFIÉES
  const dateObj = new Date(event.event_date);
  
  const formattedData = {
    name: event.name,
    event_type: event.event_type,
    place: event.place,
    description: event.description || "",
    date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    heure: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    
    // CODE UNIQUE REQUIS POUR GÉNÉRER LE QR CODE DANS LE TEMPLATE
    qrCodeCode: qrCode,
    
    // Métadonnées pour les champs personnalisés
    metadata: event.metadata || {},
    customField1Label: event.metadata?.customField1Label,
    customField1Value: event.metadata?.customField1Value,
    customField2Label: event.metadata?.customField2Label,
    customField2Value: event.metadata?.customField2Value,
  };

  // 3. SERVER ACTION POUR LA CONFIRMATION (RSVP)
  const handleConfirm = async (status: "accepted" | "declined", comment?: string) => {
    "use server";
    
    await supabase
      .from("invitations")
      .update({ 
        status: status,
      })
      .eq("id", invitation.id);
  };

  // 4. RENDU DYNAMIQUE DU TEMPLATE
  return (
    <>
      {/* Anniversaires */}
      {templateKey === "anniversaire-colore" && (
        <AnniversaireFeteColoree data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "neon-birthday" && (
        <AnniversaireNeonBirthday data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Autre */}
      {templateKey === "simple-other" && (
        <TemplateSimpleOther data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Baptêmes */}
      {templateKey === "bapteme-celeste" && (
        <BaptemeDouceurCeleste data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "sacred-lilies" && (
        <BaptemeSacredLilies data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Corporate */}
      {templateKey === "african-tech" && (
        <CorporateAfricanTech data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "executive-summit" && (
        <CorporateExecutiveSummit data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Mariages */}
      {templateKey === "mariage-dore" && (
        <MariageEleganceDoree data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-romance" && (
        <MariageMidnightRomance data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Soirées VIP */}
      {templateKey === "golden-gala" && (
        <SoireeGoldenGala data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-accra" && (
        <SoireeMidnightAccra data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}

      {/* Sécurité */}
      {!templateKey && (
        <TemplateSimpleOther data={formattedData} guestName={guest.full_name} onConfirmParams={handleConfirm} />
      )}
    </>
  );
}