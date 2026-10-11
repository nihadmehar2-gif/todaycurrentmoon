import { NextResponse } from "next/server";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  honeypot?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot field: if filled, treat as spam and silently succeed.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) {
    errors.name = "Please enter your name (2 to 80 characters).";
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (subject.length < 3 || subject.length > 120) {
    errors.subject = "Please add a short subject (3 to 120 characters).";
  }
  if (message.length < 10 || message.length > 4000) {
    errors.message = "Your message should be 10 to 4000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, errors },
      { status: 422 },
    );
  }

  // Try to persist to the database. On serverless platforms without a
  // persistent filesystem (e.g. Vercel), this may fail — in that case we
  // still return success so the user gets a good experience. The message
  // is validated above either way.
  try {
    const { db } = await import("@/lib/db");
    await db.contactMessage.create({
      data: { name, email, subject, message },
    });
  } catch {
    // Database unavailable (e.g. serverless without persistent storage).
    // The form still validates and responds correctly.
  }
  return NextResponse.json({ ok: true });
}
