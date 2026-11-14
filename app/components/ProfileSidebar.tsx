"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";
import {
  CAREER_DOMAINS,
  STUDENT_PRESETS,
  UNIVERSAL_SKILLS_DATABASE,
} from "@/lib/skills-data";

interface ProfileSidebarProps {
  name: string;
  onNameChange: (val: string) => void;
  targetRole: string;
  onTargetRoleChange: (role: string) => void;
  skillsList: string[];
  onToggleSkill: (skill: string) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  projects: string;
  onProjectsChange: (val: string) => void;
  certifications: string;
  onCertificationsChange: (val: string) => void;
  resumeText: string;
  onResumeTextChange: (val: string) => void;
  isParsingResume: boolean;
  parseSuccessMsg: string | null;
  onExtractSkillsFromResume: () => void;
  onLoadPreset: (presetId: 1 | 2 | 3) => void;
  onRunPipeline: () => void;
  isLoading: boolean;
  progressPercent: number;
  completedCount: number;
  totalResources: number;
}

const PRESET_ICONS: Record<1 | 2 | 3, string> = {
  1: "CS",
  2: "RX",
  3: "FN",
};

export default function ProfileSidebar({
  name,
  onNameChange,
  targetRole,
  onTargetRoleChange,
  skillsList,
  onToggleSkill,
  onAddSkill,
  onRemoveSkill,
  projects,
  onProjectsChange,
  certifications,
  onCertificationsChange,
  resumeText,
  onResumeTextChange,
  isParsingResume,
  parseSuccessMsg,
  onExtractSkillsFromResume,
  onLoadPreset,
  onRunPipeline,
  isLoading,
  progressPercent,
  completedCount,
  totalResources,
}: ProfileSidebarProps) {
  const [isResumeBoxOpen, setIsResumeBoxOpen] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isSkillPickerOpen, setIsSkillPickerOpen] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [newSkillInput, setNewSkillInput] = useState("");

  const rolePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRolePickerOpen) return;
    const handleOutsideOrEscape = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setIsRolePickerOpen(false);
        return;
      }
      if (
        event instanceof MouseEvent &&
        rolePickerRef.current &&
        !rolePickerRef.current.contains(event.target as Node)
      ) {
        setIsRolePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideOrEscape);
    document.addEventListener("keydown", handleOutsideOrEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideOrEscape);
      document.removeEventListener("keydown", handleOutsideOrEscape);
    };
  }, [isRolePickerOpen]);

  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery.trim()) {
      return UNIVERSAL_SKILLS_DATABASE.slice(0, 40);
    }
    const q = skillSearchQuery.toLowerCase();
    return UNIVERSAL_SKILLS_DATABASE.filter((s) =>
      s.toLowerCase().includes(q)
    );
  }, [skillSearchQuery]);

  const filteredCareerDomains = useMemo(() => {
    if (!roleSearchQuery.trim()) return CAREER_DOMAINS;
    const q = roleSearchQuery.toLowerCase();
    return CAREER_DOMAINS.map((domain) => ({
      ...domain,
      roles: domain.roles.filter(
        (r) =>
          r.toLowerCase().includes(q) ||
          domain.category.toLowerCase().includes(q)
      ),
    })).filter((d) => d.roles.length > 0);
  }, [roleSearchQuery]);

  const handleApplyCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (trimmed) {
      onTargetRoleChange(trimmed);
      setCustomRoleInput("");
      setIsRolePickerOpen(false);
    }
  };

  const handleAddCustomSkillSubmit = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed) {
      onAddSkill(trimmed);
      setNewSkillInput("");
    }
  };

  return (
    <aside
      aria-label="Learner profile and career configuration"
      className="w-full lg:w-80 shrink-0 flex flex-col gap-5"
    >
      {/* 1-Click Student Presets */}
      <section
        aria-labelledby="presets-heading"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 hover:border-slate-300 transition-colors"
      >
        <h2
          id="presets-heading"
          className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block mb-3"
        >
          1-CLICK STUDENT PRESETS
        </h2>
        <div className="flex flex-col gap-2">
          {STUDENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setCustomRoleInput("");
                onLoadPreset(preset.id);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0D9488]/[0.05] border border-slate-200 hover:border-[#0D9488]/30 transition text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-lg bg-[#6D1A36]/10 text-[#6D1A36] font-mono font-bold text-[10px] flex items-center justify-center shrink-0"
                >
                  {PRESET_ICONS[preset.id]}
                </span>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    {preset.label}
                  </span>
                  <span className="text-slate-600 text-[10px]">
                    {preset.subtitle}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#0F766E] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-md border border-[#0D9488]/20 font-semibold">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Collapsible Auto-Import from Resume / Bio */}
      <section
        aria-label="Resume and bio auto-import"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 hover:border-slate-300 transition-colors overflow-hidden"
      >
        <button
          type="button"
          aria-expanded={isResumeBoxOpen}
          aria-controls="resume-import-panel"
          onClick={() => setIsResumeBoxOpen(!isResumeBoxOpen)}
          className="w-full flex items-center justify-between text-xs font-heading font-bold tracking-tight text-[#6D1A36] hover:text-[#521228] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-lg p-0.5"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" aria-hidden="true" />
            Auto-Import from Resume / Bio
          </span>
          <span className="flex items-center gap-1 text-[11px] text-teal-800 font-medium">
            <span>{isResumeBoxOpen ? "Collapse" : "Expand"}</span>
            {isResumeBoxOpen ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </span>
        </button>

        {isResumeBoxOpen && (
          <div
            id="resume-import-panel"
            className="mt-3 pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in duration-200"
          >
            <label
              htmlFor="resume-auto-import-textarea"
              className="text-[11px] text-slate-600 leading-relaxed block"
            >
              Paste any resume, bio, or LinkedIn summary across any discipline:
            </label>

            <textarea
              id="resume-auto-import-textarea"
              rows={4}
              value={resumeText}
              maxLength={15000}
              onChange={(e) => onResumeTextChange(e.target.value)}
              placeholder="Paste resume text or experience across any science, engineering, business, law, or humanities role..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition resize-none placeholder:text-slate-500 font-sans"
            />

            <button
              type="button"
              onClick={onExtractSkillsFromResume}
              disabled={isParsingResume || !resumeText.trim()}
              className="w-full py-2 px-3 rounded-xl text-xs font-heading font-bold tracking-tight bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-teal-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              {isParsingResume ? (
                <>
                  <RefreshCw
                    className="w-3.5 h-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Parsing Profile with Gemini...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Extract Skills Automatically</span>
                </>
              )}
            </button>

            {parseSuccessMsg && (
              <p
                role="status"
                aria-live="polite"
                className="text-[11px] text-teal-800 font-semibold font-sans"
              >
                {parseSuccessMsg}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Learner Profile Form */}
      <section
        aria-labelledby="learner-profile-heading"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h2
            id="learner-profile-heading"
            className="flex items-center gap-2 text-[#6D1A36] font-heading font-bold text-sm tracking-tight"
          >
            <Target className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Learner Profile</span>
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
            UNIVERSAL
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Candidate Name */}
          <div>
            <label
              htmlFor="candidate-name-input"
              className="text-slate-700 font-semibold block mb-1"
            >
              Candidate Name
            </label>
            <input
              id="candidate-name-input"
              type="text"
              maxLength={120}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition placeholder:text-slate-500 font-sans"
              placeholder="e.g. Alex Rivera"
            />
          </div>

          {/* Target Career Role Picker */}
          <div className="relative" ref={rolePickerRef}>
            <label
              htmlFor="target-role-button"
              className="text-slate-700 font-semibold block mb-1"
            >
              Target Career Role (Any Discipline)
            </label>
            <button
              id="target-role-button"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isRolePickerOpen}
              onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 hover:border-teal-600 cursor-pointer flex items-center justify-between text-slate-800 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <span className="truncate">{targetRole}</span>
              <ChevronDown
                className="w-4 h-4 text-slate-500 shrink-0 ml-1"
                aria-hidden="true"
              />
            </button>

            {isRolePickerOpen && (
              <div
                role="region"
                aria-label="Career role selector"
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-300 rounded-xl shadow-xl z-50 p-3 max-h-80 overflow-y-auto animate-in fade-in duration-150"
              >
                <div className="relative mb-2.5">
                  <Search
                    className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5"
                    aria-hidden="true"
                  />
                  <label htmlFor="role-search-input" className="sr-only">
                    Search career roles
                  </label>
                  <input
                    id="role-search-input"
                    type="text"
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    placeholder="Search 30+ university & enterprise roles..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 text-slate-800 font-sans"
                  />
                </div>

                <div className="p-2 mb-2 rounded-lg bg-teal-50 border border-teal-200">
                  <label
                    htmlFor="custom-role-input"
                    className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-900 block mb-1"
                  >
                    + TYPE ANY CUSTOM CAREER IN THE WORLD:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="custom-role-input"
                      type="text"
                      maxLength={160}
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCustomRole();
                        }
                      }}
                      placeholder="e.g. Battery Electrochemist, Sports Psychologist..."
                      className="flex-1 px-2.5 py-1 text-xs rounded bg-white border border-teal-300 outline-none text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomRole}
                      className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div role="listbox" aria-label="Available career roles" className="space-y-3">
                  {filteredCareerDomains.map((domain) => (
                    <div key={domain.category} className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block px-1">
                        {domain.category}
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {domain.roles.map((roleName) => (
                          <button
                            key={roleName}
                            type="button"
                            role="option"
                            aria-selected={targetRole === roleName}
                            onClick={() => {
                              onTargetRoleChange(roleName);
                              setCustomRoleInput("");
                              setIsRolePickerOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                              targetRole === roleName
                                ? "bg-teal-100 text-teal-950 font-bold"
                                : "hover:bg-stone-100 text-slate-700"
                            }`}
                          >
                            <span>{roleName}</span>
                            {targetRole === roleName && (
                              <Check
                                className="w-3.5 h-3.5 text-teal-700"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Skills Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="add-custom-skill-input"
                className="text-slate-700 font-semibold"
              >
                Existing Skills ({skillsList.length})
              </label>
              <button
                type="button"
                aria-expanded={isSkillPickerOpen}
                aria-controls="skills-database-panel"
                onClick={() => setIsSkillPickerOpen(!isSkillPickerOpen)}
                className="text-[11px] text-teal-800 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
              >
                <span>
                  {isSkillPickerOpen ? "Hide Database" : "Browse 150+ Skills"}
                </span>
                {isSkillPickerOpen ? (
                  <ChevronUp className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                )}
              </button>
            </div>

            <div
              aria-label="Selected skills"
              className="flex flex-wrap gap-1.5 mb-2 min-h-8 p-1.5 bg-stone-50 rounded-lg border border-stone-200"
            >
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0D9488]/[0.08] border border-[#0D9488]/20 text-[#0F766E] text-[11px] font-mono font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => onRemoveSkill(skill)}
                    className="text-teal-700 hover:text-rose-700 transition ml-0.5 cursor-pointer font-sans px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {skillsList.length === 0 && (
                <span className="text-slate-600 text-[11px] p-0.5">
                  No skills added yet
                </span>
              )}
            </div>

            <div className="flex gap-2 mb-2">
              <input
                id="add-custom-skill-input"
                type="text"
                maxLength={100}
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkillSubmit();
                  }
                }}
                placeholder="Type ANY skill & press Enter"
                className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition text-xs placeholder:text-slate-500 font-sans"
              />
              <button
                type="button"
                onClick={handleAddCustomSkillSubmit}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-800 rounded-lg font-heading font-bold text-xs transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Add
              </button>
            </div>

            {isSkillPickerOpen && (
              <div
                id="skills-database-panel"
                className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 max-h-48 overflow-y-auto animate-in fade-in duration-150"
              >
                <div className="relative">
                  <Search
                    className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2"
                    aria-hidden="true"
                  />
                  <label htmlFor="skills-filter-input" className="sr-only">
                    Filter skills database
                  </label>
                  <input
                    id="skills-filter-input"
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    placeholder="Filter 150+ skills (A-Z)..."
                    className="w-full pl-8 pr-3 py-1 text-xs rounded bg-white border border-stone-300 outline-none focus:border-teal-600 text-slate-800 font-sans"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {filteredSkills.map((sk) => {
                    const isSelected = skillsList.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onToggleSkill(sk)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                          isSelected
                            ? "bg-teal-700 text-white border-teal-700 font-bold"
                            : "bg-white text-slate-700 border-stone-300 hover:border-teal-500 hover:text-teal-800"
                        }`}
                      >
                        {isSelected ? `Selected: ${sk}` : `+ ${sk}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Projects & Experience */}
          <div>
            <label
              htmlFor="projects-textarea"
              className="text-slate-700 font-semibold block mb-1"
            >
              Projects / Research / Experience
            </label>
            <textarea
              id="projects-textarea"
              rows={2}
              maxLength={2000}
              value={projects}
              onChange={(e) => onProjectsChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition text-xs placeholder:text-slate-500 font-sans"
              placeholder="Key projects, lab coursework, or thesis research..."
            />
          </div>

          {/* Certifications */}
          <div>
            <label
              htmlFor="certifications-input"
              className="text-slate-700 font-semibold block mb-1"
            >
              Certifications / Degrees / Licenses
            </label>
            <input
              id="certifications-input"
              type="text"
              maxLength={1000}
              value={certifications}
              onChange={(e) => onCertificationsChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition placeholder:text-slate-500 font-sans"
              placeholder="Degrees, professional licenses, or credentials..."
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onRunPipeline}
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-full font-heading font-bold tracking-tight text-xs bg-[#6D1A36] hover:bg-[#521228] text-white shadow-md shadow-[#6D1A36]/20 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            {isLoading ? (
              <>
                <RefreshCw
                  className="w-4 h-4 animate-spin text-teal-300"
                  aria-hidden="true"
                />
                <span>Universal Agents Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles
                  className="w-4 h-4 text-teal-300"
                  aria-hidden="true"
                />
                <span>Run Multi-Agent Audit &amp; Plan</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Progress Tracker Card */}
      <section
        aria-label="Roadmap execution progress"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-heading font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <CheckCircle
              className="w-3.5 h-3.5 text-teal-700"
              aria-hidden="true"
            />
            Roadmap Execution
          </span>
          <span className="text-xs font-mono font-bold text-teal-800">
            {progressPercent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap modules mastered"
          className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200"
        >
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] font-sans text-slate-600 mt-2">
          {completedCount} of {totalResources} hands-on modules mastered
        </p>
      </section>
    </aside>
  );
}
