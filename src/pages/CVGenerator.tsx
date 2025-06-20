
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputWithAI } from "@/components/InputWithAI";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

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
    ] as Experience[],
    education: [
      { institution: "", degree: "", year: "", gpa: "" }
    ] as Education[],
    skills: "",
    jobDescription: "",
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
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

  const updatePersonalData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "", gpa: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
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
                      <InputWithAI
                        label="Full Name"
                        fieldName="fullName"
                        value={formData.personal.fullName}
                        onChange={(value) => updatePersonalData('fullName', value)}
                        placeholder="Your full name"
                      />
                      <InputWithAI
                        label="Email"
                        fieldName="email"
                        value={formData.personal.email}
                        onChange={(value) => updatePersonalData('email', value)}
                        placeholder="your.email@example.com"
                      />
                      <InputWithAI
                        label="Phone"
                        fieldName="phone"
                        value={formData.personal.phone}
                        onChange={(value) => updatePersonalData('phone', value)}
                        placeholder="(11) 99999-9999"
                      />
                      <InputWithAI
                        label="Location"
                        fieldName="location"
                        value={formData.personal.location}
                        onChange={(value) => updatePersonalData('location', value)}
                        placeholder="City, State - Country"
                      />
                    </div>
                    <InputWithAI
                      label="LinkedIn"
                      fieldName="linkedIn"
                      value={formData.personal.linkedIn}
                      onChange={(value) => updatePersonalData('linkedIn', value)}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                    <InputWithAI
                      label="Professional Summary"
                      fieldName="summary"
                      type="textarea"
                      value={formData.summary}
                      onChange={(value) => setFormData(prev => ({ ...prev, summary: value }))}
                      placeholder="Brief professional summary..."
                      className="min-h-[100px]"
                    />
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
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Experience {index + 1}</h4>
                          {formData.experience.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExperience(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputWithAI
                            label="Company"
                            fieldName="company"
                            value={exp.company}
                            onChange={(value) => updateExperience(index, 'company', value)}
                            placeholder="Company name"
                          />
                          <InputWithAI
                            label="Position"
                            fieldName="position"
                            value={exp.position}
                            onChange={(value) => updateExperience(index, 'position', value)}
                            placeholder="Job title"
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                        <InputWithAI
                          label="Description"
                          fieldName="description"
                          type="textarea"
                          value={exp.description}
                          onChange={(value) => updateExperience(index, 'description', value)}
                          placeholder="Key achievements and responsibilities..."
                          className="min-h-[100px]"
                        />
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Education {index + 1}</h4>
                          {formData.education.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputWithAI
                            label="Institution"
                            fieldName="institution"
                            value={edu.institution}
                            onChange={(value) => updateEducation(index, 'institution', value)}
                            placeholder="University/School name"
                          />
                          <InputWithAI
                            label="Degree"
                            fieldName="degree"
                            value={edu.degree}
                            onChange={(value) => updateEducation(index, 'degree', value)}
                            placeholder="Degree/Certification"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={edu.year}
                              onChange={(e) => updateEducation(index, 'year', e.target.value)}
                              placeholder="2020-2024"
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={edu.gpa}
                              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                              placeholder="3.8/4.0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Competencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InputWithAI
                      label="Skills (comma-separated)"
                      fieldName="skills"
                      type="textarea"
                      value={formData.skills}
                      onChange={(value) => setFormData(prev => ({ ...prev, skills: value }))}
                      placeholder="JavaScript, React, Python, Leadership, Communication..."
                      className="min-h-[100px]"
                    />
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
                    <InputWithAI
                      label="Job Description"
                      fieldName="jobDescription"
                      type="textarea"
                      value={formData.jobDescription}
                      onChange={(value) => setFormData(prev => ({ ...prev, jobDescription: value }))}
                      placeholder="Paste the full job description here..."
                      className="min-h-[200px]"
                    />
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
