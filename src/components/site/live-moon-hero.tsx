"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Compass,
  Gauge,
  LocateFixed,
  MapPin,
  Moon,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoonVisual } from "@/components/site/moon-visual";
import { useMounted } from "@/components/site/use-mounted";
import {
  formatFullDate,
  formatTime,
  getMoonPhase,
  getTimeZoneOffsetLabel,
  getNextFullMoon,
  getNextNewMoon,
  type PhaseInfo,
} from "@/lib/moon";
import { type RouteKey, useHashRoute } from "@/components/site/use-route";

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Moscow",
  "Africa/Cairo",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
];

interface GeoState {
  status: "idle" | "loading" | "granted" | "denied" | "unavailable";
  lat?: number;
  lon?: number;
}

function tzCity(tz: string): string {
  const last = tz.split("/").pop() ?? tz;
  return last.replace(/_/g, " ");
}

/** Hero: large luminous moon centerpiece, headline, live date/day, phase, illumination, calendar button. */
export function LiveMoonHero() {
  const { navigate } = useHashRoute();
  const mounted = useMounted();
  const systemTz = useMemo(
    () =>
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        : "UTC",
    [],
  );
  const [tz, setTz] = useState<string>("UTC");
  const [now, setNow] = useState<Date | null>(null);
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  useEffect(() => {
    setTz(systemTz);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [systemTz]);

  const phase: PhaseInfo | null = useMemo(
    () => (now ? getMoonPhase(now) : null),
    [now],
  );
  const nextFull = useMemo(() => (now ? getNextFullMoon(now) : null), [now]);
  const nextNew = useMemo(() => (now ? getNextNewMoon(now) : null), [now]);
  const offsetLabel = useMemo(
    () => (mounted ? getTimeZoneOffsetLabel(tz) : ""),
    [tz, mounted],
  );

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ status: "unavailable" });
      return;
    }
    setGeo({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeo({ status: "granted", lat: latitude, lon: longitude });
      },
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  const illuminationPct = phase ? Math.round(phase.illumination * 100) : 0;

  return (
    <section
      id="live-moon"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-28 pt-28 sm:pt-32 pb-6"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative">
          {/* Top eyebrow row */}
          <RevealFade>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-300/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live moon data
              </span>
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-200" />
                {now ? formatFullDate(now, tz) : "Loading..."}
              </span>
            </div>
          </RevealFade>

          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr,1.05fr] items-center">
            {/* Left: headline + CTAs */}
            <div className="text-center lg:text-left">
              <RevealFade delay={0.05}>
                <h1
                  id="hero-heading"
                  className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.04] tracking-tight"
                >
                  <span className="text-gradient">
                    Current Phase of the Moon Emoji
                  </span>
                </h1>
              </RevealFade>

              <RevealFade delay={0.12}>
                <p className="mt-5 text-slate-300/85 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  See the exact moon phase for today with the right emoji, live
                  illumination, lunar age, and cycle progress. Updated in real
                  time for where you are.
                </p>
              </RevealFade>

              {/* Phase name + emoji quick read */}
              <RevealFade delay={0.18}>
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl glass px-4 py-2.5">
                  <span className="text-3xl leading-none" aria-hidden>
                    {phase ? phase.emoji : "\u{1F315}"}
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-indigo-200/70">
                      Tonight&apos;s phase
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {phase ? phase.name : "Loading..."}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10 mx-1" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-indigo-200/70">
                      Illumination
                    </div>
                    <div className="text-sm font-semibold text-white tabular-nums">
                      {illuminationPct}%
                    </div>
                  </div>
                </div>
              </RevealFade>

              <RevealFade delay={0.24}>
                <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Button
                    onClick={() => navigate("moon-calendar" as RouteKey)}
                    className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white border-0 shadow-lg shadow-indigo-500/20"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Open Moon Calendar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("moon-phases" as RouteKey)}
                    className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
                  >
                    See All 8 Phases
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </RevealFade>
            </div>

            {/* Right: large moon centerpiece + live data ring */}
            <RevealFade delay={0.2}>
              <div className="relative">
                <div className="glass-strong rounded-[2rem] p-5 sm:p-7 overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl"
                  />

                  <div className="relative flex flex-col items-center">
                    {/* Large luminous moon */}
                    <div className="moon-glow float-slow">
                      <MoonVisual
                        phase={phase ? phase.phaseFraction : 0.5}
                        size={250}
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-indigo-200/70">
                        Current phase
                      </div>
                      <div className="font-display text-2xl font-semibold text-white mt-0.5">
                        {phase ? phase.name : "Loading..."}
                      </div>
                    </div>

                    {/* Live stat strip */}
                    <div className="mt-5 grid grid-cols-3 gap-2.5 w-full">
                      <HeroStat
                        icon={Gauge}
                        label="Illumination"
                        value={phase ? `${illuminationPct}%` : "\u2014"}
                      />
                      <HeroStat
                        icon={Moon}
                        label="Lunar age"
                        value={phase ? `${phase.age.toFixed(1)}d` : "\u2014"}
                      />
                      <HeroStat
                        icon={Compass}
                        label="Trend"
                        value={phase ? (phase.waxing ? "Waxing" : "Waning") : "\u2014"}
                      />
                    </div>

                    {/* Clock + location */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2.5 w-full">
                      <div className="glass rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-indigo-200/70 mb-0.5">
                          <Clock className="w-3 h-3" /> Local time
                        </div>
                        <div className="font-mono text-sm text-white tabular-nums">
                          {now ? formatTime(now, tz) : "--:--:--"}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {mounted ? `${tz} ${offsetLabel}` : ""}
                        </div>
                      </div>
                      <div className="glass rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-indigo-200/70 mb-0.5">
                          <MapPin className="w-3 h-3" /> Location
                        </div>
                        <div className="text-sm text-white truncate">
                          {mounted && geo.status === "granted" && geo.lat != null
                            ? `${geo.lat.toFixed(2)}, ${geo.lon?.toFixed(2)}`
                            : mounted
                              ? tzCity(tz)
                              : "Loading..."}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {mounted && geo.status === "granted"
                            ? "From your device"
                            : "From your time zone"}
                        </div>
                      </div>
                    </div>

                    {/* Next phases */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2.5 w-full">
                      <div className="glass rounded-xl px-3 py-2">
                        <div className="text-[10px] uppercase tracking-wide text-indigo-200/70">
                          Next full moon
                        </div>
                        <div className="text-xs text-white font-medium">
                          {nextFull ? formatFullDate(nextFull, tz) : "\u2014"}
                        </div>
                      </div>
                      <div className="glass rounded-xl px-3 py-2">
                        <div className="text-[10px] uppercase tracking-wide text-indigo-200/70">
                          Next new moon
                        </div>
                        <div className="text-xs text-white font-medium">
                          {nextNew ? formatFullDate(nextNew, tz) : "\u2014"}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-center">
                      <Button
                        onClick={requestLocation}
                        disabled={geo.status === "loading"}
                        variant="secondary"
                        className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
                      >
                        <LocateFixed className="w-4 h-4" />
                        {geo.status === "loading"
                          ? "Finding..."
                          : geo.status === "granted"
                            ? "Location on"
                            : "Use my location"}
                      </Button>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-200/60 shrink-0" />
                        <Select value={tz} onValueChange={setTz}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a0e22] border-white/10 max-h-72">
                            {(mounted
                              ? Array.from(new Set([systemTz, ...COMMON_TIMEZONES]))
                              : COMMON_TIMEZONES
                            ).map((z) => (
                              <SelectItem
                                key={z}
                                value={z}
                                className="text-indigo-50 focus:bg-white/10"
                              >
                                {z}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {geo.status === "denied" && (
                      <p className="text-xs text-amber-200/70 mt-2 text-center">
                        Location blocked, so we use your device time zone.
                      </p>
                    )}
                    {geo.status === "unavailable" && (
                      <p className="text-xs text-amber-200/70 mt-2 text-center">
                        Your device does not share location, so we use your time
                        zone.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </RevealFade>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl px-2.5 py-2.5 text-center">
      <Icon className="w-3.5 h-3.5 mx-auto text-indigo-300 mb-1" />
      <div className="text-[9px] uppercase tracking-wide text-indigo-200/70">
        {label}
      </div>
      <div className="text-sm font-semibold text-white tabular-nums">
        {value}
      </div>
    </div>
  );
}

/** SSR-safe fade-and-rise wrapper (uses whileInView to avoid hydration mismatch). */
function RevealFade({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
