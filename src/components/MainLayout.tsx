import * as React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar"; // Assuming this is the correct path
import { Button } from "@/components/ui/button";
import { Home, LayoutGrid, FileText, Settings } from "lucide-react"; // Example icons

const MainLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-2 flex justify-between items-center">
            {/* Placeholder for Logo or App Name */}
            <h2 className="text-lg font-semibold px-2">AppLogo</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/cv-generator">
                    <FileText className="mr-2 h-4 w-4" />
                    CV Generator
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/cover-letter">
                    <FileText className="mr-2 h-4 w-4" />
                    Cover Letter
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/mock-interview">
                    <Home className="mr-2 h-4 w-4" /> {/* Changed icon for variety */}
                    Mock Interview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Add more menu items as needed */}
            </SidebarMenu>
          </SidebarContent>
          {/* SidebarFooter could be added here if needed */}
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b p-4 h-16 flex items-center justify-between">
            {/* Global App Header Content */}
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden mr-2"> {/* Only show trigger on mobile if sidebar is collapsible on md+ */}
                 {/* Icon for trigger, e.g., Menu icon - PanelLeft is used by default in sidebar.tsx's trigger */}
              </SidebarTrigger>
              <h1 className="text-xl font-semibold">Page Title</h1> {/* This could be dynamic */}
            </div>
            <div>{/* User Profile / Actions */}</div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet /> {/* Page content will be rendered here */}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
