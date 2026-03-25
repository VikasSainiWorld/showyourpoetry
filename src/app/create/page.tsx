"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import PoemEditor from "@/components/poems/PoemEditor";
import GlassCard from "@/components/ui/GlassCard";
import { usePoems } from "@/hooks/usePoems";
import type { PoemFormData } from "@/types";

const AudioRecorder = dynamic(
  () => import("@/components/recorder/AudioRecorder"),
  { ssr: false }
);

export default function CreatePage() {
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [language, setLanguage] = useState("en");
  const { createPoem, loading } = usePoems();
  const router = useRouter();

  const handleSave = async (formData: PoemFormData) => {
    const poem = await createPoem(formData);
    if (poem) {
      router.refresh();
      router.push(`/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Page title */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold gold-text mb-2">
            Write a Poem
          </h1>
          <p className="text-muted text-sm">
            Speak it, type it, or both — your words, your way
          </p>
        </div>

        {/* Voice recorder */}
        <div className="mb-8">
          <p className="text-xs text-muted uppercase tracking-widest mb-3 text-center">
            Voice Recording
          </p>
          <AudioRecorder
            language={language}
            onTranscriptFinal={(text) => setPendingTranscript(text)}
          />
        </div>

        {/* Poem editor */}
        <GlassCard>
          <PoemEditor
            onSave={handleSave}
            isSaving={loading}
            extraContent={pendingTranscript}
            onExtraContentConsumed={() => setPendingTranscript("")}
          />
        </GlassCard>
      </main>
    </div>
  );
}
