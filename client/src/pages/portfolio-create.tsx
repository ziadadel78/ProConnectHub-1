import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { insertPortfolioItemSchema, type InsertPortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";
import webDesignImage from "@assets/generated_images/Portfolio_project_web_design_7cdeb174.png";
import mobileAppImage from "@assets/generated_images/Portfolio_project_mobile_app_67c9e5b6.png";
import graphicDesignImage from "@assets/generated_images/Portfolio_project_graphic_design_7813c80c.png";

export default function PortfolioCreate() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const placeholderImages = [webDesignImage, mobileAppImage, graphicDesignImage];

  const form = useForm<InsertPortfolioItem>({
    resolver: zodResolver(insertPortfolioItemSchema),
    defaultValues: {
      userId: user?.id || "",
      title: "",
      description: "",
      imageUrl: placeholderImages[0],
      technologies: [],
      projectUrl: "",
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: InsertPortfolioItem) => {
      return await apiRequest("POST", "/api/portfolio", data);
    },
    onSuccess: () => {
      toast({
        title: "Project added!",
        description: "Your portfolio item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setLocation("/portfolio");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPortfolioItem) => {
    const technologies = data.technologies as any;
    const techArray = typeof technologies === "string" 
      ? technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : (technologies || []);

    createPortfolioMutation.mutate({
      ...data,
      userId: user?.id || "",
      technologies: techArray,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/portfolio">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Portfolio Project</h1>
          <p className="text-muted-foreground">Showcase your work to potential clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Add information about your project</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E-commerce Website Redesign" 
                        {...field} 
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project, challenges solved, and results achieved..."
                        className="min-h-32"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          data-testid="input-image-url"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          {placeholderImages.map((img, idx) => (
                            <div
                              key={idx}
                              className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                                field.value === img ? "border-primary" : "border-border"
                              }`}
                              onClick={() => field.onChange(img)}
                            >
                              <img src={img} alt={`Template ${idx + 1}`} className="w-full aspect-[4/3] object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a URL or select a template image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="React, Node.js, MongoDB" 
                        value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        data-testid="input-technologies"
                      />
                    </FormControl>
                    <FormDescription>Comma-separated list of technologies used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        value={field.value || ""}
                        data-testid="input-project-url"
                      />
                    </FormControl>
                    <FormDescription>Link to live project or case study</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={createPortfolioMutation.isPending}
                  data-testid="button-submit"
                >
                  {createPortfolioMutation.isPending ? "Adding..." : "Add to Portfolio"}
                </Button>
                <Button type="button" variant="outline" asChild data-testid="button-cancel">
                  <Link href="/portfolio">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
