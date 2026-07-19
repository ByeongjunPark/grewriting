"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Clock, 
  Search, 
  Sparkles, 
  History, 
  ArrowRight, 
  BookOpen, 
  Award,
  Shuffle,
  ChevronRight,
  Filter,
  Info,
  Database
} from "lucide-react";
import { greTopics, GRETopic } from "../data/gre-topics";

interface HistoryItem {
  id: string;
  topicId: string;
  topicTitle: string;
  date: string;
  score: number;
  wordCount: number;
  mode: "Step-by-Step" | "Mock Test";
}

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<GRETopic>(greTopics[0]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Dashboard Tab state: "practice" | "study"
  const [activeTab, setActiveTab] = useState<"practice" | "study">("practice");

  useEffect(() => {
    const storedHistory = localStorage.getItem("gre_awa_history");
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          // Wipes only the old mock data (hist-1, hist-2) but keeps everything else
          const filtered = parsed.filter((item: any) => item && item.id !== "hist-1" && item.id !== "hist-2");
          setHistory(filtered);
          // Persist the clean array to localStorage so it stays on refresh
          localStorage.setItem("gre_awa_history", JSON.stringify(filtered));
        } else {
          setHistory([]);
          localStorage.setItem("gre_awa_history", JSON.stringify([]));
        }
      } catch (e) {
        setHistory([]);
        localStorage.setItem("gre_awa_history", JSON.stringify([]));
      }
    } else {
      setHistory([]);
    }
  }, []);

  const categories = ["All", ...Array.from(new Set(greTopics.map(t => t.category)))];
  
  const filteredTopics = greTopics.filter(topic => {
    const matchesSearch = 
      topic.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRandomSelect = () => {
    const randomIndex = Math.floor(Math.random() * greTopics.length);
    setSelectedTopic(greTopics[randomIndex]);
  };

  const startPractice = (mode: "guided-beginner" | "guided-intermediate" | "mock-test") => {
    localStorage.setItem("gre_current_topic", JSON.stringify(selectedTopic));
    router.push(`/${mode}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100">
              G
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">GRE AWA Coach</span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">Solar-Pro</span>
            </div>
          </div>
          <nav className="hidden sm:flex items-center space-x-8 text-sm font-semibold text-slate-500">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 transition">Dashboard</Link>
            <a href="#topic-pool" className="hover:text-slate-900 transition">Topic Pool</a>
            <a 
              href="https://www.ets.org/pdfs/gre/issue-pool.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-900 transition flex items-center space-x-1"
            >
              <span>ETS Pool PDF</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Intro Banner Section */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              GRE Analytical Writing Masterclass
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
              GRE 라이팅의 유일한 과제인 **&quot;Analyze an Issue&quot;**를 위한 초보자 맞춤형 에세이 코치입니다. 
              지시문 탐색기에서 원하는 기출 토픽을 검색한 뒤, 자신의 숙련도에 맞춰 단계를 밟아가며 실력을 완성해보세요.
            </p>
          </div>
        </section>

        {/* 1. Topic Pool Browser (At the Top) */}
        <section id="topic-pool" className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">공식 GRE 이슈 풀 검색기 (Topic Pool Browser)</h2>
              <p className="text-sm text-slate-500 font-medium">
                아래 기출 풀에서 토픽을 선택하세요. 선택된 토픽은 바로 밑에 상세 요약 카드로 표시되며 에세이 연습 및 배경지식 공부의 기준이 됩니다.
              </p>
            </div>
            
            {/* Search inputs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="토픽 검색 (예: Education, Science)..."
                  className="pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 bg-slate-50 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  className="border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* List of topics */}
          <div className="max-h-[220px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 text-left transition duration-200 cursor-pointer flex justify-between items-center group ${
                    selectedTopic.id === topic.id 
                      ? "bg-indigo-50/40 border-l-4 border-indigo-600" 
                      : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="space-y-1.5 pr-4 flex-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {topic.category}
                      </span>
                      <span className="text-slate-400 uppercase tracking-wider">
                        {topic.instructionType.toUpperCase().replace("_", " ")}
                      </span>
                    </div>
                    <p className={`font-serif text-sm leading-relaxed ${
                      selectedTopic.id === topic.id ? "font-bold text-slate-900" : "text-slate-700"
                    }`}>
                      &ldquo;{topic.prompt}&rdquo;
                    </p>
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg transition duration-200 ${
                      selectedTopic.id === topic.id 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}>
                      선택됨
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm font-medium">
                일치하는 토픽이 없습니다. 다른 키워드로 검색해 보세요.
              </div>
            )}
          </div>
        </section>

        {/* 2. Selected Topic Detail & Learning Stats Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Selected Topic Card (2/3 width) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>현재 연습을 위해 선택된 토픽</span>
                </span>
                <button 
                  onClick={handleRandomSelect}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1.5 py-1 px-3 rounded-lg hover:bg-slate-100 border border-slate-200 transition"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>무작위 토픽 변경</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Category: {selectedTopic.category}</div>
                <h3 className="text-xl font-bold font-serif text-slate-850 leading-relaxed">
                  &ldquo;{selectedTopic.prompt}&rdquo;
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border-l-4 border-slate-400 leading-relaxed font-medium">
                  <span className="font-bold block text-slate-850 mb-1">Task Directions (지시 사항):</span>
                  {selectedTopic.instruction}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 flex items-center space-x-1.5 font-medium">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>선택된 토픽을 기준으로 아래 탭에서 에세이를 연습하거나 배경지식을 별도로 공부할 수 있습니다.</span>
            </div>
          </div>

          {/* Learning Stats Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-300">
            <div className="space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <Award className="h-5.5 w-5.5 text-indigo-600" />
                <span>나의 학습 통계</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block">총 작성 에세이</span>
                  <div className="text-3xl font-black text-slate-900">{history.length}</div>
                </div>
                <div className="p-4 bg-indigo-50/50 rounded-xl space-y-1.5 border border-indigo-100/50">
                  <span className="text-xs text-indigo-600 font-semibold block">평균 예상 점수</span>
                  <div className="text-3xl font-black text-indigo-700">
                    {history.length > 0 
                      ? (history.reduce((acc, h) => acc + h.score, 0) / history.length).toFixed(1) 
                      : "0.0"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ETS Scoring Rubric Overview</h4>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Score 6 (Outstanding)</span>
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-bold">인사이트 & 유창함</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Score 5 (Strong)</span>
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold">논리적 & 풍부함</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Score 4 (Adequate)</span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">명확함 & 충실함</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 flex items-center space-x-1.5 font-medium">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>실시간 브라우저 LocalStorage 동기화 모드</span>
            </div>
          </div>
        </section>

        {/* 3. Dashboard Navigation Tabs (Independent Section) */}
        <section className="space-y-6">
          <div className="flex border-b border-slate-200 select-none">
            <button
              onClick={() => setActiveTab("practice")}
              className={`py-3.5 px-6 font-bold text-sm border-b-2 transition cursor-pointer ${
                activeTab === "practice" 
                  ? "border-indigo-600 text-indigo-650 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              ✍ 에세이 연습하기 (Practice Essay)
            </button>
            <button
              onClick={() => setActiveTab("study")}
              className={`py-3.5 px-6 font-bold text-sm border-b-2 transition cursor-pointer ${
                activeTab === "study" 
                  ? "border-indigo-600 text-indigo-650 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🇺🇸 배경지식 공부방 (US Study Room)
            </button>
          </div>

          {activeTab === "practice" ? (
            /* Practice Tab Workspace */
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch animate-fade-in">
                {/* Level 1: Beginner */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-green-300 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-green-50 text-green-700 text-[10px] font-black px-3.5 py-1.5 rounded-bl-xl border-l border-b border-green-100">
                    쌩초보 추천
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-green-600 transition-colors">
                        1단계: 완전 쌩초보 모드
                        <span className="block text-xs font-semibold text-slate-400 mt-0.5">Guided Beginner</span>
                      </h2>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        AWA가 생전 처음인 왕초보를 위한 집중 훈련입니다. 문맥 쟁점 해부와 서론 입장문(Thesis) 생성 템플릿 빌더를 통해 **서론과 본론 1문단(150~250단어)** 완결을 연습하며, AI 역시 1개 문단 완성도 위주로 장려 점수를 줍니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">목표: 150~250단어</span>
                    <button 
                      onClick={() => startPractice("guided-beginner")}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm flex items-center space-x-1.5 transition duration-200 cursor-pointer"
                    >
                      <span>1단계 시작</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>

                {/* Level 2: Intermediate */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-[10px] font-black px-3.5 py-1.5 rounded-bl-xl border-l border-b border-indigo-100">
                    중급자 추천
                  </div>

                  <div className="space-y-4">
                    <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        2단계: 조금 해본 사람 모드
                        <span className="block text-xs font-semibold text-slate-400 mt-0.5">Template Intermediate</span>
                      </h2>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        뼈대는 잡히지만 살을 붙이기 버거운 중급자 전용입니다. Stance별 개요 설계기를 기반으로 **서론-본론2개-반론재반박-결론의 5문단 풀 에세이(350~500단어)**를 고급 학술 전환사 템플릿 도움을 받아 타이핑하고, 공식 루브릭으로 점수를 냅니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">목표: 350~500단어</span>
                    <button 
                      onClick={() => startPractice("guided-intermediate")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm flex items-center space-x-1.5 transition duration-200 cursor-pointer"
                    >
                      <span>2단계 시작</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>

                {/* Level 3: Mock Test */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-slate-350 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-inner">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-slate-700 transition-colors">
                        3단계: 실전 30분 모의고사
                        <span className="block text-xs font-semibold text-slate-400 mt-0.5">Realistic Mock Exam</span>
                      </h2>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        실제 GRE 시험장 소프트웨어와 100% 동일한 고밀도 타자 훈련입니다. 일시정지가 안 되는 **30분 타이머** 하에, 도움말이나 뼈대 없는 백지 에디터에서 시간 안배와 오타 통제 능력을 실제 고사장 압박감 수준에서 훈련합니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">제한시간: 30분</span>
                    <button 
                      onClick={() => startPractice("mock-test")}
                      className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm flex items-center space-x-1.5 transition duration-200 cursor-pointer"
                    >
                      <span>3단계 모의고사 시작</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* History Sub-section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
                  <History className="h-5.5 w-5.5 text-slate-700" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">에세이 연습 이력</h2>
                </div>

                {history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">날짜</th>
                          <th className="pb-3 font-semibold">연습 모드</th>
                          <th className="pb-3 font-semibold">작성 토픽</th>
                          <th className="pb-3 font-semibold text-center">글자 수</th>
                          <th className="pb-3 font-semibold text-right">예상 점수</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {history.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 text-slate-500 font-medium whitespace-nowrap">{item.date}</td>
                            <td className="py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.mode === "Step-by-Step" 
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-150" 
                                  : "bg-slate-900 text-white border-slate-950"
                              }`}>
                                {item.mode}
                              </span>
                            </td>
                            <td className="py-4 font-medium text-slate-750 max-w-sm truncate pr-6">
                              {item.topicTitle}
                            </td>
                            <td className="py-4 text-center font-medium text-slate-600">{item.wordCount} words</td>
                            <td className="py-4 text-right">
                              <span className="font-extrabold text-sm px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-150">
                                {item.score.toFixed(1)} / 6.0
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 px-6 text-center max-w-lg mx-auto space-y-6">
                    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto border border-indigo-100 shadow-inner">
                      <PenTool className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900">첫 번째 GRE 에세이를 작성해보세요!</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        아직 기록된 에세이 연습 이력이 없습니다. 맨 위 공식 이슈 풀에서 원하시는 주제를 골라 선택하신 후, 위의 모드 버튼을 눌러 연습하세요. 
                        평가 결과가 이곳에 실시간으로 저장되며, 새로고침해도 영구 보존됩니다.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => startPractice("guided-beginner")}
                        className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow hover:shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
                      >
                        <span>첫 에세이 작성하러 가기</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Study Room Tab Workspace (Independent Study Room) */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">선택된 토픽의 배경지식 공부방</h3>
                </div>
                <p className="text-slate-550 text-sm leading-relaxed font-medium">
                  현재 선택된 문제인 &ldquo;{selectedTopic.prompt}&rdquo; 에 대한 **찬성 측 주장/사례 2개**와 **반대 측 주장/사례 2개**의 학술적 영어 논증 및 한국어 대역 해석을 별도로 편안하게 공부하는 독립 공부방입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Agree Column */}
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-150 text-xs font-black uppercase shadow-sm">
                    Agree Stance (찬성 측 주장 및 미국사례 2개)
                  </div>
                  <div className="space-y-4">
                    {selectedTopic.agreePoints?.map((pt, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm hover:border-indigo-200 transition">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Argument {idx + 1} (논증)</span>
                          <p className="text-slate-850 text-sm font-extrabold leading-relaxed">{pt.argumentKo}</p>
                          <p className="font-mono text-slate-500 italic text-xs leading-relaxed border-t border-slate-200/50 pt-2">{pt.argumentEn}</p>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2">
                          <span className="text-[10px] font-bold text-indigo-600 block tracking-wider">🇺🇸 US Background Example (미국 배경지식 사례)</span>
                          <p className="text-slate-655 text-xs leading-relaxed font-medium">{pt.exampleKo}</p>
                          <p className="font-mono text-slate-400 italic text-[11px] leading-relaxed border-t border-slate-100 pt-1.5">{pt.exampleEn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disagree Column */}
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-150 text-xs font-black uppercase shadow-sm">
                    Disagree Stance (반대 측 주장 및 미국사례 2개)
                  </div>
                  <div className="space-y-4">
                    {selectedTopic.disagreePoints?.map((pt, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm hover:border-red-200 transition">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Argument {idx + 1} (논증)</span>
                          <p className="text-slate-855 text-sm font-extrabold leading-relaxed">{pt.argumentKo}</p>
                          <p className="font-mono text-slate-500 italic text-xs leading-relaxed border-t border-slate-200/50 pt-2">{pt.argumentEn}</p>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2">
                          <span className="text-[10px] font-bold text-red-500 block tracking-wider">🇺🇸 US Background Example (미국 배경지식 사례)</span>
                          <p className="text-slate-655 text-xs leading-relaxed font-medium">{pt.exampleKo}</p>
                          <p className="font-mono text-slate-400 italic text-[11px] leading-relaxed border-t border-slate-100 pt-1.5">{pt.exampleEn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-center text-xs text-slate-400">
        <p className="font-medium">© 2026 GRE AWA Prep Coach. Designed for academic mastery. Powered by Solar AI.</p>
      </footer>
    </div>
  );
}
