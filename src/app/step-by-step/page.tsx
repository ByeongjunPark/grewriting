"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  CheckSquare, 
  FileText, 
  ListOrdered,
  AlertTriangle
} from "lucide-react";
import { greTopics, GRETopic } from "../../data/gre-topics";

export default function StepByStepTraining() {
  const router = useRouter();
  
  // State for current topic
  const [topic, setTopic] = useState<GRETopic>(greTopics[0]);
  
  // Step tracker: 1 | 2 | 3 | 4
  const [step, setStep] = useState<number>(1);
  
  // Timer state (seconds remaining)
  const [timeLeft, setTimeLeft] = useState<number>(180); // Step 1: 3 mins (180s)
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  
  // Step 1: Summary of central issue
  const [summary, setSummary] = useState<string>("");
  
  // Step 2: Outlining details
  const [stance, setStance] = useState<"agree" | "disagree" | "balanced">("agree");
  const [reason1, setReason1] = useState<string>("");
  const [reason2, setReason2] = useState<string>("");
  const [rebuttal, setRebuttal] = useState<string>("");
  
  // Step 3: Drafting essay
  const [essay, setEssay] = useState<string>("");
  
  // Step 4: Submission checks
  const [checklist, setChecklist] = useState({
    spelling: false,
    punctuation: false,
    directions: false,
    logicalFlow: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load selected topic on mount
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

  // Timer logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeExpired();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, timerRunning]);

  // Handle time expiration per step
  const handleTimeExpired = () => {
    setTimerRunning(false);
    if (step === 1) {
      alert("분석 단계 제한 시간(3분)이 만료되었습니다. 개요 작성 단계로 이동합니다.");
      goToStep(2);
    } else if (step === 2) {
      alert("개요 작성 단계 제한 시간(5분)이 만료되었습니다. 드래프트 작성 단계로 이동합니다.");
      goToStep(3);
    } else if (step === 3) {
      alert("드래프트 작성 단계 제한 시간(20분)이 만료되었습니다. 최종 점검 및 제출 단계로 이동합니다.");
      goToStep(4);
    } else if (step === 4) {
      alert("제한 시간이 만료되었습니다. 작성된 에세이를 제출해 피드백을 받으세요.");
    }
  };

  const goToStep = (nextStep: number) => {
    // Save current step data to local state & set timers
    setStep(nextStep);
    setTimerRunning(true);
    
    if (nextStep === 1) {
      setTimeLeft(180); // 3 mins
    } else if (nextStep === 2) {
      setTimeLeft(300); // 5 mins
    } else if (nextStep === 3) {
      setTimeLeft(1200); // 20 mins
    } else if (nextStep === 4) {
      setTimeLeft(120); // 2 mins
    }
  };

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit to Upstage AI Api Route
  const handleSubmit = async () => {
    if (getWordCount(essay) < 50) {
      alert("최소 50단어 이상 작성하셔야 AI 첨삭이 가능합니다. (목표: 350~600단어)");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "Step-by-Step",
          prompt: topic.prompt,
          instruction: topic.instruction,
          summary,
          stance,
          outline: {
            reason1,
            reason2,
            rebuttal
          },
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
        wordCount: getWordCount(essay),
        mode: "Step-by-Step" as const
      };
      
      localStorage.setItem("gre_awa_history", JSON.stringify([newHistoryItem, ...currentHistory]));
      
      router.push("/feedback");
    } catch (error) {
      console.error(error);
      alert("AI 채점 중 오류가 발생했습니다. 데모 모드로 전환하여 결과를 표시합니다.");
      
      // Generate a mock response for fallback safety
      const fallbackResult = {
        score: 4.5,
        feedback: "The essay shows a clear understanding of the task and presents a focused argument. However, transitions between reasons could be smoother and sentence structures more varied to reach a score of 5.0 or 6.0.",
        criteria: {
          issueResponse: { grade: "Adequate", explanation: "The stance is clear and directly addresses the prompt. However, some instructions were only partially met." },
          argumentDevelopment: { grade: "Adequate", explanation: "Reasons are logical, but examples lack depth and detail. More concrete cases would strengthen the position." },
          organization: { grade: "Strong", explanation: "The structure is sound with clear introduction, body paragraphs, and conclusion. Logically connected." },
          grammarVocabulary: { grade: "Adequate", explanation: "Grammar is mostly correct, but the essay relies on basic sentence structures and repetitive vocabulary." }
        },
        corrections: [
          {
            original: "Governments should not restrict scientific developments because it is help for human progress.",
            explanation: "Subject-verb agreement and word choice are awkward.",
            improved: "Governments should refrain from restricting scientific developments as they are crucial for driving human progress."
          },
          {
            original: "For example, in the past people did not know about climate change but now they know.",
            explanation: "Sentence is too simplistic and informal for an academic essay.",
            improved: "To illustrate, prior generations lacked awareness regarding climate change, whereas modern scientific research has illuminated the severity of this crisis."
          }
        ],
        modelOutline: `I. Introduction\n   - Hook: The dual nature of scientific progress.\n   - Thesis: Governments should support scientific R&D with minimal interference, except when ethical boundaries are breached.\n\nII. Body Paragraph 1: Unrestricted research drives innovation and economic prosperity.\n\nIII. Body Paragraph 2: Historical precedents of censorship stalling human development.\n\nIV. Concession & Rebuttal: Address safety concerns and suggest independent ethical boards instead of government blockades.\n\nV. Conclusion: Minimal restriction yields maximal progress.`,
        modelEssay: `Science and technology have served as the twin engines of human progress since the Scientific Revolution. When governments impose restrictions on scientific research, they risk stalling this progress and diminishing societal advancement. Therefore, governments should place few, if any, restrictions on scientific research and development, reserving intervention only for instances of clear, universally agreed-upon ethical violations.\n\nFirst, unrestricted scientific research is the cornerstone of innovation and societal well-being. Throughout history, major breakthroughs—ranging from the discovery of penicillin to the development of the internet—occurred in environments where inquiry was encouraged rather than regulated. Had governments restricted early experiments with electricity or molecular biology due to fear of the unknown, the modern medical and technological conveniences we enjoy today might not exist. Allowing researchers to pursue their curiosity leads to unexpected discoveries that yield massive public benefits.\n\nSecond, historical precedents demonstrate that political intervention in science rarely ends well. When political bodies control the parameters of scientific research, ideology overrides objective truth. A classic example is Lysenkoism in the Soviet Union, where genetics research was banned in favor of politically convenient agricultural theories, leading to crop failures and famine. When scientific inquiry is restricted to fit a government's narrative or short-term economic goal, society at large pays the price.\n\nTo be sure, opponents argue that certain technologies, such as nuclear physics or genetic engineering, pose existential risks that necessitate strict state oversight. Indeed, ethical safeguards are necessary to prevent issues like human cloning or biological warfare. However, this oversight is best managed by independent scientific boards and global academic consortiums rather than domestic political bodies, which are susceptible to nationalistic and partisan agendas. Regulation should ensure safety without choking the creative freedom necessary for scientific progress.\n\nIn conclusion, while ethical boundaries must exist to protect humanity from dangerous misapplications of technology, governments should prioritize research freedom. By trusting the academic community and funding broad-based scientific endeavors with minimal red tape, nations can ensure they remain at the vanguard of discovery.`
      };
      
      localStorage.setItem("gre_last_feedback", JSON.stringify(fallbackResult));
      
      // Save mock to history
      const storedHistory = localStorage.getItem("gre_awa_history");
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.prompt,
        date: new Date().toISOString().split("T")[0],
        score: 4.5,
        wordCount: getWordCount(essay),
        mode: "Step-by-Step" as const
      };
      localStorage.setItem("gre_awa_history", JSON.stringify([newHistoryItem, ...currentHistory]));
      
      router.push("/feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-brand-50">
      {/* Header with Nav */}
      <header className="border-b border-brand-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => {
              if (confirm("연습을 종료하고 대시보드로 돌아가시겠습니까? 작성 중인 정보가 손실될 수 있습니다.")) {
                router.push("/");
              }
            }}
            className="flex items-center space-x-2 text-sm font-semibold text-brand-600 hover:text-brand-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-brand-100 rounded-lg text-brand-700 text-sm font-semibold">
              <Clock className="h-4 w-4 text-brand-500" />
              <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>
            {timerRunning ? (
              <button 
                onClick={() => setTimerRunning(false)}
                className="text-xs font-semibold px-2.5 py-1 border border-brand-300 rounded hover:bg-brand-100 transition"
              >
                Pause
              </button>
            ) : (
              <button 
                onClick={() => setTimerRunning(true)}
                className="text-xs font-semibold px-2.5 py-1 bg-accent-600 text-white rounded hover:bg-accent-700 transition"
              >
                Resume
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stepper Indicators */}
      <div className="bg-white border-b border-brand-100 py-3">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-xs font-bold">
          <button 
            onClick={() => goToStep(1)}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 1 ? "border-accent-600 text-accent-600" : "border-transparent text-brand-400"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px]">1</span>
            <span>지시문 분석 (3분)</span>
          </button>
          
          <div className="w-8 h-px bg-brand-200"></div>

          <button 
            onClick={() => step >= 2 && goToStep(2)}
            disabled={step < 2}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 2 ? "border-accent-600 text-accent-600" : "border-transparent text-brand-400"
            } disabled:opacity-50`}
          >
            <span className="h-5 w-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px]">2</span>
            <span>브레인스토밍 (5분)</span>
          </button>

          <div className="w-8 h-px bg-brand-200"></div>

          <button 
            onClick={() => step >= 3 && goToStep(3)}
            disabled={step < 3}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 3 ? "border-accent-600 text-accent-600" : "border-transparent text-brand-400"
            } disabled:opacity-50`}
          >
            <span className="h-5 w-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px]">3</span>
            <span>본문 드래프트 (20분)</span>
          </button>

          <div className="w-8 h-px bg-brand-200"></div>

          <button 
            onClick={() => step >= 4 && goToStep(4)}
            disabled={step < 4}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 4 ? "border-accent-600 text-accent-600" : "border-transparent text-brand-400"
            } disabled:opacity-50`}
          >
            <span className="h-5 w-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px]">4</span>
            <span>최종 교정 (2분)</span>
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        {/* Step 1: Analyze prompt */}
        {step === 1 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-accent-600 bg-accent-50 border border-accent-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 1: Prompt & Instructions Analysis
                </span>
                <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight">주제 지시사항 분석 및 핵심 쟁점 정의</h2>
                <p className="text-sm text-brand-500">
                  아래 출제된 주제의 지시문을 꼼꼼히 읽어보세요. 특히 <span className="prompt-highlight">구체적인 지시사항</span>이 가리키는 포인트를 확인한 뒤, 이 질문의 핵심 쟁점(Tension)이 무엇인지 자신의 생각을 짧게 정리해 봅니다.
                </p>
              </div>

              {/* Display prompt with highlights */}
              <div className="bg-white border border-brand-200 rounded-xl p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-semibold text-brand-400 uppercase">GRE Issue Prompt:</span>
                  <p className="font-serif text-2xl text-brand-850 leading-relaxed mt-1">
                    &ldquo;{topic.prompt}&rdquo;
                  </p>
                </div>
                <div className="border-t border-brand-100 pt-5">
                  <span className="text-xs font-semibold text-brand-400 uppercase">Specific Directions:</span>
                  <div className="mt-1 text-base text-brand-700 leading-relaxed font-medium bg-brand-50 p-4 rounded-lg border-l-4 border-accent-500">
                    {/* Render highlights for user instruction context */}
                    {topic.instructionType === 'advantageous' && (
                      <span>Write a response in which you discuss the extent to which you agree or disagree with the recommendation... <span className="prompt-highlight">describe specific circumstances in which adopting the recommendation would or would not be advantageous</span> and explain how these shape your position.</span>
                    )}
                    {topic.instructionType === 'true_false' && (
                      <span>Write a response in which you discuss the extent to which you agree or disagree... <span className="prompt-highlight">consider ways in which the statement might or might not hold true</span> and explain how these considerations shape your position.</span>
                    )}
                    {topic.instructionType === 'challenge' && (
                      <span>Write a response in which you discuss the extent to which you agree or disagree... <span className="prompt-highlight">be sure to address the most compelling reasons and/or examples that could be used to challenge your position</span>.</span>
                    )}
                    {topic.instructionType === 'claim_reason' && (
                      <span>Write a response in which you discuss the extent to which you agree or disagree with the <span className="prompt-highlight">claim</span> and the <span className="prompt-highlight">reason on which that claim is based</span>.</span>
                    )}
                    {topic.instructionType === 'two_views' && (
                      <span>Write a response in which you discuss which view aligns with your own... <span className="prompt-highlight">be sure to address both of the views presented</span>.</span>
                    )}
                    {topic.instructionType === 'consequences' && (
                      <span>Write a response in which you discuss your views on the policy... <span className="prompt-highlight">consider the possible consequences of implementing the policy</span>.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prompt tension summary */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-brand-800">
                  Q. 이 질문의 핵심 갈등/쟁점(Central Tension)은 무엇인가요? (나의 말로 요약해보기)
                </label>
                <textarea
                  placeholder="예: 과학 기술의 무조건적인 자유(발전)와 인류 안보를 위한 필요 최소한의 제재(규제) 간의 긴장 관계..."
                  rows={4}
                  className="w-full border border-brand-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-100 flex justify-end">
              <button 
                onClick={() => goToStep(2)}
                className="bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
              >
                <span>2단계: 개요 작성으로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Outline & Brainstorm */}
        {step === 2 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-accent-600 bg-accent-50 border border-accent-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 2: Brainstorming & Outlining
                </span>
                <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight">아이디어 도출 및 아웃라인 완성</h2>
                <p className="text-sm text-brand-500">
                  드래프트(본문)를 작성하기 전에 설문 양식을 작성하듯 뼈대를 만듭니다. 입장(Stance)을 선택한 뒤 구체적인 근거와 예시를 한눈에 볼 수 있도록 핵심 키워드 중심이나 짧은 구절로 작성해 보세요.
                </p>
              </div>

              {/* Selection of stance */}
              <div className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm space-y-4">
                <span className="text-sm font-bold text-brand-850 block">1. 나의 입장 선택 (Stance)</span>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    type="button"
                    onClick={() => setStance("agree")}
                    className={`py-3 px-4 rounded-lg font-semibold text-sm border transition text-center ${
                      stance === "agree" 
                        ? "bg-accent-600 border-accent-600 text-white shadow-sm" 
                        : "bg-brand-50 border-brand-200 hover:bg-brand-100 text-brand-600"
                    }`}
                  >
                    찬성 (Agree)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStance("disagree")}
                    className={`py-3 px-4 rounded-lg font-semibold text-sm border transition text-center ${
                      stance === "disagree" 
                        ? "bg-accent-600 border-accent-600 text-white shadow-sm" 
                        : "bg-brand-50 border-brand-200 hover:bg-brand-100 text-brand-600"
                    }`}
                  >
                    반대 (Disagree)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStance("balanced")}
                    className={`py-3 px-4 rounded-lg font-semibold text-sm border transition text-center ${
                      stance === "balanced" 
                        ? "bg-accent-600 border-accent-600 text-white shadow-sm" 
                        : "bg-brand-50 border-brand-200 hover:bg-brand-100 text-brand-600"
                    }`}
                  >
                    절충 (Balanced/Qualified)
                  </button>
                </div>
              </div>

              {/* Outline input fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-brand-800">
                    2. 첫 번째 근거(Reason 1) 및 이를 입증할 구체적 사례(Example 1)
                  </label>
                  <textarea
                    placeholder="예: 자유로운 연구 환경이 예상치 못한 혁신을 가져옴 (사례: 플레밍의 우연한 페니실린 발견)"
                    rows={3}
                    className="w-full border border-brand-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-brand-800">
                    3. 두 번째 근거(Reason 2) 및 이를 입증할 구체적 사례(Example 2)
                  </label>
                  <textarea
                    placeholder="예: 정치적/사상적 간섭은 과학 발전을 지체시킴 (사례: 소련의 리센코주의 농업 정책 실패)"
                    rows={3}
                    className="w-full border border-brand-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white"
                    value={reason2}
                    onChange={(e) => setReason2(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-brand-800">
                    4. 예상되는 반대 의견(Concession) 및 이에 대한 내 주장의 재반박(Rebuttal)
                  </label>
                  <textarea
                    placeholder="예: (반론) 유전자 조작이나 핵 무기 등 위협은 규제가 필요하지 않은가? (재반박) 단순한 정부 행정 제재보다는 학술 협회나 독립적 윤리 위원회의 투명한 자율 규제가 더 효과적임"
                    rows={3}
                    className="w-full border border-brand-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white"
                    value={rebuttal}
                    onChange={(e) => setRebuttal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-100 flex justify-between">
              <button 
                onClick={() => goToStep(1)}
                className="border border-brand-300 hover:bg-brand-100 text-brand-700 font-semibold py-2 px-5 rounded-lg flex items-center space-x-2 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>이전 단계</span>
              </button>
              
              <button 
                onClick={() => goToStep(3)}
                className="bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
              >
                <span>3단계: 본문 작성으로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Split-Screen Drafting */}
        {step === 3 && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-accent-600 bg-accent-50 border border-accent-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 3: Essay Writing Draft
                </span>
                <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight mt-1.5">본문 드래프트 작성</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-brand-400">Word Count</span>
                <div className={`text-lg font-bold ${
                  getWordCount(essay) >= 350 ? "text-green-600" : "text-brand-600"
                }`}>
                  {getWordCount(essay)} / <span className="text-sm font-medium text-brand-400">350~600 target</span>
                </div>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
              {/* Left Panel: Outline Review (35%) */}
              <div className="lg:col-span-1 bg-brand-100 border border-brand-200 rounded-xl p-5 space-y-5 overflow-y-auto max-h-[600px] shadow-inner">
                <h3 className="font-bold text-brand-900 text-sm border-b border-brand-200 pb-2 flex items-center space-x-1.5">
                  <ListOrdered className="h-4 w-4 text-accent-500" />
                  <span>나의 아웃라인 요약본</span>
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-brand-400 uppercase tracking-wide">My Stance</span>
                    <p className="mt-1 font-semibold text-brand-900 uppercase bg-white border border-brand-200 rounded px-2.5 py-1 inline-block">
                      {stance}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-400 uppercase tracking-wide">Tension (1단계 요약)</span>
                    <p className="mt-1 text-brand-700 leading-relaxed bg-white border border-brand-200 rounded p-2.5 whitespace-pre-wrap">
                      {summary || "작성된 내용이 없습니다."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-400 uppercase tracking-wide">Reason & Example 1</span>
                    <p className="mt-1 text-brand-700 leading-relaxed bg-white border border-brand-200 rounded p-2.5 whitespace-pre-wrap">
                      {reason1 || "작성된 내용이 없습니다."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-400 uppercase tracking-wide">Reason & Example 2</span>
                    <p className="mt-1 text-brand-700 leading-relaxed bg-white border border-brand-200 rounded p-2.5 whitespace-pre-wrap">
                      {reason2 || "작성된 내용이 없습니다."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-400 uppercase tracking-wide">Concession & Rebuttal</span>
                    <p className="mt-1 text-brand-700 leading-relaxed bg-white border border-brand-200 rounded p-2.5 whitespace-pre-wrap">
                      {rebuttal || "작성된 내용이 없습니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel: Editor (65%) */}
              <div className="lg:col-span-2 flex flex-col border border-brand-200 bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Editor Header */}
                <div className="bg-brand-50 border-b border-brand-200 py-3 px-5 flex justify-between items-center">
                  <div className="text-xs font-semibold text-brand-600 font-serif">
                    Prompt: {topic.prompt.slice(0, 70)}...
                  </div>
                </div>
                
                {/* Real Textarea Editor */}
                <textarea
                  placeholder="Start writing your GRE Issue essay here..."
                  className="flex-1 p-6 text-base font-serif text-brand-850 leading-relaxed focus:outline-none resize-none min-h-[400px]"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-brand-100 flex justify-between">
              <button 
                onClick={() => goToStep(2)}
                className="border border-brand-300 hover:bg-brand-100 text-brand-700 font-semibold py-2 px-5 rounded-lg flex items-center space-x-2 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>이전 단계</span>
              </button>
              
              <button 
                onClick={() => goToStep(4)}
                className="bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
              >
                <span>4단계: 최종 교정으로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Self-Proofing & Submit */}
        {step === 4 && (
          <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-accent-600 bg-accent-50 border border-accent-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 4: Self-Proofing & Final Check
                </span>
                <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight mt-1.5">최종 오타 및 논리 전개 점검</h2>
                <p className="text-sm text-brand-500">
                  제출하기 전에 아래 체크리스트를 확인하여 사소한 실수를 방지하세요. 체크를 완료한 뒤, 우주 최고 성능의 **Solar AI** 첨삭을 받으세요!
                </p>
              </div>

              {/* Checklist form */}
              <div className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-900 text-sm flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-accent-600" />
                  <span>제출 전 체크리스트 (ETS 권장사항)</span>
                </h3>

                <div className="space-y-3 pt-2 text-sm text-brand-700">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.spelling}
                      onChange={(e) => setChecklist({ ...checklist, spelling: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-brand-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="group-hover:text-brand-950 transition">단어 오타(Spelling) 및 띄어쓰기를 검토했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.punctuation}
                      onChange={(e) => setChecklist({ ...checklist, punctuation: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-brand-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="group-hover:text-brand-950 transition">마침표, 쉼표, 문장 첫 문자의 대문자 구성을 확인했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.directions}
                      onChange={(e) => setChecklist({ ...checklist, directions: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-brand-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="group-hover:text-brand-950 transition">주제의 구체적인 지시사항(예: 반대 의견 고려, 사례 중심 서술)을 충족했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.logicalFlow}
                      onChange={(e) => setChecklist({ ...checklist, logicalFlow: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-brand-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="group-hover:text-brand-950 transition">문단 간의 전환사(Transitions)를 적절히 사용해 흐름이 매끄럽습니까?</span>
                  </label>
                </div>
              </div>

              {/* Brief Word Count display */}
              <div className="bg-brand-100 border border-brand-200 rounded-xl p-4 text-center">
                <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide block">작성 완료 에세이 분량</span>
                <span className="text-xl font-extrabold text-brand-900 block mt-1">
                  {getWordCount(essay)}단어 작성
                </span>
                <span className="text-xs text-brand-400 block mt-1">
                  (추천 목표인 350~600단어 범위 내에 있으면 우수한 점수를 받기 좋습니다.)
                </span>
              </div>
            </div>

            {/* Submission buttons */}
            <div className="mt-8 pt-6 border-t border-brand-100 flex flex-col space-y-3">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Solar AI 첨삭 분석 중 (약 10초)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <span>AI 피드백 및 채점 결과 확인</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={() => goToStep(3)}
                disabled={isSubmitting}
                className="w-full border border-brand-300 hover:bg-brand-100 text-brand-700 font-semibold py-2 px-6 rounded-xl text-sm transition"
              >
                에세이 수정하러 본문 드래프트로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
