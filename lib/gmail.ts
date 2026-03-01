import { google, gmail_v1 } from "googleapis";
import { HttpsProxyAgent } from "https-proxy-agent";
import https from "https";

const PENPAL_ADDRESS = "penpal@mindfulpenpal.com";

function getProxyAgent(): https.Agent | undefined {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (!proxyUrl) return undefined;
  return new HttpsProxyAgent(proxyUrl);
}

function getGmailClient(): gmail_v1.Gmail {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const agent = getProxyAgent();
  if (agent) {
    google.options({
      http2: false,
      agent,
    } as any);
  }

  return google.gmail({ version: "v1", auth });
}

export interface IncomingEmail {
  messageId: string;
  threadId: string;
  originalMessageId: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

function extractEmailAddress(headerValue: string): string {
  const match = headerValue.match(/<([^>]+)>/);
  return match ? match[1].toLowerCase() : headerValue.toLowerCase().trim();
}

function extractPlainTextBody(payload: gmail_v1.Schema$MessagePart): string {
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return Buffer.from(payload.body.data, "base64url").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractPlainTextBody(part);
      if (text) return text;
    }
  }

  if (payload.mimeType === "text/html" && payload.body?.data) {
    const html = Buffer.from(payload.body.data, "base64url").toString("utf-8");
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }

  return "";
}

/**
 * Fetch unread emails sent to penpal@mindfulpenpal.com (forwarded by ImprovMX).
 */
export async function fetchNewEmails(
  _afterTimestamp?: number
): Promise<IncomingEmail[]> {
  const gmail = getGmailClient();

  // Only rely on is:unread + DB dedup; no time filter needed
  // (the after: filter can miss emails forwarded before the last processing run)
  const query = `to:${PENPAL_ADDRESS} is:unread`;

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 20,
  });

  if (!listRes.data.messages || listRes.data.messages.length === 0) {
    return [];
  }

  const emails: IncomingEmail[] = [];

  for (const msg of listRes.data.messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id!,
      format: "full",
    });

    const headers = detail.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

    const fromHeader = getHeader("From");
    const toHeader = getHeader("To");
    const subjectHeader = getHeader("Subject");
    const dateHeader = getHeader("Date");
    const originalMessageId = getHeader("Message-ID") || getHeader("Message-Id");

    const body = extractPlainTextBody(detail.data.payload!);

    emails.push({
      messageId: msg.id!,
      threadId: msg.threadId || msg.id!,
      originalMessageId,
      from: fromHeader,
      fromEmail: extractEmailAddress(fromHeader),
      to: toHeader,
      subject: subjectHeader,
      body,
      date: dateHeader,
    });
  }

  return emails;
}

/**
 * Mark a Gmail message as read after processing.
 */
export async function markAsRead(messageId: string): Promise<void> {
  const gmail = getGmailClient();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      removeLabelIds: ["UNREAD"],
    },
  });
}
