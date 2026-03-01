const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const PENPAL_ADDRESS = "penpal@mindfulpenpal.com";
const PENPAL_NAME = "Mindful PenPal";

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
  inReplyTo?: string;
  references?: string;
}

/**
 * Send an email via Brevo SMTP API as penpal@mindfulpenpal.com.
 * Brevo must have this sender address verified/authenticated in the dashboard.
 */
async function brevoSend(params: SendEmailParams): Promise<string> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  const headers: Record<string, string> = {};
  if (params.inReplyTo) {
    headers["In-Reply-To"] = params.inReplyTo;
  }
  if (params.references) {
    headers["References"] = params.references;
  }

  const body: Record<string, any> = {
    sender: { name: PENPAL_NAME, email: PENPAL_ADDRESS },
    to: [{ email: params.to, name: params.toName || params.to }],
    subject: params.subject,
    textContent: params.textContent,
  };

  if (params.htmlContent) {
    body.htmlContent = params.htmlContent;
  }

  if (Object.keys(headers).length > 0) {
    body.headers = headers;
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brevo API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.messageId || "";
}

/**
 * Send a reply to an existing email thread.
 * Uses In-Reply-To and References headers to keep the thread intact
 * in the recipient's mail client.
 */
export async function sendReply(
  originalMessageId: string,
  to: string,
  subject: string,
  replyBody: string,
  originalBody: string
): Promise<string> {
  const lowerSubject = subject.toLowerCase();
  const replySubject =
    lowerSubject.startsWith("re:") || lowerSubject.startsWith("fwd:")
      ? subject
      : `RE: ${subject}`;

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fullBody = `${replyBody}\n\n---\nOn ${dateStr}, ${to} wrote:\n\n${originalBody}`;

  return brevoSend({
    to,
    subject: replySubject,
    textContent: fullBody,
    inReplyTo: originalMessageId,
    references: originalMessageId,
  });
}

/**
 * Send a fresh email (not a reply to an existing thread).
 * Used for registration prompts to unregistered users.
 */
export async function sendNewEmail(
  to: string,
  subject: string,
  body: string
): Promise<string> {
  return brevoSend({
    to,
    subject,
    textContent: body,
  });
}
