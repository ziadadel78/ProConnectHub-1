import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("freelancer"), // 'freelancer', 'client', 'admin'
  title: text("title"),
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  avatar: text("avatar"),
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  location: text("location"),
  website: text("website"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Jobs table
export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  budgetType: text("budget_type").notNull(), // 'fixed', 'hourly'
  category: text("category").notNull(),
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'completed', 'cancelled'
  proposalCount: integer("proposal_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Proposals table
export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull(),
  freelancerId: text("freelancer_id").notNull(),
  coverLetter: text("cover_letter").notNull(),
  proposedRate: integer("proposed_rate").notNull(),
  deliveryTime: integer("delivery_time").notNull(), // in days
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Portfolio items table
export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  projectUrl: text("project_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Messages table
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull(),
  reviewerId: text("reviewer_id").notNull(),
  revieweeId: text("reviewee_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Marketing campaigns table
export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'paused', 'completed'
  targetAudience: text("target_audience"),
  budget: integer("budget"),
  clicks: integer("clicks").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["freelancer", "client", "admin"]).optional(),
  skills: z.array(z.string()).optional(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  proposalCount: true,
}).extend({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.number().positive(),
  budgetType: z.enum(["fixed", "hourly"]),
  category: z.string().min(1),
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
  skills: z.array(z.string()).optional(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  coverLetter: z.string().min(50),
  proposedRate: z.number().positive(),
  deliveryTime: z.number().positive(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  technologies: z.array(z.string()).optional(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  read: true,
}).extend({
  content: z.string().min(1),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  clicks: true,
  impressions: true,
  conversions: true,
}).extend({
  name: z.string().min(3),
  status: z.enum(["draft", "active", "paused", "completed"]).optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type LoginData = z.infer<typeof loginSchema>;
