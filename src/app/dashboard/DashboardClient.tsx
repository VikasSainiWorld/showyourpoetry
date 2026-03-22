"use client";

import { useState } from "react";
import Link from "next/link";
import PoemCard from "@/components/poems/PoemCard";
import { usePoems } from "@/hooks/usePoems";
import type { Poem } from "@/types";

interface DashboardClientProps {
  initialPoems: Poem[];
}

export default function DashboardClient({ initialPoems }: DashboardClientProps) {
  const [poems, setPoems] = useState<Poem[]>(initialPoems);
  const { deletePoem, togglePublic } = usePoems();

  const handleDelete = async (id: string) => {
    const ok = await deletePoem(id);
    if (ok) setPoems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTogglePublic = async (id: string, isPublic: boolean) => {
    const ok = await togglePublic(id, isPublic);
    if (ok) {
      setPoems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_public: isPublic } : p))
      );
    }
  };

  if (poems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">✦</div>
        <h2 className="font-serif text-2xl text-parchment/70 mb-3">
          Your story begins here
        </h2>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          You haven&apos;t written any poems yet. Start by speaking your first verse.
        </p>
        <Link href="/create">
          <button className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-midnight font-semibold px-6 py-3 rounded-lg transition-all">
            Write Your First Poem
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {poems.map((poem) => (
        <PoemCard
          key={poem.id}
          poem={poem}
          onDelete={handleDelete}
          onTogglePublic={handleTogglePublic}
        />
      ))}
    </div>
  );
}
