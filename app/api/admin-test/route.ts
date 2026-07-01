import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  // Test 1 : lecture
  const { data: readData, error: readError } = await supabaseAdmin
    .from("event_templates")
    .select("id, name, config")
    .limit(2);

  // Test 2 : écriture — update du config du premier template trouvé
  let writeResult: { success: boolean; error?: string; rowsAffected?: number } = { success: false };
  if (readData && readData.length > 0) {
    const firstId = readData[0].id;
    const { error: writeError } = await supabaseAdmin
      .from("event_templates")
      .update({ config: { test: true, timestamp: new Date().toISOString() } })
      .eq("id", firstId);

    if (writeError) {
      writeResult = { success: false, error: writeError.message };
    } else {
      // Vérifier que l'update a bien eu lieu
      const { data: verify } = await supabaseAdmin
        .from("event_templates")
        .select("id, config")
        .eq("id", firstId)
        .single();
      writeResult = {
        success: true,
        rowsAffected: 1,
        ...({ configAfterUpdate: verify?.config } as Record<string, unknown>),
      };
    }
  }

  return NextResponse.json({
    readSuccess: !readError,
    readError: readError?.message ?? null,
    readCount: readData?.length ?? 0,
    firstTemplate: readData?.[0]?.name ?? null,
    writeResult,
  });
}
