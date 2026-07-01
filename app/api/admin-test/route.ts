import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  // Test 1 : lecture
  const { data: readData, error: readError } = await supabaseAdmin
    .from("event_templates")
    .select("id, name, config")
    .limit(2);

  // Test 2 : écriture via RPC SECURITY DEFINER
  let writeResult: { success: boolean; error?: string; configAfterUpdate?: unknown } = { success: false };
  if (readData && readData.length > 0) {
    const firstId = readData[0].id;
    const { error: writeError } = await supabaseAdmin.rpc("admin_update_template", {
      template_id: firstId,
      updates: { config: { test: true, timestamp: new Date().toISOString() } },
    });

    if (writeError) {
      writeResult = { success: false, error: writeError.message };
    } else {
      const { data: verify } = await supabaseAdmin
        .from("event_templates")
        .select("id, config")
        .eq("id", firstId)
        .single();
      writeResult = { success: true, configAfterUpdate: verify?.config };
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
