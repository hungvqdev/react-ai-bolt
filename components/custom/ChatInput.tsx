import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  onGenerate: (input: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onGenerate }) => {
  const [userInput, setUserInput] = useState("");
  const handleGenerate = () => {
    if (!userInput.trim()) return;
    onGenerate(userInput);
    setUserInput("");
  };

  return (
      <div className="p-4 mt-3 border rounded-xl max-w-2xl w-full">
        <div className="flex gap-2">
          <textarea
            placeholder="Bạn muốn xây dựng cái gì?"
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          {userInput && (
            <Button
              variant={"ghost"}
              className="bg-blue-500 hover:bg-blue-700 p-2 h-8 w-8 rounded-md"
              onClick={handleGenerate}
            >
              <ArrowRight className="w-full h-full text-white" />
            </Button>
          )}
        </div>
      </div>
  );
};

export default ChatInput;
