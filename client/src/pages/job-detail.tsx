import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, User, Proposal } from "@shared/schema";
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Calendar,
  Briefcase,
  ArrowLeft,
  User as UserIcon,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = params?.id;
  const { user, isClient, isFreelancer } = useAuth();
  const { toast } = useToast();

  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const { data: client, isLoading: clientLoading } = useQuery<User>({
    queryKey: ["/api/users", job?.clientId],
    enabled: !!job?.clientId,
  });

  const { data: proposals, isLoading: proposalsLoading } = useQuery<(Proposal & { freelancer: User })[]>({
    queryKey: ["/api/jobs", jobId, "proposals"],
    enabled: !!jobId && isClient && user?.id === job?.clientId,
  });

  const acceptedProposal = proposals?.find(p => p.status === "accepted");

  const { data: hiredFreelancer } = useQuery<User>({
    queryKey: ["/api/users", acceptedProposal?.freelancerId],
    enabled: !!acceptedProposal?.freelancerId,
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ proposalId, status }: { proposalId: string; status: "accepted" | "rejected" }) => {
      const res = await apiRequest("PUT", `/api/proposals/${proposalId}`, { status });
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", jobId] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", jobId, "proposals"] });
      toast({
        title: "Success",
        description: `Proposal has been ${variables.status}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update proposal",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const res = await apiRequest("PUT", `/api/jobs/${jobId}`, { status });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", jobId] });
      toast({
        title: "Success",
        description: "Job status updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job status",
        variant: "destructive",
      });
    },
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
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select 
                      value={job.status} 
                      onValueChange={(value) => updateJobMutation.mutate({ status: value })}
                      disabled={updateJobMutation.isPending}
                    >
                      <SelectTrigger data-testid="select-job-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1" data-testid="button-edit-job">
                      <Link href={`/jobs/${job.id}/edit`}>Edit Job</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isOwner && job.status === "in_progress" && acceptedProposal && (
            <Card className="border-primary border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Active Project Workspace
                </CardTitle>
                <CardDescription>Collaborate with your hired talent to complete this project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarImage src={hiredFreelancer?.avatar || undefined} />
                      <AvatarFallback>{hiredFreelancer?.name?.charAt(0) || "F"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{hiredFreelancer?.name || "Hired Talent"}</p>
                      <p className="text-sm text-muted-foreground">{hiredFreelancer?.title || "Freelancer"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">${acceptedProposal.proposedRate}</p>
                      <p className="text-xs font-medium text-muted-foreground">{acceptedProposal.deliveryTime} days delivery</p>
                    </div>
                    <Button asChild className="w-full shadow-md">
                      <Link href={`/messages?user=${acceptedProposal.freelancerId}`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Talent
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isOwner && job.status === "open" && proposals && (
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
                              {proposal.freelancer?.avatar && <AvatarImage src={proposal.freelancer.avatar} />}
                              <AvatarFallback>{proposal.freelancer?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{proposal.freelancer?.name || "Freelancer"}</p>
                              {proposal.freelancer?.title && (
                                <p className="text-xs text-muted-foreground mb-1">{proposal.freelancer.title}</p>
                              )}
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
                            <Button 
                              size="sm" 
                              onClick={() => updateProposalMutation.mutate({ proposalId: proposal.id, status: "accepted" })}
                              disabled={updateProposalMutation.isPending}
                              data-testid={`button-accept-${proposal.id}`}
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateProposalMutation.mutate({ proposalId: proposal.id, status: "rejected" })}
                              disabled={updateProposalMutation.isPending}
                              data-testid={`button-reject-${proposal.id}`}
                            >
                              Reject
                            </Button>
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
                  <AvatarImage src={client?.avatar || undefined} />
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
