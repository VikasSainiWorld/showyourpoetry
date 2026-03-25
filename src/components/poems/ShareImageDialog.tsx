"use client";

import { useState, useRef } from "react";
import type { Poem } from "@/types";

const BG_PRESETS = [
  { label: "Midnight", value: "#0a0812" },
  { label: "Deep Purple", value: "#1a0a2e" },
  { label: "Black", value: "#000000" },
  { label: "Navy", value: "#0f172a" },
  { label: "Wine", value: "#3b0764" },
  { label: "Cream", value: "#f5efe6" },
  { label: "White", value: "#ffffff" },
];

const TEXT_PRESETS = [
  { label: "Gold", value: "#d4a017" },
  { label: "Parchment", value: "#f5efe6" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
  { label: "Violet", value: "#7c3aed" },
];

interface ShareImageDialogProps {
  poem: Poem;
  onClose: () => void;
}

export default function ShareImageDialog({ poem, onClose }: ShareImageDialogProps) {
  const [bgColor, setBgColor] = useState("#1a0a2e");
  const [textColor, setTextColor] = useState("#d4a017");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const capture = async () => {
    if (!cardRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  };

  const handleDownload = async () => {
    setBusy(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${poem.title || "poem"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    setBusy(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${poem.title || "poem"}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: poem.title });
        } else {
          const link = document.createElement("a");
          link.download = file.name;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
        setBusy(false);
      }, "image/png");
    } catch {
      setBusy(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
    background: bgImage
      ? `url(${bgImage}) center/cover no-repeat`
      : bgColor,
    color: textColor,
    fontFamily: "'Playfair Display', Georgia, serif",
    boxSizing: "border-box",
  };

  const overlayStyle: React.CSSProperties = bgImage
    ? {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        borderRadius: "16px",
      }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl bg-deep-purple border border-royal-purple/40 rounded-2xl p-6 max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold gold-text">Share Image</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-parchment transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Preview ── */}
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-3">Preview</p>
            <div ref={cardRef} style={cardStyle}>
              {/* Dark overlay when bg image is set */}
              {bgImage && <div style={overlayStyle} />}

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Branding top */}
                <div style={{
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  opacity: 0.55,
                  marginBottom: "24px",
                  color: textColor,
                }}>
                  ShowYourPoetry
                </div>

                {/* Title */}
                <div style={{
                  fontSize: "clamp(18px, 5%, 28px)",
                  fontWeight: "bold",
                  lineHeight: 1.25,
                  marginBottom: "20px",
                  color: textColor,
                }}>
                  {poem.title || "Untitled"}
                </div>

                {/* Content */}
                <div style={{
                  fontSize: "clamp(12px, 3.5%, 16px)",
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                  flex: 1,
                  overflow: "hidden",
                  color: textColor,
                  opacity: 0.9,
                }}>
                  {poem.content}
                </div>

                {/* Branding bottom */}
                <div style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  opacity: 0.4,
                  marginTop: "20px",
                  color: textColor,
                }}>
                  showyourpoetry.com
                </div>
              </div>
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="flex flex-col gap-6">

            {/* Background color */}
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-3">Background Color</p>
              <div className="flex items-center gap-2 flex-wrap">
                {BG_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    title={p.label}
                    onClick={() => setBgColor(p.value)}
                    style={{ background: p.value }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                      bgColor === p.value && !bgImage
                        ? "ring-2 ring-gold ring-offset-2 ring-offset-deep-purple scale-110"
                        : "ring-1 ring-white/20"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => { setBgColor(e.target.value); setBgImage(null); }}
                  className="w-8 h-8 rounded-full cursor-pointer border border-white/20 bg-transparent"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Text color */}
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-3">Text Color</p>
              <div className="flex items-center gap-2 flex-wrap">
                {TEXT_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    title={p.label}
                    onClick={() => setTextColor(p.value)}
                    style={{ background: p.value }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                      textColor === p.value
                        ? "ring-2 ring-gold ring-offset-2 ring-offset-deep-purple scale-110"
                        : "ring-1 ring-white/20"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer border border-white/20 bg-transparent"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Background image */}
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-3">Background Image</p>
              <label className="flex items-center gap-3 cursor-pointer glass border border-royal-purple/30 hover:border-gold/40 rounded-lg px-4 py-3 transition-colors">
                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-muted">
                  {bgImage ? "Image uploaded ✓" : "Upload image…"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBgImageUpload}
                />
              </label>
              {bgImage && (
                <button
                  onClick={() => setBgImage(null)}
                  className="mt-2 text-xs text-red-400/70 hover:text-red-300 transition-colors"
                >
                  ✕ Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-royal-purple/20">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 disabled:opacity-50 text-midnight font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            {busy ? (
              <span className="inline-block w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            Download PNG
          </button>

          <button
            onClick={handleShare}
            disabled={busy}
            className="flex items-center gap-2 glass border border-royal-purple/40 hover:border-gold/40 disabled:opacity-50 text-parchment font-medium px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
