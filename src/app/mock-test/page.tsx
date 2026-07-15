"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, HelpCircle, Eye, EyeOff } from "lucide-react";
import { greTopics, GRETopic } from "../../data/gre-topics";

export default function MockTest() {
  const router = useRouter();
  const [topic, setTopic] = useState<GRETopic>(greTopics[0]);
  const [essay, setEssay] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 mins = 1800s
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load topic from localStorage
  useEffect(() => {
    const storedTopic = localStorage.getItem("gre_current_topic");
    if (storedTopic) {
      try {
        setTopic(JSON.parse(storedTopic));
      } catch (e) {
        // use default
      }
    }
  }, []);

  // Strict 30-minute countdown (cannot be paused)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAutoSubmit = () => {
    alert("시간이 초과되어 답안이 자동 제출됩니다.");
    submitEssay();
  };

  const getWordCount = () => {
    if (!essay.trim()) return 0;
    return essay.trim().split(/\s+/).length;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const confirmExit = () => {
    if (confirm("경고: 진행 중인 모의고사를 종료하시겠습니까? 작성한 내용은 저장되지 않습니다.")) {
      router.push("/");
    }
  };

  const submitEssay = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "Mock Test",
          prompt: topic.prompt,
          instruction: topic.instruction,
          essay
        })
      });
      
      if (!response.ok) {
        throw new Error("API call failed");
      }
      
      const result = await response.json();
      
      // Save feedback results and user essay in localStorage
      localStorage.setItem("gre_last_feedback", JSON.stringify(result));
      
      // Save to history list
      const storedHistory = localStorage.getItem("gre_awa_history");
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.prompt,
        date: new Date().toISOString().split("T")[0],
        score: result.score,
        wordCount: getWordCount(),
        mode: "Mock Test" as const
      };
      
      localStorage.setItem("gre_awa_history", JSON.stringify([newHistoryItem, ...currentHistory]));
      
      router.push("/feedback");
    } catch (error) {
      console.error(error);
      alert("AI 채점 중 오류가 발생했습니다. 데모 피드백 화면으로 전환합니다.");
      
      // Fallback response in case of API failure
      const fallbackResult = {
        score: 4.0,
        feedback: "Under strict exam conditions, the response demonstrates competent analysis of the issue. Ideas are clear, though organization could be strengthened and key claims are somewhat unsupported.",
        criteria: {
          issueResponse: { grade: "Adequate", explanation: "Presents a clear position in accordance with the task. Covers most directions." },
          argumentDevelopment: { grade: "Adequate", explanation: "Supports assertions with relevant examples, though they could be more thoroughly elaborated." },
          organization: { grade: "Adequate", explanation: "Adequately focused and organized. Paragraph structure is present." },
          grammarVocabulary: { grade: "Adequate", explanation: "Demonstrates sufficient control of language to express ideas with acceptable clarity." }
        },
        corrections: [
          {
            original: "Modern peoples are thinking that we need to protect environment but sometimes economic growth is more important.",
            explanation: "Plurality of 'people' and informal sentence structure.",
            improved: "Modern society generally recognizes the need to protect the environment; however, economic growth is frequently prioritized."
          }
        ],
        modelOutline: `I. Introduction\n   - Thesis statement: balancing environment conservation and economic pragmatism.\nII. Body Paragraph 1: Instances where excessive regulation causes poverty.\nIII. Body Paragraph 2: Long-term consequences of failing to protect ecosystems.\nIV. Conclusion: A sustainable compromise.`,
        modelEssay: `In contemporary discussions, the conflict between environmental preservation and economic progress is a major topic of debate. While some argue that nature should be saved at all costs, a pragmatist must recognize that environmental policies should not jeopardize human livelihoods. Therefore, a balanced approach that protects ecosystems without crippling industry is the most logical path forward.\n\nFirst, imposing extreme regulations to save every species can lead to severe economic distress. In developing countries, resource extraction and agriculture are vital for survival. If governments block these activities, they may trigger mass unemployment and poverty. For instance, shutting down a logging operation to save a local insect species can destroy the livelihood of an entire town. Thus, economic welfare must be considered.\n\nSecond, ignoring the environment entirely leads to long-term economic decay. Polluted waters and deforested lands reduce productivity and cause public health crises that drain state coffers. Thus, complete disregard for nature is also unsustainable. A great nation balances development with strategic reserves and sustainable practices.\n\nUltimately, a healthy compromise is necessary for sustainable progress.`
      };
      
      localStorage.setItem("gre_last_feedback", JSON.stringify(fallbackResult));
      
      // Save mock history
      const storedHistory = localStorage.getItem("gre_awa_history");
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.prompt,
        date: new Date().toISOString().split("T")[0],
        score: 4.0,
        wordCount: getWordCount(),
        mode: "Mock Test" as const
      };
      localStorage.setItem("gre_awa_history", JSON.stringify([newHistoryItem, ...currentHistory]));
      
      router.push("/feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    if (confirm("에세이를 정말 제출하고 실전 AI 채점을 받으시겠습니까?")) {
      submitEssay();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-ets-theme select-none select-text ets-theme">
      {/* Retro ETS Title Header */}
      <div className="bg-[#b4b4b4] border-b-2 border-white px-4 py-2 flex items-center justify-between text-black font-mono font-bold text-xs select-none">
        <div>GRE General Test - Analytical Writing</div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {showTime && (
              <span className="bg-black text-[#00ff00] font-mono px-2 py-0.5 border border-gray-700 text-sm">
                Time Remaining: {formatTime(timeLeft)}
              </span>
            )}
            <button 
              onClick={() => setShowTime(!showTime)}
              className="bg-[#d4d4d4] border-2 border-white border-r-gray-700 border-b-gray-700 active:border-2 active:border-gray-700 active:border-r-white active:border-b-white px-2 py-0.5 text-black hover:bg-gray-300"
            >
              {showTime ? "Hide Time" : "Show Time"}
            </button>
          </div>
        </div>
      </div>

      {/* Retro ETS Action Buttons */}
      <div className="bg-[#d4d4d4] border-b-2 border-[#7a7a7a] px-4 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-sans font-bold">Question 1 of 1</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold font-sans">
          <button 
            onClick={() => alert("GRE Issue 에세이 작성 가이드:\n1. 화면 오른쪽 텍스트 박스에 영문으로 에세이를 타이핑하세요.\n2. 실전과 동일한 환경을 위해 단축키나 에디터 포맷팅(굵게 등)은 비활성화되어 있습니다.\n3. 시간 완료시 자동 제출되며, 우측 상단 'Submit' 버튼으로 직접 제출할 수 있습니다.")}
            className="bg-[#d4d4d4] border-2 border-white border-r-gray-700 border-b-gray-700 active:border-[#7a7a7a] px-4 py-1 flex items-center space-x-1"
          >
            <HelpCircle className="h-3 w-3" />
            <span>Help</span>
          </button>
          <button 
            onClick={confirmExit}
            className="bg-[#d4d4d4] border-2 border-white border-r-gray-700 border-b-gray-700 active:border-[#7a7a7a] px-4 py-1"
          >
            <span>Exit Test</span>
          </button>
          <button 
            onClick={handleManualSubmit}
            disabled={isSubmitting}
            className="bg-accent-600 border-2 border-white border-r-gray-700 border-b-gray-700 text-white font-bold px-6 py-1 hover:bg-accent-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Retro Split Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-3 overflow-hidden bg-[#e0e0e0]">
        {/* Left Side: Topic & Instruction */}
        <div className="bg-white border border-[#7a7a7a] p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold font-sans text-gray-500 border-b border-gray-300 pb-1.5 uppercase">
                Directions
              </h2>
              <p className="text-xs font-sans text-gray-750 leading-relaxed mt-2">
                Analyze the issue prompt below. Write a response in which you discuss the topic according to the specific directions provided. Make sure to structure your thoughts and support your arguments with reasons and examples.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-sans text-gray-500 uppercase">
                Issue Prompt
              </h3>
              <p className="font-serif text-lg leading-relaxed text-black font-semibold bg-gray-50 p-4 border border-gray-200">
                {topic.prompt}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold font-sans text-gray-500 uppercase">
                Task Instructions
              </h3>
              <p className="font-sans text-xs text-gray-800 leading-relaxed bg-[#fefcbf] p-4 border border-[#eab308] font-medium">
                {topic.instruction}
              </p>
            </div>
          </div>
          
          <div className="text-xs font-sans text-gray-400 border-t border-gray-200 pt-3">
            ETS AWA Simulator - Real GRE Experience
          </div>
        </div>

        {/* Right Side: Plain Text Editor */}
        <div className="flex flex-col bg-white border border-[#7a7a7a] overflow-hidden">
          {/* Word counter toolbar */}
          <div className="bg-gray-100 border-b border-gray-300 py-1.5 px-4 flex justify-between items-center text-xs font-sans text-gray-600">
            <span>Standard Text Editor (No Rich Text)</span>
            <span className="font-bold">Word Count: {getWordCount()}</span>
          </div>
          
          {/* Text Editor area */}
          <textarea
            className="flex-1 p-5 focus:outline-none font-serif text-base text-black bg-white resize-none leading-relaxed overflow-y-auto"
            placeholder="Type your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
