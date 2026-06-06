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
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  const freelancerMenuItems = [
    { title: t("common.nav.dashboard"), url: "/dashboard", icon: Home },
    { title: t("common.nav.browseJobs"), url: "/jobs", icon: Briefcase },
    { title: t("common.nav.myProposals"), url: "/proposals", icon: FileText },
    { title: t("common.nav.portfolio"), url: "/portfolio", icon: FolderOpen },
    { title: t("common.nav.messages"), url: "/messages", icon: MessageSquare },
    { title: t("common.nav.marketing"), url: "/marketing", icon: TrendingUp },
  ];

  const clientMenuItems = [
    { title: t("common.nav.dashboard"), url: "/dashboard", icon: Home },
    { title: t("common.nav.myJobs"), url: "/my-jobs", icon: Briefcase },
    { title: t("common.nav.browseFreelancers"), url: "/freelancers", icon: Users },
    { title: t("common.nav.messages"), url: "/messages", icon: MessageSquare },
    { title: t("common.nav.marketing"), url: "/marketing", icon: TrendingUp },
  ];

  const adminMenuItems = [
    { title: t("common.nav.dashboard"), url: "/dashboard", icon: BarChart3 },
    { title: t("common.nav.users"), url: "/admin/users", icon: Users },
    { title: t("common.nav.jobs"), url: "/admin/jobs", icon: Briefcase },
    { title: t("common.nav.analytics"), url: "/admin/analytics", icon: TrendingUp },
  ];

  const menuItems = isAdmin ? adminMenuItems : user?.role === "client" ? clientMenuItems : freelancerMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 rounded-md p-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">{t("common.appInitials")}</span>
            </div>
            <span className="font-semibold text-lg">{t("common.appName")}</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("common.menu")}</SidebarGroupLabel>
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
              {t("common.nav.profile")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
            {t("common.nav.logout")}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
