import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job, User, Proposal } from "@shared/schema";
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Calendar,
  Briefcase,
  ArrowLeft,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = params?.id;
  const { user, isClient, isFreelancer } = useAuth();

  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const { data: client, isLoading: clientLoading } = useQuery<User>({
    queryKey: ["/api/users", job?.clientId],
    enabled: !!job?.clientId,
  });

  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/jobs", jobId, "proposals"],
    enabled: !!jobId && isClient && user?.id === job?.clientId,
  });

  if (jobLoading || clientLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Job not found</h3>
            <Button asChild variant="outline">
              <Link href="/jobs">Back to Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === job.clientId;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/jobs">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Job Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <p className="font-semibold">${job.budget}</p>
                  <p className="text-xs text-muted-foreground">{job.budgetType}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Proposals</span>
                  </div>
                  <p className="font-semibold">{job.proposalCount}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Posted</span>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {isFreelancer && job.status === "open" && (
                <Button asChild className="w-full" data-testid="button-submit-proposal">
                  <Link href={`/jobs/${job.id}/proposal`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </Link>
                </Button>
              )}

              {isOwner && (
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1" data-testid="button-edit-job">
                    <Link href={`/jobs/${job.id}/edit`}>Edit Job</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isOwner && proposals && (
            <Card>
              <CardHeader>
                <CardTitle>Proposals ({proposals.length})</CardTitle>
                <CardDescription>Review submissions from freelancers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {proposalsLoading ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)
                ) : proposals.length > 0 ? (
                  proposals.map((proposal) => (
                    <Card key={proposal.id} data-testid={`proposal-${proposal.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Freelancer</p>
                              <Badge variant={proposal.status === "accepted" ? "default" : proposal.status === "rejected" ? "destructive" : "secondary"}>
                                {proposal.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${proposal.proposedRate}</p>
                            <p className="text-sm text-muted-foreground">{proposal.deliveryTime} days</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{proposal.coverLetter}</p>
                        {proposal.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" data-testid={`button-accept-${proposal.id}`}>Accept</Button>
                            <Button size="sm" variant="outline" data-testid={`button-reject-${proposal.id}`}>Reject</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No proposals yet</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={client?.avatar} />
                  <AvatarFallback>{client?.name?.charAt(0) || "C"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client?.name || "Client"}</p>
                  <p className="text-sm text-muted-foreground">{client?.email}</p>
                </div>
              </div>
              {client?.location && (
                <p className="text-sm text-muted-foreground">{client.location}</p>
              )}
              {!isOwner && (
                <Button asChild variant="outline" className="w-full mt-4" data-testid="button-message-client">
                  <Link href={`/messages?user=${job.clientId}`}>
                    Message Client
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={job.status === "open" ? "default" : "secondary"}>
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Proposals</span>
                <span className="font-medium">{job.proposalCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
