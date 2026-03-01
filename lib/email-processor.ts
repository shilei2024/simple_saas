import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { fetchNewEmails, markAsRead, IncomingEmail } from "./gmail";
import { sendReply, sendNewEmail } from "./brevo";
import {
  generateReply,
  getRegistrationPromptEmail,
  getNoCreditsEmail,
} from "./ai";
import type { ReplyTier } from "@/types/subscriptions";

interface DelayRange {
  minMs: number;
  maxMs: number;
}

const REPLY_DELAYS: Record<ReplyTier, DelayRange> = {
  free: {
    minMs: 5 * 60 * 60 * 1000,
    maxMs: 6 * 60 * 60 * 1000,
  },
  paid_credits: {
    minMs: 3 * 60 * 60 * 1000,
    maxMs: 4 * 60 * 60 * 1000,
  },
  monthly_subscription: {
    minMs: 2 * 60 * 60 * 1000,
    maxMs: 4 * 60 * 60 * 1000,
  },
  unlimited_subscription: {
    minMs: 1 * 60 * 60 * 1000,
    maxMs: 2 * 60 * 60 * 1000,
  },
};

function randomDelay(range: DelayRange): number {
  if (range.maxMs === 0) return 0;
  return Math.floor(Math.random() * (range.maxMs - range.minMs)) + range.minMs;
}

interface ProcessingResult {
  intake: { processed: number; scheduled: number; skipped: number; errors: number };
  dispatch: { sent: number; errors: number };
  details: string[];
}

// ──────────────────────────────────────────────
//  Main entry: runs both phases in each cron tick
// ──────────────────────────────────────────────

export async function processIncomingEmails(): Promise<ProcessingResult> {
  const supabase = createServiceRoleClient();
  const result: ProcessingResult = {
    intake: { processed: 0, scheduled: 0, skipped: 0, errors: 0 },
    dispatch: { sent: 0, errors: 0 },
    details: [],
  };

  // Phase 1 — Intake: pull new emails, validate, schedule
  await phaseIntake(supabase, result);

  // Phase 2 — Dispatch: send replies whose scheduled time has arrived
  await phaseDispatch(supabase, result);

  // Log this run
  await supabase.from("email_processing_log").insert({
    last_processed_at: new Date().toISOString(),
    emails_processed: result.intake.processed + result.dispatch.sent,
    status:
      result.intake.errors + result.dispatch.errors > 0 ? "error" : "success",
    error_message:
      result.intake.errors + result.dispatch.errors > 0
        ? result.details.filter((d) => d.startsWith("Error")).join("; ")
        : null,
    metadata: result,
  });

  return result;
}

// ──────────────────────────────────────────────
//  Phase 1 — Intake
// ──────────────────────────────────────────────

