import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StaticPage() {
  const params = useParams();
  const slug = params.slug || "page";

  const getTitle = () => {
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">{getTitle()}</h1>
          
          <div className="prose prose-neutral dark:prose-invert mt-8">
            <p className="text-lg text-muted-foreground">
              This is a placeholder page for {getTitle()}. In a production environment, this page would contain the actual legal or informational content regarding our platform policies and company information.
            </p>
            <p className="text-muted-foreground">
              ProConnect Hub is committed to providing a transparent and secure environment for all freelancers and clients. Please check back later for detailed updates to this section.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProConnect Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
