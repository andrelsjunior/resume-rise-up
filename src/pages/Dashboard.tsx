
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, CreditCard, LogOut, User } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const credits = 50; // This would come from your database
  const maxCredits = 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">ResumeRise Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credits Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Your Credits
                </CardTitle>
                <CardDescription>Use credits to generate CVs, cover letters, and mock interviews</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{credits}</div>
                <div className="text-sm text-gray-500">of {maxCredits}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(credits / maxCredits) * 100} className="w-full" />
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/cv-generator")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                CV Generator
              </CardTitle>
              <CardDescription>Create professional CVs with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Generate tailored CVs for different job applications using our AI-powered layered approach.
              </p>
              <Button className="w-full">
                Generate CV (5 credits)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/cover-letter")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Cover Letter
              </CardTitle>
              <CardDescription>Write compelling cover letters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create personalized cover letters that highlight your strengths and match job requirements.
              </p>
              <Button className="w-full">
                Write Cover Letter (3 credits)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mock-interview")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                Mock Interview
              </CardTitle>
              <CardDescription>Practice interviews with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Simulate real job interviews with voice or text responses and get detailed feedback.
              </p>
              <Button className="w-full">
                Start Interview (10 credits)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest generated content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Software Engineer CV</p>
                    <p className="text-sm text-gray-500">Generated 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-3 text-purple-600" />
                  <div>
                    <p className="font-medium">Technical Interview Practice</p>
                    <p className="text-sm text-gray-500">Score: 85% - 1 day ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
