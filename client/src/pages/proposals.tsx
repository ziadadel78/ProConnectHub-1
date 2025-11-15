import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Proposal } from "@shared/schema";
import { DollarSign, Clock, FileText, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Proposals() {
  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals/my-proposals"],
  });

  const getStatusVariant = (status: string) => {
    if (status === "accepted") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Proposals</h1>
          <p className="text-muted-foreground">Track your submitted job proposals</p>
        </div>
        <Button asChild data-testid="button-browse-jobs">
          <Link href="/jobs">
            <FileText className="w-4 h-4 mr-2" />
            Browse Jobs
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : proposals && proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="hover-elevate" data-testid={`proposal-${proposal.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-2">Proposal for Job</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {proposal.coverLetter}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(proposal.status)} data-testid={`status-${proposal.id}`}>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Rate</span>
                    </div>
                    <p className="font-semibold">${proposal.proposedRate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Delivery</span>
                    </div>
                    <p className="font-semibold">{proposal.deliveryTime} days</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Submitted</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" data-testid={`button-view-${proposal.id}`}>
                  <Link href={`/jobs/${proposal.jobId}`}>View Job</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
            <p className="text-muted-foreground mb-4">Start applying to jobs to grow your freelance career</p>
            <Button asChild data-testid="button-browse-jobs-empty">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
