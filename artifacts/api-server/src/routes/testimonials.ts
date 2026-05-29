import { Router } from "express";
import { db } from "@workspace/db";
import { testimonials, insertTestimonialSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListTestimonialsResponse,
  CreateTestimonialBody,
  GetTestimonialParams,
  UpdateTestimonialParams,
  UpdateTestimonialBody,
  DeleteTestimonialParams,
} from "@workspace/api-zod";
import { deleteUploadedFile } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(testimonials).orderBy(testimonials.createdAt);
  const result = ListTestimonialsResponse.parse(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  res.json(result);
});

router.post("/", async (req, res) => {
  const body = CreateTestimonialBody.parse(req.body);
  const [row] = await db.insert(testimonials).values(body).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.get("/:id", async (req, res) => {
  const { id } = GetTestimonialParams.parse({ id: Number(req.params.id) });
  const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateTestimonialParams.parse({ id: Number(req.params.id) });
  const body = UpdateTestimonialBody.parse(req.body);
  const [row] = await db.update(testimonials).set(body).where(eq(testimonials.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteTestimonialParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
  await deleteUploadedFile(row?.photo);
  res.status(204).send();
});

export default router;
