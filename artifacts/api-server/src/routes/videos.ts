import { Router } from "express";
import { db } from "@workspace/db";
import { videos } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListVideosResponse,
  CreateVideoBody,
  DeleteVideoParams,
} from "@workspace/api-zod";
import { deleteUploadedFiles } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(videos).orderBy(videos.order);
  res.json(ListVideosResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateVideoBody.parse(req.body);
  const [row] = await db.insert(videos).values(body).returning();
  res.status(201).json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteVideoParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(videos).where(eq(videos.id, id)).returning();
  await deleteUploadedFiles(row?.url, row?.thumbnail);
  res.status(204).send();
});

export default router;
