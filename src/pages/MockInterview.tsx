
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mic, MicOff, Play, Square, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits"; // Import useCredits
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import supabase

const COST_OF_MOCK_INTERVIEW = 10; // Define cost

const MockInterview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Initialize useAuth
  const { credits, checkCredits, spendCredits, isLoading: creditsLoading } = useCredits(); // Initialize useCredits
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What is your greatest strength?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
  ];

  const handleStartInterview = () => {
    if (creditsLoading) {
      toast({ title: "Aguarde", description: "Verificando seus créditos..." });
      return;
    }
    if (!checkCredits(COST_OF_MOCK_INTERVIEW)) {
      return; // checkCredits shows toast
    }
    setIsStarted(true);
    toast({
      title: "Interview Started",
      description: "Good luck! Take your time to answer each question thoughtfully.",
    });
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);
      
      mediaRecorder.current.ondataavailable = (event) => {
        // Handle audio data - in real app, you'd send this to your AI service
        console.log("Audio data available:", event.data);
      };
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    handleNextQuestion();
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      const newAnswers = [...answers, textAnswer];
      setAnswers(newAnswers);
      setTextAnswer("");
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    setInterviewComplete(true);
    
    // Simulate AI scoring & feedback generation
    const mockScoreValue = Math.floor(Math.random() * 30) + 70;
    setScore(mockScoreValue);
    
    const detailedFeedback = {
      communicationScore: 85, // example
      technicalKnowledgeScore: 78, // example
      problemSolvingScore: 82, // example
      strengths: [
        "Clear and confident communication style",
        "Good use of specific examples in responses",
        "Demonstrated strong problem-solving approach",
      ],
      areasForImprovement: [
        "Consider adding more technical details in responses",
        "Practice the STAR method for behavioral questions",
        "Research company-specific information for better customization",
      ],
    };

    // Prepare data for saving
    const interviewDataToSave = {
      user_id: user?.id,
      interview_type: "General AI Mock Interview", // Example type
      questions_and_answers: questions.map((q, index) => ({
        question: q,
        answer: answers[index] || "N/A (No text answer provided)", // Or handle voice answers if they were stored
      })),
      overall_feedback: JSON.stringify(detailedFeedback), // Store structured feedback as JSON string in text field
      overall_score: mockScoreValue,
      status: "completed",
      // job_description and user_resume_text could be added if collected earlier
    };

    try {
      if (user) {
        const { error: saveError } = await supabase
          .from('mock_interviews')
          .insert(interviewDataToSave);

        if (saveError) {
          console.error("Error saving mock interview:", saveError);
          toast({
            title: "Error Saving Interview",
            description: "Your interview was completed but could not be saved. " + saveError.message,
            variant: "destructive",
            duration: 7000,
          });
          // Don't spend credits if saving failed
          return;
        }
      } else {
        throw new Error("User not authenticated, cannot save interview.");
      }

      const creditsSpentSuccessfully = await spendCredits(COST_OF_MOCK_INTERVIEW);
      if (creditsSpentSuccessfully) {
        toast({
          title: "Interview Complete & Saved!",
          description: `Score: ${mockScoreValue}/100. Credits deducted.`,
        });
      } else {
        toast({
          title: "Interview Saved, but Credit Issue",
          description: `Score: ${mockScoreValue}/100. Please contact support regarding credit deduction.`,
          variant: "destructive", // or "warning"
        });
      }
    } catch (error: any) {
      console.error("Error during interview completion/saving:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save interview or process credits.",
        variant: "destructive",
      });
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Mock Interview</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">AI Mock Interview</CardTitle>
              <CardDescription>
                Practice your interview skills with our AI-powered interview simulator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-900">5 Questions</div>
                    <div className="text-blue-700">Common interview topics</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-900">Voice or Text</div>
                    <div className="text-green-700">Choose your response method</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-900">AI Feedback</div>
                    <div className="text-purple-700">Detailed scoring & tips</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Cost:</strong> 10 credits</p>
                  <p><strong>Duration:</strong> 15-20 minutes</p>
                  <p><strong>Format:</strong> You can answer using voice recording or text</p>
                </div>
                
                <Button onClick={handleStartInterview} size="lg" className="w-full" disabled={creditsLoading}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Mock Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Interview Results</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Interview Complete!</CardTitle>
              {score && (
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-blue-600">{score}/100</div>
                  <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
                    {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">85</div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Technical Knowledge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">78</div>
                    <Progress value={78} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Problem Solving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">82</div>
                    <Progress value={82} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Strengths:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li>Clear and confident communication style</li>
                      <li>Good use of specific examples in responses</li>
                      <li>Demonstrated strong problem-solving approach</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Areas for Improvement:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li>Consider adding more technical details in responses</li>
                      <li>Practice the STAR method for behavioral questions</li>
                      <li>Research company-specific information for better customization</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Take Another Practice Interview
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Mock Interview</h1>
            </div>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium p-6 bg-blue-50 rounded-lg">
                {questions[currentQuestion]}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Take your time to think about your answer. You can respond using voice recording or by typing your response.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    variant={isRecording ? "destructive" : "default"}
                    className="flex-1"
                  >
                    {isRecording ? (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Record Answer
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">or</div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <Button 
                    onClick={handleTextSubmit} 
                    className="w-full"
                    disabled={!textAnswer.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Answer
                  </Button>
                </div>
              </div>

              {isRecording && (
                <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Recording...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
