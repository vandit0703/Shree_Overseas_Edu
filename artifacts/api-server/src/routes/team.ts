import { Router } from "express";
import { db } from "@workspace/db";
import { teamMembers } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListTeamMembersResponse,
  CreateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  DeleteTeamMemberParams,
} from "@workspace/api-zod";
import { deleteUploadedFile } from "../lib/uploads";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(teamMembers).orderBy(teamMembers.order);
  res.json(ListTeamMembersResponse.parse(rows));
});

router.post("/", async (req, res) => {
  const body = CreateTeamMemberBody.parse(req.body);
  const [row] = await db.insert(teamMembers).values(body).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateTeamMemberParams.parse({ id: Number(req.params.id) });
  const body = UpdateTeamMemberBody.parse(req.body);
  const [row] = await db.update(teamMembers).set(body).where(eq(teamMembers.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteTeamMemberParams.parse({ id: Number(req.params.id) });
  const [row] = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
  await deleteUploadedFile(row?.photo);
  res.status(204).send();
});

export default router;
