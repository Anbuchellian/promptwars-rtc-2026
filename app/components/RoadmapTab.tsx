"use client";

import React from "react";
import { AlertTriangle, Layers, Sparkles } from "lucide-react";
import type { AnalysisData } from "@/lib/types";

interface RoadmapTabProps {
  targetRole: string;
  analysisData: AnalysisData | null;
  completedItems: Record<string, boolean>;
  progressPercent: number;
  onToggleItemCompletion: (key: string) => void;
  onLaunchSimulator: (focusSkill: string) => void;
}

export default function RoadmapTab({
  targetRole,
  analysisData,
  completedItems,
  progressPercent,
  onToggleItemCompletion,
  onLaunchSimulator,
}: RoadmapTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700" aria-hidden="true" />
            Personalized Phased Learning Roadmap ({targetRole})
          </h3>
          <p className="text-xs font-sans text-slate-600 mt-0.5">
            Architected by Agent 2 &bull; Check off completed modules to
            synchronize progress.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-sans text-slate-600 font-medium">
            Overall Completion
          </span>
          <div className="text-sm font-mono font-bold text-teal-800">
            {progressPercent}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {analysisData?.roadmap.map((phase, pIdx) => (
          <section
            key={phase.phase}
            aria-label={phase.phase}
            className={`rounded-2xl border p-5 transition ${
              phase.isRemedial
                ? "bg-rose-50/60 border-rose-300 shadow-sm"
                : "bg-white border-stone-200 shadow-sm"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-heading font-bold ${
                    phase.isRemedial
                      ? "bg-[#6D1A36] text-white"
                      : "bg-teal-700 text-white"
                  }`}
                >
                  {pIdx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-heading font-bold tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
                    <span>{phase.phase}</span>
                    {phase.isRemedial && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#6D1A36] border border-rose-200 text-[9px] font-mono uppercase tracking-wider font-bold inline-flex items-center gap-1">
                        <AlertTriangle
                          className="w-3 h-3 text-[#6D1A36]"
                          aria-hidden="true"
                        />
                        REMEDIAL MODULE INJECTED
                      </span>
                    )}
                  </h4>
                  <span className="text-xs font-sans text-slate-600">
                    Focus Skill:{" "}
                    <strong className="text-slate-800">
                      {phase.focusSkill}
                    </strong>
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-slate-700">
                {phase.duration}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phase.resources.map((res, rIdx) => {
                const itemKey = `${phase.phase}_${rIdx}`;
                const inputId = `roadmap-item-${pIdx}-${rIdx}`;
                const isDone = Boolean(completedItems[itemKey]);

                return (
                  <label
                    key={res.title}
                    htmlFor={inputId}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 focus-within:ring-2 focus-within:ring-[#0D9488] ${
                      isDone
                        ? "bg-stone-50 border-teal-300 opacity-85"
                        : phase.isRemedial
                        ? "bg-white border-rose-200 hover:border-[#6D1A36]"
                        : "bg-stone-50/50 border-stone-200 hover:border-teal-500"
                    }`}
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={isDone}
                      onChange={() => onToggleItemCompletion(itemKey)}
                      className="mt-1 w-4 h-4 rounded text-teal-600 bg-white border-stone-300 cursor-pointer accent-teal-600 shrink-0"
                    />
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-xs font-heading font-bold tracking-tight ${
                            isDone
                              ? "line-through text-slate-500"
                              : "text-slate-900"
                          }`}
                        >
                          {res.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            res.type === "Hands-on Project"
                              ? "bg-teal-50 text-teal-900 border border-teal-200"
                              : res.type === "Course"
                              ? "bg-rose-50 text-[#6D1A36] border border-rose-200"
                              : "bg-cyan-50 text-cyan-900 border border-cyan-200"
                          }`}
                        >
                          {res.type}
                        </span>
                      </span>
                      <span className="block text-[11px] font-sans text-slate-600 leading-relaxed">
                        {res.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-sans text-slate-600">
                Test <strong>{phase.focusSkill}</strong> in a live stakeholder
                workplace dilemma:
              </span>
              <button
                type="button"
                onClick={() => onLaunchSimulator(phase.focusSkill)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#6D1A36] hover:bg-[#521228] px-3 py-1.5 text-xs font-heading font-semibold text-white shadow-xs transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <Sparkles
                  className="w-3.5 h-3.5 text-teal-300"
                  aria-hidden="true"
                />
                <span>Launch Live Roleplay Simulation</span>
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
