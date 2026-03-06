import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { generateDesignDoc } from "@/lib/generateDesignDoc";
import { createGoogleDoc } from "@/lib/googleDrive";
import crypto from "crypto";

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

function verifySlackSignature(req: NextRequest, rawBody: string): boolean {
  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const signature = req.headers.get("x-slack-signature") ?? "";
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

  if (parseInt(timestamp) < fiveMinutesAgo) return false;

  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto
    .createHmac("sha256", process.env.SLACK_SIGNING_SECRET ?? "")
    .update(sigBasestring)
    .digest("hex");
  const computedSig = `v0=${hmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(computedSig),
    Buffer.from(signature)
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!verifySlackSignature(req, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Handle Slack URL verification challenge
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  const event = body.event;

  // Only handle app_mention events
  if (!event || event.type !== "app_mention") {
    return NextResponse.json({ ok: true });
  }

  // Respond immediately to Slack (must reply within 3s)
  // Process asynchronously
  processRequest(event).catch(console.error);

  return NextResponse.json({ ok: true });
}

async function processRequest(event: {
  text: string;
  channel: string;
  ts: string;
  user: string;
}) {
  const userInput = event.text.replace(/<@[A-Z0-9]+>/g, "").trim();

  if (!userInput) {
    await slack.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: "Hi! To create a design document, mention me with details like:\n`@designdoc Customer: Acme Corp | Type: CRM implementation | ERP: SAP via SFTP | Notes: 3 pipelines, Klaviyo integration`",
    });
    return;
  }

  // Post a "thinking" message
  await slack.chat.postMessage({
    channel: event.channel,
    thread_ts: event.ts,
    text: "Got it! Generating your solution design document... this will take about 30 seconds.",
  });

  try {
    const docContent = await generateDesignDoc(userInput);
    const docTitle = extractTitle(userInput);
    const docUrl = await createGoogleDoc(docTitle, docContent);

    await slack.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: `Your solution design document is ready!\n*${docTitle}*\n${docUrl}`,
    });
  } catch (err) {
    console.error(err);
    await slack.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: "Sorry, something went wrong generating the document. Please try again.",
    });
  }
}

function extractTitle(input: string): string {
  const customerMatch = input.match(/customer[:\s]+([^|,\n]+)/i);
  const customer = customerMatch ? customerMatch[1].trim() : "New Customer";
  const date = new Date().toISOString().split("T")[0];
  return `Solutions Design Document - ${customer} - ${date}`;
}
