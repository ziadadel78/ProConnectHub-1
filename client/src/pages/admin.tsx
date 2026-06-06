import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { User, Job } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Admin() {
  const [location] = useLocation();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    activeJobs: number;
    totalRevenue: number;
    growth: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const totalUsers = users?.length || 0;
  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter((j) => j.status === "open").length || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  if (location === "/admin/users") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users Management</h1>
          <p className="text-muted-foreground">View and manage platform members</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A complete list of registered users on ProConnect Hub.</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : user.role === "freelancer" ? "outline" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (location === "/admin/jobs") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Jobs Management</h1>
          <p className="text-muted-foreground">View and manage all platform jobs</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>A complete list of jobs posted by clients.</CardDescription>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Proposals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs?.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.category}</TableCell>
                      <TableCell>${job.budget} <span className="text-xs text-muted-foreground capitalize">({job.budgetType})</span></TableCell>
                      <TableCell>
                        <Badge variant={job.status === "open" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.proposalCount}</TableCell>
                    </TableRow>
                  ))}
                  {jobs?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default Admin Dashboard or /admin/analytics
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {location === "/admin/analytics" ? "Platform Analytics" : "Admin Dashboard"}
        </h1>
        <p className="text-muted-foreground">Platform overview and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-total-users">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered members</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-total-jobs">{totalJobs}</div>
                <p className="text-xs text-muted-foreground">{activeJobs} currently active</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-revenue">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Platform earnings</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-growth">+{stats?.growth || 12}%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest platform registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usersLoading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)
            ) : users && users.length > 0 ? (
              users.slice(0, 10).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-md border border-border" data-testid={`user-${user.id}`}>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No users found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobsLoading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)
            ) : jobs && jobs.length > 0 ? (
              jobs.slice(0, 10).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-md border border-border" data-testid={`job-${job.id}`}>
                  <div className="flex-1">
                    <p className="font-medium">{job.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">${job.budget}</Badge>
                      <span className="text-xs text-muted-foreground">{job.proposalCount} proposals</span>
                    </div>
                  </div>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No jobs found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
