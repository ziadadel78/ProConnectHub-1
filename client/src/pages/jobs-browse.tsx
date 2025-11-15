import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@shared/schema";
import { Search, DollarSign, Clock, FileText, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function JobsBrowse() {
  const { isClient } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [budgetType, setBudgetType] = useState("all");

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const categories = ["all", "Web Development", "Mobile Development", "Design", "Writing", "Marketing", "Other"];

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                         job.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || job.category === category;
    const matchesBudget = budgetType === "all" || job.budgetType === budgetType;
    return matchesSearch && matchesCategory && matchesBudget;
  }) || [];

  const getStatusColor = (status: string) => {
    if (status === "open") return "default";
    if (status === "in_progress") return "secondary";
    return "outline";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isClient ? "Browse Freelancers" : "Browse Jobs"}
          </h1>
          <p className="text-muted-foreground">
            {isClient ? "Find the perfect talent for your project" : "Find your next opportunity"}
          </p>
        </div>
        {isClient && (
          <Button asChild data-testid="button-post-job">
            <Link href="/jobs/create">
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Budget Type</label>
              <Select value={budgetType} onValueChange={setBudgetType}>
                <SelectTrigger data-testid="select-budget-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover-elevate" data-testid={`job-card-${job.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-2">
                        <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                          {job.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(job.status)} data-testid={`status-${job.id}`}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="outline">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${job.budget} {job.budgetType === "hourly" && "/hr"}
                    </Badge>
                    <Badge variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {job.proposalCount} proposals
                    </Badge>
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button asChild variant="default" data-testid={`button-view-${job.id}`}>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    {!isClient && job.status === "open" && (
                      <Button asChild variant="outline" data-testid={`button-apply-${job.id}`}>
                        <Link href={`/jobs/${job.id}/proposal`}>Apply Now</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
