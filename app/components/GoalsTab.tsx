"use client";

import React, { useMemo, useState } from "react";
import { Plus, RotateCcw, Search, Sparkles, Target, X } from "lucide-react";
import type { CareerGoal, MissingSkill } from "@/lib/types";

interface GoalsTabProps {
  targetRole: string;
  goals: CareerGoal[];
  missingSkills: MissingSkill[];
  onAddGoal: (goal: {
    title: string;
    type: "short" | "long";
    deadline: string;
    area: string;
  }) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

type StatusFilter = "all" | "active" | "completed";
type HorizonFilter = "all" | "short" | "long";

export default function GoalsTab({
  targetRole,
  goals,
  missingSkills,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}: GoalsTabProps) {
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalType, setNewGoalType] = useState<"short" | "long">("short");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalArea, setNewGoalArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [horizonFilter, setHorizonFilter] = useState<HorizonFilter>("all");

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const completionPct =
    goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const filteredGoals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return goals.filter((g) => {
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.area.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !g.completed) ||
        (statusFilter === "completed" && g.completed);
      const matchesHorizon =
        horizonFilter === "all" || g.type === horizonFilter;
      return matchesQuery && matchesStatus && matchesHorizon;
    });
  }, [goals, searchQuery, statusFilter, horizonFilter]);

  const hasActiveFilter =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    horizonFilter !== "all";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    onAddGoal({
      title: newGoalTitle.trim(),
      type: newGoalType,
      deadline: newGoalDeadline,
      area:
        newGoalArea.trim() ||
        missingSkills[0]?.skill ||
        "General Competency",
    });
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setNewGoalArea("");
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
              <span>Personal Career Goals &amp; Improvement Milestones</span>
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Empower your transition to{" "}
              <strong className="text-slate-900">{targetRole}</strong> with
              time-bound milestones and actionable skill sprints.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
            <span className="text-[#0F766E] font-bold bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
              {completedGoalsCount} / {goals.length} Completed
            </span>
            <span className="text-slate-700 font-medium">
              {goals.filter((g) => g.type === "short").length} Short-Term
            </span>
            <span className="text-slate-700 font-medium">
              {goals.filter((g) => g.type === "long").length} Long-Term
            </span>
          </div>
        </div>

        {goals.length > 0 && (
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between text-xs font-mono text-slate-600">
              <span>Milestone Completion Track</span>
              <span className="font-bold text-[#0F766E] tabular-nums">
                {completionPct}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={completionPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Personal career milestones completion"
              className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
            >
              <div
                className="h-full bg-[#0F766E] transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-goal-title"
              className="text-xs font-mono font-bold text-[#6D1A36]"
            >
              + DEFINE NEW CAREER MILESTONE
            </label>
            <span className="text-xs font-sans text-slate-600">
              Synced locally in browser storage
            </span>
          </div>

          <input
            id="new-goal-title"
            type="text"
            maxLength={200}
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder={`e.g. Master core domain verification or ship capstone deliverable for ${targetRole}...`}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none text-xs font-sans placeholder:text-slate-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div>
              <label
                htmlFor="new-goal-type"
                className="text-xs font-medium text-slate-700 block mb-1"
              >
                Horizon Type
              </label>
              <select
                id="new-goal-type"
                value={newGoalType}
                onChange={(e) =>
                  setNewGoalType(e.target.value as "short" | "long")
                }
                className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0D9488] font-sans cursor-pointer"
              >
                <option value="short">Short-term Sprint (1-4 wks)</option>
                <option value="long">Long-term Goal (1-6 mos)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new-goal-deadline"
                className="text-xs font-medium text-slate-700 block mb-1"
              >
                Target Deadline
              </label>
              <input
                id="new-goal-deadline"
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0D9488] font-sans cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="new-goal-area"
                className="text-xs font-medium text-slate-700 block mb-1"
              >
                Competency Domain / Tag
              </label>
              <input
                id="new-goal-area"
                type="text"
                maxLength={100}
                value={newGoalArea}
                onChange={(e) => setNewGoalArea(e.target.value)}
                placeholder="e.g. System Design"
                className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0D9488] font-sans placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!newGoalTitle.trim()}
                className="w-full min-h-[40px] py-2 px-3 bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-40 text-white rounded-lg text-xs font-heading font-bold tracking-tight transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Milestone</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {missingSkills.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Sparkles
                className="w-4 h-4 text-[#0F766E]"
                aria-hidden="true"
              />
              <span>
                One-Click Goal Suggestions from Skill Auditor (Agent 1)
              </span>
            </h3>
            <span className="text-xs font-sans text-slate-600">
              Select a skill to generate a targeted milestone
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.slice(0, 5).map((ms) => (
              <button
                key={ms.skill}
                type="button"
                onClick={() =>
                  onAddGoal({
                    title: `Master & verify ${ms.skill} through capstone exercises`,
                    type: ms.priority === "High" ? "short" : "long",
                    deadline: "",
                    area: ms.skill,
                  })
                }
                className={`min-h-[40px] text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-sans flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  ms.priority === "High"
                    ? "border-rose-200 bg-rose-50/60 text-rose-950 hover:border-rose-400 hover:bg-rose-100"
                    : "border-slate-200 bg-slate-50 text-slate-800 hover:border-[#0D9488] hover:bg-teal-50"
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                <span className="font-semibold">{ms.skill}</span>
                <span className="text-xs font-mono text-slate-600">
                  &middot; {ms.priority}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar for Goals */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate-500 absolute left-3 top-3"
              aria-hidden="true"
            />
            <label htmlFor="goals-search-input" className="sr-only">
              Search milestones by title or domain
            </label>
            <input
              id="goals-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milestones or competency domains..."
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-xs text-slate-900 placeholder:text-slate-500 outline-none font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Filter goals by status"
              className="flex items-center gap-1"
            >
              {(["all", "active", "completed"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    statusFilter === status
                      ? "bg-[#0F766E] border-[#0F766E] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div
              role="group"
              aria-label="Filter goals by horizon"
              className="flex items-center gap-1"
            >
              {(
                [
                  { id: "all", label: "All Horizons" },
                  { id: "short", label: "Short-Term" },
                  { id: "long", label: "Long-Term" },
                ] as const
              ).map((horizon) => (
                <button
                  key={horizon.id}
                  type="button"
                  aria-pressed={horizonFilter === horizon.id}
                  onClick={() => setHorizonFilter(horizon.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    horizonFilter === horizon.id
                      ? "bg-[#6D1A36] border-[#6D1A36] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {horizon.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
            <Target
              className="w-8 h-8 text-slate-400 mx-auto mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-heading font-bold text-slate-800">
              No career milestones recorded yet.
            </p>
            <p className="text-xs text-slate-600 font-sans mt-1">
              Add a custom milestone above or tap one of the suggested skills
              from Skill Auditor Agent.
            </p>
          </div>
        )}

        {goals.length > 0 && filteredGoals.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm font-heading font-bold text-slate-800">
              No milestones match your search or filters.
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setHorizonFilter("all");
                }}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        )}

        {(["short", "long"] as const).map((type) => {
          const typeGoals = filteredGoals.filter((g) => g.type === type);
          if (typeGoals.length === 0) return null;

          return (
            <section
              key={type}
              aria-label={
                type === "short"
                  ? "Short-Term Sprints"
                  : "Long-Term Career Objectives"
              }
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
                  {type === "short"
                    ? "Short-Term Sprints (1-4 Weeks)"
                    : "Long-Term Career Objectives (1-6 Months)"}
                </h3>
                <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                  {typeGoals.filter((g) => g.completed).length} /{" "}
                  {typeGoals.length} Done
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {typeGoals.map((goal) => {
                  const checkboxId = `goal-checkbox-${goal.id}`;
                  return (
                    <div
                      key={goal.id}
                      className="py-3 first:pt-1 last:pb-1 flex items-start gap-3"
                    >
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => onToggleGoal(goal.id)}
                        className="mt-1 w-4 h-4 rounded text-[#0F766E] bg-white border-slate-300 cursor-pointer accent-[#0F766E] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <label
                            htmlFor={checkboxId}
                            className={`text-xs sm:text-sm font-heading font-bold tracking-tight cursor-pointer ${
                              goal.completed
                                ? "line-through text-slate-500"
                                : "text-slate-900"
                            }`}
                          >
                            {goal.title}
                          </label>
                          {goal.completed && (
                            <span className="text-xs font-mono text-[#0F766E] font-bold">
                              Achieved
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-slate-600">
                          {goal.area && (
                            <span className="font-semibold text-[#0F766E]">
                              {goal.area}
                            </span>
                          )}
                          {goal.deadline && (
                            <span className="font-mono text-slate-700 tabular-nums">
                              &middot; Due{" "}
                              {new Date(goal.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                          <span className="text-slate-500 tabular-nums">
                            &middot; Added{" "}
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        aria-label={`Delete milestone: ${goal.title}`}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
