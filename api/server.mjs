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
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const signaturesPath = join(__dirname, "..", ".data", "signatures.json");

const resend = new Resend(API_KEY);

// ─── Helpers ──────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function readSignatures() {
  if (existsSync(signaturesPath)) {
    return JSON.parse(readFileSync(signaturesPath, "utf-8"));
  }
  return [];
}

function writeSignatures(data) {
  mkdirSync(dirname(signaturesPath), { recursive: true });
  writeFileSync(signaturesPath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Route handlers ────────────────────────────────────────

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

async function handleGetSignatures() {
  try {
    const signatures = readSignatures();
    return { status: 200, body: signatures };
  } catch (err) {
    console.error("[api] read signatures error:", err);
    return { status: 500, body: { error: "Failed to read signatures" } };
  }
}

async function handleAddSignature(body) {
  try {
    const { name, message, imageData } = body;

    if (!name || !name.trim()) {
      return { status: 400, body: { error: "Name is required" } };
    }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      message: (message || "").trim(),
      imageData: imageData || "",
      date: new Date().toISOString(),
    };

    const signatures = readSignatures();
    signatures.unshift(entry);
    writeSignatures(signatures);

    return { status: 200, body: { ok: true, entry } };
  } catch (err) {
    console.error("[api] add signature error:", err);
    return { status: 500, body: { error: "Failed to add signature" } };
  }
}

// ─── Server ────────────────────────────────────────────────

const server = createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = req.url;

  // ── Signatures ──
  if (url === "/api/signatures") {
    if (req.method === "GET") {
      handleGetSignatures().then(({ status, body }) => json(res, status, body));
      return;
    }
    if (req.method === "POST") {
      readBody(req)
        .then(handleAddSignature)
        .then(({ status, body }) => json(res, status, body))
        .catch(() => json(res, 400, { error: "Invalid request" }));
      return;
    }
    json(res, 405, { error: "Method not allowed" });
    return;
  }

  // ── Contact ──
  if (url === "/api/contact") {
    if (req.method === "POST") {
      readBody(req)
        .then(handleContact)
        .then(({ status, body }) => json(res, status, body))
        .catch(() => json(res, 400, { error: "Invalid request" }));
      return;
    }
    json(res, 405, { error: "Method not allowed" });
    return;
  }

  json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`[api] khrees API server running on http://localhost:${PORT}`);
});
