import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Star, 
  Shield, 
  Zap,
  ArrowRight,
  FolderOpen
} from "lucide-react";
import heroImage from "@assets/generated_images/Hero_image_freelancers_collaborating_263d42b1.png";

export default function Landing() {
  const features = [
    {
      icon: Briefcase,
      title: "Job Marketplace",
      description: "Post jobs or browse thousands of opportunities across all skill levels and categories."
    },
    {
      icon: FolderOpen,
      title: "Portfolio Showcase",
      description: "Build your professional portfolio and showcase your best work to attract clients."
    },
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description: "Connect instantly with clients and freelancers through our integrated messaging system."
    },
    {
      icon: TrendingUp,
      title: "Marketing Tools",
      description: "Grow your business with built-in analytics, campaigns, and promotional tools."
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Build trust through verified reviews and ratings from completed projects."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Freelancers" },
    { value: "5K+", label: "Jobs Posted" },
    { value: "$2M+", label: "Earned" },
    { value: "4.8", label: "Avg Rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">PC</span>
              </div>
              <span className="font-semibold text-xl">ProConnect Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" asChild data-testid="button-login-nav">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild data-testid="button-register-nav">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary-foreground backdrop-blur-sm border-primary/30">
              <Zap className="w-3 h-3 mr-1" />
              #1 Freelance Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Connect With Top Talent & Opportunities
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Join thousands of freelancers and clients building successful partnerships on ProConnect Hub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground" data-testid="button-join-freelancer">
                <Link href="/register?role=freelancer">
                  Join as Freelancer
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
                data-testid="button-join-client"
              >
                <Link href="/register?role=client">
                  Post a Job
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed to help freelancers and clients connect, collaborate, and grow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join ProConnect Hub today and start building meaningful professional connections.
          </p>
          <Button size="lg" variant="outline" asChild className="bg-primary-foreground text-primary border-primary-foreground" data-testid="button-get-started-footer">
            <Link href="/register">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-xs">PC</span>
              </div>
              <span className="font-medium">ProConnect Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ProConnect Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
