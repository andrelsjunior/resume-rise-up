
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CVGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState("personal");

  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
    },
    summary: "",
    experience: [
      { company: "", position: "", duration: "", description: "" }
    ],
    education: [
      { institution: "", degree: "", year: "", gpa: "" }
    ],
    skills: "",
    jobDescription: "",
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "CV Generated Successfully!",
        description: "Your professional CV has been created and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
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
            <h1 className="text-xl font-semibold">CV Generator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI-Powered CV Generation</CardTitle>
            <CardDescription>
              Create a professional CV tailored to your target job. Fill in each section and our AI will optimize the content for maximum impact.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                <TabsTrigger value="job" className="text-xs">Job Match</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.personal.fullName}
                          onChange={(e) => updateFormData('personal', { ...formData.personal, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.personal.email}
                          onChange={(e) => updateFormData('personal', { ...formData.personal, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.personal.phone}
                          onChange={(e) => updateFormData('personal', { ...formData.personal, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.personal.location}
                          onChange={(e) => updateFormData('personal', { ...formData.personal, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Brief professional summary..."
                        value={formData.summary}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <Input placeholder="Company name" />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input placeholder="Job title" />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea placeholder="Key achievements and responsibilities..." />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">Add Experience</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institution</Label>
                          <Input placeholder="University/School name" />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input placeholder="Degree/Certification" />
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">Add Education</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Competencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Skills (comma-separated)</Label>
                      <Textarea
                        placeholder="JavaScript, React, Python, Leadership, Communication..."
                        value={formData.skills}
                        onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="job">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description Matching</CardTitle>
                    <CardDescription>
                      Paste the job description to tailor your CV for this specific role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Job Description</Label>
                      <Textarea
                        className="min-h-[200px]"
                        placeholder="Paste the full job description here..."
                        value={formData.jobDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Generate Your CV</CardTitle>
                <CardDescription>
                  AI will analyze your information and create a professional CV optimized for your target role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p><strong>Cost:</strong> 5 credits</p>
                  <p><strong>Generation time:</strong> ~30 seconds</p>
                </div>
                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating CV...
                    </>
                  ) : (
                    "Generate CV"
                  )}
                </Button>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview CV
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
