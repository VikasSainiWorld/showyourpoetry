import Badge from "@/components/ui/Badge";
import ShareButton from "@/components/poems/ShareButton";
import { formatDate, getLanguageLabel } from "@/lib/utils";
import type { Poem, Profile } from "@/types";

interface PoemViewerProps {
  poem: Poem;
  author: Profile;
  shareUrl: string;
}

export default function PoemViewer({ poem, author, shareUrl }: PoemViewerProps) {
  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-royal-purple/4 rounded-full blur-3xl" />
      </div>

      {/* Header bar */}
      <div className="relative z-10 border-b border-royal-purple/20 glass">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-muted hover:text-parchment transition-colors"
          >
            <span className="text-gold">✦</span>
            <span className="font-serif text-sm">ShowYourPoetry</span>
          </a>
          <ShareButton url={shareUrl} />
        </div>
      </div>

      {/* Poem */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-2xl">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Badge variant="gold">{getLanguageLabel(poem.language)}</Badge>
            {poem.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold gold-text mb-2 leading-tight">
            {poem.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3 mb-12 text-muted text-sm">
            <span>by {author.username}</span>
            <span className="text-muted/30">·</span>
            <span>{formatDate(poem.created_at)}</span>
          </div>

          {/* Poem content */}
          <div className="poem-content text-parchment/90 text-lg sm:text-xl leading-loose mb-16">
            {poem.content}
          </div>

          {/* Footer */}
          <div className="border-t border-royal-purple/20 pt-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-muted/50 mb-1">Shared via</p>
              <p className="font-serif text-sm gold-text">ShowYourPoetry</p>
            </div>
            <ShareButton url={shareUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
