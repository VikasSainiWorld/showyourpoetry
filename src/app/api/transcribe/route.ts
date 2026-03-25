import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assemblyClient } from "@/lib/assemblyai";

// Allow up to 60 s on Vercel (covers ~2 min of audio transcription)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());

    const transcript = await assemblyClient.transcripts.transcribe({
      audio: buffer,
      language_detection: true, // auto-detect language — supports Hindi, Spanish, Arabic, etc.
    });

    if (transcript.status === "error") {
      return NextResponse.json(
        { error: transcript.error ?? "Transcription failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: transcript.text ?? "" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("AssemblyAI transcription error:", message);
    return NextResponse.json(
      { error: `Transcription failed: ${message}` },
      { status: 500 }
    );
  }
}
