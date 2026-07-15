"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Filter
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

const mockHistory: HistoryItem[] = [
  {
    id: "hist-1",
    topicId: "topic-1",
    topicTitle: "Governments should place few, if any, restrictions on scientific research and development.",
    date: "2026-07-14",
    score: 5.5,
    wordCount: 512,
    mode: "Step-by-Step"
  },
  {
    id: "hist-2",
    topicId: "topic-2",
    topicTitle: "The best way to teach is to praise positive actions and ignore negative ones.",
    date: "2026-07-12",
    score: 4.5,
    wordCount: 420,
    mode: "Mock Test"
  }
];

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
        setHistory(mockHistory);
      }
    } else {
      localStorage.setItem("gre_awa_history", JSON.stringify(mockHistory));
      setHistory(mockHistory);
    }
  }, []);

  // Filter topics
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
    <div className="flex-1 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-brand-200 bg-white sticky top-0 z-10 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-accent-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-accent-100">
              G
            </div>
            <div>
              <span className="font-bold text-lg text-brand-900 tracking-tight">GRE AWA Coach</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-brand-100 text-brand-600 rounded-full">Solar-Pro</span>
            </div>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium text-brand-600">
            <Link href="/" className="text-accent-600 hover:text-accent-700 transition">Dashboard</Link>
            <a href="#topic-pool" className="hover:text-brand-900 transition">Topic Pool</a>
            <a href="https://www.ets.org/pdfs/gre/issue-pool.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-brand-900 transition flex items-center space-x-1">
              <span>ETS Pool PDF</span>
              <ChevronRight className="h-3 w-3" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Welcome Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-brand-900 tracking-tight">
                GRE Analytical Writing Masterclass
              </h1>
              <p className="text-brand-500 text-lg leading-relaxed max-w-2xl">
                2023년 9월 개편 이후 GRE Writing 영역의 유일한 과제인 **&quot;Analyze an Issue&quot;**를 집중 학습하세요. 
                단계별 첨삭 시스템과 ETS 실전 환경을 결합하여 6.0점 만점을 향해 훈련합니다.
              </p>
            </div>

            {/* Selected Topic Card */}
            <div className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-accent-50 text-accent-600 rounded-full border border-accent-100 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Selected Topic to Practice</span>
                </span>
                <button 
                  onClick={handleRandomSelect}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-900 flex items-center space-x-1 py-1 px-2.5 rounded-lg hover:bg-brand-100 transition"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Random Select</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="text-xs font-medium text-brand-400">Category: {selectedTopic.category}</div>
                <h3 className="text-xl font-bold font-serif text-brand-850 leading-relaxed">
                  &ldquo;{selectedTopic.prompt}&rdquo;
                </h3>
                <div className="p-3 bg-brand-50 rounded-lg text-sm text-brand-600 border-l-4 border-brand-400">
                  <span className="font-semibold block text-brand-700 mb-1">Task Directions:</span>
                  {selectedTopic.instruction}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-brand-900 text-lg flex items-center space-x-2">
              <Award className="h-5 w-5 text-accent-600" />
              <span>Learning Dashboard</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-50 rounded-xl space-y-1">
                <span className="text-xs text-brand-500 font-medium">Essays Drafted</span>
                <div className="text-2xl font-extrabold text-brand-900">{history.length}</div>
              </div>
              <div className="p-4 bg-accent-50 rounded-xl space-y-1">
                <span className="text-xs text-accent-600 font-medium">Average Score</span>
                <div className="text-2xl font-extrabold text-accent-700">
                  {history.length > 0 
                    ? (history.reduce((acc, h) => acc + h.score, 0) / history.length).toFixed(1) 
                    : "0.0"}
                </div>
              </div>
            </div>

            <div className="border-t border-brand-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider">ETS Scoring Summary</h4>
              <div className="space-y-1.5 text-xs text-brand-600">
                <div className="flex justify-between">
                  <span>Score 6 (Outstanding)</span>
                  <span className="font-semibold text-brand-850">Fluent & Cogent</span>
                </div>
                <div className="flex justify-between">
                  <span>Score 5 (Strong)</span>
                  <span className="font-semibold text-brand-850">Thoughtful & Logical</span>
                </div>
                <div className="flex justify-between">
                  <span>Score 4 (Adequate)</span>
                  <span className="font-semibold text-brand-850">Competent & Clear</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Mode Choice Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Step-by-Step */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-brand-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between group hover:border-accent-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-accent-50 text-accent-600 text-xs font-bold px-4 py-1.5 rounded-bl-xl border-l border-b border-accent-100">
              Recommended
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 group-hover:bg-accent-600 group-hover:text-white transition-colors duration-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-brand-900 group-hover:text-accent-600 transition-colors">
                  단계별 연습 모드
                  <span className="block text-sm font-medium text-brand-400 mt-1">Step-by-Step Guided Training</span>
                </h2>
                <p className="text-brand-550 text-sm leading-relaxed">
                  에세이 작성 과정을 4단계 가이드(분석 → 브레인스토밍 아웃라인 → 좌우분할 드래프트 작성 → 제출 직전 오타 체크)로 세분화하여 체계적으로 훈련합니다. 초급자부터 완성도 있는 글을 쓰고 싶은 수험생에게 적합합니다.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-100 flex items-center justify-between">
              <div className="flex space-x-2 text-xs text-brand-500">
                <span className="px-2 py-1 bg-brand-100 rounded-md">분석 3분</span>
                <span className="px-2 py-1 bg-brand-100 rounded-md">개요 5분</span>
                <span className="px-2 py-1 bg-brand-100 rounded-md">작성 20분</span>
              </div>
              <button 
                onClick={() => startPractice("step-by-step")}
                className="bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
              >
                <span>시작하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Card B: Mock Test */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-brand-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between group hover:border-brand-300 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 group-hover:bg-brand-900 group-hover:text-white transition-colors duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
                  실전 모의고사 모드
                  <span className="block text-sm font-medium text-brand-400 mt-1">Realistic Mock Exam</span>
                </h2>
                <p className="text-brand-550 text-sm leading-relaxed">
                  실제 ETS GRE 시험장의 투박하고 레트로한 화면(불필요한 서식 도구 없음, 일시정지 불가 30분 카운트다운 타이머)을 고스란히 재현합니다. 실전의 시간 압박을 온전히 느끼며 아웃라인 없이 즉시 작성하는 모드입니다.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-100 flex items-center justify-between">
              <div className="flex space-x-2 text-xs text-brand-500">
                <span className="px-2 py-1 bg-brand-100 rounded-md">제한 시간 30:00</span>
                <span className="px-2 py-1 bg-brand-100 rounded-md">실전 인터페이스</span>
              </div>
              <button 
                onClick={() => startPractice("mock-test")}
                className="bg-brand-950 hover:bg-brand-900 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
              >
                <span>시작하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Section: Topic Pool Browser */}
        <section id="topic-pool" className="bg-white border border-brand-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight">GRE Issue Official Topic Pool</h2>
              <p className="text-sm text-brand-550">
                ETS에서 제시한 GRE Analytical Writing 공식 이슈 풀을 검색하고, 연습할 토픽을 선택하세요.
              </p>
            </div>
            
            {/* Search and Category filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-400" />
                <input
                  type="text"
                  placeholder="Search prompts or keywords..."
                  className="pl-9 pr-4 py-2 text-sm border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-brand-455" />
                <select
                  className="border border-brand-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
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

          {/* List of filtered topics */}
          <div className="max-h-96 overflow-y-auto border border-brand-100 rounded-xl divide-y divide-brand-100">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 text-left transition duration-200 cursor-pointer flex justify-between items-center group ${
                    selectedTopic.id === topic.id 
                      ? "bg-accent-50/50 border-l-4 border-accent-600" 
                      : "hover:bg-brand-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="space-y-1.5 pr-4 flex-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-semibold text-brand-500 bg-brand-100 px-2 py-0.5 rounded">
                        {topic.category}
                      </span>
                      <span className="text-brand-400 font-medium">
                        Instruction: {topic.instructionType.toUpperCase().replace("_", " ")}
                      </span>
                    </div>
                    <p className={`font-serif text-sm leading-relaxed ${
                      selectedTopic.id === topic.id ? "font-bold text-brand-900" : "text-brand-700"
                    }`}>
                      &ldquo;{topic.prompt}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded transition duration-200 ${
                      selectedTopic.id === topic.id 
                        ? "bg-accent-600 text-white" 
                        : "bg-brand-100 text-brand-600 group-hover:bg-brand-200"
                    }`}>
                      Select
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-brand-400 text-sm">
                No matching topics found. Try search query adjustments.
              </div>
            )}
          </div>
        </section>

        {/* Recent History Section */}
        <section className="bg-white border border-brand-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5">
            <History className="h-5 w-5 text-brand-455" />
            <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight">최근 작성 이력 (Recent History)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-100 text-xs font-bold text-brand-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Practice Mode</th>
                  <th className="pb-3 font-semibold">Essay Topic</th>
                  <th className="pb-3 font-semibold text-center">Word Count</th>
                  <th className="pb-3 font-semibold text-right">AWA Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50 text-sm">
                {history.length > 0 ? (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-50/50 transition">
                      <td className="py-4 text-brand-500 whitespace-nowrap">{item.date}</td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.mode === "Step-by-Step" 
                            ? "bg-accent-50 text-accent-600 border border-accent-100" 
                            : "bg-brand-900 text-white"
                        }`}>
                          {item.mode}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-brand-700 max-w-sm truncate pr-4">
                        {item.topicTitle}
                      </td>
                      <td className="py-4 text-center text-brand-600">{item.wordCount} words</td>
                      <td className="py-4 text-right">
                        <span className="font-extrabold text-base px-2.5 py-1 bg-accent-50 text-accent-700 rounded-md border border-accent-100">
                          {item.score.toFixed(1)} / 6.0
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-brand-400 text-sm">
                      No practice essays recorded yet. Choose a topic and select a mode above to begin!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-200 py-8 bg-white text-center text-xs text-brand-400">
        <p>© 2026 GRE AWA Prep Coach. Built for mastery. Solar AI powered.</p>
      </footer>
    </div>
  );
}
