"use client";

import React from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Brain,
  ShieldCheck,
} from "lucide-react";
import type { AnalysisData } from "@/lib/types";

interface OrchestrationBarProps {
  analysisData: AnalysisData | null;
  isLoading: boolean;
  adaptationAlert: string | null;
}

export default function OrchestrationBar({
  analysisData,
  isLoading,
  adaptationAlert,
}: OrchestrationBarProps) {
  return (
    <section
      aria-labelledby="orchestration-heading"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#6D1A36]" aria-hidden="true" />
          <h2
            id="orchestration-heading"
            className="text-xs font-heading font-bold text-[#6D1A36] tracking-tight uppercase"
          >
            Multi-Agent Live Orchestration Layer
          </h2>
        </div>
        <span
          role="status"
          aria-live="polite"
          className="text-[10px] font-mono uppercase tracking-wider text-[#0F766E] bg-[#0D9488]/[0.08] border border-[#0D9488]/20 px-2.5 py-0.5 rounded-full font-bold"
        >
          {isLoading ? "EXECUTING PIPELINE..." : "4 AGENTS ACTIVE"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
          <ShieldCheck
            className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">
                Skill Auditor
              </span>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">
                READINESS: {analysisData?.readinessScore ?? "--"}%
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-600 leading-relaxed line-clamp-2">
              {analysisData?.agentLogs?.find(
                (l) => l.agentName === "Skill Auditor Agent"
              )?.thought ||
                "Audits input skills against industry job descriptions; assigns empirical Readiness Score."}
            </p>
          </div>
        </div>

        <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
          <BookOpen
            className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">
                Curriculum Architect
              </span>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">
                CURRICULUM READY
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-600 leading-relaxed line-clamp-2">
              {analysisData?.agentLogs?.find(
                (l) => l.agentName === "Curriculum Architect Agent"
              )?.thought ||
                "Builds structured, week-by-week personalized learning sequences with real projects."}
            </p>
          </div>
        </div>

        <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
          <Award
            className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">
                Assessment Examiner
              </span>
              <span className="text-[10px] font-mono text-[#0F766E] font-bold">
                DIAGNOSTIC ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-600 leading-relaxed line-clamp-2">
              {analysisData?.agentLogs?.find(
                (l) => l.agentName === "Assessment Examiner Agent"
              )?.thought ||
                "Generates 3-question diagnostic quiz targeting exact identified missing skills."}
            </p>
          </div>
        </div>

        <div className="border-l-2 border-[#6D1A36] bg-[#6D1A36]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#6D1A36]/[0.06] transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-[#6D1A36] text-white text-[8px] font-mono uppercase tracking-wider font-bold rounded-bl">
            ADAPTIVE HOOK
          </div>
          <Bot
            className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#6D1A36]">
                Adaptive Mentor
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-600 leading-relaxed line-clamp-2">
              {analysisData?.agentLogs?.find(
                (l) => l.agentName === "Adaptive Mentor Agent"
              )?.thought ||
                "Monitors quiz performance & career switches; triggers visible remediation alerts."}
            </p>
          </div>
        </div>
      </div>

      {adaptationAlert && (
        <div
          role="alert"
          className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5 shadow-sm"
        >
          <AlertTriangle
            className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-0.5">
              DYNAMIC AGENT COLLABORATION ALERT
            </span>
            <p className="text-[11px] font-sans leading-relaxed text-slate-700">
              {adaptationAlert}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
