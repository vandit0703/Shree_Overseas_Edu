import { Router } from "express";
import { db } from "@workspace/db";
import { consultations } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListConsultationsResponse,
  CreateConsultationBody,
  UpdateConsultationParams,
  UpdateConsultationBody,
  DeleteConsultationParams,
} from "@workspace/api-zod";
import { sendWhatsAppNotification } from "../lib/whatsapp";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(consultations).orderBy(consultations.createdAt);
  res.json(ListConsultationsResponse.parse(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/", async (req, res) => {
  const body = CreateConsultationBody.parse(req.body);
  const [row] = await db.insert(consultations).values(body).returning();
  // Fire-and-forget email and WhatsApp notification — don't block the response
  // sendConsultationEmail(body).catch(() => {});
  sendWhatsAppNotification(body).catch(() => {});
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateConsultationParams.parse({ id: Number(req.params.id) });
  const body = UpdateConsultationBody.parse(req.body);
  const [row] = await db.update(consultations).set(body).where(eq(consultations.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteConsultationParams.parse({ id: Number(req.params.id) });
  await db.delete(consultations).where(eq(consultations.id, id));
  res.status(204).send();
});

export default router;
