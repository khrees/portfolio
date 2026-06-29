/**
 * Production API server for khrees.com
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx CONTACT_EMAIL=you@example.com node api/server.mjs
 *
 * Or with a .env file (Node 21+):
 *   node --env-file .env api/server.mjs
 */

import { createServer } from "node:http";
import { Resend } from "resend";

const PORT = process.env.PORT || 4000;
const API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

if (!API_KEY || !CONTACT_EMAIL) {
  console.error(
    "Missing RESEND_API_KEY or CONTACT_EMAIL environment variables",
  );
  process.exit(1);
}

const resend = new Resend(API_KEY);

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function handleContact(body) {
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return { status: 400, body: { error: "Missing required fields" } };
  }

  const { error } = await resend.emails.send({
    from: `khrees contact <contact@khrees.com>`,
    to: [CONTACT_EMAIL],
    replyTo: email,
    subject: `Hire inquiry from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  if (error) {
    console.error("[api] Resend error:", error);
    return { status: 500, body: { error: "Failed to send message" } };
  }

  return { status: 200, body: { ok: true } };
}

const server = createServer((req, res) => {
  // CORS headers so the client (on a different origin in prod) can reach this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/contact") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body);
      const { status, body: responseBody } = await handleContact(parsed);

      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(responseBody));
    } catch (err) {
      console.error("[api] parse/request error:", err);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid request" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[api] khrees API server running on http://localhost:${PORT}`);
});
