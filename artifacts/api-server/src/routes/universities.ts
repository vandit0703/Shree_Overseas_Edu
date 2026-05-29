import { Router } from "express";
import { db } from "@workspace/db";
import { universities } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListUniversitiesResponse,
  ListUniversitiesQueryParams,
  CreateUniversityBody,
  UpdateUniversityParams,
  UpdateUniversityBody,
  DeleteUniversityParams,
} from "@workspace/api-zod";
import { deleteUploadedFile } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const query = ListUniversitiesQueryParams.parse(req.query);
  let rows = await db.select().from(universities).orderBy(universities.name);
  if (query.country) {
    rows = rows.filter(r => r.country.toLowerCase() === query.country!.toLowerCase());
  }
  res.json(ListUniversitiesResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateUniversityBody.parse(req.body);
  const [row] = await db.insert(universities).values(body).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateUniversityParams.parse({ id: Number(req.params.id) });
  const body = UpdateUniversityBody.parse(req.body);
  const [row] = await db.update(universities).set(body).where(eq(universities.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteUniversityParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(universities).where(eq(universities.id, id)).returning();
  await deleteUploadedFile(row?.logo);
  res.status(204).send();
});

export default router;
