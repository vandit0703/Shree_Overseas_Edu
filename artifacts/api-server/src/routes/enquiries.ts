import { Router } from "express";
import { db } from "@workspace/db";
import { enquiries } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListEnquiriesResponse,
  CreateEnquiryBody,
  UpdateEnquiryParams,
  UpdateEnquiryBody,
  DeleteEnquiryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(enquiries).orderBy(enquiries.createdAt);
  res.json(ListEnquiriesResponse.parse(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/", async (req, res) => {
  const body = CreateEnquiryBody.parse(req.body);
  const [row] = await db.insert(enquiries).values(body).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateEnquiryParams.parse({ id: Number(req.params.id) });
  const body = UpdateEnquiryBody.parse(req.body);
  const [row] = await db.update(enquiries).set(body).where(eq(enquiries.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteEnquiryParams.parse({ id: Number(req.params.id) });
  await db.delete(enquiries).where(eq(enquiries.id, id));
  res.status(204).send();
});

export default router;
