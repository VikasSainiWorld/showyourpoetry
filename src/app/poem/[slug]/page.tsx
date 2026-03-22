import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PoemViewer from "@/components/poems/PoemViewer";
import { truncate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: poem } = await supabase
    .from("poems")
    .select("title, content, language")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!poem) return { title: "Poem not found — ShowYourPoetry" };

  return {
    title: `${poem.title} — ShowYourPoetry`,
    description: truncate(poem.content, 160),
    openGraph: {
      title: poem.title,
      description: truncate(poem.content, 160),
      type: "article",
    },
  };
}

export default async function PoemPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: poem } = await supabase
    .from("poems")
    .select("*, profiles(*)")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!poem) notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/poem/${poem.slug}`;

  return (
    <PoemViewer
      poem={poem}
      author={poem.profiles}
      shareUrl={shareUrl}
    />
  );
}
