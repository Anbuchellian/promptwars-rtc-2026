"use client";

import React from "react";
import { Check, FileText, UploadCloud } from "lucide-react";
import type { AnalysisData, ResumeLayout } from "@/lib/types";

interface ResumeTabProps {
  name: string;
  targetRole: string;
  skillsList: string[];
  projects: string;
  certifications: string;
  analysisData: AnalysisData | null;
  resumeLayout: ResumeLayout;
  onResumeLayoutChange: (layout: ResumeLayout) => void;
  profilePhoto: string | null;
  onRemovePhoto: () => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoUploadError: string | null;
  resumeHeadline: string;
  onResumeHeadlineChange: (val: string) => void;
}

const RESUME_STYLES: { id: ResumeLayout; name: string; desc: string }[] = [
  {
    id: "executive",
    name: "Executive Burgundy Classic",
    desc: "Prestige header banner with burgundy accent borders and structured competence columns",
  },
  {
    id: "modern",
    name: "Modern Turquoise Split",
    desc: "Two-column contemporary sidebar layout emphasizing verified technical stacks & readiness",
  },
  {
    id: "academic",
    name: "Minimal Academic Serif",
    desc: "Refined single-column typographic layout ideal for research, medicine, sciences & law",
  },
];

export default function ResumeTab({
  name,
  targetRole,
  skillsList,
  projects,
  certifications,
  analysisData,
  resumeLayout,
  onResumeLayoutChange,
  profilePhoto,
  onRemovePhoto,
  onPhotoUpload,
  photoUploadError,
  resumeHeadline,
  onResumeHeadlineChange,
}: ResumeTabProps) {
  const readiness = analysisData?.readinessScore ?? 45;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Executive Resume Architect &bull; Live Preview &amp; Export
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Tailored for <strong>{targetRole}</strong> with live profile
              synchronization and export-ready formatting
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#6D1A36] hover:bg-[#521228] text-white rounded-xl text-xs font-heading font-bold tracking-tight transition flex items-center gap-2 shadow-md shadow-[#6D1A36]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <FileText className="w-3.5 h-3.5 text-teal-300" aria-hidden="true" />
            <span>Download / Print Resume (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <span className="text-xs font-heading font-bold text-slate-800 block mb-2">
              Choose Resume Layout Archetype
            </span>
            <div className="space-y-2" role="radiogroup" aria-label="Resume layout archetype">
              {RESUME_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  role="radio"
                  aria-checked={resumeLayout === style.id}
                  onClick={() => onResumeLayoutChange(style.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    resumeLayout === style.id
                      ? "bg-teal-50 border-teal-600 text-teal-950 font-semibold shadow-xs"
                      : "bg-stone-50 border-stone-200 text-slate-800 hover:bg-stone-100 hover:border-stone-300"
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-slate-900 block text-xs">
                      {style.name}
                    </span>
                    <span className="text-[11px] font-sans text-slate-600 block mt-0.5">
                      {style.desc}
                    </span>
                  </div>
                  {resumeLayout === style.id && (
                    <Check
                      className="w-4 h-4 text-teal-700 shrink-0 ml-2"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-heading font-bold text-slate-800 block mb-1">
                Professional Profile Photo (Optional)
              </span>
              <div className="flex items-center gap-3">
                {profilePhoto ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-teal-500 shadow-sm shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profilePhoto}
                      alt={`${name} headshot preview`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={onRemovePhoto}
                      aria-label="Remove uploaded profile photo"
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition text-[9px] font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-slate-600 text-[10px] font-mono shrink-0">
                    No Photo
                  </div>
                )}

                <div className="flex-1">
                  <label
                    htmlFor="resume-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-800 text-xs font-heading font-bold transition focus-within:ring-2 focus-within:ring-[#0D9488]"
                  >
                    <UploadCloud
                      className="w-3.5 h-3.5 text-teal-700"
                      aria-hidden="true"
                    />
                    <span>Upload Headshot Image</span>
                    <input
                      id="resume-photo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={onPhotoUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-[10px] text-slate-600 font-sans mt-1">
                    Supported: PNG, JPG, WebP (max 2 MB). Encoded locally in
                    browser.
                  </p>
                  {photoUploadError && (
                    <p
                      role="alert"
                      className="text-[11px] text-rose-800 font-semibold mt-1"
                    >
                      {photoUploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="resume-headline-input"
                className="text-xs font-heading font-bold text-slate-800 block mb-1"
              >
                Professional Headline
              </label>
              <input
                id="resume-headline-input"
                type="text"
                maxLength={180}
                value={resumeHeadline}
                onChange={(e) => onResumeHeadlineChange(e.target.value)}
                placeholder={`e.g. Dedicated ${targetRole} with Analytical Rigor & Domain Expertise`}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs font-sans placeholder:text-slate-500"
              />
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-sans text-slate-700">
              <span className="font-heading font-bold text-[#6D1A36] block mb-0.5">
                Pro-Tip for Job Applicants:
              </span>
              Your verified skills ({skillsList.length}), projects,
              certifications, and AI Readiness Score ({readiness}%) are
              dynamically mapped into the selected resume template below!
            </div>
          </div>
        </div>
      </div>

      {/* Live Resume Sheet Preview Container */}
      <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 sm:p-8 flex justify-center shadow-inner overflow-x-auto">
        <article
          id="printable-resume"
          aria-label="Printable resume preview"
          className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] shadow-2xl rounded-sm p-8 sm:p-12 relative print:shadow-none print:p-0 print:m-0 print:border-none print:w-full"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {resumeLayout === "executive" && (
            <div className="space-y-6">
              <div className="border-b-2 border-[#6D1A36] pb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {profilePhoto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profilePhoto}
                      alt={name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#6D1A36] shadow-sm shrink-0"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-[#6D1A36]">
                      {name}
                    </h2>
                    <p className="text-sm font-sans font-medium text-slate-700 mt-0.5">
                      {resumeHeadline}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-mono uppercase tracking-wider text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                      TARGET: {targetRole}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex flex-col items-center p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[9px] font-mono uppercase text-slate-600 font-bold">
                      AI READINESS
                    </span>
                    <span className="text-2xl font-heading font-black text-[#6D1A36]">
                      {readiness}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                  Executive Profile &amp; Career Objective
                </h3>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  Targeting a high-impact position as a{" "}
                  <strong>{targetRole}</strong>. Demonstrated competencies across
                  verified disciplines with a structured continuous professional
                  learning trajectory audited through multi-agent career
                  engineering.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2.5">
                  Validated Core Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-50 border border-stone-200 text-slate-800 font-medium"
                    >
                      &bull; {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                  Applied Projects, Research &amp; Work
                </h3>
                <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 text-xs font-sans text-slate-800 leading-relaxed">
                  {projects ||
                    "Key applied capstone projects and continuous laboratory coursework."}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                  Certifications, Degrees &amp; Credentials
                </h3>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  {certifications ||
                    "Undergraduate degree and professional development credentials."}
                </p>
              </div>

              {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2.5">
                    Specialized Advanced Modules (THIRAN VAZHI Engine)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {analysisData.roadmap.slice(0, 4).map((phase) => (
                      <div
                        key={phase.phase}
                        className="p-2.5 rounded-lg border border-stone-200 bg-white"
                      >
                        <span className="font-heading font-bold text-slate-900 block text-[11px]">
                          {phase.phase}
                        </span>
                        <span className="text-[10px] text-teal-800 font-mono block">
                          Focus: {phase.focusSkill} ({phase.duration})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {resumeLayout === "modern" && (
            <div className="flex flex-col sm:flex-row gap-8 min-h-[900px]">
              <div className="sm:w-64 bg-teal-800 text-white -m-8 sm:-m-12 sm:mr-0 p-8 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  {profilePhoto && (
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profilePhoto}
                        alt={name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-md"
                      />
                    </div>
                  )}

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                      {name}
                    </h2>
                    <p className="text-xs text-teal-100 font-sans mt-1">
                      {targetRole}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-100 block border-b border-teal-700 pb-1 mb-2">
                      VERIFIED SKILLS
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skillsList.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-700/80 text-teal-50"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-100 block border-b border-teal-700 pb-1 mb-1.5">
                      CREDENTIALS
                    </span>
                    <p className="text-[11px] font-sans text-teal-50 leading-relaxed">
                      {certifications}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-teal-700">
                  <span className="text-[9px] font-mono uppercase text-teal-100 block">
                    BENCHMARK READINESS
                  </span>
                  <span className="text-3xl font-heading font-black text-white">
                    {readiness}%
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-6 pt-4 sm:pt-0">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block">
                    CAREER TRAJECTORY
                  </span>
                  <h3 className="text-xl font-heading font-bold text-slate-900 mt-0.5">
                    {resumeHeadline}
                  </h3>
                  <p className="text-xs font-sans text-slate-700 mt-2 leading-relaxed">
                    Proactive professional with verified competencies aligned to{" "}
                    <strong>{targetRole}</strong>. Evaluated by multi-agent
                    career intelligence to ensure compliance with modern
                    industry benchmarks.
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block border-b border-stone-200 pb-1 mb-2">
                    PROJECTS &amp; HANDS-ON ACCOMPLISHMENTS
                  </span>
                  <p className="text-xs font-sans text-slate-800 leading-relaxed">
                    {projects}
                  </p>
                </div>

                {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block border-b border-stone-200 pb-1 mb-2.5">
                      PHASED TECHNICAL MASTERY CURRICULUM
                    </span>
                    <div className="space-y-2">
                      {analysisData.roadmap.map((phase) => (
                        <div
                          key={phase.phase}
                          className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 font-heading">
                              {phase.phase}
                            </strong>
                            <span className="text-[10px] font-mono text-teal-800 font-bold">
                              {phase.duration}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            Focus: {phase.focusSkill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {resumeLayout === "academic" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center border-b border-stone-300 pb-6">
                {profilePhoto && (
                  <div className="flex justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profilePhoto}
                      alt={name}
                      className="w-20 h-20 rounded-full object-cover border border-stone-400 shadow-sm"
                    />
                  </div>
                )}
                <h2 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                  {name}
                </h2>
                <p className="text-sm font-heading italic text-slate-700 mt-1">
                  {resumeHeadline}
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-[#6D1A36] font-bold mt-1.5">
                  Candidate for: {targetRole}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-stone-200 pb-1 mb-2">
                  I. Professional Statement
                </h3>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  Scholarly and industry competencies developed toward{" "}
                  <strong>{targetRole}</strong>. Assessed through autonomous
                  multi-agent verification yielding an empirical{" "}
                  <strong>{readiness}% readiness index</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-stone-200 pb-1 mb-2">
                  II. Technical Competencies &amp; Methods
                </h3>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {skillsList.join(" • ")}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-stone-200 pb-1 mb-2">
                  III. Research, Publications &amp; Applied Projects
                </h3>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {projects}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-stone-200 pb-1 mb-2">
                  IV. Academic Degrees &amp; Certifications
                </h3>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {certifications}
                </p>
              </div>

              {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-stone-200 pb-1 mb-2">
                    V. Academic &amp; Clinical Sprint Modules
                  </h3>
                  <ul className="list-disc list-inside text-xs font-sans text-slate-700 space-y-1">
                    {analysisData.roadmap.map((p) => (
                      <li key={p.phase}>
                        <strong>{p.phase}</strong> ({p.duration}):{" "}
                        {p.focusSkill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
