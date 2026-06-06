import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MessageSquare, 
  TrendingUp, 
  Star, 
  Shield, 
  Zap,
  ArrowRight,
  FolderOpen,
  CheckCircle,
  Code,
  Smartphone,
  PenTool
} from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();

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

  const portfolios = [
    { image: "/portfolio-web.png", title: "Web Development", category: "Full-Stack & Frontend", icon: Code },
    { image: "/portfolio-mobile.png", title: "Mobile Apps", category: "iOS & Android", icon: Smartphone },
    { image: "/portfolio-design.png", title: "Brand Identity", category: "UI/UX & Graphics", icon: PenTool }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  const itemAnim = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-primary-foreground font-bold text-sm tracking-tighter">PC</span>
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">ProConnect Hub</span>
              </div>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageToggle />
              <ThemeToggle />
              <Button variant="ghost" asChild className="hidden md:flex font-medium" data-testid="button-login-nav">
                <Link href="/login">{t("auth.login")}</Link>
              </Button>
              <Button asChild className="font-medium shadow-md hover:shadow-lg transition-all" data-testid="button-register-nav">
                <Link href="/register">{t("auth.register")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background dark:from-primary/5 dark:via-background dark:to-background" />
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 dark:opacity-20" />
          <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] opacity-40 dark:opacity-10" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Badge variant="outline" className="mb-6 py-1.5 px-4 bg-background/50 backdrop-blur-md border-primary/20 text-primary rounded-full inline-flex items-center shadow-sm">
                <Zap className="w-4 h-4 mr-2 fill-primary/20" />
                <span className="font-medium">The New Standard for Freelance</span>
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Empower Your <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  Digital Future
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                ProConnect Hub is the premium destination where elite talent and visionary clients build exceptional products together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-xl shadow-primary/20 group transition-all" asChild>
                  <Link href="/register?role=freelancer">
                    Find Opportunities
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 border-muted-foreground/30 hover:bg-muted/50 transition-all" asChild>
                  <Link href="/register?role=client">
                    Hire Top Talent
                  </Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500"/> Verified Talent</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500"/> Secure Escrow</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 w-full max-w-2xl lg:max-w-none relative"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black/10 dark:shadow-black/40 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"/>
                <img 
                  src="/hero-team.png" 
                  alt="Professionals collaborating" 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              <motion.div 
                className="absolute -top-6 -right-6 bg-background/80 backdrop-blur-xl border border-border p-4 rounded-xl shadow-xl z-20 hidden md:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full"><Star className="w-5 h-5 text-green-500 fill-green-500" /></div>
                  <div>
                    <p className="text-sm font-bold">4.9/5</p>
                    <p className="text-xs text-muted-foreground">Client Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={itemAnim} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground/60 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <Badge variant="secondary" className="mb-4">Quality Work</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Crafted to Perfection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore exceptional projects delivered by our top-tier professionals across various disciplines.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
          >
            {portfolios.map((item, i) => (
              <motion.div key={i} variants={itemAnim} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden mb-4 border border-border shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-muted relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" className="scale-90 group-hover:scale-100 transition-transform">View Project</Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-1">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute -left-40 top-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -right-40 bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" {...fadeIn}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">The Complete Ecosystem</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage your freelance career or source top talent, all seamlessly integrated into one powerful platform.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemAnim}>
                <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                      <feature.icon className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute right-0 bottom-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground tracking-tight">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl mb-10 text-primary-foreground/80 leading-relaxed font-medium">
              Join the fastest growing network of professionals and start building meaningful connections today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-2xl group" asChild>
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-primary-foreground/60 text-sm">No credit card required. Setup in minutes.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">PC</span>
                </div>
                <span className="font-bold text-lg">ProConnect Hub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering the future of digital collaboration and freelance excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link href="/freelancers" className="hover:text-primary transition-colors">Find Talent</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/page/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/page/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/page/community" className="hover:text-primary transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/page/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/page/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/page/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ProConnect Hub. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/page/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/page/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
