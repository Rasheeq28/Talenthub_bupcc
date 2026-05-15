"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Users, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string>("Corporate HR");

  useEffect(() => {
    const checkUser = () => {
      const company = localStorage.getItem('hr_company');
      if (!company) {
        router.push("/login");
        return;
      }
      setCompanyName(company);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('hr_company');
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Talent Discovery", href: "/dashboard/candidates", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm truncate" title={companyName}>{companyName}</h2>
              <p className="text-xs text-muted-foreground">Partner Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-white flex items-center px-6 md:hidden">
           <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0 mr-3">
             <span className="text-white font-bold text-sm">HR</span>
           </div>
           <h1 className="font-semibold">{companyName} Portal</h1>
        </header>
        <div className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex items-center justify-around p-2 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {item.name}
            </Link>
          );
        })}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium text-muted-foreground transition-colors">
          <LogOut className="w-5 h-5 mb-1" />
          Sign out
        </button>
      </nav>
    </div>
  );
}
