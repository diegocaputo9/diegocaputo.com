// Contact form for diegocaputo.com (Supabase Edge Function, Deno).
// Receives the "Invite me to speak" form as JSON and emails it to Diego via
// Resend, with Reply-To set to the visitor so a reply goes straight to them.
//
// Deploy with JWT verification off (the site is static and has no login):
//   supabase functions deploy contact --no-verify-jwt
// Secret (set in Supabase > Edge Functions > Secrets, never in code):
//   RESEND_API_KEY
// Requires diegocaputo.com to be a verified sending domain in Resend.

const ALLOWED_ORIGINS = [
  "https://diegocaputo.com",
  "https://www.diegocaputo.com",
  "http://localhost:3000",
  "http://localhost:4000",
];
const TO = "hello@diegocaputo.com";
const FROM = "diegocaputo.com <website@diegocaputo.com>";

// Best-effort rate limit per IP (per function instance): 5 sends / 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const LIMITS: Record<string, number> = {
  name: 120,
  email: 200,
  organization: 160,
  date: 80,
  event: 200,
  message: 4000,
};

function cors(origin: string) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "content-type": "application/json" },
  });
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const headers = cors(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST" || !ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: "forbidden" }, 403, headers);
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return json({ error: "rate_limited" }, 429, headers);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400, headers);
  }

  // Bots: filled honeypot or submitted faster than a person could type.
  // Answer "ok" so they don't learn anything, but send nothing.
  if (String(body.website ?? "").trim() || Number(body.elapsed ?? 0) < 3000) {
    return json({ ok: true }, 200, headers);
  }

  const f: Record<string, string> = {};
  for (const [k, max] of Object.entries(LIMITS)) f[k] = String(body[k] ?? "").trim().slice(0, max);
  const kind = String(body.kind ?? "Website message").slice(0, 60);

  if (!f.name || !f.message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) {
    return json({ error: "invalid" }, 422, headers);
  }

  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Organization", f.organization],
    ["Date", f.date],
    ["Event or topic", f.event],
  ];
  const text =
    rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${f.message}\n`;
  const html =
    `<table style="font:14px/1.5 system-ui,sans-serif;border-collapse:collapse">` +
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#52525b">${k}</td><td>${escapeHtml(v)}</td></tr>`)
      .join("") +
    `</table><p style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(f.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: f.email,
      subject: `${kind}: ${f.event || f.name}`.slice(0, 150),
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("resend", res.status, await res.text());
    return json({ error: "send_failed" }, 502, headers);
  }

  recent.push(now);
  hits.set(ip, recent);
  return json({ ok: true }, 200, headers);
});
