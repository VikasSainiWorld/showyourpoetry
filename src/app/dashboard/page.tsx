import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardClient from "./DashboardClient";

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

  const firstName =
    user.user_metadata?.given_name ??
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.user_metadata?.name?.split(" ")[0] ??
    profile?.username ??
    "poet";

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
              Welcome back, {firstName}
            </p>
          </div>
          <Link href="/create">
            <button className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-midnight font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-glow-gold hover:shadow-glow-gold-lg active:scale-95">
              <span>✦</span> New Poem
            </button>
          </Link>
        </div>

        <DashboardClient initialPoems={poems ?? []} />
      </main>
      <Footer />
    </div>
  );
}
