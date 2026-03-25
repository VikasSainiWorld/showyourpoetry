"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "pwa-install-dismissed";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already running as installed PWA — never show
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // User already dismissed — never show again
    if (localStorage.getItem(STORAGE_KEY)) return;

    const supabase = createClient();

    const tryShowPrompt = (prompt: typeof deferredPrompt) => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && prompt) setVisible(true);
      });
    };

    // Capture the browser's install prompt event
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };
      setDeferredPrompt(promptEvent);
      tryShowPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Also check auth state change (user signs in after page load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setDeferredPrompt((current) => {
          tryShowPrompt(current);
          return current;
        });
      }
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      subscription.unsubscribe();
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-fade-in">
      <div className="glass border border-gold/30 rounded-2xl p-4 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-deep-purple border border-royal-purple/30">
            <Image
              src="/logo.png"
              alt="Show Your Poetry"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-serif font-semibold text-parchment text-sm leading-tight">
              Show Your Poetry
            </p>
            <p className="text-xs text-muted mt-0.5 leading-snug">
              Install the app for a better experience
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted/50 hover:text-muted transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gold hover:bg-gold/90 text-midnight font-semibold text-sm px-4 py-2 rounded-lg transition-all active:scale-95"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-muted hover:text-parchment glass border border-royal-purple/30 rounded-lg transition-all"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
