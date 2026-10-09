"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMoonPhase, PHASE_CATALOG } from "@/lib/moon";
import { useMounted } from "@/components/site/use-mounted";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MoonCalendarProps {
  initial?: Date;
  compact?: boolean;
}

/**
 * Interactive month calendar. Each day cell shows the moon phase emoji
 * computed from the real lunar algorithm, plus the illumination percent.
 */
export function MoonCalendar({ initial, compact = false }: MoonCalendarProps) {
  const mounted = useMounted();
  const [offset, setOffset] = useState(0);

  const today = useMemo(() => (mounted ? new Date() : null), [mounted]);

  const cursor = useMemo(() => {
    if (initial) return new Date(initial.getFullYear(), initial.getMonth(), 1);
    if (today) return new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return new Date(2000, 0, 1);
  }, [initial, today, offset]);

  const { year, month, days, leading } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = first.getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { year, month, days, leading };
  }, [cursor]);

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const isToday = (day: number) => {
    if (!today) return false;
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const prevMonth = () => setOffset((o) => o - 1);
  const nextMonth = () => setOffset((o) => o + 1);
  const goToday = () => setOffset(0);

  const cells: Array<{ day: number | null; date?: Date }> = [
    ...Array.from({ length: leading }, () => ({ day: null })),
    ...days.map((day) => ({ day, date: new Date(year, month, day) })),
  ];

  return (
    <div className="glass-strong rounded-3xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl text-gradient">
            {monthLabel}
          </h3>
          {!compact && (
            <p className="text-xs text-slate-300/60 mt-0.5">
              Each day shows the moon phase for that date.
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
            className="text-indigo-100 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToday}
            className="text-indigo-100 hover:bg-white/10 hover:text-white"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
            className="text-indigo-100 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs font-medium uppercase tracking-wide text-indigo-200/60 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((cell, i) => {
          if (cell.day === null || !cell.date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const phase = getMoonPhase(cell.date);
          return (
            <div
              key={cell.day}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors",
                "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5",
                isToday(cell.day) &&
                  "ring-1 ring-indigo-300/60 bg-indigo-400/10",
              )}
              title={`${cell.date.toDateString()} - ${phase.name} (${Math.round(
                phase.illumination * 100,
              )}% lit)`}
            >
              <span className="text-base sm:text-xl leading-none">
                {phase.emoji}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-300/70 tabular-nums">
                {cell.day}
              </span>
              {!compact && (
                <span className="hidden sm:block text-[8px] text-slate-400/50 tabular-nums">
                  {Math.round(phase.illumination * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {PHASE_CATALOG.map((p) => (
            <div
              key={p.key}
              className="flex items-center gap-1.5 text-[11px] text-slate-300/60"
            >
              <span className="text-sm">{p.emoji}</span>
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
