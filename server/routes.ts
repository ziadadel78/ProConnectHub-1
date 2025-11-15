import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "./types";
import { 
  insertUserSchema, 
  loginSchema,
  insertJobSchema,
  insertProposalSchema,
  insertPortfolioItemSchema,
  insertMessageSchema,
  insertReviewSchema,
  insertCampaignSchema
} from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 10;

// Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      // Verify user is updating their own profile
      if (req.user.id !== req.params.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { password, ...updates } = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/jobs/recent", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs.slice(0, 10));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/jobs", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.json(job);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/jobs/:id", authenticateToken, async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Verify user owns the job
      if (job.clientId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedJob = await storage.updateJob(req.params.id, req.body);
      res.json(updatedJob);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/jobs/:id/proposals", authenticateToken, async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Verify user owns the job
      if (job.clientId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const proposals = await storage.getProposalsByJob(req.params.id);
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Proposal routes
  app.get("/api/proposals/my-proposals", authenticateToken, async (req, res) => {
    try {
      const proposals = await storage.getProposalsByFreelancer(req.user.id);
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/proposals", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(validatedData);
      res.json(proposal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/proposals/:id", authenticateToken, async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      const updatedProposal = await storage.updateProposal(req.params.id, req.body);
      res.json(updatedProposal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const items = await storage.getPortfolioByUser(req.params.userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/portfolio", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/portfolio/:id", authenticateToken, async (req, res) => {
    try {
      const item = await storage.getPortfolioItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }

      // Verify user owns the portfolio item
      if (item.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deletePortfolioItem(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message routes
  app.get("/api/messages/conversations", authenticateToken, async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.user.id);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/messages/:userId", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(req.user.id, req.params.userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/messages", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/messages/:id/read", authenticateToken, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Review routes
  app.get("/api/reviews/:userId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByUser(req.params.userId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Campaign routes
  app.get("/api/campaigns/:userId", authenticateToken, async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUser(req.params.userId);
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/campaigns", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.json(campaign);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/campaigns/:id", authenticateToken, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Verify user owns the campaign
      if (campaign.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedCampaign = await storage.updateCampaign(req.params.id, req.body);
      res.json(updatedCampaign);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard stats routes
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let stats: any = {};

      if (user.role === "freelancer") {
        const proposals = await storage.getProposalsByFreelancer(user.id);
        const acceptedProposals = proposals.filter(p => p.status === "accepted");
        
        stats = {
          activeProposals: proposals.filter(p => p.status === "pending").length,
          completedJobs: acceptedProposals.length,
          totalEarnings: acceptedProposals.reduce((sum, p) => sum + p.proposedRate, 0),
          successRate: proposals.length > 0 
            ? Math.round((acceptedProposals.length / proposals.length) * 100)
            : 0,
        };
      } else if (user.role === "client") {
        const jobs = await storage.getJobsByClient(user.id);
        const allProposals = await Promise.all(
          jobs.map(job => storage.getProposalsByJob(job.id))
        );
        const totalProposals = allProposals.flat();

        stats = {
          activeJobs: jobs.filter(j => j.status === "open").length,
          totalProposals: totalProposals.length,
          completedProjects: jobs.filter(j => j.status === "completed").length,
          totalSpent: jobs.filter(j => j.status === "completed")
            .reduce((sum, j) => sum + j.budget, 0),
        };
      } else if (user.role === "admin") {
        const users = await storage.getAllUsers();
        const jobs = await storage.getAllJobs();

        stats = {
          totalUsers: users.length,
          activeJobs: jobs.filter(j => j.status === "open").length,
          totalTransactions: jobs.filter(j => j.status === "completed")
            .reduce((sum, j) => sum + j.budget, 0),
          growth: 12,
        };
      }

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const jobs = await storage.getAllJobs();

      const stats = {
        totalUsers: users.length,
        activeJobs: jobs.filter(j => j.status === "open").length,
        totalRevenue: jobs.filter(j => j.status === "completed")
          .reduce((sum, j) => sum + j.budget, 0),
        growth: 12,
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
