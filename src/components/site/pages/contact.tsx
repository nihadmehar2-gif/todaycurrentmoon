"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section";
import { SITE_EMAIL } from "@/lib/site";

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (key in errors) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        errors?: FieldErrors;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        toast({
          title: "Please check the form",
          description: data.error ?? "A few fields need a closer look.",
          variant: "destructive",
        });
        setStatus("idle");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
      toast({
        title: "Message saved",
        description: "Thanks for writing in. We read every note.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please email us directly instead.",
        variant: "destructive",
      });
      setStatus("idle");
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Today Current Moon",
    email: SITE_EMAIL,
  };

  return (
    <PageShell
      title="Contact Us"
      breadcrumb="Contact Us"
      path="/contact"
      description="Have a question, a correction, or an idea? We would love to hear from you. Send a note below or email us directly."
      jsonLd={jsonLd}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
        {/* Contact info */}
        <Reveal>
          <Card className="glass h-full rounded-3xl border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              Reach us directly
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-300/20 shrink-0">
                  <Mail className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-indigo-200/60 mb-0.5">
                    Email
                  </div>
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="text-sm text-white hover:text-indigo-200 transition-colors break-all"
                  >
                    {SITE_EMAIL}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    The fastest way to get a reply.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-300/20 shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-indigo-200/60 mb-0.5">
                    Coverage
                  </div>
                  <p className="text-sm text-white">
                    Moon data for every time zone
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Pick your zone in the live tool on the home page.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white mb-2">
                What we help with
              </h3>
              <ul className="space-y-2 text-sm text-slate-300/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  Corrections to moon data or content
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  Questions about how the tools work
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  Ideas for new moon calculators
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  Feedback on the site design
                </li>
              </ul>
            </div>
          </Card>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.08}>
          <Card className="glass-strong h-full rounded-3xl border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white mb-1">
              Send a message
            </h2>
            <p className="text-sm text-slate-300/80 mb-5">
              Fill in the form and we will save your note. We read every message
              that comes through.
            </p>

            {status === "success" ? (
              <div className="rounded-2xl bg-emerald-400/10 border border-emerald-300/20 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-white mb-1">
                  Your message was saved
                </h3>
                <p className="text-sm text-slate-300/80 mb-4">
                  Thanks for reaching out. We will get back to you soon. Need a
                  faster reply? Email us directly.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setStatus("idle")}
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                {/* Honeypot (hidden from users) */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={update("honeypot")}
                  className="hidden"
                  aria-hidden
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      aria-invalid={!!errors.name}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400/50"
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-300">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400/50"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-300">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-200">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="What is this about?"
                    aria-invalid={!!errors.subject}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-400/50"
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-300">{errors.subject}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-200">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Write your message here..."
                    rows={5}
                    aria-invalid={!!errors.message}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-400/50 resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-300">{errors.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white border-0 shadow-lg shadow-indigo-500/20"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send message
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card className="glass rounded-2xl border-white/10 p-6">
          <SectionHeading
            align="left"
            eyebrow="A quick note"
            title="How we handle your message"
            description="We keep this simple and honest."
          />
          <p className="text-slate-300/80 leading-relaxed mt-3">
            When you submit the form, we save your name, email, subject, and
            message in our database so we can read and reply. This site uses
            Google Analytics to understand traffic, and advertising partners
            to support the site. These services may set cookies or collect
            anonymous usage data. For the full details, see our{" "}
            <Link
              href="/privacy"
              className="text-indigo-200 hover:text-white underline underline-offset-2"
            >
              privacy policy
            </Link>
            .
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
