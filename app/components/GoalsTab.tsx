"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Target, X } from "lucide-react";
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

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const completionPct =
    goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    onAddGoal({
      title: newGoalTitle.trim(),
      type: newGoalType,
      deadline: newGoalDeadline,
      area: newGoalArea.trim() || missingSkills[0]?.skill || "General Competency",
    });
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setNewGoalArea("");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Personal Career Goals &amp; Improvement Milestones
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Empower your transition to <strong>{targetRole}</strong> with
              time-bound milestones and actionable skill sprints
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-teal-900 font-bold bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
              {completedGoalsCount} / {goals.length} Completed
            </span>
            <span className="text-slate-600 font-medium">
              {goals.filter((g) => g.type === "short").length} Short-Term
            </span>
            <span className="text-slate-600 font-medium">
              {goals.filter((g) => g.type === "long").length} Long-Term
            </span>
          </div>
        </div>

        {goals.length > 0 && (
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Milestone Completion Track</span>
              <span className="font-bold text-teal-800">{completionPct}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={completionPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Personal career milestones completion"
              className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200"
            >
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="new-goal-title"
              className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36]"
            >
              + DEFINE NEW CAREER MILESTONE
            </label>
            <span className="text-[10px] font-sans text-slate-600">
              Auto-synced with browser storage
            </span>
          </div>

          <input
            id="new-goal-title"
            type="text"
            maxLength={200}
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder={`e.g. Master HPLC column calibration or complete 3-statement model for ${targetRole}...`}
            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs font-sans placeholder:text-slate-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div>
              <label
                htmlFor="new-goal-type"
                className="text-[10px] font-mono text-slate-600 uppercase block mb-1"
              >
                Horizon Type
              </label>
              <select
                id="new-goal-type"
                value={newGoalType}
                onChange={(e) =>
                  setNewGoalType(e.target.value as "short" | "long")
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-800 outline-none focus:border-teal-600 font-sans cursor-pointer"
              >
                <option value="short">Short-term Sprint (1-4 wks)</option>
                <option value="long">Long-term Goal (1-6 mos)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new-goal-deadline"
                className="text-[10px] font-mono text-slate-600 uppercase block mb-1"
              >
                Target Deadline
              </label>
              <input
                id="new-goal-deadline"
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-800 outline-none focus:border-teal-600 font-sans cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="new-goal-area"
                className="text-[10px] font-mono text-slate-600 uppercase block mb-1"
              >
                Competency Domain / Tag
              </label>
              <input
                id="new-goal-area"
                type="text"
                maxLength={100}
                value={newGoalArea}
                onChange={(e) => setNewGoalArea(e.target.value)}
                placeholder="e.g. Practical Lab, System Design"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-800 outline-none focus:border-teal-600 font-sans placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!newGoalTitle.trim()}
                className="w-full py-2 px-3 bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-40 text-white rounded-lg text-xs font-heading font-bold tracking-tight transition cursor-pointer shadow-sm shadow-[#6D1A36]/20 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Milestone</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {missingSkills.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              One-Click Goal Suggestions from Skill Auditor (Agent 1)
            </h4>
            <span className="text-[10px] font-mono text-slate-600">
              Tap to auto-generate targeted milestone
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
                className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-sans flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  ms.priority === "High"
                    ? "border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-400 hover:bg-rose-100"
                    : "border-stone-200 bg-stone-50 text-slate-800 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                <Plus className="w-3 h-3 text-teal-700" aria-hidden="true" />
                <span>{ms.skill}</span>
                <span className="text-[9px] font-mono uppercase px-1 py-0.5 rounded bg-white border border-stone-200 font-bold">
                  {ms.priority}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.length === 0 && (
          <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center">
            <Target
              className="w-8 h-8 text-stone-400 mx-auto mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-heading font-bold text-slate-700">
              No career milestones recorded yet.
            </p>
            <p className="text-xs text-slate-600 font-sans mt-1">
              Add a custom milestone above or tap one of the suggested skills
              from Agent 1!
            </p>
          </div>
        )}

        {(["short", "long"] as const).map((type) => {
          const typeGoals = goals.filter((g) => g.type === type);
          if (typeGoals.length === 0) return null;

          return (
            <section
              key={type}
              aria-label={
                type === "short"
                  ? "Short-Term Sprints"
                  : "Long-Term Career Objectives"
              }
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                  {type === "short"
                    ? "Short-Term Sprints (1-4 Weeks)"
                    : "Long-Term Career Objectives (1-6 Months)"}
                </h4>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {typeGoals.filter((g) => g.completed).length} /{" "}
                  {typeGoals.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {typeGoals.map((goal) => {
                  const checkboxId = `goal-checkbox-${goal.id}`;
                  return (
                    <div
                      key={goal.id}
                      className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        goal.completed
                          ? "bg-stone-50 border-teal-300 opacity-85"
                          : "bg-white border-stone-200 hover:border-teal-400 shadow-2xs"
                      }`}
                    >
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => onToggleGoal(goal.id)}
                        className="mt-1 w-4 h-4 rounded text-teal-600 bg-white border-stone-300 cursor-pointer accent-teal-600 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <label
                            htmlFor={checkboxId}
                            className={`text-xs font-heading font-bold tracking-tight cursor-pointer ${
                              goal.completed
                                ? "line-through text-slate-500"
                                : "text-slate-900"
                            }`}
                          >
                            {goal.title}
                          </label>
                          {goal.completed && (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200 font-bold">
                              ACHIEVED
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-slate-600">
                          {goal.area && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-900 border border-teal-200 font-bold">
                              {goal.area}
                            </span>
                          )}
                          {goal.deadline && (
                            <span className="text-slate-700 font-mono text-[10px]">
                              Deadline:{" "}
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
                          <span className="text-[10px] text-slate-500">
                            Created:{" "}
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        aria-label={`Delete milestone: ${goal.title}`}
                        className="text-slate-500 hover:text-rose-700 transition p-1 cursor-pointer shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
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
