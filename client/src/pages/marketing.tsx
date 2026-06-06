import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Campaign } from "@shared/schema";
import { TrendingUp, Eye, MousePointerClick, Target, Plus, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Marketing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", description: "", targetAudience: "", budget: "" });

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns", user?.id],
    enabled: !!user?.id,
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PUT", `/api/campaigns/${id}`, { status });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", user?.id] });
      toast({ title: "Success", description: "Campaign updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update campaign.", variant: "destructive" });
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: any) => {
      const res = await apiRequest("POST", "/api/campaigns", campaign);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", user?.id] });
      setIsCreateOpen(false);
      setNewCampaign({ name: "", description: "", targetAudience: "", budget: "" });
      toast({ title: "Success", description: "Campaign created successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create campaign.", variant: "destructive" });
    },
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name) {
      toast({ title: "Error", description: "Campaign name is required.", variant: "destructive" });
      return;
    }
    createCampaignMutation.mutate({
      name: newCampaign.name,
      description: newCampaign.description,
      targetAudience: newCampaign.targetAudience,
      budget: newCampaign.budget ? parseInt(newCampaign.budget) : 0,
      status: "active"
    });
  };

  const getStatusVariant = (status: string) => {
    if (status === "active") return "default";
    if (status === "paused") return "secondary";
    if (status === "completed") return "outline";
    return "secondary";
  };

  const totalImpressions = campaigns?.reduce((sum, c) => sum + c.impressions, 0) || 0;
  const totalClicks = campaigns?.reduce((sum, c) => sum + c.clicks, 0) || 0;
  const totalConversions = campaigns?.reduce((sum, c) => sum + c.conversions, 0) || 0;
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Marketing Tools</h1>
          <p className="text-muted-foreground">Manage your campaigns and track performance</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-campaign">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Setup a new marketing campaign to reach your target audience.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" placeholder="e.g. Summer Promo" value={newCampaign.name} onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="What is this campaign about?" value={newCampaign.description} onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input id="audience" placeholder="e.g. Startups" value={newCampaign.targetAudience} onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="500" value={newCampaign.budget} onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCampaign} disabled={createCampaignMutation.isPending}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-impressions">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-clicks">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Campaign engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-conversions">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">Campaign goals met</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-ctr">{avgCTR}%</div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Campaigns</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover-elevate" data-testid={`campaign-${campaign.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{campaign.name}</CardTitle>
                      <CardDescription>{campaign.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(campaign.status)} data-testid={`status-${campaign.id}`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Impressions</p>
                      <p className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Clicks</p>
                      <p className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                      <p className="text-lg font-semibold">{campaign.conversions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget</p>
                      <p className="text-lg font-semibold">${campaign.budget || 0}</p>
                    </div>
                  </div>
                  {campaign.targetAudience && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
                      <p className="text-sm">{campaign.targetAudience}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-view-${campaign.id}`}>
                      View Details
                    </Button>
                    {campaign.status === "active" && (
                      <Button variant="outline" size="sm" data-testid={`button-pause-${campaign.id}`} onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: "paused" })} disabled={updateCampaignMutation.isPending}>
                        Pause
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm" data-testid={`button-resume-${campaign.id}`} onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: "active" })} disabled={updateCampaignMutation.isPending}>
                        Resume
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
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first marketing campaign to reach more clients
              </p>
              <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-campaign-empty">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
