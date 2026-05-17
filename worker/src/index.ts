interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
  ALLOWED_ORIGIN: string;
}

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function validate(p: unknown): ContactPayload | string {
  if (!p || typeof p !== "object") return "invalid body";
  const { name, email, message } = p as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 100)
    return "invalid name";
  if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 200)
    return "invalid email";
  if (typeof message !== "string" || message.trim().length === 0 || message.length > 5000)
    return "invalid message";
  return { name: name.trim(), email: email.trim(), message: message.trim() };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405, origin);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid json" }, 400, origin);
    }

    const result = validate(body);
    if (typeof result === "string") {
      return json({ error: result }, 400, origin);
    }
    const { name, email, message } = result;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: env.TO_EMAIL,
        reply_to: email,
        subject: `Contact form: ${name}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json({ error: "send failed", detail }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
