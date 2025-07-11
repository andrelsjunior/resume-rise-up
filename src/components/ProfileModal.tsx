
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile"; // Updated import
// import { useAuth } from "@/hooks/useAuthMock"; // Removed useAuth
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, Calendar, Crown } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  // const { user } = useAuth(); // Removed useAuth
  const { profile, isLoading, error, refreshProfile } = useProfile(); // Use new hook structure

  if (isLoading || !profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Loading your profile information...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Adjust creditPercentage as max_credits is no longer available
  // For example, if 100 is a typical max, or show full if credits > 0.
  const creditPercentage = profile.credits ? (profile.credits > 100 ? 100 : (profile.credits / 100) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and view your usage statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-gray-600">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Role:</span>
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                  {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Member since:</span>
                <span className="text-sm text-gray-600">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credits
              </CardTitle>
              <CardDescription>
                Your current credit balance and usage limit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{profile.credits ?? 0}</span>
                {/* Removed "of max_credits" display */}
              </div>
              <Progress value={creditPercentage} className="w-full" />
              <div className="text-xs text-gray-500 text-center">
                {/* Adjusted text as max_credits is not fixed */}
                {profile.credits ? `${creditPercentage.toFixed(0)}% of assumed capacity` : 'No credits'}
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {profile.updated_at ? `Last updated: ${new Date(profile.updated_at).toLocaleString()}` : 'Profile not recently updated'}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
