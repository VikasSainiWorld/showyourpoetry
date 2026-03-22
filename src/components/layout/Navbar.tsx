"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-royal-purple/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">✦</span>
          <span className="font-serif text-lg font-semibold gold-text group-hover:opacity-90 transition-opacity">
            ShowYourPoetry
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="nav-link text-sm text-muted hover:text-parchment transition-colors"
              >
                My Poems
              </Link>
              <Link
                href="/create"
                className="nav-link text-sm text-muted hover:text-parchment transition-colors"
              >
                Write
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="nav-link text-sm text-muted hover:text-parchment transition-colors"
              >
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button variant="gold" size="sm">Start Writing</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-muted hover:text-parchment p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-royal-purple/20 px-4 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-parchment py-2"
                onClick={() => setMenuOpen(false)}
              >
                My Poems
              </Link>
              <Link
                href="/create"
                className="text-sm text-parchment py-2"
                onClick={() => setMenuOpen(false)}
              >
                Write a Poem
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-parchment py-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                <Button variant="gold" size="sm" className="w-full">
                  Start Writing
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
