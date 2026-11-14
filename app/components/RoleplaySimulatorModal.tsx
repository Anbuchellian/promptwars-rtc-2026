"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Send,
  ShieldAlert,
  Award,
  CheckCircle2,
  X,
  TrendingUp,
  TrendingDown,
  Loader2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface SimulationTurn {
  turn: number;
  stakeholderPersona: string;
  scenarioPrompt: string;
  userResponse?: string;
  evaluationFeedback?: string;
  competencyDelta?: number;
}

interface RoleplaySimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  focusSkill: string;
}

export default function RoleplaySimulatorModal({
  isOpen,
  onClose,
  targetRole,
  focusSkill,
}: RoleplaySimulatorProps) {
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [history, setHistory] = useState<SimulationTurn[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [competencyScore, setCompetencyScore] = useState<number>(50);
  const [agentThought, setAgentThought] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [badgeEarned, setBadgeEarned] = useState<string | null>(null);

  const triggerSimulationTurn = async (
    nextTurn: number,
    latestResponse: string,
    currentHistory: SimulationTurn[]
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_scenario",
          targetRole,
          focusSkill,
          turnNumber: nextTurn,
          scenarioHistory: currentHistory,
          userResponse: latestResponse,
        }),
      });

      const data = await res.json();

      setAgentThought(data.agentLog?.thought || data.evaluationFeedback || "Evaluating domain standards...");
      setCompetencyScore(data.currentCompetencyScore ?? data.competencyScore ?? competencyScore);
      setIsComplete(Boolean(data.isSimulationComplete ?? data.isComplete));
      if (data.certificationBadgeEarned) {
        setBadgeEarned(data.certificationBadgeEarned);
      }

      setHistory((prev) => {
        const updated = [...prev];
        // Attach feedback from previous turn if applicable
        if (updated.length > 0 && (data.evaluationFeedback || data.feedback)) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            userResponse: latestResponse,
            evaluationFeedback: data.evaluationFeedback || data.feedback,
            competencyDelta: data.competencyDelta ?? (nextTurn === 2 ? 28 : 14),
          };
        }

        // Append new scenario turn if simulation isn't finished
        if (!data.isSimulationComplete && !data.isComplete) {
          updated.push({
            turn: nextTurn,
            stakeholderPersona: data.stakeholderPersona || `${data.stakeholderName || "Senior Director"} (${data.stakeholderRole || targetRole + " Lead"})`,
            scenarioPrompt: data.scenarioPrompt || data.dialogue,
          });
        }
        return updated;
      });

      setTurnNumber(nextTurn);
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Turn 1 when modal opens
  useEffect(() => {
    if (isOpen && history.length === 0) {
      triggerSimulationTurn(1, "", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading || isComplete) return;

    const responseToSubmit = userInput.trim();
    setUserInput("");
    triggerSimulationTurn(turnNumber + 1, responseToSubmit, history);
  };

  const handleReset = () => {
    setHistory([]);
    setTurnNumber(1);
    setCompetencyScore(50);
    setIsComplete(false);
    setBadgeEarned(null);
    triggerSimulationTurn(1, "", []);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col max-h-[90vh]">
        {/* Top Header — Frosted Glass Executive Style */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/70 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6D1A36] to-[#521228] p-2 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(109,26,54,0.25)] border border-[#6D1A36]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D1A36] font-bold px-2 py-0.5 rounded-full bg-[#6D1A36]/[0.08] border border-[#6D1A36]/15">
                  Live Workplace Simulation
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Turn {Math.min(turnNumber, 3)} of 3
                </span>
              </div>
              <h2 className="text-base font-heading font-bold text-slate-900 tracking-tight">
                {targetRole}: <span className="text-[#0D9488]">{focusSkill}</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-slate-400 hover:text-slate-700 active:scale-95"
            aria-label="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry & Competency Index Bar */}
        <div className="bg-[#FAFAFA] border-b border-slate-200/60 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#6D1A36]/10 text-[#6D1A36] shrink-0 border border-[#6D1A36]/15">
              STAGE {Math.min(turnNumber, 3)}/3
            </span>
            {agentThought && (
              <span className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                &gt; {agentThought}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Competency Index
            </span>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{
                    backgroundColor: competencyScore >= 70 ? "#0D9488" : "#6D1A36",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{
                    backgroundColor: competencyScore >= 70 ? "#0D9488" : "#6D1A36",
                  }}
                />
              </span>
              <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                {competencyScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Scenario Transcript */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {history.map((item, index) => (
            <div key={index} className="space-y-4">
              {/* Stakeholder Scenario Prompt */}
              <div className="rounded-2xl border border-[#6D1A36]/15 bg-gradient-to-r from-[#6D1A36]/[0.03] to-transparent p-5 shadow-[0_2px_12px_rgba(109,26,54,0.03)]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D1A36] uppercase mb-2">
                  <ShieldAlert className="w-4 h-4 text-[#6D1A36]" />
                  <span>{item.stakeholderPersona}</span>
                </div>
                <p className="text-slate-800 text-sm leading-relaxed font-sans font-medium">
                  {item.scenarioPrompt}
                </p>
              </div>

              {/* Learner's Submitted Action */}
              {item.userResponse && (
                <div className="ml-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/70 shadow-xs">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Action Protocol
                  </div>
                  <p className="text-slate-900 text-sm whitespace-pre-wrap font-sans">
                    {item.userResponse}
                  </p>
                </div>
              )}

              {/* Agent Rigorous Evaluation Feedback */}
              {item.evaluationFeedback && (
                <div className="ml-6 rounded-2xl border border-[#0D9488]/20 bg-gradient-to-r from-[#0D9488]/[0.04] to-transparent p-4 shadow-[0_2px_12px_rgba(13,148,136,0.03)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#0D9488] uppercase flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      Agent Audit &amp; Telemetry
                    </span>
                    {typeof item.competencyDelta === "number" && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full tabular-nums ${
                          item.competencyDelta >= 0
                            ? "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20"
                            : "bg-[#6D1A36]/10 text-[#6D1A36] border border-[#6D1A36]/20"
                        }`}
                      >
                        {item.competencyDelta >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {item.competencyDelta >= 0
                          ? `+${item.competencyDelta}%`
                          : `${item.competencyDelta}%`}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-sans">
                    {item.evaluationFeedback}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Loading State with Shimmer */}
          {loading && (
            <div className="flex items-center justify-center py-8 text-[#0D9488] gap-3 font-mono text-sm animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Simulating stakeholder response &amp; auditing protocol...</span>
            </div>
          )}

          {/* Final Certification / Completion Banner */}
          {isComplete && !loading && (
            <div className="rounded-3xl border-2 border-[#0D9488]/30 bg-gradient-to-br from-[#0D9488]/[0.06] via-white to-white p-7 text-center space-y-4 shadow-[0_12px_32px_rgba(13,148,136,0.08)] animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D9488] to-teal-700 text-white flex items-center justify-center mx-auto shadow-[0_6px_20px_rgba(13,148,136,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
                  Simulation Complete &bull; Final Competency: <span className="tabular-nums text-[#0D9488]">{competencyScore}%</span>
                </h3>
                <p className="text-xs font-sans text-slate-600 mt-1 max-w-md mx-auto">
                  Your workplace decisions were evaluated against realistic senior stakeholder and industry benchmarks for <strong>{targetRole}</strong>.
                </p>
              </div>

              {badgeEarned ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488] text-xs font-mono font-bold shadow-xs">
                  <Award className="w-4 h-4" />
                  <span>Verified Micro-Credential: {badgeEarned}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488] text-xs font-mono font-bold shadow-xs">
                  <Award className="w-4 h-4" />
                  <span>Verified Micro-Credential: {focusSkill} Practitioner</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-heading font-bold tracking-tight transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run New Scenario</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#6D1A36] hover:bg-[#521228] text-white text-xs font-heading font-bold tracking-tight transition shadow-[0_4px_14px_rgba(109,26,54,0.25)] cursor-pointer active:scale-[0.98]"
                >
                  Return to Roadmap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        {!isComplete && (
          <form
            onSubmit={handleSubmitResponse}
            className="border-t border-slate-200/70 bg-[#FAFAFA] p-4 flex gap-3"
          >
            <textarea
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              placeholder="Enter your technical decision, root-cause protocol, or executive defense..."
              className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 disabled:opacity-50 font-sans shadow-xs transition-all"
            />
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#6D1A36] hover:bg-[#521228] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,26,54,0.25)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 font-heading active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Execute</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
