import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "gold" | "violet" | "none";
}

export default function GlassCard({
  className,
  glow = "none",
  children,
  ...props
}: GlassCardProps) {
  const glowClass = {
    gold: "hover:shadow-glow-gold",
    violet: "hover:shadow-glow-violet",
    none: "",
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        glowClass[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
