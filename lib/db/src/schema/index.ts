import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull().default(5),
  message: text("message").notNull(),
  country: text("country").notNull(),
  university: text("university"),
  photo: text("photo"),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  description: text("description"),
  photo: text("photo"),
  order: integer("order").notNull().default(0),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  detailedDescription: text("detailed_description"),
  detailImage: text("detail_image"),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  flag: text("flag"),
  highlights: text("highlights").notNull(),
  universities: integer("universities").notNull().default(0),
  order: integer("order").notNull().default(0),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  logo: text("logo").notNull(),
  website: text("website"),
  description: text("description"),
  isPartner: boolean("is_partner").notNull().default(true),
});

export const insertUniversitySchema = createInsertSchema(universities).omit({ id: true });
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type University = typeof universities.$inferSelect;

export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  country: text("country").notNull(),
  university: text("university").notNull(),
  course: text("course").notNull(),
  year: integer("year").notNull(),
  story: text("story"),
  photo: text("photo"),
  videoUrl: text("video_url"),
  visaType: text("visa_type"),
});

export const insertSuccessStorySchema = createInsertSchema(successStories).omit({ id: true });
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStories.$inferSelect;

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  order: integer("order").notNull().default(0),
});

export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull().default("image"),
  category: text("category"),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({ id: true });
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  preferredCountry: text("preferred_country").notNull(),
  courseInterest: text("course_interest").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({ id: true, status: true, createdAt: true });
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiries).omit({ id: true, status: true, createdAt: true });
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiries.$inferSelect;
