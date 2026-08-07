import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium tracking-wide transition-all duration-300";

const variants = {
  default: "bg-gold-gradient text-studio-black hover:brightness-110 hover:-translate-y-0.5 shadow-lg shadow-gold/10",
  outline: "border border-gold/40 text-cream hover:border-gold hover:bg-gold/10",
  ghost: "text-cream hover:text-gold",
};

export function Button({ href, children, variant = "default", external, className = "" }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
