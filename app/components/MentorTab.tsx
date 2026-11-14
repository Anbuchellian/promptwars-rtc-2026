"use client";

import React from "react";
import {
  AlertTriangle,
  Bot,
  Briefcase,
  RefreshCw,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface MentorTabProps {
  name: string;
  targetRole: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  isChatLoading: boolean;
  onChatInputChange: (val: string) => void;
  onSendMessage: (presetText?: string) => void;
}

export default function MentorTab({
  name,
  targetRole,
  chatMessages,
  chatInput,
  isChatLoading,
  onChatInputChange,
  onSendMessage,
}: MentorTabProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[450px] animate-in fade-in duration-300">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#6D1A36]"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36]">
                Universal Adaptive Mentor Console
              </h3>
              <p className="text-[10px] font-sans text-slate-600">
                Targeting: <strong>{targetRole}</strong> &bull;
                Cross-disciplinary consultation
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
            SESSION ACTIVE
          </span>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() =>
              onSendMessage(
                `What are the top 3 interview topics for ${targetRole}?`
              )
            }
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-teal-50 border border-stone-200 text-[11px] text-[#6D1A36] hover:border-teal-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <Sparkles className="w-3 h-3 text-teal-700" aria-hidden="true" />
            <span>Top Interview Focus</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onSendMessage(
                "I'm struggling with the core technical prerequisites for this role."
              )
            }
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-rose-50 border border-stone-200 text-[11px] text-rose-900 hover:border-rose-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <AlertTriangle
              className="w-3 h-3 text-rose-700"
              aria-hidden="true"
            />
            <span>I&apos;m struggling with prerequisites</span>
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Pivot to AI Engineer")}
            className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-teal-50 border border-stone-200 text-[11px] text-teal-900 hover:border-teal-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <Briefcase
              className="w-3.5 h-3.5 text-teal-700"
              aria-hidden="true"
            />
            <span>Pivot to AI Engineer</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div
          aria-live="polite"
          aria-label="Mentor conversation transcript"
          className="space-y-3 max-h-[280px] overflow-y-auto pr-1"
        >
          {chatMessages.length === 0 && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-sans text-slate-700 leading-relaxed">
              Hello {name}! I am your Universal Adaptive Mentor Agent. I monitor
              your diagnostic evaluations, track your project deliverables for{" "}
              <strong>{targetRole}</strong>, and coordinate directly with the
              Curriculum Architect Agent. How can I help accelerate your path
              today?
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col text-xs ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-[#6D1A36] text-white font-medium shadow-2xs font-sans"
                    : "bg-stone-50 border border-stone-200 text-slate-800 shadow-2xs font-sans"
                }`}
              >
                <p>{msg.text}</p>
                {msg.adjustment && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-teal-800 font-mono font-bold flex items-center gap-1">
                    <Zap
                      className="w-3 h-3 text-teal-700 shrink-0"
                      aria-hidden="true"
                    />
                    <span>ADJUSTMENT: {msg.adjustment}</span>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isChatLoading && (
            <div
              role="status"
              className="flex items-center gap-2 text-xs text-slate-600 font-sans"
            >
              <RefreshCw
                className="w-3 h-3 animate-spin text-teal-700"
                aria-hidden="true"
              />
              <span>Mentor Agent synthesizing advice...</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        className="pt-3 border-t border-stone-100 flex gap-2"
      >
        <label htmlFor="mentor-chat-input" className="sr-only">
          Ask the Adaptive Mentor Agent a question
        </label>
        <input
          id="mentor-chat-input"
          type="text"
          maxLength={2000}
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          placeholder={`Ask a question or request a career adjustment for ${targetRole}...`}
          className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs transition placeholder:text-slate-500 font-sans"
        />
        <button
          type="submit"
          disabled={isChatLoading || !chatInput.trim()}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl font-heading font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
