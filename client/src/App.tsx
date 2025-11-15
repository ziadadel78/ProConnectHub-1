import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import JobsBrowse from "@/pages/jobs-browse";
import JobDetail from "@/pages/job-detail";
import JobCreate from "@/pages/job-create";
import ProposalCreate from "@/pages/proposal-create";
import Proposals from "@/pages/proposals";
import Portfolio from "@/pages/portfolio";
import PortfolioCreate from "@/pages/portfolio-create";
import Messages from "@/pages/messages";
import Profile from "@/pages/profile";
import Marketing from "@/pages/marketing";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function PublicOnlyRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  
  return <Component {...rest} />;
}

function AppRouter() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isPublicRoute = location === "/" || location === "/login" || location === "/register";

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (!isAuthenticated || isPublicRoute) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login">{() => <PublicOnlyRoute component={Login} />}</Route>
        <Route path="/register">{() => <PublicOnlyRoute component={Register} />}</Route>
        <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route>{() => <Redirect to={isAuthenticated ? "/dashboard" : "/"} />}</Route>
      </Switch>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <Switch>
              <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
              <Route path="/jobs">{() => <ProtectedRoute component={JobsBrowse} />}</Route>
              <Route path="/jobs/create">{() => <ProtectedRoute component={JobCreate} />}</Route>
              <Route path="/jobs/:id">{() => <ProtectedRoute component={JobDetail} />}</Route>
              <Route path="/jobs/:id/proposal">{() => <ProtectedRoute component={ProposalCreate} />}</Route>
              <Route path="/proposals">{() => <ProtectedRoute component={Proposals} />}</Route>
              <Route path="/portfolio">{() => <ProtectedRoute component={Portfolio} />}</Route>
              <Route path="/portfolio/create">{() => <ProtectedRoute component={PortfolioCreate} />}</Route>
              <Route path="/messages">{() => <ProtectedRoute component={Messages} />}</Route>
              <Route path="/profile">{() => <ProtectedRoute component={Profile} />}</Route>
              <Route path="/marketing">{() => <ProtectedRoute component={Marketing} />}</Route>
              <Route path="/admin">{() => <ProtectedRoute component={Admin} />}</Route>
              <Route path="/admin/users">{() => <ProtectedRoute component={Admin} />}</Route>
              <Route path="/admin/jobs">{() => <ProtectedRoute component={Admin} />}</Route>
              <Route path="/admin/analytics">{() => <ProtectedRoute component={Admin} />}</Route>
              <Route path="/my-jobs">{() => <ProtectedRoute component={JobsBrowse} />}</Route>
              <Route path="/freelancers">{() => <ProtectedRoute component={JobsBrowse} />}</Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
