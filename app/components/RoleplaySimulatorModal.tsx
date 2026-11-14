"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  AlertTriangle,
} from "lucide-react";
import type { SupportedLanguage } from "@/lib/types";

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
  preferredLanguage?: SupportedLanguage;
}

export default function RoleplaySimulatorModal({
  isOpen,
  onClose,
  targetRole,
  focusSkill,
  preferredLanguage = "English",
}: RoleplaySimulatorProps) {
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [history, setHistory] = useState<SimulationTurn[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [competencyScore, setCompetencyScore] = useState<number>(50);
  const [agentThought, setAgentThought] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [badgeEarned, setBadgeEarned] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const triggerSimulationTurn = useCallback(
    async (
      nextTurn: number,
      latestResponse: string,
      currentHistory: SimulationTurn[]
    ) => {
      setLoading(true);
      setErrorMsg(null);
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
            preferredLanguage,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Simulation request failed.");
        }

        setAgentThought(
          data.agentLog?.thought ||
            data.evaluationFeedback ||
            "Evaluating domain standards..."
        );
        setCompetencyScore((prev) =>
          typeof data.currentCompetencyScore === "number"
            ? data.currentCompetencyScore
            : typeof data.competencyScore === "number"
            ? data.competencyScore
            : prev
        );
        setIsComplete(Boolean(data.isSimulationComplete ?? data.isComplete));
        if (data.certificationBadgeEarned) {
          setBadgeEarned(data.certificationBadgeEarned);
        }

        setHistory((prev) => {
          const updated = [...prev];
          if (updated.length > 0 && (data.evaluationFeedback || data.feedback)) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              userResponse: latestResponse,
              evaluationFeedback: data.evaluationFeedback || data.feedback,
              competencyDelta: data.competencyDelta ?? (nextTurn === 2 ? 28 : 14),
            };
          }

          if (!data.isSimulationComplete && !data.isComplete) {
            updated.push({
              turn: nextTurn,
              stakeholderPersona:
                data.stakeholderPersona ||
                `${data.stakeholderName || "Senior Director"} (${
                  data.stakeholderRole || `${targetRole} Lead`
                })`,
              scenarioPrompt: data.scenarioPrompt || data.dialogue,
            });
          }
          return updated;
        });

        setTurnNumber(nextTurn);
      } catch (error) {
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Unable to connect to the simulation agent. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [targetRole, focusSkill, preferredLanguage]
  );

  useEffect(() => {
    if (isOpen && history.length === 0) {
      triggerSimulationTurn(1, "", []);
    }
  }, [isOpen, history.length, triggerSimulationTurn]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

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
    setErrorMsg(null);
    triggerSimulationTurn(1, "", []);
  };

  if (!isOpen) return null;

  const stage = Math.min(turnNumber, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="roleplay-modal-title"
        aria-describedby="roleplay-modal-status"
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-xl bg-[#6D1A36] flex items-center justify-center shrink-0"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono font-semibold text-[#6D1A36]">
                Live Workplace Simulation &middot; Turn {stage} of 3
              </p>
              <h2
                id="roleplay-modal-title"
                className="text-base font-heading font-bold text-slate-900 tracking-tight truncate"
              >
                {targetRole}:{" "}
                <span className="text-[#0F766E]">{focusSkill}</span>
              </h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            aria-label="Close Live Workplace Simulation dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Status & Competency Bar */}
        <div
          id="roleplay-modal-status"
          aria-live="polite"
          className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white text-[#6D1A36] shrink-0 border border-slate-200 tabular-nums">
              STAGE {stage}/3
            </span>
            {agentThought && (
              <span className="text-xs text-slate-700 font-mono truncate max-w-xs sm:max-w-md">
                {agentThought}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600 font-mono">
              Competency Index
            </span>
            <span
              className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-md border bg-white tabular-nums ${
                competencyScore >= 70
                  ? "text-[#0F766E] border-teal-200"
                  : "text-[#6D1A36] border-rose-200"
              }`}
            >
              {competencyScore}%
            </span>
          </div>
        </div>

        {/* Scrollable Scenario Transcript */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-rose-300 bg-rose-50 p-4 flex items-start gap-3 text-xs text-rose-900"
            >
              <AlertTriangle
                className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
              </div>
            </div>
          )}

          {history.map((item, index) => (
            <div key={index} className="space-y-3">
              {/* Stakeholder Scenario Prompt */}
              <div className="rounded-xl border border-[#6D1A36]/20 bg-rose-50/30 p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D1A36] mb-2">
                  <ShieldAlert
                    className="w-4 h-4 text-[#6D1A36]"
                    aria-hidden="true"
                  />
                  <span>{item.stakeholderPersona}</span>
                </div>
                <p className="text-slate-900 text-sm leading-relaxed font-sans font-medium">
                  {item.scenarioPrompt}
                </p>
              </div>

              {/* Learner's Submitted Action */}
              {item.userResponse && (
                <div className="ml-4 sm:ml-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div className="text-xs font-mono font-bold text-slate-600 mb-1">
                    Your Action Protocol
                  </div>
                  <p className="text-slate-900 text-sm whitespace-pre-wrap font-sans">
                    {item.userResponse}
                  </p>
                </div>
              )}

              {/* Agent Rigorous Evaluation Feedback */}
              {item.evaluationFeedback && (
                <div className="ml-4 sm:ml-6 rounded-xl border border-teal-200 bg-teal-50/40 p-4">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs font-mono font-bold text-[#0F766E] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Agent Audit &amp; Telemetry</span>
                    </span>
                    {typeof item.competencyDelta === "number" && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-md tabular-nums border ${
                          item.competencyDelta >= 0
                            ? "bg-white text-[#0F766E] border-teal-200"
                            : "bg-white text-[#6D1A36] border-rose-200"
                        }`}
                      >
                        {item.competencyDelta >= 0 ? (
                          <TrendingUp className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <TrendingDown
                            className="w-3 h-3"
                            aria-hidden="true"
                          />
                        )}
                        {item.competencyDelta >= 0
                          ? `+${item.competencyDelta}%`
                          : `${item.competencyDelta}%`}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed font-sans">
                    {item.evaluationFeedback}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center py-8 text-[#0F766E] gap-3 font-mono text-sm"
            >
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>
                Simulating stakeholder response &amp; auditing protocol...
              </span>
            </div>
          )}

          {/* Final Certification / Completion Banner */}
          {isComplete && !loading && (
            <div className="rounded-xl border border-teal-300 bg-teal-50/40 p-6 text-center space-y-4">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-xl bg-[#0F766E] text-white flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 tracking-tight">
                  Simulation Complete &middot; Final Competency:{" "}
                  <span className="tabular-nums text-[#0F766E]">
                    {competencyScore}%
                  </span>
                </h3>
                <p className="text-xs font-sans text-slate-600 mt-1 max-w-md mx-auto">
                  Your workplace decisions were evaluated against realistic
                  senior stakeholder and industry benchmarks for{" "}
                  <strong>{targetRole}</strong>.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-teal-200 text-[#0F766E] text-xs font-mono font-bold">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>
                  Verified Micro-Credential:{" "}
                  {badgeEarned || `${focusSkill} Practitioner`}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-heading font-bold transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Run New Scenario</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[40px] px-5 py-2 rounded-lg bg-[#6D1A36] hover:bg-[#521228] text-white text-xs font-heading font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
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
            className="border-t border-slate-200 bg-slate-50 p-4 flex gap-3"
          >
            <label htmlFor="modal-roleplay-response" className="sr-only">
              Enter your technical decision, root-cause protocol, or executive
              defense
            </label>
            <textarea
              id="modal-roleplay-response"
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              maxLength={3000}
              placeholder="Enter your technical decision, root-cause protocol, or executive defense..."
              className="flex-1 resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 disabled:opacity-50 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6D1A36] hover:bg-[#521228] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 font-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Execute</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
