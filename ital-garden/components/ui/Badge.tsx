import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
};

const variants = {
  default: "bg-gold/15 text-gold-light border border-gold/30",
  secondary: "bg-palm/25 text-[#8FD9A8] border border-palm-light/40",
  outline: "border border-mist/30 text-mist",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
