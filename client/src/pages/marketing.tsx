import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Campaign } from "@shared/schema";
import { TrendingUp, Eye, MousePointerClick, Target, Plus, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Marketing() {
  const { user } = useAuth();

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns", user?.id],
    enabled: !!user?.id,
  });

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
        <Button asChild data-testid="button-create-campaign">
          <Link href="/marketing/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
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
                      <Button variant="outline" size="sm" data-testid={`button-pause-${campaign.id}`}>
                        Pause
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm" data-testid={`button-resume-${campaign.id}`}>
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
              <Button asChild data-testid="button-create-campaign-empty">
                <Link href="/marketing/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
