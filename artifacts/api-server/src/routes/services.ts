import { Router } from "express";
import { db } from "@workspace/db";
import { services } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListServicesResponse,
  CreateServiceBody,
  UpdateServiceParams,
  UpdateServiceBody,
  DeleteServiceParams,
} from "@workspace/api-zod";
import { deleteUploadedFiles } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(services).orderBy(services.order);
  res.json(ListServicesResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [row] = await db.insert(services).values(body).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateServiceParams.parse({ id: Number(req.params.id) });
  const body = UpdateServiceBody.parse(req.body);
  const [row] = await db.update(services).set(body).where(eq(services.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteServiceParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(services).where(eq(services.id, id)).returning();
  await deleteUploadedFiles(row?.icon, row?.detailImage);
  res.status(204).send();
});

export default router;
