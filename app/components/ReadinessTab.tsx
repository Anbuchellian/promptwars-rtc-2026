"use client";

import React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { AnalysisData, DomainComparison } from "@/lib/types";

interface ReadinessTabProps {
  name: string;
  targetRole: string;
  analysisData: AnalysisData | null;
  domainComparisonList: DomainComparison[];
}

export default function ReadinessTab({
  name,
  targetRole,
  analysisData,
  domainComparisonList,
}: ReadinessTabProps) {
  const readinessScore = analysisData?.readinessScore ?? 45;

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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Readiness Score Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-800">
              AUDIT SYNTHESIS &bull; AGENT 1 EVALUATOR
            </span>
          </div>
          <h2 className="text-xl font-heading font-bold tracking-tight text-[#6D1A36]">
            {name}&apos;s Job Readiness for {targetRole}
          </h2>
          <p className="text-xs font-sans text-slate-600 mt-1 max-w-xl leading-relaxed">
            Evaluated against contemporary academic and industry competencies for{" "}
            <strong>{targetRole}</strong> across professional requirements and
            applied standards.
          </p>

          <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-700">
            <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-1">
              Strategic Mentor Advice (Agent 4):
            </span>
            <p className="text-slate-700 italic font-sans leading-relaxed">
              &ldquo;
              {analysisData?.mentorAdvice || "Analyzing profile trajectory..."}
              &rdquo;
            </p>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="flex flex-col items-center justify-center p-5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl shadow-inner min-w-[160px]">
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
                className="text-stone-200"
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
                className="text-teal-600 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-black tracking-tight text-[#6D1A36]">
                {readinessScore}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                READINESS
              </span>
            </div>
          </div>
          <span className="mt-2 text-[10px] font-mono uppercase tracking-wider font-bold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {readinessScore > 70
              ? "ADVANCED READY"
              : readinessScore > 40
              ? "MID-STAGE"
              : "FOUNDATION"}
          </span>
        </div>
      </div>

      {/* 5-Axis Pentagon Radar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Competency Attribute Radar &bull; 5 Core Dimensions
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Multi-axis attribute evaluation for <strong>{targetRole}</strong>{" "}
              with empirical benchmark thresholds
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2 rounded bg-gradient-to-r from-teal-500 to-cyan-500"
              />
              <span className="text-slate-700 font-bold text-[10px]">
                Candidate Profile
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2 rounded bg-rose-100 border border-[#6D1A36]"
              />
              <span className="text-slate-600 font-bold text-[10px]">
                Benchmark Target
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 pt-2">
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-labelledby="radar-svg-title radar-svg-desc"
              className="w-full h-full overflow-visible drop-shadow-sm select-none"
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
                  <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.25" />
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
                  stroke="#E2E8F0"
                  strokeWidth={li === 4 ? "1.8" : "1"}
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
                    fontSize="8"
                    fill="#64748B"
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
                stroke="#0D9488"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              {candidateVertices.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#0D9488"
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
                      fontSize="9.5"
                      fontWeight="700"
                      fill="#1E293B"
                      fontFamily="system-ui, sans-serif"
                    >
                      {v.label}
                    </text>
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 11}
                      textAnchor={anchor}
                      fontSize="9"
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

          <div className="w-full lg:w-72 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block">
              5-AXIS ATTRIBUTE BREAKDOWN
            </span>
            {radarValues.map((item, idx) => {
              const gap = item.target - item.current;
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-heading font-bold text-slate-800 block text-[11px] leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-600 font-sans block truncate">
                      {item.sub}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="font-bold text-teal-800">
                      {item.current}%
                    </span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-700">{item.target}%</span>
                    <span
                      className={`block text-[9px] font-bold ${
                        gap <= 0 ? "text-teal-800" : "text-rose-800"
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

      {/* Visual Skill Gap Comparison Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <TrendingUp
                className="w-4 h-4 text-teal-700"
                aria-hidden="true"
              />
              Domain Skill Gap &amp; Benchmark Analysis ({targetRole})
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Empirical evaluation of Candidate Competencies vs. Industry Target
              Requirements
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2 rounded bg-gradient-to-r from-teal-500 to-cyan-500"
              />
              <span className="text-slate-700 font-bold text-[10px]">
                Candidate Mastery
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-3 h-2 rounded bg-stone-300 border border-[#6D1A36]/60"
              />
              <span className="text-slate-600 font-bold text-[10px]">
                Target Req
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {domainComparisonList.map((item) => {
            const diff = item.requiredScore - item.currentScore;

            return (
              <div
                key={item.domain}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-teal-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold tracking-tight text-slate-900">
                      {item.domain}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        item.gapStatus === "Strong Match"
                          ? "bg-teal-50 text-teal-900 border border-teal-200"
                          : item.gapStatus === "Moderate Gap"
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "bg-rose-50 text-rose-900 border border-rose-200"
                      }`}
                    >
                      {item.gapStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono font-bold">
                    <span className="text-teal-800">
                      Current: {item.currentScore}%
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="text-[#6D1A36]">
                      Req: {item.requiredScore}%
                    </span>
                    <span
                      className={`text-[11px] ${
                        diff <= 0 ? "text-teal-800" : "text-rose-800"
                      }`}
                    >
                      {diff <= 0 ? `+${Math.abs(diff)}% Met` : `-${diff}% Gap`}
                    </span>
                  </div>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={item.currentScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.domain}: current ${item.currentScore}%, target ${item.requiredScore}%`}
                  className="relative w-full h-3.5 bg-stone-200 rounded-full overflow-hidden border border-stone-200"
                >
                  <div
                    className="absolute top-0 bottom-0 bg-stone-300 border-r-2 border-[#6D1A36]"
                    style={{ width: `${item.requiredScore}%` }}
                    title={`Target Requirement: ${item.requiredScore}%`}
                  />
                  <div
                    className={`h-full transition-all duration-700 rounded-full relative z-10 ${
                      item.gapStatus === "Strong Match"
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                        : item.gapStatus === "Moderate Gap"
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                        : "bg-gradient-to-r from-rose-500 to-amber-500"
                    }`}
                    style={{ width: `${item.currentScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-sans text-slate-600 mt-1.5">
                  <span>
                    Key Focus:{" "}
                    <strong className="text-slate-800 font-semibold">
                      {item.keyMissing}
                    </strong>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    SCALE: 0 &rarr; 100%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched vs Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle
              className="w-4 h-4 text-teal-700"
              aria-hidden="true"
            />
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
              Validated Strengths &amp; Matched Skills
            </h3>
          </div>
          <p className="text-xs font-sans text-slate-600 mb-3">
            Skills verified from your profile that directly transfer to{" "}
            {targetRole}:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysisData?.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-mono font-semibold shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                {skill}
              </span>
            ))}
            {(!analysisData?.matchedSkills ||
              analysisData.matchedSkills.length === 0) && (
              <span className="text-xs text-slate-600 font-sans">
                No directly matched skills identified yet.
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              className="w-4 h-4 text-rose-700"
              aria-hidden="true"
            />
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
              Identified Skill Deficits &amp; Priorities
            </h3>
          </div>
          <div className="space-y-2.5">
            {analysisData?.missingSkills.map((item) => (
              <div
                key={item.skill}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-heading font-bold tracking-tight text-slate-900">
                    {item.skill}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.priority === "High"
                        ? "bg-rose-50 text-rose-900 border border-rose-200"
                        : item.priority === "Medium"
                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                        : "bg-teal-50 text-teal-900 border border-teal-200"
                    }`}
                  >
                    {item.priority} PRIORITY
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-600 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
