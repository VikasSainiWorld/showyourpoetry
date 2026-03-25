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

  if (!process.env.ASSEMBLYAI_API_KEY) {
    return NextResponse.json(
      { error: "AssemblyAI API key is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const token = await assemblyClient.realtime.createTemporaryToken({
      expires_in: 480, // 8 minutes
    });

    return NextResponse.json({ token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("AssemblyAI token error:", message);
    return NextResponse.json(
      { error: `AssemblyAI error: ${message}` },
      { status: 500 }
    );
  }
}
