
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { VideoModal } from "./VideoModal";

interface HelpVideoButtonProps {
  videoUrl: string;
  title: string;
  className?: string;
}

export const HelpVideoButton = ({ videoUrl, title, className }: HelpVideoButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={`text-muted-foreground hover:text-primary ${className}`}
        title={`Ver vídeo de ajuda: ${title}`}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
        title={title}
      />
    </>
  );
};
