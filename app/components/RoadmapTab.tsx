"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import type { AnalysisData, Resource } from "@/lib/types";

interface RoadmapTabProps {
  targetRole: string;
  analysisData: AnalysisData | null;
  completedItems: Record<string, boolean>;
  progressPercent: number;
  onToggleItemCompletion: (key: string) => void;
  onLaunchSimulator: (focusSkill: string) => void;
}

type ResourceFilter = "All" | Resource["type"];

const RESOURCE_FILTERS: ResourceFilter[] = [
  "All",
  "Course",
  "Tutorial",
  "Hands-on Project",
];

export default function RoadmapTab({
  targetRole,
  analysisData,
  completedItems,
  progressPercent,
  onToggleItemCompletion,
  onLaunchSimulator,
}: RoadmapTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceFilter>("All");

  const filteredPhases = useMemo(() => {
    const phases = analysisData?.roadmap ?? [];
    const q = searchQuery.trim().toLowerCase();

    return phases
      .map((phase, originalIndex) => {
        const phaseMatches =
          !q ||
          phase.phase.toLowerCase().includes(q) ||
          phase.focusSkill.toLowerCase().includes(q);

        const matchingResources = phase.resources
          .map((res, rIdx) => ({ res, rIdx }))
          .filter(({ res }) => {
            const matchesType =
              typeFilter === "All" || res.type === typeFilter;
            const matchesQuery =
              phaseMatches ||
              res.title.toLowerCase().includes(q) ||
              res.description.toLowerCase().includes(q);
            return matchesType && matchesQuery;
          });

        return {
          phase,
          originalIndex,
          matchingResources,
        };
      })
      .filter((entry) => entry.matchingResources.length > 0);
  }, [analysisData?.roadmap, searchQuery, typeFilter]);

  const hasActiveFilter =
    searchQuery.trim().length > 0 || typeFilter !== "All";

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
              <span>Personalized Phased Learning Roadmap ({targetRole})</span>
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Architected by Curriculum Architect Agent &middot; Check off
              completed modules to synchronize readiness progress.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-sans text-slate-600 font-medium block">
              Overall Completion
            </span>
            <div className="text-lg font-mono font-bold text-[#0F766E] tabular-nums">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-500 absolute left-3 top-3"
              aria-hidden="true"
            />
            <label htmlFor="roadmap-search-input" className="sr-only">
              Search roadmap modules and focus skills
            </label>
            <input
              id="roadmap-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, skills, or deliverables..."
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-xs text-slate-900 placeholder:text-slate-500 outline-none font-sans"
            />
          </div>

          <div
            role="group"
            aria-label="Filter roadmap resources by format"
            className="flex flex-wrap items-center gap-1.5"
          >
            {RESOURCE_FILTERS.map((filter) => {
              const isSelected = typeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setTypeFilter(filter)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isSelected
                      ? "bg-[#0F766E] border-[#0F766E] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredPhases.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm font-heading font-bold text-slate-800">
            No roadmap modules match your current filter.
          </p>
          <p className="text-xs text-slate-600">
            {hasActiveFilter
              ? "Try clearing your search term or selecting All resource types."
              : "Run an audit from the profile sidebar to generate tailored phases."}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("All");
              }}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPhases.map(({ phase, originalIndex, matchingResources }) => {
            const phaseDoneCount = phase.resources.filter((_, rIdx) =>
              Boolean(completedItems[`${phase.phase}_${rIdx}`])
            ).length;

            return (
              <section
                key={phase.phase}
                aria-label={phase.phase}
                className={`rounded-xl border p-5 transition-colors ${
                  phase.isRemedial
                    ? "bg-rose-50/40 border-rose-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 mb-4">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                        phase.isRemedial
                          ? "bg-[#6D1A36] text-white"
                          : "bg-[#0F766E] text-white"
                      }`}
                    >
                      {originalIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-heading font-bold tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
                        <span>{phase.phase}</span>
                        {phase.isRemedial && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-[#6D1A36] border border-rose-200 text-xs font-semibold">
                            <AlertTriangle
                              className="w-3.5 h-3.5 text-[#6D1A36]"
                              aria-hidden="true"
                            />
                            Remedial Intervention
                          </span>
                        )}
                      </h3>
                      <p className="text-xs font-sans text-slate-600 mt-0.5">
                        Focus Skill:{" "}
                        <strong className="text-slate-900 font-semibold">
                          {phase.focusSkill}
                        </strong>{" "}
                        &middot;{" "}
                        <span className="font-mono tabular-nums">
                          {phaseDoneCount}/{phase.resources.length} done
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800">
                    {phase.duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchingResources.map(({ res, rIdx }) => {
                    const itemKey = `${phase.phase}_${rIdx}`;
                    const inputId = `roadmap-item-${originalIndex}-${rIdx}`;
                    const isDone = Boolean(completedItems[itemKey]);

                    return (
                      <label
                        key={res.title}
                        htmlFor={inputId}
                        className={`min-h-[44px] p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 focus-within:ring-2 focus-within:ring-[#0D9488] ${
                          isDone
                            ? "bg-slate-50 border-teal-400"
                            : phase.isRemedial
                            ? "bg-white border-rose-200 hover:border-[#6D1A36]"
                            : "bg-slate-50/60 border-slate-200 hover:border-[#0D9488]"
                        }`}
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={isDone}
                          onChange={() => onToggleItemCompletion(itemKey)}
                          className="mt-1 w-4 h-4 rounded text-[#0F766E] bg-white border-slate-300 cursor-pointer accent-[#0F766E] shrink-0"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-center justify-between gap-2 mb-1">
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
                              className={`text-xs font-mono font-semibold shrink-0 ${
                                res.type === "Hands-on Project"
                                  ? "text-[#0F766E]"
                                  : res.type === "Course"
                                  ? "text-[#6D1A36]"
                                  : "text-slate-700"
                              }`}
                            >
                              {res.type}
                            </span>
                          </span>
                          <span className="block text-xs font-sans text-slate-600 leading-relaxed">
                            {res.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-sans text-slate-600">
                    Test <strong className="text-slate-900">{phase.focusSkill}</strong>{" "}
                    in a live stakeholder workplace dilemma:
                  </span>
                  <button
                    type="button"
                    onClick={() => onLaunchSimulator(phase.focusSkill)}
                    className="inline-flex items-center gap-1.5 min-h-[40px] rounded-lg bg-[#6D1A36] hover:bg-[#521228] px-3.5 py-2 text-xs font-heading font-semibold text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  >
                    <Sparkles
                      className="w-3.5 h-3.5 text-teal-200"
                      aria-hidden="true"
                    />
                    <span>Launch Live Roleplay Simulation</span>
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
