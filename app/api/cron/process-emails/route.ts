import { NextResponse } from "next/server";
import { processIncomingEmails } from "@/lib/email-processor";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting email processing (intake + dispatch)...");
    const result = await processIncomingEmails();
    console.log("[CRON] Complete:", JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      intake: result.intake,
      dispatch: result.dispatch,
      details: result.details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Email processing failed:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Processing failed", details: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
