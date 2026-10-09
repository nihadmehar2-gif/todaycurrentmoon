"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          id={id ? `${id}-eyebrow` : undefined}
          className="eyebrow mb-3"
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          "font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-gradient leading-[1.15] tracking-tight",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-300/80 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      )}
    </Reveal>
  );
}

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  container?: boolean;
}

export function Section({
  id,
  className,
  children,
  container = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn("py-14 sm:py-16 lg:py-20 scroll-mt-24", className)}
    >
      {container ? (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
