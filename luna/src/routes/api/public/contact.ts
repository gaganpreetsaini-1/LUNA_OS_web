import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
  website: z.string().max(0).optional(), // honeypot
});

// Ad-hoc per-IP rate limit (per Worker isolate — best-effort, not global).
// 3 submissions per 10 minutes per IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  hits.set(ip, arr);
  // opportunistic cleanup to avoid unbounded growth
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return { ok: true };
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";

        const rl = rateLimit(ip);
        if (!rl.ok) {
          return Response.json(
            { error: `Too many messages — try again in ${rl.retryAfter}s.` },
            { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid input", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        // Silent success on honeypot hit
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("contact_submissions").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
        });

        if (error) {
          console.error("[contact] insert failed", error);
          return Response.json({ error: "Could not save message" }, { status: 500 });
        }

        // Fire-and-forget email notification to support inbox.
        // Requires a verified email domain — wired up once setup completes.
        try {
          const apiKey = process.env.LOVABLE_API_KEY;
          const senderDomain = process.env.SENDER_DOMAIN;
          if (apiKey && senderDomain) {
            const mod: { sendLovableEmail?: (opts: Record<string, unknown>) => Promise<unknown> } =
              await import("@lovable.dev/email-js" as string).catch(() => ({}));
            if (mod.sendLovableEmail) {
              await mod.sendLovableEmail({
                apiKey,
                from: `LUNA OS <notify@${senderDomain}>`,
                to: "support@lunaos.dpdns.org",
                replyTo: parsed.data.email,
                subject: `New contact — ${parsed.data.name}`,
                html: `<h2>New LUNA OS contact form submission</h2>
<p><b>Name:</b> ${escapeHtml(parsed.data.name)}</p>
<p><b>Email:</b> ${escapeHtml(parsed.data.email)}</p>
<p><b>Message:</b></p>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(parsed.data.message)}</pre>`,
              }).catch((e: unknown) => console.error("[contact] email send failed", e));
            }
          }
        } catch (e) {
          console.error("[contact] email module unavailable", e);
        }

        return Response.json({ ok: true });
      },
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
