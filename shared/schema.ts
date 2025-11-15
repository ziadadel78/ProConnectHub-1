import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("freelancer"), // 'freelancer', 'client', 'admin'
  title: text("title"),
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  avatar: text("avatar"),
  skills: text("skills").array().default(sql`ARRAY[]::text[]`),
  location: text("location"),
  website: text("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  budgetType: text("budget_type").notNull(), // 'fixed', 'hourly'
  category: text("category").notNull(),
  skills: text("skills").array().default(sql`ARRAY[]::text[]`),
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'completed', 'cancelled'
  proposalCount: integer("proposal_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Proposals table
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  freelancerId: varchar("freelancer_id").notNull(),
  coverLetter: text("cover_letter").notNull(),
  proposedRate: integer("proposed_rate").notNull(),
  deliveryTime: integer("delivery_time").notNull(), // in days
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Portfolio items table
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  technologies: text("technologies").array().default(sql`ARRAY[]::text[]`),
  projectUrl: text("project_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  reviewerId: varchar("reviewer_id").notNull(),
  revieweeId: varchar("reviewee_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Marketing campaigns table
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'paused', 'completed'
  targetAudience: text("target_audience"),
  budget: integer("budget"),
  clicks: integer("clicks").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
