"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import PoemEditor from "@/components/poems/PoemEditor";
import GlassCard from "@/components/ui/GlassCard";
import Spinner from "@/components/ui/Spinner";
import { usePoems } from "@/hooks/usePoems";
import { createClient } from "@/lib/supabase/client";
import type { Poem, PoemFormData } from "@/types";

const AudioRecorder = dynamic(
  () => import("@/components/recorder/AudioRecorder"),
  { ssr: false }
);

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [pendingTranscript, setPendingTranscript] = useState("");
  const { updatePoem, loading } = usePoems();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("poems")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setPoem(data);
        setFetchLoading(false);
      });
  }, [id]);

  const handleSave = async (formData: PoemFormData) => {
    const updated = await updatePoem(id, formData);
    if (updated) router.push("/dashboard");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center text-muted">
        Poem not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold gold-text mb-2">Edit Poem</h1>
          <p className="text-muted text-sm">Refine your verse</p>
        </div>

        <div className="mb-8">
          <p className="text-xs text-muted uppercase tracking-widest mb-3 text-center">
            Add via Voice
          </p>
          <AudioRecorder
            language={poem.language}
            onTranscriptFinal={(text) => setPendingTranscript(text)}
          />
        </div>

        <GlassCard>
          <PoemEditor
            initialData={poem}
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
