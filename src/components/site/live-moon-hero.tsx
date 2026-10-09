"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
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

/** The hero: giant live moon emoji, realistic moon, date/time/location, and live stats. */
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
  // Stable "UTC" during SSR + first paint; switch to the user's zone after mount.
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

  const stats = [
    {
      icon: Gauge,
      label: "Illumination",
      value: phase ? `${Math.round(phase.illumination * 100)}%` : "\u2014",
      hint: phase ? (phase.waxing ? "Waxing" : "Waning") : "",
    },
    {
      icon: Moon,
      label: "Lunar age",
      value: phase ? `${phase.age.toFixed(1)} d` : "\u2014",
      hint: "Since new moon",
    },
    {
      icon: Sparkles,
      label: "Cycle progress",
      value: phase ? `${phase.progress.toFixed(1)}%` : "\u2014",
      hint: "Of 29.53 days",
    },
    {
      icon: Compass,
      label: "Trend",
      value: phase ? (phase.waxing ? "Waxing" : "Waning") : "\u2014",
      hint: phase ? (phase.waxing ? "Growing" : "Shrinking") : "",
    },
  ];

  const tzOptions = mounted
    ? Array.from(new Set([systemTz, ...COMMON_TIMEZONES]))
    : COMMON_TIMEZONES;

  return (
    <section
      id="live-moon"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-28 pt-28 sm:pt-32 pb-8"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="glass-strong rounded-[2rem] p-5 sm:p-8 lg:p-12 overflow-hidden relative">
          {/* Decorative glows */}
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          />

          <div className="relative grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr,1fr] items-center">
            {/* Left: headline + giant emoji */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-300/20 mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live moon data for your time zone
              </motion.div>

              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight"
              >
                <span className="text-gradient">
                  Current Phase of the Moon Emoji
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-4 text-violet-100/75 text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
              >
                See the exact moon phase for today with the right emoji, live
                illumination, lunar age, and cycle progress. Updated in real
                time for where you are.
              </motion.p>

              {/* Giant live emoji + realistic moon */}
              <div className="mt-7 flex items-center justify-center lg:justify-start gap-6">
                <div className="moon-glow float-slow shrink-0">
                  <MoonVisual
                    phase={phase ? phase.phaseFraction : 0.5}
                    size={170}
                  />
                </div>
                <div className="text-center">
                  <div
                    className="text-7xl sm:text-8xl leading-none select-none"
                    aria-hidden
                  >
                    {phase ? phase.emoji : "\u{1F315}"}
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {phase ? phase.name : "Loading..."}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  onClick={() => navigate("moon-calendar" as RouteKey)}
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 text-white border-0"
                >
                  Open Moon Calendar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("moon-phases" as RouteKey)}
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
                >
                  See All 8 Phases
                </Button>
              </div>
            </div>

            {/* Right: live data panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass rounded-3xl p-5 sm:p-6"
            >
              {/* Date / day / time / location */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-violet-200/70 mb-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Date &amp; day
                  </div>
                  <div className="text-sm text-white font-medium leading-snug">
                    {now ? formatFullDate(now, tz) : "Loading..."}
                  </div>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-violet-200/70 mb-1">
                    <Clock className="w-3.5 h-3.5" /> Local time
                  </div>
                  <div className="font-mono text-lg text-white tabular-nums">
                    {now ? formatTime(now, tz) : "--:--:--"}
                  </div>
                  <div className="text-[10px] text-violet-100/50 mt-0.5">
                    {mounted ? `${tz} ${offsetLabel}` : ""}
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl px-4 py-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-violet-200/70 mb-1">
                  <MapPin className="w-3.5 h-3.5" /> Your location
                </div>
                {mounted && geo.status === "granted" && geo.lat != null ? (
                  <div className="text-sm text-white">
                    <span className="font-medium tabular-nums">
                      {geo.lat.toFixed(2)}, {geo.lon?.toFixed(2)}
                    </span>
                    <span className="block text-xs text-violet-100/50 mt-0.5">
                      {tzCity(tz)} area
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-white">
                    {mounted ? tzCity(tz) : "Loading..."}
                    <span className="block text-xs text-violet-100/50 mt-0.5">
                      From your device time zone
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="glass rounded-2xl px-2.5 py-3 text-center"
                  >
                    <s.icon className="w-4 h-4 mx-auto text-violet-300 mb-1.5" />
                    <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                      {s.label}
                    </div>
                    <div className="text-base font-semibold text-white tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-[10px] text-violet-100/50 mt-0.5">
                      {s.hint}
                    </div>
                  </div>
                ))}
              </div>

              {/* Next phases */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="glass rounded-2xl px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                    Next full moon
                  </div>
                  <div className="text-xs text-white font-medium">
                    {nextFull ? formatFullDate(nextFull, tz) : "\u2014"}
                  </div>
                </div>
                <div className="glass rounded-2xl px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                    Next new moon
                  </div>
                  <div className="text-xs text-white font-medium">
                    {nextNew ? formatFullDate(nextNew, tz) : "\u2014"}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <Button
                  onClick={requestLocation}
                  disabled={geo.status === "loading"}
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
                >
                  <LocateFixed className="w-4 h-4" />
                  {geo.status === "loading"
                    ? "Finding you..."
                    : geo.status === "granted"
                      ? "Location on"
                      : "Use my location"}
                </Button>
                <div className="flex items-center gap-2 flex-1">
                  <RefreshCw className="w-3.5 h-3.5 text-violet-200/60 shrink-0" />
                  <Select value={tz} onValueChange={setTz}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c0a1c] border-white/10 max-h-72">
                      {tzOptions.map((z) => (
                        <SelectItem
                          key={z}
                          value={z}
                          className="text-violet-50 focus:bg-white/10"
                        >
                          {z}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {geo.status === "denied" && (
                <p className="text-xs text-amber-200/70 mt-2">
                  Location access was blocked, so we use your device time zone.
                  You can still pick a time zone above.
                </p>
              )}
              {geo.status === "unavailable" && (
                <p className="text-xs text-amber-200/70 mt-2">
                  Your device does not share location, so we use your time zone
                  for the moon data.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
