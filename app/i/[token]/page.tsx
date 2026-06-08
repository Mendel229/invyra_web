import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import RSVPSection from "@/components/RSVPSection";

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

  // 1. Récupérer l'invitation via public_token (sans joins pour éviter les ambiguïtés PostgREST)
  const { data: invitationRecord, error: invError } = await supabaseAdmin
    .from("invitations")
    .select("id, status, public_token, event_id, guest_id")
    .eq("public_token", token)
    .maybeSingle();

  if (invError || !invitationRecord) {
    notFound();
  }

  // Tracker la vue de manière synchrone pour garantir l'exécution
  const inv = invitationRecord!;
  await Promise.allSettled([
    supabaseAdmin.from("invitation_views").insert({ invitation_id: inv.id }),
    inv.status === "brouillon"
      ? supabaseAdmin
          .from("invitations")
          .update({ status: "envoye", viewed_at: new Date().toISOString() })
          .eq("id", inv.id)
          .eq("status", "brouillon")
      : Promise.resolve(),
    supabaseAdmin.rpc("increment_invitation_viewed", { event_id_param: inv.event_id }),
  ]);

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
      .select("id, name, event_type, event_date, place, description, metadata, template_id, logo_url")
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

  // Générer l'URL de l'image QR à partir du code hexadécimal
  const qrCodeUrl = qrCode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}&format=png&margin=4`
    : null;
  
  const formattedData = {
    name: event.name,
    event_type: event.event_type,
    place: event.place,
    description: event.description || "",
    date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    heure: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    qrCodeCode: qrCode,
    qrCodeUrl: qrCodeUrl ?? undefined,   // URL image QR pour les templates
    logoUrl: event.logo_url ?? undefined, // Logo de l'événement
    metadata: event.metadata || {},
    customField1Label: event.metadata?.customField1Label,
    customField1Value: event.metadata?.customField1Value,
    customField2Label: event.metadata?.customField2Label,
    customField2Value: event.metadata?.customField2Value,
  };

  // SERVER ACTION POUR LA CONFIRMATION (RSVP) — met à jour BDD et compteurs
  const handleConfirm = async (status: "accepted" | "declined", _comment?: string) => {
    "use server";
    // Mettre à jour le statut de l'invitation
    await supabaseAdmin
      .from("invitations")
      .update({
        status: status,
        confirmed_at: status === "accepted" ? new Date().toISOString() : null,
      })
      .eq("id", invitationRecord!.id);

    // Mettre à jour les compteurs sur l'event
    if (status === "accepted") {
      const { data: ev } = await supabaseAdmin
        .from("events")
        .select("guests_confirmed")
        .eq("id", invitationRecord!.event_id)
        .single();
      await supabaseAdmin
        .from("events")
        .update({ guests_confirmed: (ev?.guests_confirmed ?? 0) + 1 })
        .eq("id", invitationRecord!.event_id);
    }
  };

  const currentStatus = inv.status;

  // RENDU DYNAMIQUE DU TEMPLATE avec RSVPSection injectée
  const rsvpSection = (
    <RSVPSection
      initialStatus={currentStatus}
      onConfirm={handleConfirm}
    />
  );

  // 4. RENDU DYNAMIQUE DU TEMPLATE
  return (
    <>
      {templateKey === "anniversaire-colore" && (
        <AnniversaireFeteColoree data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "neon-birthday" && (
        <AnniversaireNeonBirthday data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "simple-other" && (
        <TemplateSimpleOther data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "bapteme-celeste" && (
        <BaptemeDouceurCeleste data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "sacred-lilies" && (
        <BaptemeSacredLilies data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "african-tech" && (
        <CorporateAfricanTech data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "executive-summit" && (
        <CorporateExecutiveSummit data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "mariage-dore" && (
        <MariageEleganceDoree data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-romance" && (
        <MariageMidnightRomance data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "golden-gala" && (
        <SoireeGoldenGala data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {templateKey === "midnight-accra" && (
        <SoireeMidnightAccra data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
      {!templateKey && (
        <TemplateSimpleOther data={formattedData} guestName={guest.full_name} initialStatus={currentStatus} onConfirmParams={handleConfirm} />
      )}
    </>
  );
}