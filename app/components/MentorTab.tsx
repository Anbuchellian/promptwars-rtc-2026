"use client";

import React from "react";
import {
  AlertTriangle,
  Bot,
  Briefcase,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
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
  onClearChat: () => void;
}

export default function MentorTab({
  name,
  targetRole,
  chatMessages,
  chatInput,
  isChatLoading,
  onChatInputChange,
  onSendMessage,
  onClearChat,
}: MentorTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex-1 flex flex-col justify-between min-h-[460px]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#6D1A36]"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
                Universal Adaptive Mentor Console
              </h2>
              <p className="text-xs font-sans text-slate-600">
                Targeting: <strong className="text-slate-900">{targetRole}</strong>{" "}
                &middot; Cross-disciplinary consultation
              </p>
            </div>
          </div>

          {chatMessages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>

        {/* Quick Action Prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() =>
              onSendMessage(
                `What are the top 3 interview topics for ${targetRole}?`
              )
            }
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-xs text-[#6D1A36] hover:border-[#0D9488] transition-colors cursor-pointer flex items-center gap-1.5 font-heading font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <Sparkles
              className="w-3.5 h-3.5 text-[#0F766E]"
              aria-hidden="true"
            />
            <span>Top Interview Focus</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onSendMessage(
                "I'm struggling with the core technical prerequisites for this role."
              )
            }
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 text-xs text-rose-900 hover:border-rose-300 transition-colors cursor-pointer flex items-center gap-1.5 font-heading font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <AlertTriangle
              className="w-3.5 h-3.5 text-rose-700"
              aria-hidden="true"
            />
            <span>I&apos;m struggling with prerequisites</span>
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Pivot to AI Engineer")}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-xs text-teal-950 hover:border-[#0D9488] transition-colors cursor-pointer flex items-center gap-1.5 font-heading font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <Briefcase
              className="w-3.5 h-3.5 text-[#0F766E]"
              aria-hidden="true"
            />
            <span>Pivot to AI Engineer</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div
          aria-live="polite"
          aria-label="Mentor conversation transcript"
          className="space-y-3 max-h-[300px] overflow-y-auto pr-1"
        >
          {chatMessages.length === 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-700 leading-relaxed">
              Hello {name}. I am your Universal Adaptive Mentor Agent. I monitor
              your diagnostic evaluations, track your project deliverables for{" "}
              <strong className="text-slate-900">{targetRole}</strong>, and
              coordinate directly with the Curriculum Architect Agent. How can I
              help accelerate your path today?
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
                className={`max-w-[85%] p-3.5 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-[#6D1A36] text-white font-medium font-sans"
                    : "bg-slate-50 border border-slate-200 text-slate-900 font-sans"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                {msg.adjustment && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-[#0F766E] font-mono font-bold flex items-center gap-1.5">
                    <Zap
                      className="w-3.5 h-3.5 text-[#0F766E] shrink-0"
                      aria-hidden="true"
                    />
                    <span>Adjustment: {msg.adjustment}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500 mt-1 px-1 font-mono tabular-nums">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isChatLoading && (
            <div
              role="status"
              className="flex items-center gap-2 text-xs text-slate-600 font-sans py-1"
            >
              <RefreshCw
                className="w-3.5 h-3.5 animate-spin text-[#0F766E]"
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
        className="pt-4 mt-3 border-t border-slate-100 flex gap-2"
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
          className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none text-xs transition placeholder:text-slate-500 font-sans"
        />
        <button
          type="submit"
          disabled={isChatLoading || !chatInput.trim()}
          className="min-h-[42px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white rounded-lg font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
