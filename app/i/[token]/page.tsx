import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MariageEleganceDoree from "@/components/templates/mariage/MariageEleganceDoree";

interface InvitationPageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;

  // 1. Récupérer l'invitation et les détails de l'événement via le Token
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select(`
      id,
      guest_name,
      event_id,
      secure_token,
      events (
        name,
        event_type,
        event_date,
        place,
        description
      )
    `)
    .eq("secure_token", token)
    .single();

  // Sécurité : Si le token n'existe pas ou s'il y a une erreur, on renvoie une erreur 404
  if (error || !invitation) {
    notFound();
  }

  // Correction TypeScript : Extraction sécurisée si Supabase retourne un tableau pour la jointure
  const eventRaw = invitation.events;
  const eventData = Array.isArray(eventRaw) ? eventRaw[0] : eventRaw;

  // Sécurité si l'événement lié n'existe pas ou est mal configuré
  if (!eventData) {
    notFound();
  }

  // 2. Enregistrement automatique de la Vue
  await supabase.from("invitation_views").insert({
    event_id: invitation.event_id,
    invitation_id: invitation.id,
  });

  // 3. Fonction Action pour le bouton RSVP (Server Action)
  const handleConfirm = async (status: "accepted" | "declined") => {
    "use server";
    
    await supabase.from("guest_responses").insert({
      event_id: invitation.event_id,
      invitation_id: invitation.id,
      status: status,
    });
  };

  // Transformation et formatage des données pour le composant visuel
  const formattedData = {
    nomEvenement: eventData.name,
    eventType: eventData.event_type,
    date: new Date(eventData.event_date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    heure: new Date(eventData.event_date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    lieu: eventData.place,
    message: eventData.description || undefined,
  };

  return (
    <MariageEleganceDoree
      data={formattedData}
      guestName={invitation.guest_name}
      token={token}
      onConfirm={handleConfirm}
    />
  );
}