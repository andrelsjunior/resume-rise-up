
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useDeductCredits } from "@/hooks/useProfile";
import { useActivities } from "@/hooks/useActivities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfileModal } from "@/components/ProfileModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FileText, MessageSquare, CreditCard, LogOut, User, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const deductCredits = useDeductCredits();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleServiceClick = (serviceType: string, credits: number, title: string, route: string) => {
    if (!profile) return;
    
    if (profile.credits < credits) {
      return;
    }
    
    deductCredits.mutate({
      credits,
      activityType: serviceType,
      title,
    });
    
    navigate(route);
  };

  const getActivityTypeDisplay = (type: string) => {
    switch (type) {
      case 'cv_generated':
        return { icon: FileText, color: 'text-blue-600', label: 'CV Generated' };
      case 'cover_letter_generated':
        return { icon: FileText, color: 'text-green-600', label: 'Cover Letter Generated' };
      case 'mock_interview_completed':
        return { icon: MessageSquare, color: 'text-purple-600', label: 'Mock Interview Completed' };
      default:
        return { icon: FileText, color: 'text-gray-600', label: type };
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">ResumeRise Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </Button>
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
                <div className="text-2xl font-bold">{profile?.credits || 0}</div>
                <div className="text-sm text-gray-500">of {profile?.max_credits || 100}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={profile ? (profile.credits / profile.max_credits) * 100 : 0} 
              className="w-full" 
            />
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
              <Button 
                className="w-full" 
                onClick={() => handleServiceClick('cv_generated', 5, 'Generated CV', '/cv-generator')}
                disabled={!profile || profile.credits < 5 || deductCredits.isPending}
              >
                {deductCredits.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate CV (5 credits)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
              <Button 
                className="w-full"
                onClick={() => handleServiceClick('cover_letter_generated', 3, 'Generated Cover Letter', '/cover-letter')}
                disabled={!profile || profile.credits < 3 || deductCredits.isPending}
              >
                {deductCredits.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Write Cover Letter (3 credits)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
              <Button 
                className="w-full"
                onClick={() => handleServiceClick('mock_interview_completed', 10, 'Completed Mock Interview', '/mock-interview')}
                disabled={!profile || profile.credits < 10 || deductCredits.isPending}
              >
                {deductCredits.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const { icon: Icon, color, label } = getActivityTypeDisplay(activity.activity_type);
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Icon className={`h-4 w-4 mr-3 ${color}`} />
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">
                            {activity.score ? `Score: ${activity.score}% - ` : ''}
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.credits_used} credits
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity. Start using our services to see your history here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </div>
  );
};

export default Dashboard;
