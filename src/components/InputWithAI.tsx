
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIGenerateButton } from "./AIGenerateButton";
import { useAIGenerate } from "@/hooks/useAIGenerate";

interface InputWithAIProps {
  label: string;
  fieldName: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "input" | "textarea";
  className?: string;
}

export const InputWithAI = ({ 
  label, 
  fieldName, 
  value, 
  onChange, 
  placeholder,
  type = "input",
  className 
}: InputWithAIProps) => {
  const { generate, isGenerating } = useAIGenerate();

  const handleAIGenerate = async () => {
    await generate(
      {
        fieldName,
        currentText: value,
      },
      (generatedText) => {
        onChange(generatedText);
      }
    );
  };

  const InputComponent = type === "textarea" ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{label}</Label>
      <div className="flex gap-2">
        <InputComponent
          id={fieldName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
        <AIGenerateButton 
          onGenerate={handleAIGenerate}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
};
