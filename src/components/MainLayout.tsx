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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, LayoutGrid, FileText, Settings, MessageSquare } from "lucide-react"; // Updated imports

const MainLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold px-2">ResumeRise</h2> {/* Updated Branding */}
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
                    <MessageSquare className="mr-2 h-4 w-4" /> {/* Updated Icon */}
                    Mock Interview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b p-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden mr-2">
              </SidebarTrigger>
              <h1 className="text-xl font-semibold">Page Title</h1>
            </div>
            <div></div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
