import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

// Forcer le rendu dynamique — cette page ne doit jamais être mise en cache statique
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // DEBUG: vérifier que les variables d'env sont bien chargées
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supaUrl = process.env.SUPABASE_URL;
  console.log('[InvitationPage] SUPABASE_URL defined:', !!supaUrl, '| url:', supaUrl?.substring(0, 30));
  console.log('[InvitationPage] SERVICE_ROLE_KEY defined:', !!serviceKey, '| length:', serviceKey?.length ?? 0, '| starts:', serviceKey?.substring(0, 10));
  console.log('[InvitationPage] token:', token);

  // 1. Récupérer l'invitation via public_token (sans joins pour éviter les ambiguïtés PostgREST)
  const { data: invitationRecord, error: invError } = await supabaseAdmin
    .from("invitations")
    .select("id, status, public_token, event_id, guest_id")
    .eq("public_token", token)
    .maybeSingle();

  console.log('[InvitationPage] invitations result:', JSON.stringify(invitationRecord), '| error:', JSON.stringify(invError));

  if (invError || !invitationRecord) {
    console.error('[InvitationPage] invitations query error:', JSON.stringify(invError), '| token:', token);
    notFound();
  }

  // 2. Récupérer en parallèle : invité, QR code, et événement+template
  const [guestRes, qrRes, eventRes] = await Promise.all([
    supabaseAdmin
      .from("guests")
      .select("full_name")
      .eq("id", invitationRecord.guest_id)
      .single(),

    supabaseAdmin
      .from("qr_codes")
      .select("code")
      .eq("invitation_id", invitationRecord.id)
      .maybeSingle(),

    supabaseAdmin
      .from("events")
      .select("id, name, event_type, event_date, place, description, metadata, template_id")
      .eq("id", invitationRecord.event_id)
      .single(),
  ]);

  if (eventRes.error || !eventRes.data || guestRes.error || !guestRes.data) {
    notFound();
  }

  const guest = guestRes.data;
  const event = eventRes.data;
  const qrCode = qrRes.data?.code ?? null;

  // 3. Récupérer le template si event a un template_id
  let templateKey: string | null = null;
  if (event.template_id) {
    const { data: templateData } = await supabaseAdmin
      .from("event_templates")
      .select("web_template_key")
      .eq("id", event.template_id)
      .single();
    templateKey = templateData?.web_template_key ?? null;
  }

  // 4. FORMATAGE DES DONNÉES
  const dateObj = new Date(event.event_date);
  
  const formattedData = {
    name: event.name,
    event_type: event.event_type,
    place: event.place,
    description: event.description || "",
    date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    heure: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    qrCodeCode: qrCode,
    metadata: event.metadata || {},
    customField1Label: event.metadata?.customField1Label,
    customField1Value: event.metadata?.customField1Value,
    customField2Label: event.metadata?.customField2Label,
    customField2Value: event.metadata?.customField2Value,
  };

  // 3. SERVER ACTION POUR LA CONFIRMATION (RSVP)
  const handleConfirm = async (status: "accepted" | "declined", _comment?: string) => {
    "use server";
    await supabaseAdmin
      .from("invitations")
      .update({ status: status })
      .eq("id", invitationRecord.id);
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