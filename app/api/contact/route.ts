import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Simple in-memory rate limiting using IPs
// For production in serverless environments, Redis/Upstash is better
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMITCount = 5; // max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  role: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  _honey: z.string().max(0, "Invalid submission"),
  type: z.enum(["cta", "careers"]).default("cta")
});

export async function POST(req: Request) {
  try {
    // 1. Rate limiting based on IP (or x-forwarded-for)
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }
    rateLimitMap.set(ip, rateData);

    if (rateData.count > RATE_LIMITCount) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse request
    const body = await req.json();
    const parsed = ContactSchema.safeParse({
        ...body,
        _honey: body._honey || ""
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, phone, email, service, role, message, _honey, type } = parsed.data;

    // 3. Honeypot check
    if (_honey) {
      // Return 200 to trick the bot
      return NextResponse.json({ success: true, message: "Submitted successfully" });
    }

    // 4. Send email via Nodemailer
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;

    if (!user || !pass || !host) {
      console.warn("Mail configuration missing. Form submission processed but email wasn't sent.");
      return NextResponse.json({ 
        success: true, 
        message: "Your application was recorded but our mailing system is temporarily offline. We will still follow up." 
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: { user, pass }
    });

    const subject = type === "careers" 
      ? `New Job Application: ${name} - ${role || "General"}` 
      : `New Service Inquiry: ${name} - ${service || "General"}`;

    const text = `
You have received a new submission from rsecurity.in (${type === "careers" ? "Careers Form" : "Contact/CTA Form"}):

Name: ${name}
Phone: ${phone}
${email ? `Email: ${email}\n` : ""}
${type === "careers" ? `Role Applied For: ${role}` : `Service of Interest: ${service}`}

Message/Cover Letter:
${message}
    `.trim();

    await transporter.sendMail({
      from: `"Ranchi Security Website" <${user}>`,
      to: "security.rsp@gmail.com",
      replyTo: email || undefined,
      subject,
      text
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error processing form:", err);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
