import { Router } from "express";
import { db } from "@workspace/db";
import { galleryItems } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListGalleryItemsResponse,
  CreateGalleryItemBody,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";
import { deleteUploadedFile } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(galleryItems);
  res.json(ListGalleryItemsResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateGalleryItemBody.parse(req.body);
  const [row] = await db.insert(galleryItems).values(body).returning();
  res.status(201).json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteGalleryItemParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
  await deleteUploadedFile(row?.url);
  res.status(204).send();
});

export default router;
