import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "violet" | "muted" | "green" | "red";
  className?: string;
}

export default function Badge({ children, variant = "muted", className }: BadgeProps) {
  const variants = {
    gold: "bg-gold/20 text-gold-light border border-gold/30",
    violet: "bg-violet/20 text-violet-light border border-violet/30",
    muted: "bg-royal-purple/30 text-muted border border-royal-purple/40",
    green: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40",
    red: "bg-red-900/40 text-red-300 border border-red-700/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
