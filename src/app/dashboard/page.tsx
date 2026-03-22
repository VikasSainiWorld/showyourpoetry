import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardClient from "./DashboardClient";
import type { Poem } from "@/types";

export const metadata = { title: "My Poems — ShowYourPoetry" };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: poems } = await supabase
    .from("poems")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold gold-text">
              My Poems
            </h1>
            <p className="text-muted mt-1">
              Welcome back, {profile?.username ?? "poet"}
            </p>
          </div>
          <Link href="/create">
            <button className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-midnight font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-glow-gold hover:shadow-glow-gold-lg active:scale-95">
              <span>✦</span> New Poem
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-serif text-3xl font-bold gold-text">{poems?.length ?? 0}</p>
            <p className="text-xs text-muted mt-1">Total Poems</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-serif text-3xl font-bold gold-text">
              {poems?.filter((p: Poem) => p.is_public).length ?? 0}
            </p>
            <p className="text-xs text-muted mt-1">Published</p>
          </div>
          <div className="glass rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <p className="font-serif text-3xl font-bold gold-text">
              {new Set(poems?.map((p: Poem) => p.language)).size ?? 0}
            </p>
            <p className="text-xs text-muted mt-1">Languages</p>
          </div>
        </div>

        <DashboardClient initialPoems={poems ?? []} />
      </main>
      <Footer />
    </div>
  );
}
