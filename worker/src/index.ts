interface Env {
  RESEND_API_KEY: string;
  AUDIENCE_ID: string;
  TO_EMAIL: string;
  FROM_EMAIL: string;
  ALLOWED_ORIGIN: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function resolveOrigin(request: Request, env: Env): string {
  const allowed = new Set(env.ALLOWED_ORIGIN.split(",").map((s) => s.trim()));
  const reqOrigin = request.headers.get("Origin") ?? "";
  return allowed.has(reqOrigin) ? reqOrigin : "";
}

async function resend(path: string, env: Env, body: unknown): Promise<Response> {
  return fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = resolveOrigin(request, env);

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

    const raw = (body as { email?: unknown } | null)?.email;
    const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return json({ error: "invalid email" }, 400, origin);
    }

    const audienceRes = await resend(
      `/audiences/${env.AUDIENCE_ID}/contacts`,
      env,
      { email, unsubscribed: false },
    );
    if (!audienceRes.ok && audienceRes.status !== 422) {
      const detail = await audienceRes.text();
      console.error("audience add failed", audienceRes.status, detail);
      return json({ error: "subscribe failed" }, 502, origin);
    }

    const notify = resend("/emails", env, {
      from: env.FROM_EMAIL,
      to: env.TO_EMAIL,
      subject: `New subscriber: ${email}`,
      html: `<p><strong>${email}</strong> just subscribed.</p>`,
    });
    const welcome = resend("/emails", env, {
      from: env.FROM_EMAIL,
      to: email,
      subject: "Welcome to my newsletter",
      html: `<p>Thanks for subscribing! You'll get an email when I publish a new blog post.</p>`,
    });

    const results = await Promise.allSettled([notify, welcome]);
    for (const [i, r] of results.entries()) {
      const label = i === 0 ? "notify" : "welcome";
      if (r.status === "rejected") console.error(`${label} threw`, r.reason);
      else if (!r.value.ok) console.error(`${label} failed`, r.value.status, await r.value.text());
    }

    return json({ ok: true }, 200, origin);
  },
};
