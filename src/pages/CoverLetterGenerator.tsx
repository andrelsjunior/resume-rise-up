
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits"; // Import useCredits
import { useAuth } from "@/hooks/useAuth"; // To get current user ID
import { supabase } from "@/integrations/supabase/client"; // For saving to DB

const COST_OF_COVER_LETTER_GENERATION = 3; // Define cost

const CoverLetterGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Initialize useAuth
  const { credits, checkCredits, spendCredits, isLoading: creditsLoading } = useCredits(); // Initialize useCredits
  const [generating, setGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    hiringManager: "",
    jobDescription: "",
    personalExperiences: "",
    tone: "professional",
  });

  const handleGenerate = async () => {
    if (creditsLoading) {
      toast({
        title: "Aguarde",
        description: "Verificando seus créditos...",
      });
      return;
    }

    if (!checkCredits(COST_OF_COVER_LETTER_GENERATION)) {
      return; // checkCredits shows toast
    }

    setGenerating(true);
    let letterContent = ""; // To store the generated letter

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      letterContent = `Dear ${formData.hiringManager || 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.position} position at ${formData.companyName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

In my previous roles, I have developed expertise in modern web technologies and have successfully delivered multiple projects from conception to deployment. My experience includes working with React, Node.js, and various database technologies, which aligns well with the requirements mentioned in your job posting.

What particularly excites me about ${formData.companyName} is your commitment to innovation and user-centric design. I believe my technical skills combined with my collaborative approach would make me a valuable addition to your development team.

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to ${formData.companyName}'s continued success. Thank you for considering my application.

Sincerely,
[Your Name]`; // Replace [Your Name] appropriately if user data is available

      setGeneratedLetter(letterContent); // Show letter in UI first

      // Attempt to save to Supabase
      if (user && letterContent) {
        const { error: saveError } = await supabase
          .from('cover_letters')
          .insert({
            user_id: user.id,
            title: `Cover Letter for ${formData.position} at ${formData.companyName}`,
            content: letterContent,
          });

        if (saveError) {
          console.error("Error saving cover letter:", saveError);
          toast({
            title: "Error Saving Letter",
            description: "Your cover letter was generated but could not be saved. Please copy it manually. " + saveError.message,
            variant: "destructive",
            duration: 7000,
          });
          // Decide if we should still attempt to spend credits if saving failed.
          // For now, let's assume if saving fails, we don't spend credits.
          // Or, you might spend credits first, then save, and handle save failure differently.
          // Current logic: save first, then spend.
          setGenerating(false); // Stop loading if saving failed critically
          return;
        }
      } else {
        throw new Error("User not authenticated or letter content empty, cannot save.");
      }

      // If saving was successful, attempt to spend credits
      const creditsSpentSuccessfully = await spendCredits(COST_OF_COVER_LETTER_GENERATION);

      if (creditsSpentSuccessfully) {
        toast({
          title: "Cover Letter Generated & Saved!",
          description: "Credits have been deducted.",
        });
      } else {
        toast({
          title: "Cover Letter Saved, but Credit Issue",
          description: "Your letter was saved. Please contact support regarding credit deduction.",
          variant: "destructive", // Or "warning"
        });
      }

    } catch (error: any) {
      console.error("Error during cover letter generation/saving:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate or save cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">Cover Letter Generator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter Details</CardTitle>
                <CardDescription>
                  Provide information about the job and company to create a personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="e.g., Google, Microsoft"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hiringManager">Hiring Manager (Optional)</Label>
                  <Input
                    id="hiringManager"
                    value={formData.hiringManager}
                    onChange={(e) => setFormData(prev => ({ ...prev, hiringManager: e.target.value }))}
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    className="min-h-[120px]"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                    placeholder="Paste the job description here..."
                  />
                </div>

                <div>
                  <Label htmlFor="personalExperiences">Your Relevant Experiences</Label>
                  <Textarea
                    id="personalExperiences"
                    className="min-h-[120px]"
                    value={formData.personalExperiences}
                    onChange={(e) => setFormData(prev => ({ ...prev, personalExperiences: e.target.value }))}
                    placeholder="Describe your relevant work experience, projects, and achievements..."
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={generating || creditsLoading || !formData.companyName || !formData.position}
                >
                  {generating || creditsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Cover Letter...
                    </>
                  ) : (
                    "Generate Cover Letter (3 credits)"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Generated Cover Letter</CardTitle>
                <CardDescription>
                  Your AI-generated cover letter will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 border rounded-lg min-h-[400px] whitespace-pre-wrap font-mono text-sm">
                      {generatedLetter}
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download as PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500 bg-gray-50 rounded-lg">
                    Fill in the details and click "Generate Cover Letter" to see your personalized letter here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