async function phaseIntake(
  supabase: ReturnType<typeof createServiceRoleClient>,
  result: ProcessingResult
) {
  try {
    const { data: lastLog } = await supabase
      .from("email_processing_log")
      .select("last_processed_at")
      .order("last_processed_at", { ascending: false })
      .limit(1)
      .single();

    const afterTimestamp = lastLog
      ? new Date(lastLog.last_processed_at).getTime()
      : Date.now() - 10 * 60 * 1000;

    const emails = await fetchNewEmails(afterTimestamp);
    result.details.push(`[Intake] Found ${emails.length} new emails`);

    for (const email of emails) {
      try {
        await intakeOneEmail(email, supabase, result);
        result.intake.processed++;
      } catch (err) {
        result.intake.errors++;
        const msg = err instanceof Error ? err.message : "Unknown error";
        result.details.push(`Error intaking ${email.fromEmail}: ${msg}`);
        console.error(`Intake error for ${email.messageId}:`, err);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    result.details.push(`Error in intake phase: ${msg}`);
    result.intake.errors++;
    console.error("Fatal intake error:", err);
  }
}

async function intakeOneEmail(
  email: IncomingEmail,
  supabase: ReturnType<typeof createServiceRoleClient>,
  result: ProcessingResult
) {
  // Dedup
  const { data: existing } = await supabase
    .from("email_correspondence")
    .select("id")
    .eq("gmail_message_id", email.messageId)
    .single();

  if (existing) {
    result.intake.skipped++;
    return;
  }

  // Look up sender
  const { data: customer } = await supabase
    .from("customers")
    .select("id, email, free_credits, paid_credits, credits, user_id")
    .eq("email", email.fromEmail)
    .single();

  // Unregistered user → reply immediately with registration prompt
  if (!customer) {
    await handleUnregisteredUser(email, supabase, result);
    return;
  }

  const totalCredits =
    (customer.free_credits || 0) + (customer.paid_credits || 0);

  // No credits → reply immediately with purchase link
  if (totalCredits <= 0) {
    await handleNoCredits(email, customer.id, supabase, result);
    return;
  }

  // Determine which reply tier applies
  const replyTier = await determineReplyTier(customer, supabase);
  const useFreeCredits = (customer.free_credits || 0) > 0;
  const creditType = useFreeCredits ? "free" : "paid";

  // Calculate scheduled reply time
  const delayMs = randomDelay(REPLY_DELAYS[replyTier]);
  const scheduledAt = new Date(Date.now() + delayMs);

  const delayHours = (delayMs / (1000 * 60 * 60)).toFixed(1);

  // Save to DB as "scheduled"
  await supabase.from("email_correspondence").insert({
    customer_id: customer.id,
    sender_email: email.fromEmail,
    recipient_email: "penpal@mindfulpenpal.com",
    subject: email.subject,
    incoming_body: email.body,
    gmail_message_id: email.messageId,
    gmail_thread_id: email.threadId,
    status: "scheduled",
    credit_type: creditType,
    reply_tier: replyTier,
    scheduled_reply_at: scheduledAt.toISOString(),
    metadata: {
      delay_ms: delayMs,
      delay_hours: delayHours,
      from_header: email.from,
      original_message_id: email.originalMessageId,
    },
  });

  // Deduct credits immediately (reserve them)
  if (useFreeCredits) {
    await supabase
      .from("customers")
      .update({
        free_credits: customer.free_credits - 1,
        credits: customer.credits - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customer.id);
  } else {
    await supabase
      .from("customers")
      .update({
        paid_credits: customer.paid_credits - 1,
        credits: customer.credits - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customer.id);
  }

  await supabase.from("credits_history").insert({
    customer_id: customer.id,
    amount: 1,
    type: "subtract",
    description: `Pen pal reply scheduled: ${email.subject}`,
    metadata: {
      credit_type: creditType,
      reply_tier: replyTier,
      email_message_id: email.messageId,
      scheduled_reply_at: scheduledAt.toISOString(),
    },
  });

  await markAsRead(email.messageId);
  result.intake.scheduled++;
  result.details.push(
    `[Intake] Scheduled reply to ${email.fromEmail} in ~${delayHours}h (tier: ${replyTier}, credit: ${creditType})`
  );
}

// ──────────────────────────────────────────────
//  Phase 2 — Dispatch
// ──────────────────────────────────────────────

async function phaseDispatch(
  supabase: ReturnType<typeof createServiceRoleClient>,
  result: ProcessingResult
) {
  try {
    const now = new Date().toISOString();

    const { data: dueEmails } = await supabase
      .from("email_correspondence")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_reply_at", now)
      .order("scheduled_reply_at", { ascending: true })
      .limit(10);

    if (!dueEmails || dueEmails.length === 0) {
      result.details.push("[Dispatch] No scheduled replies due yet");
      return;
    }

    result.details.push(
      `[Dispatch] ${dueEmails.length} replies due for sending`
    );

    for (const record of dueEmails) {
      try {
        await dispatchOneReply(record, supabase);
        result.dispatch.sent++;
        result.details.push(
          `[Dispatch] Sent reply to ${record.sender_email} (subject: ${record.subject})`
        );
      } catch (err) {
        result.dispatch.errors++;
        const msg = err instanceof Error ? err.message : "Unknown error";
        result.details.push(
          `Error dispatching to ${record.sender_email}: ${msg}`
        );
        console.error(`Dispatch error for ${record.id}:`, err);

        await supabase
          .from("email_correspondence")
          .update({ status: "failed", error_message: msg })
          .eq("id", record.id);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    result.details.push(`Error in dispatch phase: ${msg}`);
    result.dispatch.errors++;
    console.error("Fatal dispatch error:", err);
  }
}

async function dispatchOneReply(
  record: any,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  // Mark as processing
  await supabase
    .from("email_correspondence")
    .update({ status: "processing" })
    .eq("id", record.id);

  // Fetch conversation history for this customer
  const { data: history } = await supabase
    .from("email_correspondence")
    .select("incoming_body, outgoing_body, created_at")
    .eq("customer_id", record.customer_id)
    .eq("status", "replied")
    .order("created_at", { ascending: true });

  const conversationHistory = (history || []).map((h: any) => ({
    incoming_body: h.incoming_body,
    outgoing_body: h.outgoing_body,
    created_at: h.created_at,
  }));

  const isFirstLetter = conversationHistory.length === 0;
  const senderName =
    (record.metadata?.from_header || "").split("<")[0].trim() ||
    record.sender_email.split("@")[0];

  // Generate AI reply with automatic persona/language detection
  const { reply: replyContent, senderProfile } = await generateReply({
    senderName,
    senderEmail: record.sender_email,
    incomingBody: record.incoming_body,
    conversationHistory,
    isFirstLetter,
  });

  console.log(
    `[Dispatch] Sender profile: region=${senderProfile.culturalRegion}, lang=${senderProfile.detectedLanguage}`
  );

  // Send via Brevo using the original RFC Message-ID for threading
  const originalMsgId = record.metadata?.original_message_id || "";
  await sendReply(
    originalMsgId,
    record.sender_email,
    record.subject,
    replyContent,
    record.incoming_body
  );

  // Update record with reply and detected profile
  await supabase
    .from("email_correspondence")
    .update({
      outgoing_body: replyContent,
      status: "replied",
      replied_at: new Date().toISOString(),
      metadata: {
        ...(record.metadata || {}),
        sender_profile: {
          cultural_region: senderProfile.culturalRegion,
          detected_language: senderProfile.detectedLanguage,
          gender_hint: senderProfile.genderHint,
        },
      },
    })
    .eq("id", record.id);
}

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────

async function determineReplyTier(
  customer: { id: string; user_id: string; free_credits: number; paid_credits: number },
  supabase: ReturnType<typeof createServiceRoleClient>
): Promise<ReplyTier> {
  if ((customer.free_credits || 0) > 0) {
    return "free";
  }

  // Check for active subscription to determine speed tier
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("creem_product_id, status, metadata")
    .eq("customer_id", customer.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (subscription) {
    const meta = subscription.metadata as Record<string, any> | null;
    const tierFromMeta = meta?.reply_tier as ReplyTier | undefined;

    if (tierFromMeta && REPLY_DELAYS[tierFromMeta]) {
      return tierFromMeta;
    }

    // Fallback: match by product ID against known config
    const { SUBSCRIPTION_TIERS } = await import("@/config/subscriptions");
    const matched = SUBSCRIPTION_TIERS.find(
      (t) => t.productId === subscription.creem_product_id
    );
    if (matched?.replyTier) {
      return matched.replyTier;
    }

    return "monthly_subscription";
  }

  return "paid_credits";
}

async function handleUnregisteredUser(
  email: IncomingEmail,
  supabase: ReturnType<typeof createServiceRoleClient>,
  result: ProcessingResult
) {
  const body = getRegistrationPromptEmail(email.body);

  await sendNewEmail(email.fromEmail, `RE: ${email.subject}`, body);

  await supabase.from("email_correspondence").insert({
    sender_email: email.fromEmail,
    recipient_email: "penpal@mindfulpenpal.com",
    subject: email.subject,
    incoming_body: email.body,
    outgoing_body: body,
    gmail_message_id: email.messageId,
    gmail_thread_id: email.threadId,
    status: "skipped",
    error_message: "User not registered",
    metadata: { reason: "unregistered" },
  });

  await markAsRead(email.messageId);
  result.intake.skipped++;
  result.details.push(
    `[Intake] Unregistered: ${email.fromEmail} — sent registration prompt`
  );
}

async function handleNoCredits(
  email: IncomingEmail,
  customerId: string,
  supabase: ReturnType<typeof createServiceRoleClient>,
  result: ProcessingResult
) {
  const body = getNoCreditsEmail(email.body);

  await sendReply(
    email.originalMessageId,
    email.fromEmail,
    email.subject,
    body,
    email.body
  );

  await supabase.from("email_correspondence").insert({
    customer_id: customerId,
    sender_email: email.fromEmail,
    recipient_email: "penpal@mindfulpenpal.com",
    subject: email.subject,
    incoming_body: email.body,
    outgoing_body: body,
    gmail_message_id: email.messageId,
    gmail_thread_id: email.threadId,
    status: "skipped",
    error_message: "No credits available",
    metadata: { reason: "no_credits" },
  });

  await markAsRead(email.messageId);
  result.intake.skipped++;
  result.details.push(
    `[Intake] No credits: ${email.fromEmail} — sent purchase prompt`
  );
}
