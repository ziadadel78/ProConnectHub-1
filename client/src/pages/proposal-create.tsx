import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { insertProposalSchema, type InsertProposal, type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProposalCreate() {
  const [, params] = useRoute("/jobs/:id/proposal");
  const jobId = params?.id;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const form = useForm<InsertProposal>({
    resolver: zodResolver(insertProposalSchema),
    defaultValues: {
      jobId: jobId || "",
      freelancerId: user?.id || "",
      coverLetter: "",
      proposedRate: 0,
      deliveryTime: 7,
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: InsertProposal) => {
      return await apiRequest("POST", "/api/proposals", data);
    },
    onSuccess: () => {
      toast({
        title: "Proposal submitted!",
        description: "Your proposal has been sent to the client.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", jobId] });
      setLocation("/proposals");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProposal) => {
    createProposalMutation.mutate({
      ...data,
      jobId: jobId || "",
      freelancerId: user?.id || "",
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium mb-2">Job not found</h3>
            <Button asChild variant="outline">
              <Link href="/jobs">Back to Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href={`/jobs/${jobId}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Submit Proposal</h1>
          <p className="text-muted-foreground">Apply for this opportunity</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.category}</Badge>
            <Badge variant="outline">
              <DollarSign className="w-3 h-3 mr-1" />
              ${job.budget} {job.budgetType === "hourly" && "/hr"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Proposal</CardTitle>
          <CardDescription>Tell the client why you're the best fit for this job</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Introduce yourself and explain why you're perfect for this job..."
                        className="min-h-48"
                        {...field}
                        data-testid="input-cover-letter"
                      />
                    </FormControl>
                    <FormDescription>
                      Highlight your relevant experience and skills (minimum 50 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="proposedRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed Rate ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-proposed-rate"
                        />
                      </FormControl>
                      <FormDescription>
                        Your {job.budgetType === "hourly" ? "hourly rate" : "total price"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="7"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-delivery-time"
                        />
                      </FormControl>
                      <FormDescription>How long to complete this project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={createProposalMutation.isPending}
                  data-testid="button-submit"
                >
                  {createProposalMutation.isPending ? "Submitting..." : "Submit Proposal"}
                </Button>
                <Button type="button" variant="outline" asChild data-testid="button-cancel">
                  <Link href={`/jobs/${jobId}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
