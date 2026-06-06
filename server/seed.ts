import { db } from "./db";
import { users, jobs, proposals, messages, portfolioItems, reviews, campaigns } from "../shared/schema";
import { hash } from "bcrypt";
import crypto from "crypto";
import * as xlsx from "xlsx";
import path from "path";

const seedDatabase = async () => {
  console.log("Starting MASSIVE comprehensive seed process...");

  const getRandomDateInLast6Months = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  console.log("Wiping existing data...");
  await db.delete(reviews);
  await db.delete(portfolioItems);
  await db.delete(campaigns);
  await db.delete(messages);
  await db.delete(proposals);
  await db.delete(jobs);
  await db.delete(users);

  const defaultPassword = "password123";
  const hashedPassword = await hash(defaultPassword, 10);

  // Data pools
  const arabicFirstNamesM = ["Ahmed", "Omar", "Youssef", "Ali", "Hassan", "Mahmoud", "Tariq", "Ziad", "Karim", "Mostafa", "Ibrahim", "Khaled", "Amr", "Hussein", "Saeed"];
  const arabicFirstNamesF = ["Aisha", "Fatima", "Nour", "Mariam", "Salma", "Hoda", "Layla", "Mona", "Yasmin", "Hana", "Dina", "Nadia", "Sarah"];
  const arabicLastNames = ["Ali", "Hassan", "Mahmoud", "Ibrahim", "Nabil", "Tawfiq", "Saad", "Mansour", "Fawzy", "Kamal", "Zaki", "Osman", "Salem", "Fadel"];
  const locations = ["Cairo, Egypt", "Dubai, UAE", "Riyadh, Saudi Arabia", "Amman, Jordan", "Casablanca, Morocco", "Doha, Qatar", "Kuwait City, Kuwait"];
  
  const freelancerTitles = ["Senior Full-Stack Developer", "UI/UX Designer", "Mobile App Developer", "Frontend Engineer", "Backend Specialist", "DevOps Engineer", "Graphic Designer", "Product Designer", "Data Scientist", "Cloud Architect"];
  const clientTitles = ["Startup Founder", "Product Manager", "CTO", "CEO", "Marketing Director", "Project Manager", "Operations Head", "Technical Lead"];
  
  const techSkills = ["React", "Node.js", "TypeScript", "Next.js", "Python", "Django", "Figma", "UI/UX", "Flutter", "React Native", "iOS", "Android", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "Tailwind CSS"];
  const jobCategories = ["Web Development", "Mobile Development", "Design", "Data Science", "DevOps", "Marketing"];

  const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomItems = <T>(arr: T[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateName = () => {
    const isMale = Math.random() > 0.4;
    const first = isMale ? randomItem(arabicFirstNamesM) : randomItem(arabicFirstNamesF);
    const last = randomItem(arabicLastNames);
    return { name: `${first} ${last}`, isMale };
  };

  console.log("Generating Users...");
  const mockUsers: any[] = [];
  
  // 1. Admin
  mockUsers.push({
    id: crypto.randomUUID(),
    name: "System Admin",
    email: "admin@proconnect.com",
    password: hashedPassword,
    role: "admin",
    title: "Administrator",
    skills: [],
    createdAt: getRandomDateInLast6Months()
  });

  const freelancers: any[] = [];
  const clients: any[] = [];

  // Generate 30 Freelancers
  for (let i = 1; i <= 30; i++) {
    const { name } = generateName();
    const id = crypto.randomUUID();
    const user = {
      id,
      name,
      email: `freelancer${i}@proconnect.com`,
      password: hashedPassword,
      role: "freelancer",
      title: randomItem(freelancerTitles),
      bio: `Professional ${randomItem(freelancerTitles).toLowerCase()} with years of experience delivering high-quality work to clients globally.`,
      hourlyRate: randomInt(20, 150),
      skills: randomItems(techSkills, randomInt(3, 7)),
      location: randomItem(locations),
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      createdAt: getRandomDateInLast6Months()
    };
    mockUsers.push(user);
    freelancers.push(user);
  }

  // Generate 20 Clients
  for (let i = 1; i <= 20; i++) {
    const { name } = generateName();
    const id = crypto.randomUUID();
    const user = {
      id,
      name,
      email: `client${i}@proconnect.com`,
      password: hashedPassword,
      role: "client",
      title: randomItem(clientTitles),
      bio: "Looking for top-tier talent to help scale our operations and build innovative products.",
      hourlyRate: null,
      skills: [],
      location: randomItem(locations),
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      createdAt: getRandomDateInLast6Months()
    };
    mockUsers.push(user);
    clients.push(user);
  }

  await db.insert(users).values(mockUsers);

  console.log("Generating Jobs...");
  const mockJobs: any[] = [];
  
  // Generate 80 Jobs
  for (let i = 1; i <= 80; i++) {
    const client = randomItem(clients);
    const category = randomItem(jobCategories);
    const statusRand = Math.random();
    let status = "open";
    if (statusRand > 0.5) status = "in_progress";
    if (statusRand > 0.8) status = "completed";
    if (statusRand > 0.95) status = "cancelled";

    mockJobs.push({
      id: crypto.randomUUID(),
      clientId: client.id,
      title: `Build a ${category} Solution for our Company`,
      description: `We are a growing company looking for an expert in ${category}. The ideal candidate will have strong experience and be able to deliver within the timeline. Please provide examples of past work in your proposal.`,
      budget: randomInt(100, 10000),
      budgetType: Math.random() > 0.3 ? "fixed" : "hourly",
      category,
      skills: randomItems(techSkills, randomInt(2, 5)),
      status,
      proposalCount: 0,
      createdAt: getRandomDateInLast6Months()
    });
  }

  console.log("Generating Proposals...");
  const mockProposals: any[] = [];
  
  for (const job of mockJobs) {
    if (job.status === "cancelled") continue;

    const numProposals = job.status === "open" ? randomInt(0, 10) : randomInt(3, 10);
    job.proposalCount = numProposals;
    
    let hasAccepted = false;
    const shuffledFreelancers = [...freelancers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numProposals; i++) {
      const freelancer = shuffledFreelancers[i];
      let pStatus = "pending";
      
      if ((job.status === "in_progress" || job.status === "completed") && !hasAccepted) {
        pStatus = "accepted";
        hasAccepted = true;
      } else if (job.status === "in_progress" || job.status === "completed") {
        pStatus = "rejected";
      } else if (job.status === "open" && Math.random() > 0.8) {
        pStatus = "rejected";
      }

      mockProposals.push({
        id: crypto.randomUUID(),
        jobId: job.id,
        freelancerId: freelancer.id,
        coverLetter: `Hi, I am very interested in your ${job.category} project. I have extensive experience in this field and can deliver high-quality results. I have attached my portfolio for your review. Let's discuss further!`,
        proposedRate: job.budgetType === "fixed" ? randomInt(job.budget * 0.8, job.budget * 1.2) : randomInt(30, 100),
        deliveryTime: randomInt(7, 90),
        status: pStatus,
        createdAt: getRandomDateInLast6Months()
      });
    }
  }

  await db.insert(jobs).values(mockJobs);
  // Insert proposals in chunks to avoid SQLite variable limits (999)
  const chunkSize = 100;
  for (let i = 0; i < mockProposals.length; i += chunkSize) {
    await db.insert(proposals).values(mockProposals.slice(i, i + chunkSize));
  }

  console.log("Generating Messages & Reviews...");
  const mockMessages: any[] = [];
  const mockReviews: any[] = [];
  const mockPortfolios: any[] = [];

  // Messages and Reviews for accepted proposals
  const acceptedProposals = mockProposals.filter(p => p.status === "accepted");
  for (const ap of acceptedProposals) {
    const job = mockJobs.find(j => j.id === ap.jobId);
    
    mockMessages.push({
      id: crypto.randomUUID(),
      senderId: job.clientId,
      receiverId: ap.freelancerId,
      content: "Hello! Glad to have you onboard for this project. When can we have our kickoff meeting?",
      read: true,
      createdAt: getRandomDateInLast6Months()
    });
    mockMessages.push({
      id: crypto.randomUUID(),
      senderId: ap.freelancerId,
      receiverId: job.clientId,
      content: "Hi! Thanks for the opportunity. I can start immediately. I'll send over the initial plan.",
      read: true,
      createdAt: getRandomDateInLast6Months()
    });

    if (job.status === "completed") {
      mockReviews.push({
        id: crypto.randomUUID(),
        jobId: job.id,
        reviewerId: job.clientId,
        revieweeId: ap.freelancerId,
        rating: randomInt(4, 5), // Only generating good reviews for positivity!
        comment: "Excellent work, delivered on time and exceeded expectations. Will definitely hire again!",
        createdAt: getRandomDateInLast6Months()
      });
    }
  }

  // Portfolio items for freelancers
  for (const f of freelancers) {
    const numItems = randomInt(1, 4);
    for (let i = 0; i < numItems; i++) {
      mockPortfolios.push({
        id: crypto.randomUUID(),
        userId: f.id,
        title: `Project Success: ${f.title}`,
        description: "A successful project implementation demonstrating my core skills and dedication to quality.",
        imageUrl: randomItem(["/portfolio-web.png", "/portfolio-mobile.png", "/portfolio-design.png"]),
        technologies: randomItems(techSkills, 3),
        projectUrl: "https://example.com",
        createdAt: getRandomDateInLast6Months()
      });
    }
  }

  // Marketing campaigns for users
  console.log("Generating Marketing Campaigns...");
  const mockCampaigns: any[] = [];
  const campaignTopics = ["Web Design Services", "Full-Stack Development", "SEO Optimization", "Mobile App Launch", "Brand Identity Makeover", "E-commerce Migration", "Social Media Management"];
  
  for (const user of mockUsers) {
    // Both clients and freelancers can have campaigns
    if (Math.random() > 0.5) {
      const numCampaigns = randomInt(1, 3);
      for (let i = 0; i < numCampaigns; i++) {
        const impressions = randomInt(500, 50000);
        const clicks = Math.floor(impressions * (randomInt(10, 100) / 1000)); // 1-10% CTR
        const conversions = Math.floor(clicks * (randomInt(1, 10) / 100)); // 1-10% conversion rate
        
        mockCampaigns.push({
          id: crypto.randomUUID(),
          userId: user.id,
          name: randomItem(campaignTopics),
          description: `Promotional campaign targeting highly qualified leads for ${user.role} services.`,
          status: randomItem(["active", "paused", "completed", "draft"]),
          targetAudience: randomItem(["Startups", "Enterprise", "Small Businesses", "Tech Companies", "Agencies"]),
          budget: randomInt(50, 5000),
          impressions,
          clicks,
          conversions,
          createdAt: getRandomDateInLast6Months()
        });
      }
    }
  }

  // Insert messages, reviews, portfolios, campaigns in chunks
  for (let i = 0; i < mockMessages.length; i += chunkSize) {
    await db.insert(messages).values(mockMessages.slice(i, i + chunkSize));
  }
  for (let i = 0; i < mockReviews.length; i += chunkSize) {
    await db.insert(reviews).values(mockReviews.slice(i, i + chunkSize));
  }
  for (let i = 0; i < mockPortfolios.length; i += chunkSize) {
    await db.insert(portfolioItems).values(mockPortfolios.slice(i, i + chunkSize));
  }
  for (let i = 0; i < mockCampaigns.length; i += chunkSize) {
    await db.insert(campaigns).values(mockCampaigns.slice(i, i + chunkSize));
  }

  console.log("Generating multi-sheet Excel file...");
  try {
    const workbook = xlsx.utils.book_new();

    const usersSheetData = mockUsers.map(u => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      "Raw Password": defaultPassword,
      Title: u.title,
      Location: u.location,
      "Hourly Rate ($)": u.hourlyRate || "N/A"
    }));
    xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(usersSheetData), "Users");

    const jobsSheetData = mockJobs.map(j => ({
      Title: j.title,
      Category: j.category,
      Budget: `$${j.budget} (${j.budgetType})`,
      Status: j.status,
      "Required Skills": j.skills.join(", "),
      "Total Proposals": j.proposalCount
    }));
    xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(jobsSheetData), "Jobs");

    const outputPath = path.join(process.cwd(), "seeded_data.xlsx");
    xlsx.writeFile(workbook, outputPath);
    console.log(`Excel file created at: ${outputPath}`);
  } catch (err: any) {
    console.error("Could not write Excel file. Make sure it is not open in another program.");
    console.error(err.message);
  }

  console.log("MASSIVE Seeding complete!");
  process.exit(0);
};

seedDatabase().catch(console.error);
