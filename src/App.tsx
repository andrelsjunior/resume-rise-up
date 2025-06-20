
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthMock";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CVGenerator from "./pages/CVGenerator";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import MockInterview from "./pages/MockInterview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            } />
            <Route path="/cv-generator" element={
              <AuthGuard>
                <CVGenerator />
              </AuthGuard>
            } />
            <Route path="/cover-letter" element={
              <AuthGuard>
                <CoverLetterGenerator />
              </AuthGuard>
            } />
            <Route path="/mock-interview" element={
              <AuthGuard>
                <MockInterview />
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
