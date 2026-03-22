"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface ShareButtonProps {
  url: string;
  className?: string;
}

export default function ShareButton({ url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={copied ? "secondary" : "gold"}
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <span>✓</span> Link Copied!
        </>
      ) : (
        <>
          <span>🔗</span> Share Poem
        </>
      )}
    </Button>
  );
}
