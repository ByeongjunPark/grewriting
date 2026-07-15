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

  useEffect(() => {
    const storedHistory = localStorage.getItem("gre_awa_history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        setHistory([]);
      }
    } else {
      // Empty initially as requested
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

  const startPractice = (mode: "step-by-step" | "mock-test") => {
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
              지시문 탐색기에서 원하는 기출 토픽을 검색한 뒤, 단계별 지도를 따르거나 실전 시험과 동일하게 타이핑 연습을 수행하세요.
            </p>
          </div>
        </section>

        {/* 1. Topic Pool Browser (Moved to the Top as requested) */}
        <section id="topic-pool" className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">공식 GRE 이슈 풀 검색기 (Topic Pool Browser)</h2>
              <p className="text-sm text-slate-500 font-medium">
                아래 기출 풀에서 토픽을 선택하세요. 선택된 토픽은 바로 밑에 상세 요약 카드로 표시되며 에세이 연습의 기준이 됩니다.
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
          <div className="max-h-[300px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
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
              <span>선택된 토픽을 기준으로 아래 연습 모드를 골라 연습할 수 있습니다.</span>
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

        {/* 3. Practice Mode Choice Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Step-by-Step */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-xs font-extrabold px-4 py-2 rounded-bl-2xl border-l border-b border-indigo-100">
              초보자 추천 (Recommended)
            </div>
            
            <div className="space-y-5">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  단계별 연습 모드
                  <span className="block text-sm font-semibold text-slate-400 mt-1">Step-by-Step Guided Training</span>
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  에세이를 처음 쓰는 입문자 전용 모드입니다. **분석 → 아웃라인 설계 → 좌우분할 화면 작성 → 자가 교정**의 4단계 템플릿과 실시간 코치 도움말(단락 구조, 단어 은행)을 지원하여 논리 정연한 글을 손쉽게 써 내려가도록 이끕니다.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">분석 3분</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">개요 5분</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">드래프트 20분</span>
              </div>
              <button 
                onClick={() => startPractice("step-by-step")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition duration-200 cursor-pointer"
              >
                <span>연습 시작</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Card B: Mock Test */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between group hover:border-slate-350 transition-all duration-300"
          >
            <div className="space-y-5">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Clock className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 group-hover:text-slate-700 transition-colors">
                  실전 모의고사 모드
                  <span className="block text-sm font-semibold text-slate-400 mt-1">Realistic Mock Exam</span>
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed font-medium">
                  실제 GRE 시험장 소프트웨어와 동질의 긴장감을 재현합니다. 화면 일시정지가 불가능한 **30분 타이머**가 작동하며, 편집 도구나 장식 없는 순수 텍스트 편집기 안에서 시간 조절 및 타자 입력 연습을 훈련합니다.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex space-x-2 text-[10px] font-bold text-slate-500">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">제한 시간 30:00</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">실전 인터페이스</span>
              </div>
              <button 
                onClick={() => startPractice("mock-test")}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition duration-200 cursor-pointer"
              >
                <span>모의고사 시작</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* 4. Recent History Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
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
                      <td className="py-4 font-medium text-slate-700 max-w-sm truncate pr-6">
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
            // Empty State Helper for beginners
            <div className="py-12 px-6 text-center max-w-lg mx-auto space-y-6">
              <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto border border-indigo-100 shadow-inner">
                <PenTool className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">첫 번째 GRE 에세이를 작성해보세요!</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  아직 기록된 에세이 연습 이력이 없습니다. 맨 위 공식 이슈 풀에서 원하시는 주제를 골라 선택하신 후, **단계별 연습 모드** 또는 **실전 모의고사**를 실행하세요. 
                  평가 결과가 이곳에 실시간으로 실시간 저장됩니다.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => startPractice("step-by-step")}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow hover:shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>첫 에세이 작성하러 가기</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
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
