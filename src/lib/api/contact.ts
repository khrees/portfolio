import { Resend } from 'resend'

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export function getContactEnv() {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL
  if (!apiKey || !to) {
    throw new Error(
      'Missing RESEND_API_KEY or CONTACT_EMAIL environment variables. ' +
      'Copy .env.example to .env and fill in your values.'
    )
  }
  return { apiKey, to }
}

export async function sendContactEmail(
  payload: ContactPayload,
  opts: { apiKey: string; to: string },
): Promise<void> {
  const resend = new Resend(opts.apiKey)

  const { error } = await resend.emails.send({
    from: `khrees contact <contact@khrees.com>`,
    to: [opts.to],
    replyTo: payload.email,
    subject: `Hire inquiry from ${payload.name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p>
    `,
  })

  if (error) {
    throw new Error(error.message)
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
