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
  Lightbulb,
  Compass,
  Info
} from "lucide-react";
import { greTopics, GRETopic } from "../../data/gre-topics";

export default function GuidedIntermediate() {
  const router = useRouter();
  
  const [topic, setTopic] = useState<GRETopic>(greTopics[0]);
  const [step, setStep] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins for Outline
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  
  // Form states
  const [summary, setSummary] = useState<string>("");
  const [stance, setStance] = useState<"agree" | "disagree" | "balanced">("agree");
  const [reason1, setReason1] = useState<string>("");
  const [reason2, setReason2] = useState<string>("");
  const [rebuttal, setRebuttal] = useState<string>("");
  
  // Drafting states
  const [essay, setEssay] = useState<string>("");
  const [leftTab, setLeftTab] = useState<"outline" | "starters">("outline");
  
  // Checklist states
  const [checklist, setChecklist] = useState({
    spelling: false,
    punctuation: false,
    fiveParagraphs: false,
    transitions: false
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
      alert("개요 설계 시간(5분)이 만료되었습니다. 전체 에세이 작성 단계로 이동합니다.");
      goToStep(2);
    } else if (step === 2) {
      alert("작성 시간(20분)이 만료되었습니다. 검토 및 제출 단계로 이동합니다.");
      goToStep(3);
    }
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    setTimerRunning(true);
    if (nextStep === 1) setTimeLeft(300); // 5 mins
    else if (nextStep === 2) setTimeLeft(1200); // 20 mins
    else if (nextStep === 3) setTimeLeft(300); // 5 mins
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

  const handleSubmit = async () => {
    const wc = getWordCount(essay);
    if (wc < 100) {
      alert("최소 100단어 이상 입력하셔야 AI 채점이 가능합니다. (권장: 350~500단어)");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "Step-by-Step",
          level: "intermediate",
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
        score: 4.5,
        feedback: "2단계 학습자 수준에 적합한 탄탄하고 성실하게 구성된 에세이입니다. 서론, 본론 2개, 양보 및 반론 재반박 문장이 모두 잘 들어가 있으나, 단어의 단조로운 사용 및 특정 구문 오류가 발견되었습니다. 5.0 점수대로 도약하기 위해서는 보다 학술적 어조의 형식을 강화해야 합니다.",
        criteria: {
          issueResponse: { grade: "Strong", explanation: "지시문의 요구사항인 찬/반 양론 대응이 모두 훌륭하게 완비되어 있습니다." },
          argumentDevelopment: { grade: "Adequate", explanation: "미국 역사 사례들을 차용하여 설득력을 갖췄으나, 본론 2에서 설명(Explanation) 단락의 전개가 다소 짧습니다." },
          organization: { grade: "Strong", explanation: "서론, 본론2개, Concession, 결론의 5문단 유기적 흐름이 훌륭하고 문맥 정돈도가 높습니다." },
          grammarVocabulary: { grade: "Adequate", explanation: "학술 문장에 어울리지 않는 구어적 표현(e.g., lots of, guys)과 반복된 동사를 정밀하게 바꿀 필요가 있습니다." }
        },
        corrections: [
          {
            original: "This logic has lots of problem when we think about history.",
            explanation: "Lots of는 격식 있는 GRE에 서면으로 쓰기엔 구어적인 톤입니다.",
            improved: "This reasoning presents numerous shortcomings when historical precedents are considered."
          }
        ],
        modelOutline: "I. Introduction\n   - Thesis: Academic freedom must be balanced with governmental ethics regulation.\nII. Body Paragraph 1: DARPA and NIH prove science's self-driving power.\nIII. Body Paragraph 2: Historical failures of censorship (e.g. Lysenkoism).\nIV. Concession & Rebuttal: Mitigating bioethical threats via independent panels.\nV. Conclusion: Regulate safety, don't restrict discovery.",
        modelEssay: "In modern discourse, the degree to which governments should regulate scientific inquiry remains a contentious subject. While some argue that unrestricted research is vital for technological advancement, others advocate for tight boundaries. In my view, governments should place few, if any, restrictions on scientific development, except when fundamental human rights are directly threatened.\n\nFirst, free inquiry is the engine of technological progress and economic growth. This is clearly shown in the case of DARPA's ARPANET and the Human Genome Project funded by the NIH. In both instances, scientists were granted autonomy to explore, eventually yielding consumer spin-offs like GPS and advanced therapeutics. Unconstrained curiosity allows researchers to discover what political bodies cannot anticipate.\n\nSecond, historical censorship demonstrates that political control over science invariably fails. A classic example is Lysenkoism in the Soviet Union. When genetics was banned to support political ideology, crop yields collapsed. Science requires objective truth, which political mandates cannot construct.\n\nAdmittedly, opponents argue that technologies like nuclear weapons demand strict state restrictions. Indeed, ethical safeguards are essential. However, this is best managed by independent academic boards rather than partisan government bodies. Regulation should target safety without throttling research freedom.\n\nIn conclusion, while safety rules must exist, state control over scientific inquiry should be minimal. Trusting researchers is the most reliable way to secure future prosperity."
      };
      
      localStorage.setItem("gre_last_feedback", JSON.stringify(fallbackResult));
      
      const storedHistory = localStorage.getItem("gre_awa_history");
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.prompt,
        date: new Date().toISOString().split("T")[0],
        score: 4.5,
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
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">2단계: 조금 해본 사람 모드</span>
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
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm select-none">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center text-xs font-bold text-slate-400">
          <button onClick={() => goToStep(1)} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition cursor-pointer ${step === 1 ? "border-indigo-650 text-indigo-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>1</span>
            <span>지문 분석 & 뼈대 짜기</span>
          </button>
          <div className="w-12 h-px bg-slate-200"></div>
          <button onClick={() => step >= 2 && goToStep(2)} disabled={step < 2} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition cursor-pointer ${step === 2 ? "border-indigo-650 text-indigo-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>2</span>
            <span>풀 에세이 작문 (템플릿)</span>
          </button>
          <div className="w-12 h-px bg-slate-200"></div>
          <button onClick={() => step >= 3 && goToStep(3)} disabled={step < 3} className={`flex items-center space-x-1.5 pb-1 border-b-2 transition cursor-pointer ${step === 3 ? "border-indigo-650 text-indigo-700" : "border-transparent"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>3</span>
            <span>오타 검사 및 최종제출</span>
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-between">
        
        {/* Step 1: Outline */}
        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">Step 1: 지문 및 구조화</span>
                <h2 className="text-2xl font-black text-slate-900">Q. 에세이 전체 아웃라인(Outline) 설계하기</h2>
                <p className="text-sm text-slate-500 font-medium">
                  지문을 정독한 뒤, 5개 단락으로 뻗어 나갈 아웃라인 뼈대를 미리 적어두세요. (배경지식은 대시보드 공부방 탭에서 미리 정독하고 올 수 있습니다)
                </p>
              </div>

              {/* Prompt box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-wider block">GRE Topic Prompt</span>
                <p className="font-serif text-base text-slate-800 font-bold leading-relaxed mt-1">&ldquo;{topic.prompt}&rdquo;</p>
              </div>

              {/* Stance Selector */}
              <div className="grid grid-cols-4 items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-sm font-bold text-slate-800">1. 나의 stance 결정:</span>
                <div className="col-span-3 grid grid-cols-3 gap-3">
                  {["agree", "disagree", "balanced"].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStance(s as any)}
                      className={`py-2 rounded-lg font-bold text-xs border transition cursor-pointer ${
                        stance === s ? "bg-indigo-600 border-indigo-600 text-white shadow" : "bg-slate-50 border-slate-200 text-slate-650"
                      }`}
                    >
                      {s === "agree" && "찬성 (Agree)"}
                      {s === "disagree" && "반대 (Disagree)"}
                      {s === "balanced" && "절충 (Balanced)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outline boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">본론 1 주장 & 미국사례 예시</label>
                  <textarea
                    placeholder="예: 자유 과학 R&D의 효익 (사례: DARPA & ARPANET)"
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">본론 2 주장 & 미국사례 예시</label>
                  <textarea
                    placeholder="예: 규제의 부작용 및 오류 (사례: 구소련 리센코주의 농업 통제 실패)"
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    value={reason2}
                    onChange={(e) => setReason2(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">반대 의견 양보 및 재반박 (Concession)</label>
                  <textarea
                    placeholder="예: (양보) 생명윤리는 규제가 일견 타당하다. (반박) 하지만 정치 단체보다는 학계 독립위원회가 통제해야 옳다."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    value={rebuttal}
                    onChange={(e) => setRebuttal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => goToStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <span>2단계: 작문 에디터로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Full Drafting */}
        {step === 2 && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">Step 2: 풀 드래프트 작성</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">에세이 전체 본문 영작하기</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Word Count</span>
                <div className={`text-xl font-black ${getWordCount(essay) >= 350 ? "text-green-600" : "text-indigo-650"}`}>
                  {getWordCount(essay)} / <span className="text-xs text-slate-400">350~500 target</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px] items-stretch">
              {/* Left Panel: Tabs */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                <div className="flex bg-slate-50 border-b border-slate-200 select-none">
                  <button onClick={() => setLeftTab("outline")} className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition cursor-pointer ${leftTab === "outline" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500"}`}>나의 개요</button>
                  <button onClick={() => setLeftTab("starters")} className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition cursor-pointer ${leftTab === "starters" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500"}`}>유용한 전환사</button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-medium">
                  {leftTab === "outline" ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">My Stance</span>
                        <span className="mt-1 font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 rounded px-2.5 py-0.5 inline-block uppercase text-[10px]">{stance}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Reason & Example 1</span>
                        <p className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-relaxed font-sans">{reason1 || "공백"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Reason & Example 2</span>
                        <p className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-relaxed font-sans">{reason2 || "공백"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Concession & Rebuttal</span>
                        <p className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-relaxed font-sans">{rebuttal || "공백"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <span className="font-bold text-indigo-700 block mb-1">학술 문단 간 전환 및 인과</span>
                        <ul className="space-y-2 text-[11px]">
                          <li><strong className="text-slate-750 font-mono">Consequently, / Therefore,</strong> (그러므로, 결론적으로)</li>
                          <li><strong className="text-slate-750 font-mono">Furthermore, / Moreover,</strong> (뿐만 아니라, 나아가)</li>
                          <li><strong className="text-slate-750 font-mono">Admittedly, / Granted that...</strong> (일견 양보하여 수용하자면)</li>
                          <li><strong className="text-slate-750 font-mono">Conversely, / On the other hand,</strong> (대조적으로, 반면에)</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-700 block mb-1">예시 도입 구절</span>
                        <ul className="space-y-1 text-[11px] font-mono text-slate-650">
                          <li>To illustrate, this is clearly shown in...</li>
                          <li>A compelling historical example is...</li>
                          <li>This situation is epitomized by...</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Editor */}
              <div className="lg:col-span-2 flex flex-col border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                <textarea
                  placeholder="서론 - 본론 1 - 본론 2 - Concession - 결론의 순서대로 에세이 전체를 완성해 보세요. (목표: 350~500단어)"
                  className="flex-1 p-6 text-base font-serif text-slate-850 leading-relaxed focus:outline-none resize-none overflow-y-auto"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <button onClick={() => goToStep(1)} className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition cursor-pointer">이전 단계</button>
              <button onClick={() => goToStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer">
                <span>3단계: 오타 검사 및 제출</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Checklist & Submit */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch flex-1">
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">Step 3: 최종 자가 점검</span>
                  <h2 className="text-2xl font-black text-slate-900">Q. 마지막 교정 검토표</h2>
                  <p className="text-sm text-slate-500 font-medium">실수하기 쉬운 문법 오류와 구조 결함을 자가 진단한 후 제출하세요.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                    <span>AWA 중급자 에세이 체크리스트</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm text-slate-700">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.spelling}
                        onChange={(e) => setChecklist({ ...checklist, spelling: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">단어 오탈자 및 문장 쉼표/마침표 배치를 세부 점검했나요?</span>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.punctuation}
                        onChange={(e) => setChecklist({ ...checklist, punctuation: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">주어와 동사의 수 일치, 동사의 시제가 일관되게 흐르고 있나요?</span>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.fiveParagraphs}
                        onChange={(e) => setChecklist({ ...checklist, fiveParagraphs: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">서론, 본론 1, 본론 2, Concession, 결론이 시각적으로 단락이 구분되어 있나요?</span>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checklist.transitions}
                        onChange={(e) => setChecklist({ ...checklist, transitions: e.target.checked })}
                        className="mt-1 h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-slate-950 font-medium transition">문단 이동 시 transition word(Furthermore, Admittedly 등)를 배치했나요?</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase block">작성 완료 에세이 분량</span>
                  <span className="text-2xl font-black text-slate-900 block mt-1">{getWordCount(essay)} words</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between space-x-3">
                <button onClick={() => goToStep(2)} disabled={isSubmitting} className="border border-slate-350 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-sm transition cursor-pointer">에세이 고치러 가기</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Solar AI 채점분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                      <span>에세이 최종 제출 및 채점받기</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white border border-slate-200 p-6 shadow-sm space-y-4 rounded-2xl h-[550px] overflow-y-auto">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Info className="h-4.5 w-4.5 text-indigo-600" />
                <span>2단계 채점 가이드</span>
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-655 font-medium">
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-slate-750">
                  <span className="font-bold text-indigo-700 block mb-1">💡 2단계 첨삭 요건</span>
                  이 모드는 실제 ETS의 공식 에세이 채점 등급과 동일하게 엄격하게 점수를 측정합니다. 글의 논리 구조, 논리적 연결성, 문단 배치를 확인하고 Solar AI가 1:1 감점 교정을 환류합니다.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
