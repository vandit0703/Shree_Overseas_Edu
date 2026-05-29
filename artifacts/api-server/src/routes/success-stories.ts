import { Router } from "express";
import { db } from "@workspace/db";
import { successStories } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListSuccessStoriesResponse,
  CreateSuccessStoryBody,
  UpdateSuccessStoryParams,
  UpdateSuccessStoryBody,
  DeleteSuccessStoryParams,
} from "@workspace/api-zod";
import { deleteUploadedFiles } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(successStories).orderBy(successStories.year);
  res.json(ListSuccessStoriesResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateSuccessStoryBody.parse(req.body);
  const [row] = await db.insert(successStories).values(body).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateSuccessStoryParams.parse({ id: Number(req.params.id) });
  const body = UpdateSuccessStoryBody.parse(req.body);
  const [row] = await db.update(successStories).set(body).where(eq(successStories.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteSuccessStoryParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(successStories).where(eq(successStories.id, id)).returning();
  await deleteUploadedFiles(row?.photo, row?.videoUrl);
  res.status(204).send();
});

export default router;
