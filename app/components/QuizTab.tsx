"use client";

import React from "react";
import { Award, Check, CheckCircle, RefreshCw, RotateCcw } from "lucide-react";
import type { AnalysisData } from "@/lib/types";

interface QuizTabProps {
  targetRole: string;
  analysisData: AnalysisData | null;
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;
  quizScore: { correct: number; total: number } | null;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
  onSubmitQuiz: () => void;
  onRetakeQuiz: () => void;
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
  onRetakeQuiz,
  onAutoAdaptRoadmap,
}: QuizTabProps) {
  const quizLength = analysisData?.diagnosticQuiz.length || 3;
  const answeredCount = Object.keys(quizAnswers).length;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
              <span>Instant Diagnostic Assessment (Examiner Agent 3)</span>
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Targeting missing skills for {targetRole}:{" "}
              {analysisData?.missingSkills.map((m) => m.skill).join(", ")}.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-700 tabular-nums">
            <span>
              Answered {answeredCount}/{quizLength}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
              THRESHOLD: 60%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {analysisData?.diagnosticQuiz.map((q, idx) => {
            const selectedOpt = quizAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <fieldset
                key={q.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#0F766E]">
                    Question {idx + 1} &middot; {q.skill}
                  </span>
                  {quizSubmitted && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        isCorrect ? "text-[#0F766E]" : "text-rose-800"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>

                <legend className="text-sm font-heading font-bold tracking-tight text-slate-900 mb-3">
                  {q.question}
                </legend>

                <div
                  role="radiogroup"
                  aria-label={`Options for question ${idx + 1}`}
                  className="space-y-2"
                >
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let btnStyle =
                      "bg-white border-slate-200 text-slate-800 hover:border-[#0D9488] hover:bg-teal-50/30";

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle =
                          "bg-teal-50 border-teal-600 text-teal-950 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "bg-rose-50 border-rose-400 text-rose-950 font-medium";
                      }
                    } else if (isSelected) {
                      btnStyle =
                        "bg-teal-50 border-teal-600 text-teal-950 font-semibold";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={quizSubmitted}
                        onClick={() => onSelectAnswer(q.id, optIdx)}
                        className={`w-full min-h-[42px] text-left px-3.5 py-2.5 rounded-lg border text-xs font-sans transition-colors cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correctIndex && (
                          <Check
                            className="w-4 h-4 text-[#0F766E] shrink-0 ml-2"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs font-sans text-slate-700">
                    <span className="font-heading font-bold text-[#6D1A36] block mb-0.5">
                      Diagnostic Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              disabled={answeredCount < quizLength}
              className="min-h-[42px] px-5 py-2.5 rounded-lg text-xs font-heading font-bold tracking-tight bg-[#6D1A36] hover:bg-[#521228] text-white disabled:opacity-40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
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
                  className={`font-mono text-sm tabular-nums ${
                    quizScore && quizScore.correct / quizScore.total >= 0.6
                      ? "text-[#0F766E] font-bold"
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

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onRetakeQuiz}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-heading font-bold text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Retake Quiz</span>
                </button>

                {quizScore && quizScore.correct / quizScore.total < 0.6 ? (
                  <button
                    type="button"
                    onClick={onAutoAdaptRoadmap}
                    className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-heading font-bold tracking-tight bg-[#6D1A36] hover:bg-[#521228] text-white transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      Auto-Adapt Roadmap with Mentor Agent (Inject Remedial
                      Modules)
                    </span>
                  </button>
                ) : (
                  <span className="text-xs text-[#0F766E] font-heading font-bold flex items-center gap-1.5">
                    <CheckCircle
                      className="w-4 h-4 text-[#0F766E]"
                      aria-hidden="true"
                    />
                    <span>
                      Passing Score Met. Ready to proceed with Phase 1.
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
