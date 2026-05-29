import { Router } from "express";
import { db } from "@workspace/db";
import { destinations } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListDestinationsResponse,
  CreateDestinationBody,
  UpdateDestinationParams,
  UpdateDestinationBody,
  DeleteDestinationParams,
} from "@workspace/api-zod";
import { deleteUploadedFiles } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(destinations).orderBy(destinations.order);
  res.json(ListDestinationsResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateDestinationBody.parse(req.body);
  const [row] = await db.insert(destinations).values(body).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateDestinationParams.parse({ id: Number(req.params.id) });
  const body = UpdateDestinationBody.parse(req.body);
  const [row] = await db.update(destinations).set(body).where(eq(destinations.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteDestinationParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(destinations).where(eq(destinations.id, id)).returning();
  await deleteUploadedFiles(row?.image, row?.flag);
  res.status(204).send();
});

export default router;
