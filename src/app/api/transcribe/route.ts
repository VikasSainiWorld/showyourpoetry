import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assemblyClient } from "@/lib/assemblyai";

export async function POST() {
  // Verify user is authenticated
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await assemblyClient.realtime.createTemporaryToken({
      expires_in: 480, // 8 minutes
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("AssemblyAI token error:", err);
    return NextResponse.json(
      { error: "Failed to create transcription session" },
      { status: 500 }
    );
  }
}
