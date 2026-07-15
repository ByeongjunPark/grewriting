"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Award, 
  ArrowLeft, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  CheckCircle,
  FileText,
  AlertCircle,
  TrendingUp,
  Bookmark
} from "lucide-react";

interface FeedbackData {
  score: number;
  feedback: string;
  criteria: {
    issueResponse: { grade: string; explanation: string };
    argumentDevelopment: { grade: string; explanation: string };
    organization: { grade: string; explanation: string };
    grammarVocabulary: { grade: string; explanation: string };
  };
  corrections: Array<{
    original: string;
    explanation: string;
    improved: string;
  }>;
  modelOutline: string;
  modelEssay: string;
}

export default function FeedbackDashboard() {
  const router = useRouter();
  const [data, setData] = useState<FeedbackData | null>(null);
  const [modelOutlineOpen, setModelOutlineOpen] = useState(false);
  const [modelEssayOpen, setModelEssayOpen] = useState(false);

  useEffect(() => {
    const feedback = localStorage.getItem("gre_last_feedback");
    if (feedback) {
      try {
        setData(JSON.parse(feedback));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-slate-900">AI 피드백 보고서 분석 중...</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            작성하신 에세이를 분석하고 채점 지표를 로드하는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  const getScoreLevel = (score: number) => {
    if (score >= 5.5) return { label: "Outstanding (6.0 만점 수준)", color: "text-green-700 bg-green-50 border-green-200" };
    if (score >= 5.0) return { label: "Strong (우수)", color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
    if (score >= 4.0) return { label: "Adequate (보통)", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (score >= 3.0) return { label: "Limited (미흡)", color: "text-yellow-750 bg-yellow-50 border-yellow-200" };
    return { label: "Seriously Flawed (보완 시급)", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const scoreLevel = getScoreLevel(data.score);
  const strokeDashoffset = 440 - (440 * (data.score / 6.0));

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>대시보드로 돌아가기</span>
          </button>
          
          <div className="text-sm font-extrabold text-slate-900">
            GRE AWA AI 피드백 보고서
          </div>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Summary Card: Score Circle & AI Overview */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Animated SVG Circle */}
          <div className="flex flex-col items-center justify-center space-y-3 md:border-r border-slate-100 pr-0 md:pr-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AWA 예상 점수</span>
            
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-slate-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-indigo-600"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              
              <div className="absolute text-center select-none">
                <span className="text-4xl font-black text-slate-900">{data.score.toFixed(1)}</span>
                <span className="text-xs text-slate-400 block font-bold mt-0.5">out of 6.0</span>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${scoreLevel.color} shadow-sm`}>
              {scoreLevel.label}
            </span>
          </div>

          {/* Core Feedback Commentary */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Award className="h-6 w-6 text-indigo-600" />
              <span>AI 종합 첨삭 평결</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm font-medium whitespace-pre-wrap">
              {data.feedback}
            </p>
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-500 flex items-start space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="font-medium">이 채점결과는 ETS 채점관 가이드라인에 따라 작성되었습니다. 에세이에 논리적 흐름이 끊기거나 구체적 논거가 부족한 부위를 개선하기 위한 척도로 삼으시기 바랍니다.</span>
            </div>
          </div>
        </section>

        {/* 4-Criteria Diagnostic Cards Grid */}
        <section className="space-y-4">
          <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>4대 평가 요소 영역별 진단</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* 1. Issue Response */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-extrabold text-sm text-slate-900">주제 대응 (Issue Response)</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150 uppercase">
                    {data.criteria.issueResponse.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.criteria.issueResponse.explanation}
                </p>
              </div>
            </div>

            {/* 2. Argument Development */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-extrabold text-sm text-slate-900">논증 전개 (Argument Development)</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150 uppercase">
                    {data.criteria.argumentDevelopment.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.criteria.argumentDevelopment.explanation}
                </p>
              </div>
            </div>

            {/* 3. Organization */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-extrabold text-sm text-slate-900">조직력 (Organization)</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150 uppercase">
                    {data.criteria.organization.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.criteria.organization.explanation}
                </p>
              </div>
            </div>

            {/* 4. Grammar & Vocabulary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-extrabold text-sm text-slate-900">문법 및 어휘 (Grammar & Vocabulary)</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150 uppercase">
                    {data.criteria.grammarVocabulary.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.criteria.grammarVocabulary.explanation}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 1:1 Sentence Correction Table (Polished style) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 text-lg">1:1 문장 첨삭 및 표현 개선안 (Corrections)</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              작성된 에세이 중 문법적 결함이나 비격식적인 어휘를 탐지하여, GRE 6.0점 수준의 격조 높은 학술용 문맥으로 재구성합니다.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200 select-none">
                    <th className="p-4 w-[35%]">원문 (내가 작성한 문장)</th>
                    <th className="p-4 w-[25%]">피드백 / 원인 진단</th>
                    <th className="p-4 w-[40%] text-green-800 bg-green-50/20">6.0점 모범 추천 대안</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-750 font-medium">
                  {data.corrections.length > 0 ? (
                    data.corrections.map((corr, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/20 transition duration-150">
                        {/* Original Sentence */}
                        <td className="p-4 font-serif leading-relaxed bg-red-50/15 text-red-950 border-r border-slate-100">
                          <div className="space-y-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black uppercase">
                              Before
                            </span>
                            <div className="flex items-start space-x-1.5">
                              <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                              <span>&ldquo;{corr.original}&rdquo;</span>
                            </div>
                          </div>
                        </td>
                        {/* Explanation */}
                        <td className="p-4 text-slate-555 leading-relaxed border-r border-slate-100 font-sans">
                          {corr.explanation}
                        </td>
                        {/* Improved Sentence */}
                        <td className="p-4 font-serif leading-relaxed bg-green-50/15 text-green-950">
                          <div className="space-y-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase">
                              After
                            </span>
                            <div className="flex items-start space-x-1.5">
                              <Check className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                              <span className="font-bold">&ldquo;{corr.improved}&rdquo;</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-400 font-medium">
                        감지된 어휘나 문법상의 문제점이 없습니다. 우수한 영어 표현력을 유지하고 계십니다!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Model Guide Accordions */}
        <section className="space-y-4">
          <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-indigo-600" />
            <span>만점 도달 가이드 모범 개요 및 에세이</span>
          </h3>

          {/* Accordion 1: Model Outline */}
          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden hover:border-slate-350 transition duration-200">
            <button
              onClick={() => setModelOutlineOpen(!modelOutlineOpen)}
              className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900 hover:bg-slate-50 transition"
            >
              <div className="flex items-center space-x-2.5">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <span>6.0점 만점 모범 개요 (Model Outline)</span>
              </div>
              {modelOutlineOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>
            
            {modelOutlineOpen && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-xs leading-relaxed text-slate-700 font-mono whitespace-pre-wrap">
                {data.modelOutline}
              </div>
            )}
          </div>

          {/* Accordion 2: Model Essay */}
          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden hover:border-slate-350 transition duration-200">
            <button
              onClick={() => setModelEssayOpen(!modelEssayOpen)}
              className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900 hover:bg-slate-50 transition"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>6.0점 만점 에세이 전문 (Model Essay)</span>
              </div>
              {modelEssayOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>
            
            {modelEssayOpen && (
              <div className="p-6 border-t border-slate-100 bg-white text-sm font-serif leading-relaxed text-slate-850 whitespace-pre-wrap select-text">
                {data.modelEssay}
              </div>
            )}
          </div>
        </section>

        {/* Dashboard Nav Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => router.push("/")}
            className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 px-12 rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-center text-xs text-slate-400 mt-12">
        <p className="font-medium">© 2026 GRE AWA Prep Coach. Designed for academic mastery. Powered by Solar AI.</p>
      </footer>
    </div>
  );
}
