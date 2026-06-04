import { 
  Home, 
  Briefcase, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Settings,
  Users,
  BarChart3
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const freelancerMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Browse Jobs", url: "/jobs", icon: Briefcase },
    { title: "My Proposals", url: "/proposals", icon: FileText },
    { title: "Portfolio", url: "/portfolio", icon: FolderOpen },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Marketing Tools", url: "/marketing", icon: TrendingUp },
  ];

  const clientMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Jobs", url: "/my-jobs", icon: Briefcase },
    { title: "Browse Freelancers", url: "/freelancers", icon: Users },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Marketing Tools", url: "/marketing", icon: TrendingUp },
  ];

  const adminMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Jobs", url: "/admin/jobs", icon: Briefcase },
    { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
  ];

  const menuItems = isAdmin ? adminMenuItems : user?.role === "client" ? clientMenuItems : freelancerMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 rounded-md p-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">PC</span>
            </div>
            <span className="font-semibold text-lg">ProConnect</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1" data-testid="button-profile">
            <Link href="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
