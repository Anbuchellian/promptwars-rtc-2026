"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { RoleplayTurn } from "@/lib/types";

interface RoleplayTabProps {
  targetRole: string;
  roleplayData: RoleplayTurn | null;
  roleplayHistory: RoleplayTurn[];
  roleplayInput: string;
  isRoleplayLoading: boolean;
  roleplayError: string | null;
  onRoleplayInputChange: (val: string) => void;
  onContinueRoleplay: (decision?: string) => void;
  onResetRoleplay: () => void;
}

export default function RoleplayTab({
  targetRole,
  roleplayData,
  roleplayHistory,
  roleplayInput,
  isRoleplayLoading,
  roleplayError,
  onRoleplayInputChange,
  onContinueRoleplay,
  onResetRoleplay,
}: RoleplayTabProps) {
  const activeTurn = roleplayData ? Math.min(roleplayData.turnNumber, 3) : 1;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Sparkles
                className="w-4 h-4 text-[#0F766E]"
                aria-hidden="true"
              />
              <span>
                Interactive Roleplay Scenario Engine ({targetRole})
              </span>
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Respond to realistic executive escalations and operational dilemmas
              across a 3-turn simulation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {roleplayData && (
              <div
                role="status"
                aria-live="polite"
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-[#0F766E] tabular-nums"
              >
                Turn {activeTurn}/3 &middot; Competency{" "}
                {roleplayData.competencyScore}%
              </div>
            )}
            <button
              type="button"
              onClick={onResetRoleplay}
              disabled={isRoleplayLoading}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-heading font-bold text-slate-800 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Restart Scenario</span>
            </button>
          </div>
        </div>

        {/* 3-Turn Progress Bar */}
        {roleplayData && (
          <div className="mb-4">
            <div
              role="progressbar"
              aria-valuenow={activeTurn}
              aria-valuemin={1}
              aria-valuemax={3}
              aria-label={`Simulation progress: turn ${activeTurn} of 3`}
              className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
            >
              <div
                className="h-full bg-[#0F766E] transition-all duration-300"
                style={{ width: `${Math.round((activeTurn / 3) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {roleplayError && (
          <div
            role="alert"
            className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle
              className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{roleplayError}</span>
          </div>
        )}

        {/* History of previous turns */}
        {roleplayHistory.length > 0 && (
          <div className="space-y-3 mb-4">
            {roleplayHistory.map((turn, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6D1A36] font-bold">
                  <span>
                    Turn {turn.turnNumber}: {turn.stakeholderName} (
                    {turn.stakeholderRole})
                  </span>
                  <span className="text-[#0F766E] tabular-nums">
                    Score: {turn.competencyScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {turn.dialogue}
                </p>
                {turn.userResponse && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-900">
                    <span className="font-mono text-xs text-slate-600 font-bold block mb-0.5">
                      Your Decision
                    </span>
                    {turn.userResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isRoleplayLoading && !roleplayData && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center py-10 text-[#0F766E] gap-2.5 font-mono text-xs"
          >
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Initializing stakeholder scenario...</span>
          </div>
        )}

        {roleplayData && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#6D1A36]/25 bg-rose-50/30 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D1A36]">
                  <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {roleplayData.stakeholderName} &middot;{" "}
                    {roleplayData.stakeholderRole}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                  Turn {activeTurn} of 3
                </span>
              </div>
              <h3 className="text-sm font-heading font-bold text-slate-900 mb-1.5">
                {roleplayData.scenarioTitle}
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-sans">
                {roleplayData.dialogue}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs font-mono text-slate-700">
                State: {roleplayData.consequenceState}
              </div>
            </div>

            {roleplayData.evaluationFeedback && (
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs text-slate-800">
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#0F766E] text-xs mb-1">
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Agent Audit &amp; Feedback</span>
                </div>
                <p className="leading-relaxed">
                  {roleplayData.evaluationFeedback}
                </p>
              </div>
            )}

            {roleplayData.isComplete ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-teal-300 bg-teal-50/50 p-5 text-center space-y-2"
              >
                <CheckCircle2
                  className="w-8 h-8 text-[#0F766E] mx-auto"
                  aria-hidden="true"
                />
                <h3 className="text-base font-heading font-bold text-slate-900 tabular-nums">
                  Simulation Complete &middot; Final Score:{" "}
                  {roleplayData.competencyScore}%
                </h3>
                <p className="text-xs text-slate-600">
                  Select &ldquo;Restart Scenario&rdquo; above to practice another
                  executive dilemma.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {roleplayData.suggestedResponses &&
                  roleplayData.suggestedResponses.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-heading font-semibold text-slate-700 block">
                        Quick Tactical Decisions (or write your own below):
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {roleplayData.suggestedResponses.map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isRoleplayLoading}
                            onClick={() => onContinueRoleplay(option)}
                            className="text-left min-h-[44px] p-3.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-[#0D9488] text-xs text-slate-900 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (roleplayInput.trim()) onContinueRoleplay();
                  }}
                  className="flex gap-2 pt-2"
                >
                  <label htmlFor="inline-roleplay-input" className="sr-only">
                    Enter your tactical decision
                  </label>
                  <input
                    id="inline-roleplay-input"
                    type="text"
                    maxLength={3000}
                    value={roleplayInput}
                    onChange={(e) => onRoleplayInputChange(e.target.value)}
                    disabled={isRoleplayLoading}
                    placeholder="Type your operational protocol or executive response..."
                    className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-xs text-slate-900 outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isRoleplayLoading || !roleplayInput.trim()}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-40 text-white text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Submit</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
