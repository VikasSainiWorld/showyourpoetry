"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { LANGUAGE_OPTIONS } from "@/lib/utils";
import type { PoemFormData } from "@/types";

interface PoemEditorProps {
  initialData?: Partial<PoemFormData>;
  onSave: (data: PoemFormData) => void;
  isSaving?: boolean;
  extraContent?: string; // Appended from voice transcription
  onExtraContentConsumed?: () => void;
}

export default function PoemEditor({
  initialData,
  onSave,
  isSaving,
  extraContent,
  onExtraContentConsumed,
}: PoemEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [language, setLanguage] = useState(initialData?.language ?? "en");
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? false);
  const [tags, setTags] = useState((initialData?.tags ?? []).join(", "));

  // When voice transcript arrives, append it
  useEffect(() => {
    if (extraContent) {
      setContent((prev) => {
        const separator = prev.trim() ? "\n" : "";
        return prev + separator + extraContent;
      });
      onExtraContentConsumed?.();
    }
  }, [extraContent, onExtraContentConsumed]);

  const handleSave = () => {
    onSave({
      title: title.trim() || "Untitled",
      content,
      language,
      is_public: isPublic,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <input
          type="text"
          placeholder="Untitled Poem"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent font-serif text-3xl sm:text-4xl font-bold text-parchment placeholder:text-muted/40 outline-none border-b border-royal-purple/30 pb-3 focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <textarea
          placeholder="Begin your poem here... or speak it above ↑"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full bg-transparent poem-content text-parchment/90 placeholder:text-muted/30 outline-none resize-none rounded-xl p-4 border border-royal-purple/20 focus:border-gold/30 transition-colors focus:bg-deep-purple/20"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted/40">
          {content.split("\n").filter(Boolean).length} lines ·{" "}
          {content.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted uppercase tracking-wider">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="glass text-parchment text-sm px-3 py-2 rounded-lg border border-royal-purple/30 focus:border-gold/50 outline-none bg-deep-purple/60 cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code} className="bg-deep-purple">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs text-muted uppercase tracking-wider">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="love, midnight, hope"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="glass text-parchment text-sm px-3 py-2 rounded-lg border border-royal-purple/30 focus:border-gold/50 outline-none placeholder:text-muted/40"
          />
        </div>

        {/* Public toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted uppercase tracking-wider">Visibility</label>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
              isPublic ? "bg-gold" : "bg-royal-purple/60"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                isPublic ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-xs text-muted">{isPublic ? "Public" : "Private"}</span>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          variant="gold"
          size="lg"
          onClick={handleSave}
          loading={isSaving}
          disabled={!content.trim()}
        >
          {isSaving ? "Saving…" : "Save Poem"}
        </Button>
      </div>
    </div>
  );
}
