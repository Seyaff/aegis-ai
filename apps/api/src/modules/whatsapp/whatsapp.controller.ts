import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";
import { getEnv } from "../../utils/getEnv";
import { fetchOperationalLogs, generateLogSummary, parseWhatsAppPayload, saveAndValidateMessage } from "./whatsapp.service";
import { classifyIncomingMessage } from "./ai.service";
import { Message } from "../../models/message.model";


export const verifyWebhook = asyncHandler(async (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = getEnv("WHATSAPP_VERIFY_TOKEN") || process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ WhatsApp Webhook successfully verified.");
    return res.status(HTTPSTATUS.OK).send(challenge);
  }

  console.error("❌ Webhook token verification failed.");
  return res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Verification failed." });
});


export const handleIncomingMessage = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  res.status(HTTPSTATUS.OK).send("EVENT_RECEIVED");

  const parsed = parseWhatsAppPayload(body);
  if (!parsed) return;

  const dbMessage = await saveAndValidateMessage(parsed);
  if (!dbMessage) return;

  console.log(`\n📥 --- NEW MESSAGE STORED IN DB ---`);
  const analysis = await classifyIncomingMessage(dbMessage.textBody);

  await Message.findByIdAndUpdate(dbMessage._id, {
    status: "processed",
    classification: {
      category: analysis.category,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning
    }
  });

  console.log("\n🧠 --- AI INTENT ANALYSIS COMPLETE ---");
  console.log(`🏷️  Category:   [${analysis.category}] (Confidence: ${analysis.confidence * 100}%)`);
  console.log(`📝 Reasoning:  "${analysis.reasoning}"`);

  console.log(`⚡ Executing target workflow routing for: ${analysis.category}...`);
  
  if (analysis.category === "LOGS_REQUEST") {

    const rawLogs = await fetchOperationalLogs();
    
    const summaryResult = await generateLogSummary(rawLogs);
    
    console.log("\n📊 --- LIVE SYSTEM OPERATIONAL REPORT GENERATED ---");
    console.log(summaryResult);
    console.log("---------------------------------------------------\n");
    
  } else if (analysis.category === "SUPPORT") {
    console.log("\n🚨 [WORKFLOW] High priority alert dispatched to Support Matrix escalation queue.\n");
  } else {
    console.log("\n📝 [WORKFLOW] Logged internally into CRM lead engagement funnel.\n");
  }
});