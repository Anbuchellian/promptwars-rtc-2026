"use client";

import React from "react";
import { Award, Check, CheckCircle, RefreshCw } from "lucide-react";
import type { AnalysisData } from "@/lib/types";

interface QuizTabProps {
  targetRole: string;
  analysisData: AnalysisData | null;
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;
  quizScore: { correct: number; total: number } | null;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
  onSubmitQuiz: () => void;
  onAutoAdaptRoadmap: () => void;
}

export default function QuizTab({
  targetRole,
  analysisData,
  quizAnswers,
  quizSubmitted,
  quizScore,
  onSelectAnswer,
  onSubmitQuiz,
  onAutoAdaptRoadmap,
}: QuizTabProps) {
  const quizLength = analysisData?.diagnosticQuiz.length || 3;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Instant Diagnostic Assessment (Examiner Agent 3)
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Targeting missing skills for {targetRole}:{" "}
              {analysisData?.missingSkills.map((m) => m.skill).join(", ")}.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-slate-700">
            THRESHOLD: 60%
          </span>
        </div>

        <div className="space-y-4 mt-4">
          {analysisData?.diagnosticQuiz.map((q, idx) => {
            const selectedOpt = quizAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <fieldset
                key={q.id}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-800">
                    QUESTION {idx + 1} &bull; {q.skill}
                  </span>
                  {quizSubmitted && (
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? "bg-teal-50 text-teal-900 border border-teal-200"
                          : "bg-rose-50 text-rose-900 border border-rose-200"
                      }`}
                    >
                      {isCorrect ? "CORRECT" : "INCORRECT"}
                    </span>
                  )}
                </div>

                <legend className="text-xs font-heading font-bold tracking-tight text-slate-900 mb-3">
                  {q.question}
                </legend>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let btnStyle =
                      "bg-white border-stone-200 text-slate-800 hover:border-teal-400 hover:bg-teal-50/30";

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle =
                          "bg-teal-50 border-teal-600 text-teal-950 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "bg-rose-50 border-rose-400 text-rose-950 font-medium";
                      }
                    } else if (isSelected) {
                      btnStyle =
                        "bg-teal-50 border-teal-600 text-teal-950 font-bold shadow-xs";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={quizSubmitted}
                        onClick={() => onSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-sans transition cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correctIndex && (
                          <Check
                            className="w-3.5 h-3.5 text-teal-700 shrink-0 ml-2"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white border border-stone-200 text-[11px] font-sans text-slate-700">
                    <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-0.5">
                      Diagnostic Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < quizLength}
              className="px-5 py-2 rounded-xl text-xs font-heading font-bold tracking-tight bg-[#6D1A36] hover:bg-[#521228] text-white shadow-md shadow-[#6D1A36]/20 disabled:opacity-40 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              Submit Diagnostic Quiz
            </button>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="flex-1 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="text-xs font-sans">
                <span className="text-slate-700 font-medium">
                  Diagnostic Result:{" "}
                </span>
                <strong
                  className={`font-mono text-sm ${
                    quizScore && quizScore.correct / quizScore.total >= 0.6
                      ? "text-teal-800 font-bold"
                      : "text-rose-800 font-bold"
                  }`}
                >
                  {quizScore?.correct}/{quizScore?.total} Correct (
                  {quizScore
                    ? Math.round((quizScore.correct / quizScore.total) * 100)
                    : 0}
                  %)
                </strong>
              </div>

              {quizScore && quizScore.correct / quizScore.total < 0.6 ? (
                <button
                  type="button"
                  onClick={onAutoAdaptRoadmap}
                  className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold tracking-tight bg-gradient-to-r from-[#6D1A36] to-rose-700 hover:from-[#521228] hover:to-rose-800 text-white shadow-md shadow-rose-900/20 transition flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    Auto-Adapt Roadmap with Mentor Agent (Inject Remedial
                    Modules)
                  </span>
                </button>
              ) : (
                <span className="text-xs text-teal-800 font-heading font-bold tracking-tight flex items-center gap-1">
                  <CheckCircle
                    className="w-4 h-4 text-teal-700"
                    aria-hidden="true"
                  />
                  Passing Score Met! You are ready to proceed with Phase 1.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
