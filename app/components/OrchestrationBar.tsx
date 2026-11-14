"use client";

import React from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Loader2,
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
  const agents = [
    {
      key: "Skill Auditor Agent" as const,
      title: "Skill Auditor",
      metric: `Readiness ${analysisData?.readinessScore ?? "--"}%`,
      fallbackThought:
        "Audits input skills against industry benchmarks and assigns an empirical Readiness Score.",
      icon: ShieldCheck,
      accentClass: "text-[#0F766E]",
    },
    {
      key: "Curriculum Architect Agent" as const,
      title: "Curriculum Architect",
      metric: `${analysisData?.roadmap?.length ?? 3} Phases`,
      fallbackThought:
        "Builds structured, week-by-week personalized learning sequences with applied projects.",
      icon: BookOpen,
      accentClass: "text-[#0F766E]",
    },
    {
      key: "Assessment Examiner Agent" as const,
      title: "Assessment Examiner",
      metric: `${analysisData?.diagnosticQuiz?.length ?? 3} Questions`,
      fallbackThought:
        "Generates targeted diagnostic questions aligned to identified skill gaps.",
      icon: Award,
      accentClass: "text-[#0F766E]",
    },
    {
      key: "Adaptive Mentor Agent" as const,
      title: "Adaptive Mentor",
      metric: adaptationAlert ? "Intervention Active" : "Monitoring",
      fallbackThought:
        "Monitors quiz performance and career switches to inject remedial modules when needed.",
      icon: Bot,
      accentClass: "text-[#6D1A36]",
    },
  ];

  return (
    <section
      aria-labelledby="orchestration-heading"
      className="bg-white rounded-xl border border-slate-200 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#6D1A36] shrink-0" aria-hidden="true" />
          <h2
            id="orchestration-heading"
            className="text-sm font-heading font-bold text-[#6D1A36] tracking-tight"
          >
            Multi-Agent Orchestration Layer
          </h2>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700"
        >
          {isLoading ? (
            <>
              <Loader2
                className="w-3.5 h-3.5 animate-spin text-[#0F766E]"
                aria-hidden="true"
              />
              <span>Running 4-Agent Pipeline...</span>
            </>
          ) : (
            <>
              <CheckCircle2
                className="w-3.5 h-3.5 text-[#0F766E]"
                aria-hidden="true"
              />
              <span>4 Agents Synchronized</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          const thought =
            analysisData?.agentLogs?.find((l) => l.agentName === agent.key)
              ?.thought || agent.fallbackThought;

          return (
            <div
              key={agent.key}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 flex items-start gap-3"
            >
              <IconComponent
                className={`w-4 h-4 shrink-0 mt-0.5 ${agent.accentClass}`}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-heading font-bold text-slate-900">
                    {agent.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums whitespace-nowrap">
                    {agent.metric}
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  {thought}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {adaptationAlert && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-3"
        >
          <AlertTriangle
            className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <strong className="font-heading text-[#6D1A36] block mb-0.5">
              Adaptive Intervention Active
            </strong>
            <p className="text-xs font-sans leading-relaxed text-slate-800">
              {adaptationAlert}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
