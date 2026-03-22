"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDateShort, getLanguageLabel, truncate } from "@/lib/utils";
import type { Poem } from "@/types";

interface PoemCardProps {
  poem: Poem;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

export default function PoemCard({ poem, onDelete, onTogglePublic }: PoemCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onTogglePublic(poem.id, !poem.is_public);
    setToggling(false);
  };

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/poem/${poem.slug}`;

  return (
    <div className="glass rounded-2xl p-5 border border-royal-purple/20 hover:border-gold/20 transition-all duration-300 group flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link href={`/edit/${poem.id}`} className="block group/title">
            <h3 className="font-serif text-lg font-semibold text-parchment group-hover/title:text-gold-light transition-colors truncate">
              {poem.title}
            </h3>
          </Link>
          <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
            {truncate(poem.content, 100)}
          </p>
        </div>
        <Badge variant={poem.is_public ? "gold" : "muted"}>
          {poem.is_public ? "Public" : "Private"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="violet">{getLanguageLabel(poem.language)}</Badge>
        {poem.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="muted">{tag}</Badge>
        ))}
        <span className="text-xs text-muted/50 ml-auto">{formatDateShort(poem.updated_at)}</span>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-royal-purple/20">
        <Link href={`/edit/${poem.id}`}>
          <Button variant="ghost" size="sm">Edit</Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={toggling}
        >
          {poem.is_public ? "Make Private" : "Make Public"}
        </Button>

        {poem.is_public && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            title="Copy share link"
          >
            🔗 Share
          </Button>
        )}

        <div className="ml-auto">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Delete?</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(poem.id)}
              >
                Yes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400/70 hover:text-red-300"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
