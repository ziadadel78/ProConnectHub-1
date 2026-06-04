import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, or, asc } from "drizzle-orm";
import {
  users,
  jobs,
  proposals,
  portfolioItems,
  messages,
  reviews,
  campaigns,
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type Proposal,
  type InsertProposal,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Campaign,
  type InsertCampaign,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Jobs
  getJob(id: string): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  getJobsByClient(clientId: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;

  // Proposals
  getProposal(id: string): Promise<Proposal | undefined>;
  getProposalsByJob(jobId: string): Promise<Proposal[]>;
  getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Portfolio
  getPortfolioItem(id: string): Promise<PortfolioItem | undefined>;
  getPortfolioByUser(userId: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  deletePortfolioItem(id: string): Promise<boolean>;

  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]>;
  getConversations(userId: string): Promise<any[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message | undefined>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByUser(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Campaigns
  getCampaign(id: string): Promise<Campaign | undefined>;
  getCampaignsByUser(userId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role ?? "freelancer",
      title: insertUser.title ?? null,
      bio: insertUser.bio ?? null,
      hourlyRate: insertUser.hourlyRate ?? null,
      avatar: insertUser.avatar ?? null,
      skills: insertUser.skills ?? [],
      location: insertUser.location ?? null,
      website: insertUser.website ?? null,
      createdAt: new Date(),
    };
    await db.insert(users).values(user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await db.update(users).set(updates).where(eq(users.id, id));
    return this.getUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Jobs
  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getAllJobs(): Promise<Job[]> {
    return db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    return db.select().from(jobs).where(eq(jobs.clientId, clientId)).orderBy(desc(jobs.createdAt));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...insertJob,
      id,
      skills: insertJob.skills ?? [],
      status: insertJob.status ?? "open",
      proposalCount: 0,
      createdAt: new Date(),
    };
    await db.insert(jobs).values(job);
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    await db.update(jobs).set(updates).where(eq(jobs.id, id));
    return this.getJob(id);
  }

  async deleteJob(id: string): Promise<boolean> {
    await db.delete(jobs).where(eq(jobs.id, id));
    return true;
  }

  // Proposals
  async getProposal(id: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async getProposalsByJob(jobId: string): Promise<Proposal[]> {
    return db.select().from(proposals).where(eq(proposals.jobId, jobId)).orderBy(desc(proposals.createdAt));
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    return db.select().from(proposals).where(eq(proposals.freelancerId, freelancerId)).orderBy(desc(proposals.createdAt));
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    await db.insert(proposals).values(proposal);

    // Increment proposal count for the job
    const job = await this.getJob(insertProposal.jobId);
    if (job) {
      await this.updateJob(job.id, { proposalCount: (job.proposalCount || 0) + 1 });
    }

    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    await db.update(proposals).set(updates).where(eq(proposals.id, id));
    return this.getProposal(id);
  }

  // Portfolio
  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async getPortfolioByUser(userId: string): Promise<PortfolioItem[]> {
    return db.select().from(portfolioItems).where(eq(portfolioItems.userId, userId)).orderBy(desc(portfolioItems.createdAt));
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = randomUUID();
    const item: PortfolioItem = {
      ...insertItem,
      id,
      technologies: insertItem.technologies ?? [],
      projectUrl: insertItem.projectUrl ?? null,
      createdAt: new Date(),
    };
    await db.insert(portfolioItems).values(item);
    return item;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    return true;
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    const [msg] = await db.select().from(messages).where(eq(messages.id, id));
    return msg;
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return db.select().from(messages).where(
      or(
        and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
        and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
      )
    ).orderBy(asc(messages.createdAt));
  }

  async getConversations(userId: string): Promise<any[]> {
    const userMessages = await db.select().from(messages).where(
      or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
    );

    const conversationMap = new Map<string, any>();
    const allUsers = await this.getAllUsers();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    for (const msg of userMessages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!conversationMap.has(otherUserId)) {
        const otherUser = userMap.get(otherUserId);
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser?.name || "Unknown",
          userAvatar: otherUser?.avatar,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      const conv = conversationMap.get(otherUserId);
      if (new Date(msg.createdAt) > new Date(conv.lastMessageTime)) {
        conv.lastMessage = msg.content;
        conv.lastMessageTime = msg.createdAt;
      }

      if (!msg.read && msg.receiverId === userId) {
        conv.unreadCount++;
      }
    }

    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      read: false,
      createdAt: new Date(),
    };
    await db.insert(messages).values(message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
    return this.getMessage(id);
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.revieweeId, userId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      comment: insertReview.comment ?? null,
      createdAt: new Date(),
    };
    await db.insert(reviews).values(review);
    return review;
  }

  // Campaigns
  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      status: insertCampaign.status ?? "draft",
      description: insertCampaign.description ?? null,
      targetAudience: insertCampaign.targetAudience ?? null,
      budget: insertCampaign.budget ?? null,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      createdAt: new Date(),
    };
    await db.insert(campaigns).values(campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    await db.update(campaigns).set(updates).where(eq(campaigns.id, id));
    return this.getCampaign(id);
  }
}

export const storage = new DatabaseStorage();
