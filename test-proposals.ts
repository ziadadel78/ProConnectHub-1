import { db } from "./server/db";
import { proposals, users } from "./shared/schema";
import { eq, desc } from "drizzle-orm";

async function testQuery() {
  const allProps = await db.select().from(proposals).limit(1);
  if (allProps.length === 0) {
    console.log("No proposals found in DB.");
    process.exit(0);
  }
  
  const jobId = allProps[0].jobId;
  console.log("Testing job:", jobId);

  const results = await db
    .select({
      proposal: proposals,
      freelancer: users,
    })
    .from(proposals)
    .leftJoin(users, eq(proposals.freelancerId, users.id))
    .where(eq(proposals.jobId, jobId))
    .orderBy(desc(proposals.createdAt));

  console.log("Results from DB JOIN:");
  console.log(JSON.stringify(results[0], null, 2));
  process.exit(0);
}

testQuery().catch(console.error);
