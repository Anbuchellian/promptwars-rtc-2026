"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  RefreshCw,
  RotateCcw,
  Search,
  Target,
  UploadCloud,
  X,
} from "lucide-react";
import {
  CAREER_DOMAINS,
  STUDENT_PRESETS,
  SUPPORTED_LANGUAGES,
  UNIVERSAL_SKILLS_DATABASE,
} from "@/lib/skills-data";
import type { StudentPresetId, SupportedLanguage } from "@/lib/types";

interface ProfileSidebarProps {
  name: string;
  onNameChange: (val: string) => void;
  targetRole: string;
  onTargetRoleChange: (role: string) => void;
  preferredLanguage: SupportedLanguage;
  onPreferredLanguageChange: (lang: SupportedLanguage) => void;
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
  activePresetId: StudentPresetId | null;
  onLoadPreset: (presetId: StudentPresetId) => void;
  onResetProfile: () => void;
  onRunPipeline: () => void;
  isLoading: boolean;
  progressPercent: number;
  completedCount: number;
  totalResources: number;
}

export default function ProfileSidebar({
  name,
  onNameChange,
  targetRole,
  onTargetRoleChange,
  preferredLanguage,
  onPreferredLanguageChange,
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
  activePresetId,
  onLoadPreset,
  onResetProfile,
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
  const roleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isRolePickerOpen) return;
    const handleOutsideOrEscape = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setIsRolePickerOpen(false);
        roleButtonRef.current?.focus();
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
      roleButtonRef.current?.focus();
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
      {/* 4 Candidate Sample Records */}
      <section
        aria-labelledby="presets-heading"
        className="bg-white rounded-xl border border-slate-200 p-4"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2
            id="presets-heading"
            className="text-xs font-heading font-bold text-[#6D1A36]"
          >
            Candidate Profile Records (4)
          </h2>
          <button
            type="button"
            onClick={onResetProfile}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            aria-label="Reset to default candidate profile"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {STUDENT_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setCustomRoleInput("");
                  onLoadPreset(preset.id);
                }}
                className={`w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg border transition-colors text-xs flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  isActive
                    ? "bg-teal-50/70 border-teal-600 text-slate-900"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-[#0F766E] text-white"
                      : "bg-[#6D1A36]/10 text-[#6D1A36]"
                  }`}
                >
                  {preset.code}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-heading font-bold text-slate-900 block truncate">
                    {preset.label}
                  </span>
                  <span className="text-xs text-slate-600 block truncate">
                    {preset.targetSummary} &middot; {preset.metaSummary}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Collapsible Auto-Import from Resume / Bio */}
      <section
        aria-label="Resume and bio auto-import"
        className="bg-white rounded-xl border border-slate-200 p-4"
      >
        <button
          type="button"
          aria-expanded={isResumeBoxOpen}
          aria-controls="resume-import-panel"
          onClick={() => setIsResumeBoxOpen(!isResumeBoxOpen)}
          className="w-full min-h-[40px] flex items-center justify-between text-xs font-heading font-bold text-[#6D1A36] hover:text-[#521228] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded-lg px-1"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            <span>Import from Resume / Bio</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-[#0F766E] font-medium">
            <span>{isResumeBoxOpen ? "Hide" : "Open"}</span>
            {isResumeBoxOpen ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </span>
        </button>

        {isResumeBoxOpen && (
          <div
            id="resume-import-panel"
            className="mt-3 pt-3 border-t border-slate-100 space-y-3"
          >
            <label
              htmlFor="resume-auto-import-textarea"
              className="text-xs text-slate-700 leading-relaxed block"
            >
              Paste any resume, bio, or LinkedIn summary across any discipline:
            </label>

            <textarea
              id="resume-auto-import-textarea"
              rows={4}
              value={resumeText}
              maxLength={15000}
              onChange={(e) => onResumeTextChange(e.target.value)}
              placeholder="Paste resume text or experience across science, engineering, business, law, or humanities..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none transition resize-none placeholder:text-slate-500 font-sans"
            />

            <button
              type="button"
              onClick={onExtractSkillsFromResume}
              disabled={isParsingResume || !resumeText.trim()}
              className="w-full min-h-[40px] py-2 px-4 rounded-lg text-xs font-heading font-bold bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-45 text-white transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              {isParsingResume ? (
                <>
                  <RefreshCw
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Parsing Profile...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" aria-hidden="true" />
                  <span>Extract Skills &amp; Profile</span>
                </>
              )}
            </button>

            {parseSuccessMsg && (
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-[#0F766E] font-semibold font-sans"
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
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2
            id="learner-profile-heading"
            className="flex items-center gap-2 text-[#6D1A36] font-heading font-bold text-sm"
          >
            <Target className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            <span>Learner Profile</span>
          </h2>
          <span className="text-xs text-slate-600 font-medium">
            All Disciplines
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Candidate Name */}
          <div>
            <label
              htmlFor="candidate-name-input"
              className="text-slate-800 font-semibold block mb-1.5"
            >
              Candidate Name
            </label>
            <input
              id="candidate-name-input"
              type="text"
              maxLength={120}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none transition placeholder:text-slate-500 font-sans text-xs"
              placeholder="e.g. Karthik Sundaram"
            />
          </div>

          {/* Target Career Role Picker */}
          <div className="relative" ref={rolePickerRef}>
            <label
              htmlFor="target-role-button"
              className="text-slate-800 font-semibold block mb-1.5"
            >
              Target Career Role
            </label>
            <button
              ref={roleButtonRef}
              id="target-role-button"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isRolePickerOpen}
              onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 hover:border-[#0D9488] cursor-pointer flex items-center justify-between text-slate-900 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <span className="truncate">{targetRole}</span>
              <ChevronDown
                className="w-4 h-4 text-slate-600 shrink-0 ml-1"
                aria-hidden="true"
              />
            </button>

            {isRolePickerOpen && (
              <div
                role="region"
                aria-label="Career role selector"
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-300 rounded-xl shadow-lg z-50 p-3 max-h-80 overflow-y-auto"
              >
                <div className="relative mb-2.5">
                  <Search
                    className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3"
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
                    placeholder="Search 30+ roles..."
                    className="w-full min-h-[38px] pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-300 outline-none focus:border-[#0D9488] text-slate-900 font-sans"
                  />
                </div>

                <div className="p-2.5 mb-3 rounded-lg bg-teal-50/70 border border-teal-200">
                  <label
                    htmlFor="custom-role-input"
                    className="text-xs font-semibold text-teal-950 block mb-1.5"
                  >
                    Custom Target Role
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
                      placeholder="e.g. Battery Electrochemist"
                      className="flex-1 min-h-[38px] px-2.5 py-1 text-xs rounded-md bg-white border border-teal-300 outline-none text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomRole}
                      className="px-3 min-h-[38px] rounded-md bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div
                  role="listbox"
                  aria-label="Available career roles"
                  className="space-y-3"
                >
                  {filteredCareerDomains.map((domain) => (
                    <div key={domain.category} className="space-y-1">
                      <span className="text-xs font-semibold text-[#6D1A36] block px-1">
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
                              roleButtonRef.current?.focus();
                            }}
                            className={`w-full min-h-[38px] text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                              targetRole === roleName
                                ? "bg-teal-100 text-teal-950 font-bold"
                                : "hover:bg-slate-100 text-slate-800"
                            }`}
                          >
                            <span>{roleName}</span>
                            {targetRole === roleName && (
                              <Check
                                className="w-3.5 h-3.5 text-[#0F766E]"
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

          {/* Output Language Preference */}
          <div>
            <label
              htmlFor="preferred-language-select"
              className="text-slate-800 font-semibold flex items-center gap-1.5 mb-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
              <span>Guidance Language</span>
            </label>
            <select
              id="preferred-language-select"
              value={preferredLanguage}
              onChange={(e) =>
                onPreferredLanguageChange(e.target.value as SupportedLanguage)
              }
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none text-xs font-sans cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Existing Skills Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="add-custom-skill-input"
                className="text-slate-800 font-semibold"
              >
                Existing Skills ({skillsList.length})
              </label>
              <button
                type="button"
                aria-expanded={isSkillPickerOpen}
                aria-controls="skills-database-panel"
                onClick={() => setIsSkillPickerOpen(!isSkillPickerOpen)}
                className="text-xs text-[#0F766E] font-semibold hover:underline flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <span>
                  {isSkillPickerOpen ? "Hide Catalog" : "Browse 150+"}
                </span>
                {isSkillPickerOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            <ul
              aria-label="Selected skills"
              className="flex flex-wrap gap-1.5 mb-2.5 min-h-[40px] p-2 bg-slate-50 rounded-lg border border-slate-200"
            >
              {skillsList.map((skill) => (
                <li
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-800 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => onRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-700 transition cursor-pointer p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
              {skillsList.length === 0 && (
                <li className="text-slate-600 text-xs p-0.5">
                  No skills added yet
                </li>
              )}
            </ul>

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
                placeholder="Type any skill & press Enter"
                className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none transition text-xs placeholder:text-slate-500 font-sans"
              />
              <button
                type="button"
                onClick={handleAddCustomSkillSubmit}
                className="min-h-[40px] px-4 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 rounded-lg font-heading font-bold text-xs transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                Add
              </button>
            </div>

            {isSkillPickerOpen && (
              <div
                id="skills-database-panel"
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 max-h-52 overflow-y-auto"
              >
                <div className="relative">
                  <Search
                    className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3"
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
                    placeholder="Filter skills (A-Z)..."
                    className="w-full min-h-[38px] pl-8 pr-3 py-1 text-xs rounded-md bg-white border border-slate-300 outline-none focus:border-[#0D9488] text-slate-900 font-sans"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filteredSkills.map((sk) => {
                    const isSelected = skillsList.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onToggleSkill(sk)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border transition cursor-pointer font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                          isSelected
                            ? "bg-[#0F766E] text-white border-[#0F766E] font-semibold"
                            : "bg-white text-slate-800 border-slate-300 hover:border-[#0D9488]"
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
              className="text-slate-800 font-semibold block mb-1.5"
            >
              Projects &amp; Experience
            </label>
            <textarea
              id="projects-textarea"
              rows={2}
              maxLength={2000}
              value={projects}
              onChange={(e) => onProjectsChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none transition text-xs placeholder:text-slate-500 font-sans"
              placeholder="Key projects, lab coursework, or thesis research..."
            />
          </div>

          {/* Certifications */}
          <div>
            <label
              htmlFor="certifications-input"
              className="text-slate-800 font-semibold block mb-1.5"
            >
              Certifications &amp; Degrees
            </label>
            <input
              id="certifications-input"
              type="text"
              maxLength={1000}
              value={certifications}
              onChange={(e) => onCertificationsChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none transition placeholder:text-slate-500 font-sans text-xs"
              placeholder="Degrees, licenses, or credentials..."
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onRunPipeline}
            disabled={isLoading}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-lg font-heading font-bold text-xs bg-[#6D1A36] hover:bg-[#521228] text-white disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            {isLoading ? (
              <>
                <RefreshCw
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Analyzing Profile...</span>
              </>
            ) : (
              <span>Run Multi-Agent Audit &amp; Plan</span>
            )}
          </button>
        </div>
      </section>

      {/* Progress Tracker Card */}
      <section
        aria-label="Roadmap execution progress"
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-heading font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle
              className="w-4 h-4 text-[#0F766E]"
              aria-hidden="true"
            />
            <span>Roadmap Execution</span>
          </span>
          <span className="text-xs font-mono font-bold text-[#0F766E] tabular-nums">
            {progressPercent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap modules mastered"
          className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
        >
          <div
            className="h-full bg-[#0F766E] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs font-sans text-slate-600 mt-2 tabular-nums">
          {completedCount} of {totalResources} modules completed
        </p>
      </section>
    </aside>
  );
}
