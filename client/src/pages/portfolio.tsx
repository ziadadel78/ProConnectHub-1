import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioItem } from "@shared/schema";
import { Plus, ExternalLink, FolderOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Portfolio() {
  const { user } = useAuth();
  
  const { data: portfolioItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio", user?.id],
    enabled: !!user?.id,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Showcase your best work to attract clients</p>
        </div>
        <Button asChild data-testid="button-add-project">
          <Link href="/portfolio/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : portfolioItems && portfolioItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-elevate" data-testid={`portfolio-${item.id}`}>
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.projectUrl && (
                  <Button asChild variant="outline" size="sm" className="w-full" data-testid={`button-view-${item.id}`}>
                    <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No portfolio items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your portfolio to showcase your skills and attract clients
            </p>
            <Button asChild data-testid="button-add-project-empty">
              <Link href="/portfolio/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
