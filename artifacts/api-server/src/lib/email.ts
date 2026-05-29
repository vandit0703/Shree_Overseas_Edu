import nodemailer from "nodemailer";
import { logger } from "./logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendConsultationEmail(data: {
  fullName: string;
  mobile: string;
  email: string;
  preferredCountry: string;
  courseInterest: string;
  preferredDate: string;
  preferredTime: string;
  message?: string | null;
}) {
  const transporter = getTransporter();
  if (!transporter || !ADMIN_EMAIL) {
    logger.info("Email not configured — skipping consultation notification");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #C84B0F; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Consultation Booking</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Shree Overseas Education</p>
      </div>
      <div style="padding: 28px; background: #fff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 160px;">Student Name</td><td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${data.fullName}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 10px 6px; color: #64748b; font-size: 14px;">Mobile</td><td style="padding: 10px 6px; font-weight: 600; color: #0f172a;">${data.mobile}</td></tr>
          <tr><td style="padding: 10px 0; color: #64748b; font-size: 14px;">Email</td><td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${data.email}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 10px 6px; color: #64748b; font-size: 14px;">Preferred Country</td><td style="padding: 10px 6px; font-weight: 600; color: #0f172a;">${data.preferredCountry}</td></tr>
          <tr><td style="padding: 10px 0; color: #64748b; font-size: 14px;">Course Interest</td><td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${data.courseInterest}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 10px 6px; color: #64748b; font-size: 14px;">Preferred Date</td><td style="padding: 10px 6px; font-weight: 600; color: #0f172a;">${data.preferredDate}</td></tr>
          <tr><td style="padding: 10px 0; color: #64748b; font-size: 14px;">Preferred Time</td><td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${data.preferredTime}</td></tr>
          ${data.message ? `<tr style="background: #f8fafc;"><td style="padding: 10px 6px; color: #64748b; font-size: 14px; vertical-align: top;">Message</td><td style="padding: 10px 6px; color: #0f172a;">${data.message}</td></tr>` : ""}
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fff7ed; border-left: 4px solid #C84B0F; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #7c2d12;">Please follow up with this student within 24 hours. Log in to the admin panel to update the booking status.</p>
        </div>
      </div>
      <div style="padding: 16px; background: #f8fafc; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Shree Overseas Education — Gandhinagar, Gujarat</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Shree Overseas Education" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Consultation Booking — ${data.fullName} (${data.preferredCountry})`,
      html,
    });
    logger.info("Consultation email sent to admin");
  } catch (err) {
    logger.error({ err }, "Failed to send consultation email");
  }
}
