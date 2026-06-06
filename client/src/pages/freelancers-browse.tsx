import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";
import { Search, DollarSign, MapPin, MessageSquare } from "lucide-react";

export default function FreelancersBrowse() {
  const [search, setSearch] = useState("");

  const { data: freelancers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/freelancers"],
  });

  const filteredFreelancers = freelancers?.filter((freelancer) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      freelancer.name.toLowerCase().includes(searchLower) || 
      (freelancer.title && freelancer.title.toLowerCase().includes(searchLower)) ||
      (freelancer.skills && freelancer.skills.some(s => s.toLowerCase().includes(searchLower)));
    return matchesSearch;
  }) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Freelancers</h1>
          <p className="text-muted-foreground">Find the perfect talent for your next project</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Talent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-freelancers"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {filteredFreelancers.length} {filteredFreelancers.length === 1 ? "Freelancer" : "Freelancers"} Found
        </h2>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredFreelancers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover-elevate flex flex-col" data-testid={`freelancer-card-${freelancer.id}`}>
                <CardHeader className="flex flex-row gap-4 items-start pb-2">
                  <Avatar className="w-16 h-16 border-2 border-primary/10">
                    <AvatarImage src={freelancer.avatar || undefined} />
                    <AvatarFallback className="text-xl">{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{freelancer.name}</CardTitle>
                    <CardDescription className="line-clamp-1 text-primary font-medium">
                      {freelancer.title || "Freelancer"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {freelancer.hourlyRate && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-medium text-foreground">${freelancer.hourlyRate}/hr</span>
                      </div>
                    )}
                    {freelancer.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">{freelancer.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm line-clamp-3 mb-4 flex-1">
                    {freelancer.bio || "No biography provided."}
                  </p>

                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {freelancer.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{freelancer.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button asChild className="w-full mt-auto" variant="outline" data-testid={`button-message-freelancer-${freelancer.id}`}>
                    <Link href={`/messages?user=${freelancer.id}`}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Talent
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No freelancers found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
