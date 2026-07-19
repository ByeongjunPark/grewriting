"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckSquare, 
  BookOpen, 
  Compass,
  Lightbulb,
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import { greTopics, GRETopic } from "../../data/gre-topics";

export default function GuidedBeginner() {
  const router = useRouter();
  
  const [topic, setTopic] = useState<GRETopic>(greTopics[0]);
  const [step, setStep] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins for Step 1
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  
  // Form states
  const [summary, setSummary] = useState<string>("");
  const [stance, setStance] = useState<"agree" | "disagree" | "balanced">("agree");
  
  // Thesis builder states
  const [thesisText, setThesisText] = useState<string>("");
  const [reason1, setReason1] = useState<string>("");
  const [selectedExample, setSelectedExample] = useState<string>("");
  
  // Drafting states
  const [essay, setEssay] = useState<string>("");
  
  // Checklist states
  const [checklist, setChecklist] = useState({
    spelling: false,
    punctuation: false,
    introBodyOnly: false,
    thesisIncluded: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedTopic = localStorage.getItem("gre_current_topic");
    if (storedTopic) {
      try {
        setTopic(JSON.parse(storedTopic));
      } catch (e) {}
    }
  }, []);

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
      alert("분석 단계 제한 시간(5분)이 완료되었습니다. 개요/서론 아웃라인 단계로 이동합니다.");
      goToStep(2);
    } else if (step === 2) {
      alert("개요 설계 단계 제한 시간(5분)이 완료되었습니다. 작문 드래프트 단계로 이동합니다.");
      goToStep(3);
    } else if (step === 3) {
      alert("작성 단계 제한 시간(15분)이 완료되었습니다. 검토 및 제출 단계로 이동합니다.");
      goToStep(4);
    }
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    setTimerRunning(true);
    if (nextStep === 1) setTimeLeft(300); // 5 mins
    else if (nextStep === 2) setTimeLeft(300); // 5 mins
    else if (nextStep === 3) setTimeLeft(900); // 15 mins
    else if (nextStep === 4) setTimeLeft(180); // 3 mins
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleApplyThesisTemplate = (templateType: number) => {
    const topicKeywords = topic.category.split(" & ");
    const keyword = topicKeywords[0] || "this issue";
    
    if (templateType === 1) {
      setThesisText(`Although some argue that restrictions on ${keyword} are necessary to prevent societal harm, I believe that we should place few restrictions on it because scientific autonomy promotes innovation and historical precedents show that government censorship invariably stalls progress.`);
    } else if (templateType === 2) {
      setThesisText(`While the recommendation to praise positive actions in ${keyword} is well-intentioned, ignoring negative behaviors entirely is impractical because classroom discipline collapses without boundaries and students require objective feedback to recognize their limitations.`);
    } else {
      setThesisText(`In this issue concerning ${keyword}, I firmly agree that the government should provide tuition-free higher education because it expands the middle class and drives long-term economic prosperity.`);
    }
  };

  const handleSubmit = async () => {
    const wc = getWordCount(essay);
    if (wc < 40) {
      alert("최소 40단어 이상 입력하셔야 채점이 가능합니다. (권장: 150~250단어)");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "Step-by-Step",
          level: "beginner",
          prompt: topic.prompt,
          instruction: topic.instruction,
          summary,
          stance,
          outline: {
            reason1: `${reason1} (Example: ${selectedExample})`,
            reason2: "",
            rebuttal: ""
          },
          essay
        })
      });

      if (!response.ok) throw new Error("API failed");
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
        wordCount: wc,
        mode: "Step-by-Step" as const
      };
      
      localStorage.setItem("gre_awa_history", JSON.stringify([newHistoryItem, ...currentHistory]));
      router.push("/feedback");
    } catch (e) {
      console.error(e);
      alert("AI 채점 중 오류가 발생하여 데모 평가 화면으로 이동합니다.");
      
      const fallbackResult = {
        score: 4.0,
        feedback: "1단계 쌩초보 에세이 작성을 축하드립니다! 서론의 뚜렷한 입장 선언(Thesis Statement)과 본문 1문단의 구성(PEEL 구조)이 원만하게 정돈되어 있습니다. 다만 글의 분량을 늘리고 양론을 균형 있게 다루기 위해서는 두 번째 본론 문단과 반대 측 입장을 양보 및 재반박하는 문장이 추가로 보강되어야 합니다.",
        criteria: {
          issueResponse: { grade: "Strong", explanation: "서론에서 자신의 명확한 Stance를 피력하고 지시문에 답하려 한 점이 훌륭합니다." },
          argumentDevelopment: { grade: "Adequate", explanation: "선택한 예시(미국사 사례)를 본문에 나열하였으나, 사례와 주장 간의 논리적 연결 고리(Link)에 대한 설명이 조금 더 유기적이어야 합니다." },
          organization: { grade: "Adequate", explanation: "서론과 본론 1개 문단 구조는 명확하나, 완전한 에세이가 되기엔 단락의 절대적 숫자가 부족합니다." },
          grammarVocabulary: { grade: "Adequate", explanation: "단순 문장이 반복되는 경향이 있어 전환사를 다양하게 활용해볼 것을 권장합니다." }
        },
        corrections: [
          {
            original: "Free research is good and government should not ban it because it help progress.",
            explanation: "단어 선택이 단조롭고 3인칭 단수 동사 일치가 틀렸습니다.",
            improved: "Unrestricted research is highly beneficial, and the government should refrain from banning it because it drives human progress."
          }
        ],
        modelOutline: "I. Introduction\n   - Thesis: Governments should support scientific R&D with minimal interference.\nII. Body Paragraph 1: Free inquiry drives technological innovation (e.g. DARPA & Internet).\nIII. Conclusion: Free science is essential for future competitiveness.",
        modelEssay: "In modern society, scientific inquiry is the cornerstone of progress. Governments should place few, if any, restrictions on scientific research and development, because intellectual freedom is the engine of technological innovation.\n\nFirst, history demonstrates that breakthroughs occur when researchers are granted autonomy. For example, the development of ARPANET (the precursor to the internet) by DARPA, and the Human Genome Project funded by the NIH, illustrate how scientific autonomy leads to innovations that transform society. Free from state censorship, scientists were able to explore complex questions, leading to consumer spin-offs like GPS and advanced biotechnology. Therefore, providing academic freedom is key to national progress."
      };
      
      localStorage.setItem("gre_last_feedback", JSON.stringify(fallbackResult));
      
      const storedHistory = localStorage.getItem("gre_awa_history");
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.prompt,
        date: new Date().toISOString().split("T")[0],
        score: 4.0,
        wordCount: wc,
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
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => confirm("연습을 종료하고 대시보드로 돌아가시겠습니까?") && router.push("/")}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>대시보드로 돌아가기</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">1단계: 완전 쌩초보 모드</span>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 text-sm font-bold">
              <Clock className="h-4.5 w-4.5 text-slate-500" />
              <span className={timeLeft < 60 ? "text-red-500 font-black animate-pulse" : ""}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-xs font-bold text-slate-400">
          <button onClick={() => goToStep(1)} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${step === 1 ? "border-green-600 text-green-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? "bg-green-600 text-white" : "bg-slate-100"}`}>1</span>
            <span>지문 분석 & 배경지식 공부</span>
          </button>
          <div className="w-8 h-px bg-slate-200"></div>
          <button onClick={() => step >= 2 && goToStep(2)} disabled={step < 2} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${step === 2 ? "border-green-600 text-green-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? "bg-green-600 text-white" : "bg-slate-100"}`}>2</span>
            <span>서론 문장 빌더 (Thesis)</span>
          </button>
          <div className="w-8 h-px bg-slate-200"></div>
          <button onClick={() => step >= 3 && goToStep(3)} disabled={step < 3} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${step === 3 ? "border-green-600 text-green-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? "bg-green-600 text-white" : "bg-slate-100"}`}>3</span>
            <span>서론+본론1단락 작문</span>
          </button>
          <div className="w-8 h-px bg-slate-200"></div>
          <button onClick={() => step >= 4 && goToStep(4)} disabled={step < 4} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition ${step === 4 ? "border-green-600 text-green-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? "bg-green-600 text-white" : "bg-slate-100"}`}>4</span>
            <span>최종 점검 및 제출</span>
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-between">
        
        {/* Step 1: Study & Analysis */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch flex-1">
            {/* Left Work */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase">Step 1: 지문 이해 & 쟁점 찾기</span>
                  <h2 className="text-2xl font-black text-slate-900">Q. 문제의 쟁점과 지시사항 확인하기</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    아래 출제된 주제의 지시문을 꼼꼼히 읽어보세요. 이 질문의 핵심 대립(Tension)이 무엇인지 한글로 한 문장 정리해보세요. 우측 공부방 자료를 그대로 읽으며 키워드를 파악해 봅니다.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">GRE Issue Prompt</span>
                    <p className="font-serif text-lg text-slate-850 leading-relaxed mt-2 font-bold">&ldquo;{topic.prompt}&rdquo;</p>
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-400 uppercase block">지시 사항 (Directions)</span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-4 border-slate-400">{topic.instruction}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-800">Q. 이 질문의 핵심 대립 구조를 한글로 정리해보세요.</label>
                  <textarea
                    placeholder="예: 과학 기술의 절대적인 연구 자유와, 사회적/생명윤리적 위협을 통제하려는 정부 규제 사이의 대립"
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-150 flex justify-end">
                <button 
                  onClick={() => goToStep(2)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
                >
                  <span>2단계: 서론 문장 빌더로 가기</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: US Background Study on Screen */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[580px] overflow-hidden">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <BookOpen className="h-4.5 w-4.5 text-green-600" />
                <span>배경지식 바로 학습하기</span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-5 pt-3 pr-1 text-xs">
                {/* Agree Stances */}
                <div className="space-y-3">
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-bold border border-green-150 text-[9px] uppercase">Agree Points (찬성 측 사례)</span>
                  {topic.agreePoints?.map((pt, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
                      <p className="font-bold text-slate-800">{pt.argumentKo}</p>
                      <p className="font-mono text-slate-400 italic text-[10px]">{pt.argumentEn}</p>
                      <div className="border-t border-slate-200/60 pt-1.5 mt-1 text-slate-600">
                        <strong className="text-[10px] text-green-700 block">🇺🇸 US Example:</strong>
                        <p className="font-sans leading-relaxed">{pt.exampleKo}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disagree Stances */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-bold border border-red-150 text-[9px] uppercase">Disagree Points (반대 측 사례)</span>
                  {topic.disagreePoints?.map((pt, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
                      <p className="font-bold text-slate-800">{pt.argumentKo}</p>
                      <p className="font-mono text-slate-400 italic text-[10px]">{pt.argumentEn}</p>
                      <div className="border-t border-slate-200/60 pt-1.5 mt-1 text-slate-600">
                        <strong className="text-[10px] text-red-700 block">🇺🇸 US Example:</strong>
                        <p className="font-sans leading-relaxed">{pt.exampleKo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Thesis Builder */}
        {step === 2 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase">Step 2: 입장 선택 & 서론 Thesis 빌더</span>
                <h2 className="text-2xl font-black text-slate-900">Q. 서론의 핵심 문장(Thesis Statement) 빌딩하기</h2>
                <p className="text-sm text-slate-500 font-medium">
                  GRE 에세이 서론의 마지막 문장은 **자신의 분명한 입장(Thesis Statement)**이어야 합니다. 아래의 템플릿 예시 버튼을 누르면 영어 문장이 자동 생성되며, 자신의 입장에 맞춰 다듬어 보세요.
                </p>
              </div>

              {/* Stance select */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <span className="text-sm font-bold text-slate-850 block">1. 나의 stance 결정</span>
                <div className="grid grid-cols-3 gap-3">
                  {["agree", "disagree", "balanced"].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStance(s as any)}
                      className={`py-3 rounded-xl font-bold text-sm border transition cursor-pointer ${
                        stance === s ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100" : "bg-slate-55 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s === "agree" && "찬성 (Agree)"}
                      {s === "disagree" && "반대 (Disagree)"}
                      {s === "balanced" && "절충 (Balanced)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-slate-850 block">2. 쌩초보 추천 Thesis 문장 템플릿 (아래 중 하나를 선택해보세요)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleApplyThesisTemplate(1)}
                    className="p-4 border border-slate-200 bg-white rounded-xl text-left hover:border-green-500 transition space-y-1 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">템플릿 1 (대조 양보형)</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono">Although some argue that..., I believe that... because Reason A and Reason B.</p>
                  </button>
                  <button 
                    onClick={() => handleApplyThesisTemplate(2)}
                    className="p-4 border border-slate-200 bg-white rounded-xl text-left hover:border-green-500 transition space-y-1 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">템플릿 2 (부작용 반증형)</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono">While the recommendation is well-intentioned, ignoring... is impractical because...</p>
                  </button>
                  <button 
                    onClick={() => handleApplyThesisTemplate(3)}
                    className="p-4 border border-slate-200 bg-white rounded-xl text-left hover:border-green-500 transition space-y-1 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">템플릿 3 (직진 옹호형)</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono">In this issue concerning..., I firmly agree that... because it expands...</p>
                  </button>
                </div>
              </div>

              {/* Thesis input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800">3. 완성할 영어 Thesis Statement 문장 (서론 문장 완성하기)</label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={thesisText}
                  onChange={(e) => setThesisText(e.target.value)}
                  placeholder="위 템플릿 버튼을 누르거나 직접 영문으로 기입해 완성하세요."
                />
              </div>

              {/* Reason 1 & Example selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase">본론 1에 사용할 핵심 논거 (영작 또는 한글 요약)</label>
                  <input
                    type="text"
                    placeholder="예: 자유로운 학술 연구 보장이 인터넷 등 파급적 기술을 만듦"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase">본론 1에 예시로 삼을 미국 역사 사례 키워드</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-semibold text-slate-700"
                    value={selectedExample}
                    onChange={(e) => setSelectedExample(e.target.value)}
                  >
                    <option value="">-- 사례 선택 (미국 역사/사회) --</option>
                    <option value="DARPA & Internet (ARPANET)">DARPA & Internet (ARPANET)</option>
                    <option value="Human Genome Project (NIH)">Human Genome Project (NIH)</option>
                    <option value="Manhattan Project / Nuclear Arms">Manhattan Project / Nuclear Arms</option>
                    <option value="Tuskegee Syphilis Study & IRB rules">Tuskegee Syphilis Study & IRB rules</option>
                    <option value="B.F. Skinner Behaviorism & PBIS">B.F. Skinner Behaviorism & PBIS</option>
                    <option value="Stanford Dweck Growth Mindset">Stanford Dweck Growth Mindset</option>
                    <option value="G.I. Bill (1944)">G.I. Bill (1944)</option>
                    <option value="Morrill Land-Grant Acts (1862)">Morrill Land-Grant Acts (1862)</option>
                    <option value="California Master Plan (1960)">California Master Plan (1960)</option>
                    <option value="Thoreau at Walden Pond">Thoreau at Walden Pond</option>
                    <option value="First Amendment (Free Speech)">First Amendment (Free Speech)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between">
              <button onClick={() => goToStep(1)} className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition cursor-pointer">이전 단계</button>
              <button 
                onClick={() => {
                  if (!thesisText.trim()) {
                    alert("Thesis Statement를 입력하거나 템플릿을 선택하셔야 다음 단계로 넘어갈 수 있습니다.");
                    return;
                  }
                  goToStep(3);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <span>3단계: 작문 드래프트 쓰기로 가기</span>
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
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase">Step 3: 단기 집중 에세이 작문</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">서론 + 본론 1개 문단만 완결해보기</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Word Count</span>
                <div className={`text-xl font-black ${getWordCount(essay) >= 150 ? "text-green-600" : "text-indigo-650"}`}>
                  {getWordCount(essay)} / <span className="text-xs text-slate-400">150~250 words target</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px] items-stretch">
              {/* Left Panel: Outline Summary & Starters */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col overflow-y-auto space-y-5 shadow-sm text-xs font-medium">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase block tracking-wider mb-1">내가 작성한 서론 입장문 (Thesis)</span>
                  <p className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-relaxed font-mono italic">{thesisText}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase block tracking-wider mb-1">본론 1 설계</span>
                  <ul className="space-y-1 list-disc pl-4 text-slate-655">
                    <li>**주장**: {reason1 || "미작성"}</li>
                    <li>**적용 사례**: {selectedExample || "미선택"}</li>
                  </ul>
                </div>

                <div className="border-t border-slate-150 pt-4 space-y-3 text-slate-600">
                  <span className="font-extrabold text-slate-800 block">💡 쌩초보용 영작 힌트/문장 조각</span>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-green-700 block">서론 시작할 때 (Intro Hook):</span>
                      <span className="font-mono text-slate-600 block bg-slate-50 p-1.5 rounded mt-0.5">In today&apos;s society, the question of whether... has sparked intense debate.</span>
                    </div>
                    <div>
                      <span className="font-bold text-green-700 block">본론 1 시작할 때 (PEEL Point):</span>
                      <span className="font-mono text-slate-600 block bg-slate-50 p-1.5 rounded mt-0.5">First, it is undeniable that...</span>
                    </div>
                    <div>
                      <span className="font-bold text-green-700 block">예시 설명 도입부 (PEEL Example):</span>
                      <span className="font-mono text-slate-600 block bg-slate-50 p-1.5 rounded mt-0.5">To illustrate, this is clearly shown in the case of...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Editor */}
              <div className="lg:col-span-2 flex flex-col border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 py-3 px-5 text-xs text-slate-450 font-serif">
                  작성 범위: 서론 한 단락 + 본론 한 단락만 완결하시면 됩니다.
                </div>
                <textarea
                  placeholder="여기에 영어로 작성하세요. 위의 Thesis Statement 문장을 서론 끝부분에 그대로 복사해서 삽입한 뒤, 본론 1단락을 마저 작성해보세요!"
                  className="flex-1 p-6 text-base font-serif text-slate-850 leading-relaxed focus:outline-none resize-none overflow-y-auto"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <button onClick={() => goToStep(2)} className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition cursor-pointer">이전 단계</button>
              <button 
                onClick={() => goToStep(4)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <span>4단계: 최종 점검으로 가기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submission */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch flex-1">
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase">Step 4: 제출 전 자가 진단</span>
                  <h2 className="text-2xl font-black text-slate-900">Q. 마지막으로 확인하기</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    체크리스트의 내용을 하나씩 클릭하여 검토한 뒤 에세이를 최종 제출하여 AI 첨삭을 받아보세요.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                    <span>초보자용 에세이 자가 점검표</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm text-slate-700">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.spelling}
                        onChange={(e) => setChecklist({ ...checklist, spelling: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-green-600 focus:ring-green-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">영단어 스펠링(Spelling) 오타나 띄어쓰기 오류를 훑어보았나요?</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.punctuation}
                        onChange={(e) => setChecklist({ ...checklist, punctuation: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-green-600 focus:ring-green-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">문장의 첫 단어가 대문자로 시작하고 마침표(.)를 올바르게 찍었나요?</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.thesisIncluded}
                        onChange={(e) => setChecklist({ ...checklist, thesisIncluded: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-green-600 focus:ring-green-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">서론 맨 마지막에 내가 직접 구축한 입장 선언(Thesis) 문장을 넣었나요?</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.introBodyOnly}
                        onChange={(e) => setChecklist({ ...checklist, introBodyOnly: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-green-600 focus:ring-green-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">서론 문단과 본론 1개 문단이 문단 구분이 되게 나뉘어 있나요?</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase block">작성 완료 에세이 분량</span>
                  <span className="text-2xl font-black text-slate-900 block mt-1">{getWordCount(essay)} words</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between space-x-3">
                <button onClick={() => goToStep(3)} disabled={isSubmitting} className="border border-slate-350 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-sm transition cursor-pointer">에세이 고치러 가기</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Solar AI 채점분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                      <span>에세이 제출하고 피드백 받기</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white border border-slate-200 p-6 shadow-sm space-y-4 rounded-2xl h-[550px] overflow-y-auto">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Info className="h-4.5 w-4.5 text-green-600" />
                <span>1단계 평가 가이드</span>
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 font-medium">
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 text-slate-750">
                  <span className="font-bold text-green-700 block mb-1">💡 쌩초보 채점 특전</span>
                  이 연습 모드는 서론과 본론 1단락만을 평가하도록 최적화되어 있습니다. AI는 전체 에세이가 아니라는 이유로 감점하지 않고, 기입된 단락 안의 **논리 타당성**과 **영문법 기초**만을 집중 격려 평가하여 점수를 냅니다.
                </div>
                <p>제출을 완료하고 나면 6.0 만점 기준으로 몇 점대에 해당하는지와, 어색한 영어 문장에 대한 1:1 Before/After 첨삭 테이블이 제공됩니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
