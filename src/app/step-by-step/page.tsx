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
  BookOpen,
  Info,
  Lightbulb,
  Compass
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
  
  // Step 3: Tab state for left panel ("outline" | "coach")
  const [leftTab, setLeftTab] = useState<"outline" | "coach">("outline");
  
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
      
      localStorage.setItem("gre_last_feedback", JSON.stringify(result));
      
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
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Header with Nav */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => {
              if (confirm("연습을 종료하고 대시보드로 돌아가시겠습니까? 작성 중인 정보가 손실될 수 있습니다.")) {
                router.push("/");
              }
            }}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>대시보드로 나가기</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 text-sm font-bold">
              <Clock className="h-4.5 w-4.5 text-slate-500" />
              <span className={timeLeft < 60 ? "text-red-500 font-black animate-pulse" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>
            {timerRunning ? (
              <button 
                onClick={() => setTimerRunning(false)}
                className="text-xs font-bold px-3 py-1.5 border border-slate-350 rounded-lg hover:bg-slate-50 transition"
              >
                일시정지
              </button>
            ) : (
              <button 
                onClick={() => setTimerRunning(true)}
                className="text-xs font-bold px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-750 transition"
              >
                재개
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stepper Indicators */}
      <div className="bg-white border-b border-slate-200 py-3.5 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-xs font-bold text-slate-400">
          <button 
            onClick={() => goToStep(1)}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 1 ? "border-indigo-600 text-indigo-650" : "border-transparent text-slate-400"
            }`}
          >
            <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] ${
              step === 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}>1</span>
            <span>지시문 분석 (3분)</span>
          </button>
          
          <div className="w-8 h-px bg-slate-200"></div>

          <button 
            onClick={() => step >= 2 && goToStep(2)}
            disabled={step < 2}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 2 ? "border-indigo-600 text-indigo-650" : "border-transparent text-slate-400"
            } disabled:opacity-50`}
          >
            <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}>2</span>
            <span>브레인스토밍 (5분)</span>
          </button>

          <div className="w-8 h-px bg-slate-200"></div>

          <button 
            onClick={() => step >= 3 && goToStep(3)}
            disabled={step < 3}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 3 ? "border-indigo-600 text-indigo-650" : "border-transparent text-slate-400"
            } disabled:opacity-50`}
          >
            <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] ${
              step === 3 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}>3</span>
            <span>본문 드래프트 (20분)</span>
          </button>

          <div className="w-8 h-px bg-slate-200"></div>

          <button 
            onClick={() => step >= 4 && goToStep(4)}
            disabled={step < 4}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${
              step === 4 ? "border-indigo-600 text-indigo-650" : "border-transparent text-slate-400"
            } disabled:opacity-50`}
          >
            <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] ${
              step === 4 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            }`}>4</span>
            <span>최종 교정 (2분)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace with 3-Column Layout for steps 1, 2, 4 */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-between">
        
        {/* Step 1: Prompt & Tension Analysis */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
            {/* Work Panel (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 1: 지시문 분석 및 핵심 쟁점 정의
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Q. 출제 주제 분석하기</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  아래 출제된 주제의 지시문을 꼼꼼히 읽어보세요. 특히 <span className="prompt-highlight font-semibold">구체적인 지시사항</span>이 무엇을 요구하는지 확인한 뒤, 이 질문의 핵심 갈등/쟁점이 무엇인지 한국어로 가볍게 써 봅니다.
                </p>
              </div>

              {/* Display prompt with highlights */}
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">GRE Issue Prompt</span>
                  <p className="font-serif text-xl text-slate-850 leading-relaxed mt-2 font-bold">
                    &ldquo;{topic.prompt}&rdquo;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Specific Directions (지시 사항)</span>
                  <div className="mt-2 text-sm text-slate-700 leading-relaxed font-medium bg-indigo-50/40 p-4 rounded-xl border-l-4 border-indigo-600">
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
                <label className="block text-sm font-bold text-slate-800">
                  Q. 이 질문의 핵심 쟁점(Tension)은 무엇인가요? (한국어로 짧게 정리해보세요)
                </label>
                <textarea
                  placeholder="예: 과학 기술 연구의 전적인 자유와, 인류의 윤리적/생명적 위협을 막기 위한 정부 규제 간의 대립 구조..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => goToStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition"
                >
                  <span>2단계: 브레인스토밍 개요로 이동</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Beginner Coach Panel (Right 1/3) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Compass className="h-4.5 w-4.5 text-indigo-600" />
                <span>AWA 초보 코치: 지시문 분석법</span>
              </h3>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-700 block mb-1">💡 GRE Analytical Writing 기초</span>
                  이 시험은 수험생이 단순히 영어를 잘 쓰는지를 넘어, **&quot;주어진 주제에 대한 설득력 있는 논리 분석을 전개할 수 있는가&quot;**를 측정합니다.
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">✔ 핵심 쟁점(Central Tension)이란?</span>
                  GRE 모든 주제는 무조건 찬성하거나 반대할 수 없는 **갈등 요소**를 내포합니다. 그 양극단의 가치가 무엇인지 파악하는 것이 논리적인 에세이 작성의 첫 단추입니다.
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">✔ 지시사항(Specific Directions)에 집중하세요</span>
                  단순히 찬반을 적는 데 그치지 않고, 지시사항이 요구하는 특정 행동(예: 반대 입장 비판, 유용한 상황적 예외 설명 등)을 본문 문단에 반드시 명시해야 배점이 깎이지 않습니다.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Outline & Brainstorm */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
            {/* Work Panel (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 2: 브레인스토밍 및 아웃라인 작성
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Q. 논리 뼈대 세우기</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  본문을 쓰기 전 개요를 잡습니다. 입장(Stance)을 토글한 뒤, 논리적인 근거 2가지와 예상되는 반론에 대한 재반박을 간단한 영어 구절이나 한국어 키워드로 미리 메모해두세요.
                </p>
              </div>

              {/* Selection of stance */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <span className="text-sm font-bold text-slate-850 block">1. 나의 입장 선택 (Stance)</span>
                <div className="grid grid-cols-3 gap-3">
                  {["agree", "disagree", "balanced"].map((s) => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setStance(s as any)}
                      className={`py-3 px-4 rounded-xl font-bold text-sm border transition text-center ${
                        stance === s 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s === "agree" && "찬성 (Agree)"}
                      {s === "disagree" && "반대 (Disagree)"}
                      {s === "balanced" && "절충 (Balanced)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outline input fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800">
                    2. 첫 번째 논거 및 사례 (Reason & Example 1)
                  </label>
                  <textarea
                    placeholder="예: 자유로운 과학 연구가 인류 혁신을 이끎 (예시: 플레밍의 페니실린 우연한 발견)"
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800">
                    3. 두 번째 논거 및 사례 (Reason & Example 2)
                  </label>
                  <textarea
                    placeholder="예: 정부의 지나친 연구 제재는 지식 검열로 이어져 실패함 (예시: 구소련의 리센코주의 농업 연구 규제 실패)"
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                    value={reason2}
                    onChange={(e) => setReason2(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800">
                    4. 예상되는 반대 측 주장 수용 및 그에 대한 나의 반박 (Concession & Rebuttal)
                  </label>
                  <textarea
                    placeholder="예: (양보) 복제 양 돌리 등 윤리적 위협은 국가 규제가 필요하다. (반박) 하지만 무조건적인 금지보다는 학술적 중립 위원회에 의한 윤리 심의가 안전장치로서 더 작동한다."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                    value={rebuttal}
                    onChange={(e) => setRebuttal(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button 
                  onClick={() => goToStep(1)}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 transition"
                >
                  <span>이전 단계</span>
                </button>
                <button 
                  onClick={() => goToStep(3)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition"
                >
                  <span>3단계: 본문 드래프트로 이동</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Beginner Coach Panel (Right 1/3) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Lightbulb className="h-4.5 w-4.5 text-indigo-600" />
                <span>AWA 초보 코치: 논리 개요 작성법</span>
              </h3>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-700 block mb-1">💡 설득력 있는 예시 선택법</span>
                  **주의:** &quot;내 친구가 겪었던 일인데...&quot; 같은 사적인 에피소드는 감점 요인입니다. 역사적 사실, 저명한 사회 현상, 혹은 과학적 지식 등 누구나 아는 객관적 사례를 사용하세요.
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">✔ PEEL 문단 구조화 기법</span>
                  - **P (Point)**: 문단의 첫머리에 핵심 논리 주장 1줄 적기 (주제문)
                  - **E (Explanation)**: 주장을 보충하는 부연 논증 설명 1~2줄
                  - **E (Example)**: 객관적인 역사/사회적 사례 예시 3~4줄
                  - **L (Link)**: 사례와 주장을 엮어 나의 입장으로 되돌아오기 1줄
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">✔ 반론 재반박(Concession)은 필수</span>
                  글 전체의 객관성을 보여주기 위해 &quot;반대 입장에서도 어떤 그럴듯한 주장이 있을 수 있다&quot;는 점을 수용한 후, 그럼에도 불구하고 나의 주장이 타당한 이유를 증명하는 것이 만점의 핵심 조건입니다.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Split-Screen Drafting (Fixed equal height) */}
        {step === 3 && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 3: 본문 에세이 작성
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">에세이 드래프트 작성</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Word Count</span>
                <div className={`text-xl font-black ${
                  getWordCount(essay) >= 350 ? "text-green-600" : "text-indigo-600"
                }`}>
                  {getWordCount(essay)} / <span className="text-sm font-semibold text-slate-400">350~600 target</span>
                </div>
              </div>
            </div>

            {/* Split Screen Layout (Locked Height h-[500px]) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] items-stretch">
              
              {/* Left Panel: Outline OR Coach tabs (35%) */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                {/* Tabs */}
                <div className="flex bg-slate-50 border-b border-slate-200 select-none">
                  <button
                    onClick={() => setLeftTab("outline")}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                      leftTab === "outline" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    나의 개요 (Outline)
                  </button>
                  <button
                    onClick={() => setLeftTab("coach")}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                      leftTab === "coach" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    코치 도움말 (Writing Tips)
                  </button>
                </div>

                {/* Tab content (Scrollable within h-[500px]) */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {leftTab === "outline" ? (
                    <div className="space-y-4 text-xs font-medium">
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wide block">My Stance (나의 입장)</span>
                        <span className="mt-1 font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1 inline-block uppercase text-[10px]">
                          {stance}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide block">핵심 쟁점 요약</span>
                        <p className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                          {summary || "기입된 요약이 없습니다."}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide block">Reason & Example 1</span>
                        <p className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                          {reason1 || "기입된 개요가 없습니다."}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide block">Reason & Example 2</span>
                        <p className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                          {reason2 || "기입된 개요가 없습니다."}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide block">Concession & Rebuttal</span>
                        <p className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                          {rebuttal || "기입된 개요가 없습니다."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800 block mb-1">📝 표준 4문장 구조 템플릿</span>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>**1. 서론**: 쟁점 설명(Hook) → 양측 입장 요약 → **나의 뚜렷한 입장/선언(Thesis)**</li>
                          <li>**2. 본론 1**: 핵심 근거 1문장 → 상세 설명 → 객관적 증명 사례 → 소결론 매핑</li>
                          <li>**3. 본론 2**: 핵심 근거 2문장 → 상세 설명 → 대조군/역사 사례 → 소결론 매핑</li>
                          <li>**4. 결론**: 전체 요지 요약 → 양보(어떤 면에선 타당할 수 있음) → 재강조</li>
                        </ul>
                      </div>

                      <div className="border-t border-slate-150 pt-3">
                        <span className="font-bold text-slate-800 block mb-1.5">🔗 만점 단어 은행 (Transition Words)</span>
                        <div className="space-y-2">
                          <div>
                            <span className="font-bold text-indigo-700 block">논거 추가 시</span>
                            <span className="text-[11px] font-mono text-slate-700">Furthermore, In addition, Moreover</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-700 block">대조/반박 시</span>
                            <span className="text-[11px] font-mono text-slate-700">Conversely, On the other hand, However</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-700 block">반대 주장 수용 시</span>
                            <span className="text-[11px] font-mono text-slate-700">Admittedly, To be sure, Granted that</span>
                          </div>
                          <div>
                            <span className="font-bold text-indigo-700 block">결론 도출 시</span>
                            <span className="text-[11px] font-mono text-slate-700">Consequently, Therefore, Ultimately</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Editor (65%) */}
              <div className="lg:col-span-2 flex flex-col border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 py-3 px-5 flex items-center">
                  <div className="text-xs font-bold text-slate-500 font-serif truncate">
                    Topic: {topic.prompt.slice(0, 80)}...
                  </div>
                </div>
                
                <textarea
                  placeholder="여기에 영어로 에세이를 작성하세요. (목표: 350~600단어)"
                  className="flex-1 p-6 text-base font-serif text-slate-850 leading-relaxed focus:outline-none resize-none overflow-y-auto"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <button 
                onClick={() => goToStep(2)}
                className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition"
              >
                <span>이전 단계</span>
              </button>
              
              <button 
                onClick={() => goToStep(4)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition"
              >
                <span>4단계: 최종 점검으로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Self-Proofing & Submit */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
            {/* Work Panel (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Step 4: 최종 자가 교정 및 제출
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Q. 제출하기 전 마지막 오타 체크</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  사소한 타이핑 오류나 스펠링 실수로 에세이의 품격이 낮아지는 것을 막습니다. 아래 자가 체크리스트에 표시하면서 최종 점검을 진행한 뒤 우측 '결과 제출'을 누르세요.
                </p>
              </div>

              {/* Checklist form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-indigo-600" />
                  <span>최종 점검 리스트</span>
                </h3>

                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.spelling}
                      onChange={(e) => setChecklist({ ...checklist, spelling: e.target.checked })}
                      className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="group-hover:text-slate-950 font-medium transition">단어 오타(Spelling) 및 띄어쓰기를 검토했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.punctuation}
                      onChange={(e) => setChecklist({ ...checklist, punctuation: e.target.checked })}
                      className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="group-hover:text-slate-950 font-medium transition">마침표, 쉼표, 문장 첫 문자의 대문자 구성을 확인했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.directions}
                      onChange={(e) => setChecklist({ ...checklist, directions: e.target.checked })}
                      className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="group-hover:text-slate-950 font-medium transition">토픽의 구체적인 지시사항(예: 반대 의견 고려, 사례 중심 서술)을 충족했습니까?</span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist.logicalFlow}
                      onChange={(e) => setChecklist({ ...checklist, logicalFlow: e.target.checked })}
                      className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="group-hover:text-slate-950 font-medium transition">문단 간의 전환사(Transitions)를 적절히 사용해 흐름이 매끄럽습니까?</span>
                  </label>
                </div>
              </div>

              {/* Brief Word Count display */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">작성 완료 에세이 분량</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">
                  {getWordCount(essay)}단어
                </span>
                <span className="text-xs text-slate-400 block mt-1.5 font-medium">
                  (목표치인 350~600단어 범위 내에 수렴할수록 탄탄하고 충분한 논증으로 비추어지기 쉽습니다.)
                </span>
              </div>

              {/* Submission buttons */}
              <div className="pt-4 flex justify-between space-x-3">
                <button 
                  onClick={() => goToStep(3)}
                  disabled={isSubmitting}
                  className="border border-slate-350 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-sm transition"
                >
                  에세이 수정하러 돌아가기
                </button>
                
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>AI 첨삭 분석 중 (약 10초)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                      <span>최종 완료 및 AI 채점 받기</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Beginner Coach Panel (Right 1/3) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <CheckSquare className="h-4.5 w-4.5 text-indigo-600" />
                <span>AWA 초보 코치: 교정 가이드</span>
              </h3>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-700 block mb-1">💡 사소한 실수를 잡아내는 팁</span>
                  글을 소리 내어 (마음속으로) 읽으며 주어와 동사의 단복수 일치, 혹은 시제 일치가 틀린 부분이 있는지 확인해 보세요.
                </div>
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">✔ 대표적인 흔한 문법 에러</span>
                  - **Comma Splice**: 접합사 없이 콤마(,)만으로 완전한 두 문장을 무리하게 잇는 행동 (콤마 대신 세미콜론이나 마침표를 찍거나 접속사 추가)
                  - **Run-on Sentences**: 마침표 없이 두 개 이상의 독립절을 연이어 타이핑하는 현상
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
