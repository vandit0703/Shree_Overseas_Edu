import axios from "axios";
import { logger } from "./logger";

type ConsultationData = {
  fullName: string;
  mobile: string;
  email: string;
  preferredCountry: string;
  courseInterest: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
};

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN ?? "";
const WHATSAPP_RECIPIENT_NUMBER = process.env.WHATSAPP_RECIPIENT_NUMBER ?? "";

function formatMessage(data: ConsultationData) {
  return [
    "*New Consultation Booking*",
    "",
    `*Full Name:* ${data.fullName}`,
    `*Mobile:* ${data.mobile}`,
    `*Email:* ${data.email}`,
    `*Preferred Country:* ${data.preferredCountry}`,
    `*Course Interest:* ${data.courseInterest}`,
    `*Preferred Date:* ${data.preferredDate}`,
    `*Preferred Time:* ${data.preferredTime}`,
    `*Additional Message:* ${data.message?.trim() || "(none)"}`,
  ].join("\n");
}

export async function sendWhatsAppNotification(data: ConsultationData) {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_RECIPIENT_NUMBER) {
    logger.info("WhatsApp credentials not configured — skipping WhatsApp notification");
    return;
  }

  const url = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: WHATSAPP_RECIPIENT_NUMBER,
    type: "text",
    text: {
      preview_url: false,
      body: formatMessage(data),
    },
  };

  try {
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10_000,
    });
    logger.info("WhatsApp notification sent for consultation booking");
  } catch (error) {
    logger.error({ err: error }, "Failed to send WhatsApp notification");
    throw error;
  }
}
