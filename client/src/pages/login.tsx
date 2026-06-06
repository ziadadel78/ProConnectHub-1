import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("user");

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast({
        title: t("auth.login.successTitle"),
        description: t("auth.login.successMessage"),
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: t("auth.login.failedTitle"),
        description: error.message || t("auth.login.failedMessage"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "admin") {
      form.setValue("email", "admin@proconnect.com");
      form.setValue("password", "admin123");
    } else {
      form.setValue("email", "");
      form.setValue("password", "");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">PC</span>
              </div>
              <span className="font-semibold text-xl">ProConnect Hub</span>
            </div>
            {activeTab === "admin" && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t("common.roles.admin")}
              </span>
            )}
          </div>
          <CardTitle className="text-2xl">
            {activeTab === "admin" ? t("auth.login.titleAdmin") : t("auth.login.title")}
          </CardTitle>
          <CardDescription>
            {activeTab === "admin" 
              ? t("auth.login.subtitleAdmin")
              : t("auth.login.subtitle")
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2" data-testid="tab-user">
                <User className="w-4 h-4" />
                {t("auth.login.userLogin")}
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2" data-testid="tab-admin">
                <ShieldCheck className="w-4 h-4" />
                {t("auth.login.adminLogin")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.login.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={t("auth.login.emailPlaceholder")} 
                        {...field} 
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.login.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={t("auth.login.passwordPlaceholder")} 
                        {...field} 
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
                data-testid="button-submit"
              >
                {loginMutation.isPending ? t("auth.login.submitting") : t("auth.login.submitButton")}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t("auth.login.noAccount")} </span>
            <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
              {t("auth.login.signUp")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
