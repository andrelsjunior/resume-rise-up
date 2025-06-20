
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { InputWithAI } from "@/components/InputWithAI";
import { HelpVideoButton } from "@/components/HelpVideoButton";
import { useToast } from "@/hooks/use-toast";

const CVGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    },
  ]);

  const [skills, setSkills] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
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

  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    }]);
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }]);
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Enter your basic contact information and professional summary
                  </CardDescription>
                </div>
                <HelpVideoButton
                  videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Como preencher informações pessoais"
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithAI
                    label="Full Name"
                    fieldName="fullName"
                    value={personalInfo.fullName}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, fullName: value }))}
                    placeholder="John Doe"
                  />
                  <InputWithAI
                    label="Email"
                    fieldName="email"
                    value={personalInfo.email}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, email: value }))}
                    placeholder="john@example.com"
                  />
                  <InputWithAI
                    label="Phone"
                    fieldName="phone"
                    value={personalInfo.phone}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, phone: value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                  <InputWithAI
                    label="Address"
                    fieldName="address"
                    value={personalInfo.address}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, address: value }))}
                    placeholder="New York, NY"
                  />
                  <InputWithAI
                    label="LinkedIn"
                    fieldName="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, linkedin: value }))}
                    placeholder="linkedin.com/in/johndoe"
                  />
                  <InputWithAI
                    label="Website"
                    fieldName="website"
                    value={personalInfo.website}
                    onChange={(value) => setPersonalInfo(prev => ({ ...prev, website: value }))}
                    placeholder="johndoe.com"
                  />
                </div>
                <InputWithAI
                  label="Professional Summary"
                  fieldName="summary"
                  value={personalInfo.summary}
                  onChange={(value) => setPersonalInfo(prev => ({ ...prev, summary: value }))}
                  placeholder="Brief description of your professional background and goals..."
                  type="textarea"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add your professional work experience
                  </CardDescription>
                </div>
                <HelpVideoButton
                  videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Como descrever experiência profissional"
                />
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithAI
                        label="Company"
                        fieldName={`company_${exp.id}`}
                        value={exp.company}
                        onChange={(value) => setExperience(prev => 
                          prev.map(e => e.id === exp.id ? { ...e, company: value } : e)
                        )}
                        placeholder="Company Name"
                      />
                      <InputWithAI
                        label="Position"
                        fieldName={`position_${exp.id}`}
                        value={exp.position}
                        onChange={(value) => setExperience(prev => 
                          prev.map(e => e.id === exp.id ? { ...e, position: value } : e)
                        )}
                        placeholder="Job Title"
                      />
                      <InputWithAI
                        label="Start Date"
                        fieldName={`startDate_${exp.id}`}
                        value={exp.startDate}
                        onChange={(value) => setExperience(prev => 
                          prev.map(e => e.id === exp.id ? { ...e, startDate: value } : e)
                        )}
                        placeholder="MM/YYYY"
                      />
                      <InputWithAI
                        label="End Date"
                        fieldName={`endDate_${exp.id}`}
                        value={exp.endDate}
                        onChange={(value) => setExperience(prev => 
                          prev.map(e => e.id === exp.id ? { ...e, endDate: value } : e)
                        )}
                        placeholder="MM/YYYY or Present"
                      />
                    </div>
                    <InputWithAI
                      label="Description"
                      fieldName={`description_${exp.id}`}
                      value={exp.description}
                      onChange={(value) => setExperience(prev => 
                        prev.map(e => e.id === exp.id ? { ...e, description: value } : e)
                      )}
                      placeholder="Describe your responsibilities and achievements..."
                      type="textarea"
                    />
                  </div>
                ))}
                <Button onClick={addExperience} variant="outline" className="w-full">
                  Add Another Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </div>
                <HelpVideoButton
                  videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Como organizar informações educacionais"
                />
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithAI
                        label="Institution"
                        fieldName={`institution_${edu.id}`}
                        value={edu.institution}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, institution: value } : e)
                        )}
                        placeholder="University Name"
                      />
                      <InputWithAI
                        label="Degree"
                        fieldName={`degree_${edu.id}`}
                        value={edu.degree}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, degree: value } : e)
                        )}
                        placeholder="Bachelor's, Master's, etc."
                      />
                      <InputWithAI
                        label="Field of Study"
                        fieldName={`field_${edu.id}`}
                        value={edu.field}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, field: value } : e)
                        )}
                        placeholder="Computer Science, Business, etc."
                      />
                      <InputWithAI
                        label="GPA (Optional)"
                        fieldName={`gpa_${edu.id}`}
                        value={edu.gpa}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, gpa: value } : e)
                        )}
                        placeholder="3.8/4.0"
                      />
                      <InputWithAI
                        label="Start Date"
                        fieldName={`eduStartDate_${edu.id}`}
                        value={edu.startDate}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, startDate: value } : e)
                        )}
                        placeholder="MM/YYYY"
                      />
                      <InputWithAI
                        label="End Date"
                        fieldName={`eduEndDate_${edu.id}`}
                        value={edu.endDate}
                        onChange={(value) => setEducation(prev => 
                          prev.map(e => e.id === edu.id ? { ...e, endDate: value } : e)
                        )}
                        placeholder="MM/YYYY"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full">
                  Add Another Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Skills & Qualifications</CardTitle>
                  <CardDescription>
                    List your technical skills, soft skills, and certifications
                  </CardDescription>
                </div>
                <HelpVideoButton
                  videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Como destacar suas habilidades"
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <InputWithAI
                  label="Technical Skills"
                  fieldName="technicalSkills"
                  value={skills.technical}
                  onChange={(value) => setSkills(prev => ({ ...prev, technical: value }))}
                  placeholder="React, Node.js, Python, SQL, etc."
                  type="textarea"
                />
                <InputWithAI
                  label="Soft Skills"
                  fieldName="softSkills"
                  value={skills.soft}
                  onChange={(value) => setSkills(prev => ({ ...prev, soft: value }))}
                  placeholder="Leadership, Communication, Problem-solving, etc."
                  type="textarea"
                />
                <InputWithAI
                  label="Languages"
                  fieldName="languages"
                  value={skills.languages}
                  onChange={(value) => setSkills(prev => ({ ...prev, languages: value }))}
                  placeholder="English (Fluent), Spanish (Intermediate), etc."
                  type="textarea"
                />
                <InputWithAI
                  label="Certifications"
                  fieldName="certifications"
                  value={skills.certifications}
                  onChange={(value) => setSkills(prev => ({ ...prev, certifications: value }))}
                  placeholder="AWS Certified, Google Analytics, etc."
                  type="textarea"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={handleGenerate} disabled={generating} size="lg">
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating CV...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate CV (5 credits)
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" disabled>
            Preview CV
          </Button>
          <Button variant="outline" size="lg" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
