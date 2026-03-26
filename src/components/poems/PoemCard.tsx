"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDateShort, truncate } from "@/lib/utils";
import type { Poem } from "@/types";

const ShareImageDialog = dynamic(
  () => import("@/components/poems/ShareImageDialog"),
  { ssr: false }
);

interface PoemCardProps {
  poem: Poem;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

export default function PoemCard({ poem, onDelete, onTogglePublic }: PoemCardProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showShareImage, setShowShareImage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/poem/${poem.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleToggle = async () => {
    setToggling(true);
    await onTogglePublic(poem.id, !poem.is_public);
    setToggling(false);
  };

  const handleCardClick = () => {
    if (poem.is_public) {
      router.push(`/poem/${poem.slug}`);
    } else {
      router.push(`/edit/${poem.id}`);
    }
  };

  const handleOpenOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(true);
  };

  return (
    <>
      <div
        className="glass rounded-2xl p-5 border border-royal-purple/20 hover:border-gold/20 transition-all duration-300 group flex flex-col gap-4 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-semibold text-parchment group-hover:text-gold-light transition-colors truncate">
              {poem.title}
            </h3>
            <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
              {truncate(poem.content, 100)}
            </p>
          </div>
          <Badge variant={poem.is_public ? "gold" : "muted"}>
            {poem.is_public ? "Public" : "Private"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {poem.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
          <span className="text-xs text-muted/50 ml-auto">{formatDateShort(poem.updated_at)}</span>
        </div>

        <div className="flex items-center pt-2 border-t border-royal-purple/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenOptions}
          >
            Options
          </Button>
        </div>
      </div>

      {showOptions && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => { setShowOptions(false); setConfirmDelete(false); }}
        >
          <div
            className="glass rounded-2xl border border-royal-purple/40 w-[22rem] overflow-hidden shadow-2xl shadow-black/60"
            style={{ animation: "dialogIn 0.18s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 border-b border-royal-purple/20 bg-gradient-to-br from-royal-purple/20 to-transparent">
              <p className="text-xs text-gold/70 uppercase tracking-widest font-medium mb-1">Options</p>
              <p className="font-serif text-parchment font-semibold truncate pr-8">{poem.title}</p>
              <button
                onClick={() => { setShowOptions(false); setConfirmDelete(false); }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-parchment hover:bg-white/10 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Options list */}
            <div className="flex flex-col py-2">

              {/* Edit */}
              <Link
                href={`/edit/${poem.id}`}
                onClick={() => setShowOptions(false)}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center text-violet-light flex-shrink-0 group-hover:bg-violet/20 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </span>
                <span className="text-sm text-parchment">Edit poem</span>
              </Link>

              {/* Toggle Public/Private */}
              <button
                onClick={handleToggle}
                disabled={toggling}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors disabled:opacity-50 w-full text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold/20 group-disabled:group-hover:bg-gold/10 transition-colors">
                  {poem.is_public ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                </span>
                <span className="text-sm text-parchment">
                  {toggling ? "Saving…" : poem.is_public ? "Make Private" : "Make Public"}
                </span>
              </button>

              {/* Share link (public only) */}
              {poem.is_public && (
                <button
                  onClick={handleCopyLink}
                  className="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left"
                >
                  <span className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    {linkCopied ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm transition-colors ${linkCopied ? "text-green-400" : "text-parchment"}`}>
                    {linkCopied ? "Link copied!" : "Copy share link"}
                  </span>
                </button>
              )}

              {/* Share Image */}
              <button
                onClick={() => { setShowOptions(false); setShowShareImage(true); }}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center text-violet-light flex-shrink-0 group-hover:bg-violet/20 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                </span>
                <span className="text-sm text-parchment">Share as image</span>
              </button>

              {/* Divider + Delete */}
              <div className="mx-4 my-1 border-t border-royal-purple/20" />

              {confirmDelete ? (
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </span>
                  <span className="text-sm text-red-400 flex-1">Delete this poem?</span>
                  <Button variant="danger" size="sm" onClick={() => onDelete(poem.id)}>Yes</Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>No</Button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="group flex items-center gap-3 px-4 py-3 hover:bg-red-500/5 transition-colors w-full text-left"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </span>
                  <span className="text-sm text-red-400">Delete poem</span>
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes dialogIn {
              from { opacity: 0; transform: scale(0.95) translateY(6px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}

      {showShareImage && (
        <ShareImageDialog poem={poem} onClose={() => setShowShareImage(false)} />
      )}
    </>
  );
}
