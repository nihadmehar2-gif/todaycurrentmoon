"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MoonStar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/lib/routes";
import { useMounted } from "@/components/site/use-mounted";
import { cn } from "@/lib/utils";

/** Sticky top navigation with a glass surface and a mobile sheet menu. */
export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-3 sm:py-4",
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-300",
            scrolled ? "glass-strong" : "glass",
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Today Current Moon home"
          >
            <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/15">
              <MoonStar className="w-5 h-5 text-indigo-100" />
              <span className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-md group-hover:bg-indigo-400/40 transition-colors" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight text-gradient">
                Moon Phase Emoji
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-indigo-200/60">
                Tonight&apos;s Moon
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {ROUTES.map((r) => (
              <Link
                key={r.path}
                href={r.path}
                className={cn(
                  "relative px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive(r.path)
                    ? "text-white"
                    : "text-slate-300/80 hover:text-white",
                )}
              >
                {r.label}
                {isActive(r.path) && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu trigger.
              The Radix Sheet/Dialog trigger generates an aria-controls ID
              that can mismatch between server and client in React 19 +
              Turbopack. Render a plain button placeholder during SSR and
              only mount the Sheet after hydration. */}
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-indigo-100 hover:text-white hover:bg-white/10"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[340px] bg-[#070b1d]/95 border-white/10 p-0"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <SheetTitle className="font-display text-lg text-gradient">
                    Moon Phase Emoji
                  </SheetTitle>
                </div>
                <nav className="flex flex-col p-3">
                  {ROUTES.map((r) => (
                    <Link
                      key={r.path}
                      href={r.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors",
                        isActive(r.path)
                          ? "bg-white/10 text-white"
                          : "text-slate-300/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {r.label}
                      {isActive(r.path) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                      )}
                    </Link>
                  ))}
                </nav>
                <div className="px-5 py-4 mt-auto border-t border-white/10">
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="block text-xs text-indigo-200/60"
                  >
                    Questions? Reach out anytime.
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-indigo-100 hover:text-white hover:bg-white/10"
              aria-label="Open menu"
              disabled
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
