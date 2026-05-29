import { Router } from "express";
import { db } from "@workspace/db";
import { testimonials, successStories, universities, destinations, consultations, enquiries } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const [
    [totalConsultationsRow],
    [totalEnquiriesRow],
    [totalTestimonialsRow],
    [totalSuccessStoriesRow],
    [totalUniversitiesRow],
    [totalDestinationsRow],
    [pendingConsultationsRow],
    [newEnquiriesRow],
  ] = await Promise.all([
    db.select({ count: count() }).from(consultations),
    db.select({ count: count() }).from(enquiries),
    db.select({ count: count() }).from(testimonials),
    db.select({ count: count() }).from(successStories),
    db.select({ count: count() }).from(universities),
    db.select({ count: count() }).from(destinations),
    db.select({ count: count() }).from(consultations).where(eq(consultations.status, "pending")),
    db.select({ count: count() }).from(enquiries).where(eq(enquiries.status, "new")),
  ]);

  res.json({
    totalConsultations: Number(totalConsultationsRow.count),
    totalEnquiries: Number(totalEnquiriesRow.count),
    totalTestimonials: Number(totalTestimonialsRow.count),
    totalSuccessStories: Number(totalSuccessStoriesRow.count),
    totalUniversities: Number(totalUniversitiesRow.count),
    totalDestinations: Number(totalDestinationsRow.count),
    pendingConsultations: Number(pendingConsultationsRow.count),
    newEnquiries: Number(newEnquiriesRow.count),
  });
});

export default router;
