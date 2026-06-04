import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Clock,
  CheckCircle,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Job, Proposal } from "@shared/schema";

export default function Dashboard() {
  const { user, isFreelancer, isClient, isAdmin } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentJobs, isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs/recent"],
  });

  const { data: recentProposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: isFreelancer ? ["/api/proposals/my-proposals"] : [],
    enabled: isFreelancer,
  });

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = isFreelancer
    ? [
        {
          title: "Active Proposals",
          value: stats?.activeProposals || 0,
          icon: FileText,
          description: "Pending responses",
        },
        {
          title: "Completed Jobs",
          value: stats?.completedJobs || 0,
          icon: CheckCircle,
          description: "Successfully delivered",
        },
        {
          title: "Total Earnings",
          value: `$${stats?.totalEarnings || 0}`,
          icon: DollarSign,
          description: "Lifetime earnings",
        },
        {
          title: "Success Rate",
          value: `${stats?.successRate || 0}%`,
          icon: TrendingUp,
          description: "Accepted proposals",
        },
      ]
    : isClient
    ? [
        {
          title: "Active Jobs",
          value: stats?.activeJobs || 0,
          icon: Briefcase,
          description: "Currently hiring",
        },
        {
          title: "Total Proposals",
          value: stats?.totalProposals || 0,
          icon: FileText,
          description: "Received",
        },
        {
          title: "Completed Projects",
          value: stats?.completedProjects || 0,
          icon: CheckCircle,
          description: "Successfully finished",
        },
        {
          title: "Total Spent",
          value: `$${stats?.totalSpent || 0}`,
          icon: DollarSign,
          description: "On projects",
        },
      ]
    : [
        {
          title: "Total Users",
          value: stats?.totalUsers || 0,
          icon: Users,
          description: "Platform members",
        },
        {
          title: "Active Jobs",
          value: stats?.activeJobs || 0,
          icon: Briefcase,
          description: "Currently open",
        },
        {
          title: "Total Transactions",
          value: `$${stats?.totalTransactions || 0}`,
          icon: DollarSign,
          description: "Platform volume",
        },
        {
          title: "Platform Growth",
          value: `${stats?.growth || 0}%`,
          icon: TrendingUp,
          description: "This month",
        },
      ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            {isFreelancer && "Here's your freelance activity overview"}
            {isClient && "Manage your jobs and find talent"}
            {isAdmin && "Platform analytics and management"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isFreelancer && (
            <Button asChild data-testid="button-browse-jobs">
              <Link href="/jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
            </Button>
          )}
          {isClient && (
            <Button asChild data-testid="button-post-job">
              <Link href="/jobs/create">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest opportunities on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobsLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)
            ) : recentJobs && recentJobs.length > 0 ? (
              recentJobs.slice(0, 5).map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="flex items-start justify-between p-4 rounded-md border border-border hover-elevate active-elevate-2 cursor-pointer" data-testid={`job-${job.id}`}>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{job.budgetType === "fixed" ? "Fixed Price" : "Hourly"}</Badge>
                        <Badge variant="outline">${job.budget}</Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No jobs available</p>
            )}
            {recentJobs && recentJobs.length > 0 && (
              <Button variant="outline" asChild className="w-full" data-testid="button-view-all-jobs">
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {isFreelancer && (
          <Card>
            <CardHeader>
              <CardTitle>My Proposals</CardTitle>
              <CardDescription>Track your submitted proposals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposalsLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)
              ) : recentProposals && recentProposals.length > 0 ? (
                recentProposals.slice(0, 5).map((proposal) => (
                  <div key={proposal.id} className="p-4 rounded-md border border-border" data-testid={`proposal-${proposal.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">Proposal</p>
                      <Badge variant={proposal.status === "accepted" ? "default" : proposal.status === "rejected" ? "destructive" : "secondary"}>
                        {proposal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{proposal.coverLetter}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      ${proposal.proposedRate}
                      <Clock className="w-3 h-3 ml-2" />
                      {proposal.deliveryTime} days
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No proposals yet</p>
              )}
              {recentProposals && recentProposals.length > 0 && (
                <Button variant="outline" asChild className="w-full" data-testid="button-view-all-proposals">
                  <Link href="/proposals">View All Proposals</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {isClient && (
          <Card>
            <CardHeader>
              <CardTitle>My Jobs</CardTitle>
              <CardDescription>Manage your posted jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobsLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)
              ) : recentJobs && recentJobs.length > 0 ? (
                recentJobs.slice(0, 5).map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="p-4 rounded-md border border-border hover-elevate active-elevate-2 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{job.title}</p>
                        <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>${job.budget}</span>
                        <span>{job.proposalCount} proposals</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No jobs posted yet</p>
              )}
              <Button asChild className="w-full" data-testid="button-post-job-card">
                <Link href="/jobs/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
