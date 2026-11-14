"use client";

import React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { AnalysisData, DomainComparison } from "@/lib/types";

interface ReadinessTabProps {
  name: string;
  targetRole: string;
  analysisData: AnalysisData | null;
  domainComparisonList: DomainComparison[];
  completedCount: number;
  totalResources: number;
  onAddGoalFromSkill: (skill: string, priority: "High" | "Medium" | "Low") => void;
}

export default function ReadinessTab({
  name,
  targetRole,
  analysisData,
  domainComparisonList,
  completedCount,
  totalResources,
  onAddGoalFromSkill,
}: ReadinessTabProps) {
  const readinessScore = analysisData?.readinessScore ?? 48;
  const matchedCount = analysisData?.matchedSkills?.length ?? 0;
  const missingCount = analysisData?.missingSkills?.length ?? 0;

  const dimensions = [
    {
      name: "Domain Mastery",
      desc: "Core Theoretical & Field Fundamentals",
    },
    {
      name: "Practical Execution",
      desc: "Hands-on Tools & Implementation",
    },
    {
      name: "Analytical Problem Solving",
      desc: "Algorithmic & Critical Diagnostics",
    },
    {
      name: "Industry Tools & Compliance",
      desc: "Regulatory SOPs & Professional Tooling",
    },
    {
      name: "Communication & Leadership",
      desc: "Technical Synthesis & Cross-team Delivery",
    },
  ];

  const radarValues = dimensions.map((dim, idx) => {
    const fallbackItem = domainComparisonList[idx] || domainComparisonList[0];
    const current = fallbackItem ? fallbackItem.currentScore : 55;
    const target = fallbackItem ? fallbackItem.requiredScore : 80;
    return {
      label: dim.name,
      sub: dim.desc,
      current: Math.min(100, Math.max(15, current)),
      target: Math.min(100, Math.max(25, target)),
    };
  });

  const cx = 200;
  const cy = 190;
  const maxR = 125;
  const numAxes = 5;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2;

  const polarToCartesian = (radius: number, index: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const pentagonPaths = levels.map((lvl) =>
    Array.from({ length: numAxes }, (_, i) => {
      const pt = polarToCartesian(maxR * lvl, i);
      return `${pt.x},${pt.y}`;
    }).join(" ")
  );

  const candidatePoints = radarValues
    .map((v, i) => {
      const pt = polarToCartesian(maxR * (v.current / 100), i);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  const targetPoints = radarValues
    .map((v, i) => {
      const pt = polarToCartesian(maxR * (v.target / 100), i);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  const candidateVertices = radarValues.map((v, i) =>
    polarToCartesian(maxR * (v.current / 100), i)
  );

  const readinessTier =
    readinessScore > 70
      ? "Advanced Ready"
      : readinessScore > 40
      ? "Mid-Stage"
      : "Foundation";

  return (
    <div className="space-y-5">
      {/* 4-Column Executive KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-600 block">
            Readiness Index
          </span>
          <span className="text-2xl font-heading font-bold text-[#6D1A36] tabular-nums mt-1 block">
            {readinessScore}%
          </span>
          <span className="text-xs text-[#0F766E] font-medium mt-0.5 block">
            {readinessTier}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-600 block">
            Verified Skills
          </span>
          <span className="text-2xl font-heading font-bold text-slate-900 tabular-nums mt-1 block">
            {matchedCount}
          </span>
          <span className="text-xs text-slate-600 mt-0.5 block">
            Directly transferable
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-600 block">
            Priority Gaps
          </span>
          <span className="text-2xl font-heading font-bold text-slate-900 tabular-nums mt-1 block">
            {missingCount}
          </span>
          <span className="text-xs text-slate-600 mt-0.5 block">
            Flagged by Auditor
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-600 block">
            Modules Completed
          </span>
          <span className="text-2xl font-heading font-bold text-[#0F766E] tabular-nums mt-1 block">
            {completedCount}/{totalResources}
          </span>
          <span className="text-xs text-slate-600 mt-0.5 block">
            Roadmap progress
          </span>
        </div>
      </div>

      {/* Readiness Summary & Gauge */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <p className="text-xs font-mono font-semibold text-[#0F766E] mb-1.5">
            Skill Auditor Synthesis &middot; Target Alignment
          </p>
          <h2 className="text-xl font-heading font-bold tracking-tight text-[#6D1A36]">
            {name}&apos;s Job Readiness for {targetRole}
          </h2>
          <p className="text-sm font-sans text-slate-700 mt-1.5 max-w-xl leading-relaxed">
            Evaluated against contemporary academic and industry competencies for{" "}
            <strong>{targetRole}</strong> across core domain benchmarks.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="font-heading font-bold text-xs text-[#6D1A36] block mb-1">
              Strategic Mentor Guidance
            </span>
            <p className="text-sm text-slate-700 font-sans leading-relaxed">
              {analysisData?.mentorAdvice || "Analyzing profile trajectory..."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl min-w-[170px] shrink-0">
          <div
            role="img"
            aria-label={`Job readiness score: ${readinessScore} percent`}
            className="relative w-28 h-28 flex items-center justify-center"
          >
            <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - readinessScore / 100)}
                strokeLinecap="round"
                className="text-[#0F766E] transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-[#6D1A36] tabular-nums">
                {readinessScore}%
              </span>
              <span className="text-xs font-mono text-slate-600 font-semibold">
                Readiness
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-[#0F766E]">
            {readinessTier}
          </span>
        </div>
      </section>

      {/* 5-Axis Pentagon Radar Chart */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-heading font-bold text-[#6D1A36] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
              <span>Competency Attribute Radar &middot; 5 Core Dimensions</span>
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Multi-axis benchmark comparison for <strong>{targetRole}</strong>
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2.5 rounded-sm bg-[#0D9488]"
              />
              <span className="text-slate-800">Candidate Profile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2.5 rounded-sm bg-rose-100 border border-[#6D1A36]"
              />
              <span className="text-slate-700">Benchmark Target</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-2">
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-labelledby="radar-svg-title radar-svg-desc"
              className="w-full h-full overflow-visible select-none"
            >
              <title id="radar-svg-title">
                5-Axis Competency Radar Chart for {targetRole}
              </title>
              <desc id="radar-svg-desc">
                {radarValues
                  .map(
                    (v) =>
                      `${v.label}: candidate ${v.current}% vs target ${v.target}%`
                  )
                  .join("; ")}
              </desc>
              <defs>
                <radialGradient
                  id="candidateGradient"
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.2" />
                </radialGradient>
                <linearGradient
                  id="targetBorderGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6D1A36" />
                  <stop offset="100%" stopColor="#800020" />
                </linearGradient>
              </defs>

              {pentagonPaths.map((pts, li) => (
                <polygon
                  key={li}
                  points={pts}
                  fill={li % 2 === 0 ? "#F8FAFC" : "#FFFFFF"}
                  stroke="#CBD5E1"
                  strokeWidth={li === 4 ? "1.6" : "1"}
                />
              ))}

              {Array.from({ length: numAxes }, (_, i) => {
                const outerPt = polarToCartesian(maxR, i);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={outerPt.x}
                    y2={outerPt.y}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeDasharray={i % 2 === 1 ? "2 2" : undefined}
                  />
                );
              })}

              {levels.map((lvl, li) => {
                const pt = polarToCartesian(maxR * lvl, 0);
                return (
                  <text
                    key={li}
                    x={pt.x + 4}
                    y={pt.y - 2}
                    fontSize="9"
                    fill="#475569"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {Math.round(lvl * 100)}%
                  </text>
                );
              })}

              <polygon
                points={targetPoints}
                fill="#6D1A36"
                fillOpacity="0.08"
                stroke="url(#targetBorderGradient)"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />

              <polygon
                points={candidatePoints}
                fill="url(#candidateGradient)"
                stroke="#0F766E"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              {candidateVertices.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#0F766E"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <circle cx={pt.x} cy={pt.y} r="2" fill="#FFFFFF" />
                </g>
              ))}

              {radarValues.map((v, i) => {
                const labelPt = polarToCartesian(maxR + 24, i);
                const isLeft = labelPt.x < cx - 20;
                const isRight = labelPt.x > cx + 20;
                const anchor = isLeft ? "end" : isRight ? "start" : "middle";

                return (
                  <g key={i}>
                    <text
                      x={labelPt.x}
                      y={labelPt.y}
                      textAnchor={anchor}
                      fontSize="10"
                      fontWeight="700"
                      fill="#0F172A"
                      fontFamily="system-ui, sans-serif"
                    >
                      {v.label}
                    </text>
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 12}
                      textAnchor={anchor}
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#0F766E"
                      fontFamily="monospace"
                    >
                      {v.current}% / {v.target}%
                    </text>
                  </g>
                );
              })}

              <circle cx={cx} cy={cy} r="3" fill="#6D1A36" />
            </svg>
          </div>

          <div className="w-full lg:flex-1">
            <h4 className="text-xs font-heading font-bold text-[#6D1A36] mb-3">
              5-Axis Benchmark Breakdown
            </h4>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
              {radarValues.map((item) => {
                const gap = item.target - item.current;
                return (
                  <div
                    key={item.label}
                    className="p-3 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-slate-900 block">
                        {item.label}
                      </span>
                      <span className="text-xs text-slate-600 font-sans block">
                        {item.sub}
                      </span>
                    </div>
                    <div className="text-right shrink-0 font-mono tabular-nums">
                      <span className="font-bold text-[#0F766E]">
                        {item.current}%
                      </span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-800">{item.target}%</span>
                      <span
                        className={`block text-xs font-semibold ${
                          gap <= 0 ? "text-[#0F766E]" : "text-rose-800"
                        }`}
                      >
                        {gap <= 0 ? "Benchmarked" : `-${gap}% Gap`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Domain Skill Gap Comparison Bars */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-heading font-bold text-[#6D1A36] flex items-center gap-2">
              <TrendingUp
                className="w-4 h-4 text-[#0F766E]"
                aria-hidden="true"
              />
              <span>Domain Skill Gap &amp; Benchmark Analysis</span>
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Candidate competencies versus target requirements for {targetRole}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2.5 rounded-sm bg-[#0F766E]"
              />
              <span className="text-slate-800">Candidate Mastery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2.5 rounded-sm bg-slate-300 border border-[#6D1A36]"
              />
              <span className="text-slate-700">Target Threshold</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {domainComparisonList.map((item) => {
            const diff = item.requiredScore - item.currentScore;
            return (
              <div key={item.domain} className="py-4 first:pt-1 last:pb-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-heading font-bold text-slate-900">
                      {item.domain}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        item.gapStatus === "Strong Match"
                          ? "text-[#0F766E]"
                          : item.gapStatus === "Moderate Gap"
                          ? "text-amber-800"
                          : "text-rose-800"
                      }`}
                    >
                      &middot; {item.gapStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold tabular-nums">
                    <span className="text-[#0F766E]">
                      {item.currentScore}%
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="text-[#6D1A36]">
                      Req {item.requiredScore}%
                    </span>
                    <span
                      className={
                        diff <= 0 ? "text-[#0F766E]" : "text-rose-800"
                      }
                    >
                      ({diff <= 0 ? `+${Math.abs(diff)}% Met` : `-${diff}% Gap`})
                    </span>
                  </div>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={item.currentScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.domain}: current ${item.currentScore}%, target ${item.requiredScore}%`}
                  className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
                >
                  <div
                    className="absolute top-0 bottom-0 bg-slate-200 border-r-2 border-[#6D1A36]"
                    style={{ width: `${item.requiredScore}%` }}
                    title={`Target Requirement: ${item.requiredScore}%`}
                  />
                  <div
                    className={`h-full transition-all duration-500 rounded-full relative z-10 ${
                      item.gapStatus === "Critical Gap"
                        ? "bg-rose-600"
                        : "bg-[#0F766E]"
                    }`}
                    style={{ width: `${item.currentScore}%` }}
                  />
                </div>

                <p className="text-xs font-sans text-slate-700 mt-1.5">
                  Priority Focus:{" "}
                  <strong className="text-slate-900 font-semibold">
                    {item.keyMissing}
                  </strong>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Matched vs Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle
              className="w-4 h-4 text-[#0F766E]"
              aria-hidden="true"
            />
            <h3 className="text-sm font-heading font-bold text-[#6D1A36]">
              Verified Strengths
            </h3>
          </div>
          <p className="text-xs font-sans text-slate-600 mb-3">
            Skills from your profile aligned to {targetRole}:
          </p>
          <ul className="divide-y divide-slate-100">
            {analysisData?.matchedSkills.map((skill) => (
              <li
                key={skill}
                className="py-2 flex items-center gap-2 text-xs font-medium text-slate-900"
              >
                <Check
                  className="w-4 h-4 text-[#0F766E] shrink-0"
                  aria-hidden="true"
                />
                <span>{skill}</span>
              </li>
            ))}
            {(!analysisData?.matchedSkills ||
              analysisData.matchedSkills.length === 0) && (
              <li className="text-xs text-slate-600 font-sans py-2">
                No directly matched skills identified yet.
              </li>
            )}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              className="w-4 h-4 text-rose-700"
              aria-hidden="true"
            />
            <h3 className="text-sm font-heading font-bold text-[#6D1A36]">
              Identified Skill Deficits
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {analysisData?.missingSkills.map((item) => (
              <div key={item.skill} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-heading font-bold text-slate-900 block">
                      {item.skill}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        item.priority === "High"
                          ? "text-rose-800"
                          : item.priority === "Medium"
                          ? "text-amber-800"
                          : "text-[#0F766E]"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddGoalFromSkill(item.skill, item.priority)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-md border border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-[#0D9488] text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                    <span>Add Goal</span>
                  </button>
                </div>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
