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
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-4">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Interactive Roleplay Scenario Engine ({targetRole})
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Respond to realistic executive escalations and operational dilemmas
              across a 3-turn simulation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {roleplayData && (
              <span
                role="status"
                aria-live="polite"
                className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900"
              >
                Competency: {roleplayData.competencyScore}%
              </span>
            )}
            <button
              type="button"
              onClick={onResetRoleplay}
              disabled={isRoleplayLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-heading font-bold text-slate-800 transition cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Restart Scenario</span>
            </button>
          </div>
        </div>

        {roleplayError && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2"
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
                className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#6D1A36] font-bold">
                  <span>
                    Turn {turn.turnNumber}: {turn.stakeholderName} (
                    {turn.stakeholderRole})
                  </span>
                  <span className="text-teal-800">
                    Score: {turn.competencyScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {turn.dialogue}
                </p>
                {turn.userResponse && (
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs text-slate-900">
                    <span className="font-mono text-[10px] uppercase text-slate-600 font-bold block mb-0.5">
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
            className="flex items-center justify-center py-10 text-teal-800 gap-2.5 font-mono text-xs"
          >
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Initializing stakeholder scenario...</span>
          </div>
        )}

        {roleplayData && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#6D1A36]/20 bg-gradient-to-r from-[#6D1A36]/[0.04] to-transparent p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D1A36] uppercase">
                  <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {roleplayData.stakeholderName} &bull;{" "}
                    {roleplayData.stakeholderRole}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200 text-slate-700">
                  Turn {Math.min(roleplayData.turnNumber, 3)} of 3
                </span>
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900 mb-1.5">
                {roleplayData.scenarioTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {roleplayData.dialogue}
              </p>
              <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex items-center justify-between text-[11px] font-mono text-slate-700">
                <span>State: {roleplayData.consequenceState}</span>
              </div>
            </div>

            {roleplayData.evaluationFeedback && (
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-mono font-bold text-teal-900 uppercase text-[11px] mb-1">
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
                className="rounded-2xl border-2 border-teal-500/30 bg-teal-50/40 p-5 text-center space-y-2"
              >
                <CheckCircle2
                  className="w-8 h-8 text-teal-700 mx-auto"
                  aria-hidden="true"
                />
                <h4 className="text-base font-heading font-bold text-slate-900">
                  Simulation Complete &bull; Final Score:{" "}
                  {roleplayData.competencyScore}%
                </h4>
                <p className="text-xs text-slate-600">
                  Click &ldquo;Restart Scenario&rdquo; above to practice another
                  executive dilemma.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {roleplayData.suggestedResponses &&
                  roleplayData.suggestedResponses.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-600 block">
                        Quick Tactical Decisions (or write your own below):
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {roleplayData.suggestedResponses.map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isRoleplayLoading}
                            onClick={() => onContinueRoleplay(option)}
                            className="text-left p-3 rounded-xl bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-400 text-xs text-slate-800 transition cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
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
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-xs text-slate-800 outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isRoleplayLoading || !roleplayInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-40 text-white text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
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
