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
  HelpCircle,
  FileText,
  AlertCircle
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-brand-50">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-10 w-10 border-4 border-accent-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-brand-900">Loading AI Feedback...</h2>
          <p className="text-sm text-brand-500">
            Please wait while we load your essay evaluation dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Get score description and styling
  const getScoreLevel = (score: number) => {
    if (score >= 5.5) return { label: "Outstanding (최우수)", color: "text-green-600 bg-green-50 border-green-150" };
    if (score >= 5.0) return { label: "Strong (우수)", color: "text-indigo-600 bg-indigo-50 border-indigo-150" };
    if (score >= 4.0) return { label: "Adequate (보통)", color: "text-blue-600 bg-blue-50 border-blue-150" };
    if (score >= 3.0) return { label: "Limited (미흡)", color: "text-yellow-600 bg-yellow-50 border-yellow-150" };
    return { label: "Seriously Flawed (취약)", color: "text-red-600 bg-red-50 border-red-150" };
  };

  const scoreLevel = getScoreLevel(data.score);

  // SVG Gauge calculations
  const strokeDashoffset = 440 - (440 * (data.score / 6.0));

  return (
    <div className="flex-1 flex flex-col bg-brand-50 min-h-screen">
      {/* Header */}
      <header className="border-b border-brand-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-sm font-semibold text-brand-600 hover:text-brand-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <div className="text-sm font-bold text-brand-900">
            GRE AWA AI Feedback Report
          </div>
        </div>
      </header>

      {/* Report Workspace */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Top Summary Block (Score + Feedback) */}
        <section className="bg-white border border-brand-200 rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center space-y-3 md:border-r border-brand-100 pr-0 md:pr-8">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">AWA Estimated Score</span>
            
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="transform -rotate-90 w-40 h-40">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-brand-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Foreground circle */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-accent-600"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              
              <div className="absolute text-center">
                <span className="text-4xl font-extrabold text-brand-900">{data.score.toFixed(1)}</span>
                <span className="text-sm text-brand-400 block font-semibold">out of 6.0</span>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${scoreLevel.color}`}>
              {scoreLevel.label}
            </span>
          </div>

          {/* Feedback Commentary */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight flex items-center space-x-2">
              <Award className="h-6 w-6 text-accent-600" />
              <span>AI 종합 첨삭 리포트</span>
            </h2>
            <p className="text-brand-700 leading-relaxed text-sm whitespace-pre-wrap">
              {data.feedback}
            </p>
            <div className="p-3 bg-brand-50 border border-brand-150 rounded-lg text-xs text-brand-550 flex items-start space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-brand-400 shrink-0 mt-0.5" />
              <span>이 리포트는 ETS 채점 기준(Scoring Guide)에 맞춰 Solar-Pro 모델이 분석한 예상 점수입니다. 실전 시험에서 논리와 표현력의 완성도를 높이는 기준표로 활용하세요.</span>
            </div>
          </div>
        </section>

        {/* 4-Criteria Diagnostic Cards Grid */}
        <section className="space-y-4">
          <h3 className="font-extrabold text-brand-900 text-lg">4대 평가 요소 영역별 진단 (Rubric Diagnostics)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Issue Response */}
            <div className="bg-white border border-brand-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="font-bold text-sm text-brand-900">주제 대응 (Issue Response)</span>
                <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded border border-accent-100 uppercase">
                  {data.criteria.issueResponse.grade}
                </span>
              </div>
              <p className="text-xs text-brand-600 leading-relaxed">
                {data.criteria.issueResponse.explanation}
              </p>
            </div>

            {/* 2. Argument Development */}
            <div className="bg-white border border-brand-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="font-bold text-sm text-brand-900">논증 전개 (Argument Development)</span>
                <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded border border-accent-100 uppercase">
                  {data.criteria.argumentDevelopment.grade}
                </span>
              </div>
              <p className="text-xs text-brand-600 leading-relaxed">
                {data.criteria.argumentDevelopment.explanation}
              </p>
            </div>

            {/* 3. Organization */}
            <div className="bg-white border border-brand-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="font-bold text-sm text-brand-900">조직력 (Organization)</span>
                <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded border border-accent-100 uppercase">
                  {data.criteria.organization.grade}
                </span>
              </div>
              <p className="text-xs text-brand-600 leading-relaxed">
                {data.criteria.organization.explanation}
              </p>
            </div>

            {/* 4. Grammar & Vocabulary */}
            <div className="bg-white border border-brand-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                <span className="font-bold text-sm text-brand-900">문법 및 어휘 (Grammar/Vocabulary)</span>
                <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded border border-accent-100 uppercase">
                  {data.criteria.grammarVocabulary.grade}
                </span>
              </div>
              <p className="text-xs text-brand-600 leading-relaxed">
                {data.criteria.grammarVocabulary.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* 1:1 Sentence Correction Table */}
        <section className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-brand-900 text-lg">1:1 문장 첨삭 및 개선 제안 (Sentence Corrections)</h3>
            <p className="text-xs text-brand-500 mt-1">
              에세이에서 표현이나 논리성이 아쉬웠던 부분을 꼽아, GRE 6.0 만점 수준의 구조적인 대안 문장으로 고쳐 제안합니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-brand-100 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-brand-50 text-xs font-bold text-brand-600 uppercase border-b border-brand-100">
                  <th className="p-4 w-[35%]">내가 작성한 원래 문장</th>
                  <th className="p-4 w-[25%] font-medium">문제점 진단</th>
                  <th className="p-4 w-[40%] text-green-700 bg-green-50/30">6.0점 만점 수준 모범 문장</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
                {data.corrections.length > 0 ? (
                  data.corrections.map((corr, idx) => (
                    <tr key={idx} className="hover:bg-brand-50/20">
                      <td className="p-4 font-serif leading-relaxed bg-red-50/25 text-red-900 border-r border-brand-50">
                        <div className="flex items-start space-x-2">
                          <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>&ldquo;{corr.original}&rdquo;</span>
                        </div>
                      </td>
                      <td className="p-4 text-brand-550 leading-relaxed border-r border-brand-50">
                        {corr.explanation}
                      </td>
                      <td className="p-4 font-serif leading-relaxed bg-green-50/25 text-green-900">
                        <div className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          <span className="font-semibold">&ldquo;{corr.improved}&rdquo;</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-brand-400">
                      감지된 심각한 표현 오류가 없습니다. 훌륭한 문장력을 갖추셨습니다!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Model Outline and Essay (Accordions) */}
        <section className="space-y-4">
          <h3 className="font-extrabold text-brand-900 text-lg">만점 가이드 모범 답안 (Model Responses)</h3>

          {/* Accordion 1: Model Outline */}
          <div className="border border-brand-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setModelOutlineOpen(!modelOutlineOpen)}
              className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-brand-900 hover:bg-brand-50 transition"
            >
              <div className="flex items-center space-x-2.5">
                <BookOpen className="h-5 w-5 text-accent-600" />
                <span>6.0점 만점 모범 개요 (Model Outline)</span>
              </div>
              {modelOutlineOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {modelOutlineOpen && (
              <div className="p-6 border-t border-brand-100 bg-brand-50/30 text-sm leading-relaxed text-brand-750 font-mono whitespace-pre-wrap">
                {data.modelOutline}
              </div>
            )}
          </div>

          {/* Accordion 2: Model Essay */}
          <div className="border border-brand-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setModelEssayOpen(!modelEssayOpen)}
              className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-brand-900 hover:bg-brand-50 transition"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-5 w-5 text-accent-600" />
                <span>6.0점 만점 에세이 전문 (Model Essay)</span>
              </div>
              {modelEssayOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {modelEssayOpen && (
              <div className="p-6 border-t border-brand-100 bg-brand-50/10 text-base font-serif leading-relaxed text-brand-850 whitespace-pre-wrap select-text">
                {data.modelEssay}
              </div>
            )}
          </div>
        </section>

        {/* Dashboard Nav Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/")}
            className="bg-brand-900 hover:bg-brand-950 text-white font-bold py-3 px-10 rounded-xl shadow transition"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-200 py-8 bg-white text-center text-xs text-brand-400 mt-12">
        <p>© 2026 GRE AWA Prep Coach. Built for mastery. Solar AI powered.</p>
      </footer>
    </div>
  );
}
