import { randomUUID } from "crypto";
import {
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private proposals: Map<string, Proposal>;
  private portfolioItems: Map<string, PortfolioItem>;
  private messages: Map<string, Message>;
  private reviews: Map<string, Review>;
  private campaigns: Map<string, Campaign>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.proposals = new Map();
    this.portfolioItems = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.campaigns = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      title: null,
      bio: null,
      hourlyRate: null,
      avatar: null,
      skills: [],
      location: null,
      website: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Jobs
  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter((job) => job.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...insertJob,
      id,
      proposalCount: 0,
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  // Proposals
  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async getProposalsByJob(jobId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter((proposal) => proposal.jobId === jobId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter((proposal) => proposal.freelancerId === freelancerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.proposals.set(id, proposal);

    // Increment proposal count for the job
    const job = this.jobs.get(insertProposal.jobId);
    if (job) {
      job.proposalCount = (job.proposalCount || 0) + 1;
      this.jobs.set(job.id, job);
    }

    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    const updatedProposal = { ...proposal, ...updates };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Portfolio
  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }

  async getPortfolioByUser(userId: string): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = randomUUID();
    const item: PortfolioItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.portfolioItems.set(id, item);
    return item;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(
        (msg) =>
          (msg.senderId === user1Id && msg.receiverId === user2Id) ||
          (msg.senderId === user2Id && msg.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async getConversations(userId: string): Promise<any[]> {
    const userMessages = Array.from(this.messages.values()).filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId
    );

    const conversationMap = new Map<string, any>();

    for (const msg of userMessages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!conversationMap.has(otherUserId)) {
        const otherUser = this.users.get(otherUserId);
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
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    message.read = true;
    this.messages.set(id, message);
    return message;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.revieweeId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  // Campaigns
  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaignsByUser(userId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter((campaign) => campaign.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
}

export const storage = new MemStorage();
