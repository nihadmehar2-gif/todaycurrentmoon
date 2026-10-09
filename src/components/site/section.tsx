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
          className="inline-block text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/80 mb-3"
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          "font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-gradient leading-tight",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-violet-100/70 text-sm sm:text-base leading-relaxed">
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
      className={cn("py-12 sm:py-16 lg:py-20 scroll-mt-24", className)}
    >
      {container ? (
        <div className="container mx-auto max-w-6xl px-4">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
