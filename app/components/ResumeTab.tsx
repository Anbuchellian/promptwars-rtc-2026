"use client";

import React, { useState } from "react";
import { Check, Copy, Download, FileText, UploadCloud } from "lucide-react";
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

function buildResumeMarkdown(params: {
  name: string;
  targetRole: string;
  resumeHeadline: string;
  skillsList: string[];
  projects: string;
  certifications: string;
  readiness: number;
  analysisData: AnalysisData | null;
}): string {
  const roadmapLines =
    params.analysisData?.roadmap
      ?.map((p) => `- **${p.phase}** (${p.duration}): ${p.focusSkill}`)
      .join("\n") || "- Customized learning modules";

  return `# ${params.name}
**${params.resumeHeadline}**
Target Role: ${params.targetRole} | Verified AI Readiness Index: ${params.readiness}%

## Core Competencies
${params.skillsList.map((s) => `- ${s}`).join("\n")}

## Applied Projects & Experience
${params.projects}

## Certifications & Degrees
${params.certifications}

## Specialized Roadmap Modules
${roadmapLines}
`;
}

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
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleDownloadMarkdown = () => {
    const markdown = buildResumeMarkdown({
      name,
      targetRole,
      resumeHeadline,
      skillsList,
      projects,
      certifications,
      readiness,
      analysisData,
    });
    const safeFileName =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "candidate-resume";
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName}-resume.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus("Downloaded Markdown resume file.");
  };

  const handleCopyText = async () => {
    const markdown = buildResumeMarkdown({
      name,
      targetRole,
      resumeHeadline,
      skillsList,
      projects,
      certifications,
      readiness,
      analysisData,
    });
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(markdown);
        setExportStatus("Copied resume summary to clipboard.");
      } else {
        setExportStatus("Clipboard access is unavailable in this browser.");
      }
    } catch {
      setExportStatus("Unable to copy to clipboard.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
              <span>
                Executive Resume Architect &middot; Live Preview &amp; Export
              </span>
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Tailored for <strong className="text-slate-900">{targetRole}</strong>{" "}
              with live profile synchronization and export-ready formatting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[40px] px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-heading font-bold transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Copy className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
              <span>Copy Text</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="min-h-[40px] px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-heading font-bold transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <Download
                className="w-3.5 h-3.5 text-[#0F766E]"
                aria-hidden="true"
              />
              <span>Download (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[40px] px-4 py-2 bg-[#6D1A36] hover:bg-[#521228] text-white rounded-lg text-xs font-heading font-bold tracking-tight transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              <FileText
                className="w-3.5 h-3.5 text-teal-200"
                aria-hidden="true"
              />
              <span>Download / Print Resume (PDF)</span>
            </button>
          </div>
        </div>

        {exportStatus && (
          <p
            role="status"
            aria-live="polite"
            className="mb-4 text-xs font-semibold text-[#0F766E] bg-teal-50 border border-teal-200 rounded-lg px-3 py-2"
          >
            {exportStatus}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <span className="text-xs font-heading font-bold text-slate-800 block mb-2">
              Choose Resume Layout Archetype
            </span>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Resume layout archetype"
            >
              {RESUME_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  role="radio"
                  aria-checked={resumeLayout === style.id}
                  onClick={() => onResumeLayoutChange(style.id)}
                  className={`w-full min-h-[44px] text-left p-3.5 rounded-xl border text-xs transition-colors cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    resumeLayout === style.id
                      ? "bg-teal-50 border-teal-600 text-teal-950 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-slate-900 block text-xs">
                      {style.name}
                    </span>
                    <span className="text-xs font-sans text-slate-600 block mt-0.5">
                      {style.desc}
                    </span>
                  </div>
                  {resumeLayout === style.id && (
                    <Check
                      className="w-4 h-4 text-[#0F766E] shrink-0 ml-2"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-heading font-bold text-slate-800 block mb-1.5">
                Professional Profile Photo (Optional)
              </span>
              <div className="flex items-center gap-3">
                {profilePhoto ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0F766E] shrink-0">
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
                      className="absolute inset-0 bg-slate-950/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition text-xs font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-600 text-xs font-mono shrink-0">
                    Photo
                  </div>
                )}

                <div className="flex-1">
                  <label
                    htmlFor="resume-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-heading font-bold transition-colors focus-within:ring-2 focus-within:ring-[#0D9488]"
                  >
                    <UploadCloud
                      className="w-4 h-4 text-[#0F766E]"
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
                  <p className="text-xs text-slate-600 font-sans mt-1">
                    Supported: PNG, JPG, WebP (max 2 MB). Encoded locally in
                    browser.
                  </p>
                  {photoUploadError && (
                    <p
                      role="alert"
                      className="text-xs text-rose-800 font-semibold mt-1"
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
                className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-900 outline-none text-xs font-sans placeholder:text-slate-500"
              />
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700">
              <span className="font-heading font-bold text-[#6D1A36] block mb-0.5">
                Live Synchronization
              </span>
              Your verified skills ({skillsList.length}), projects,
              certifications, and AI Readiness Score ({readiness}%) map directly
              into the resume sheet below.
            </div>
          </div>
        </div>
      </div>

      {/* Live Resume Sheet Preview Container */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 sm:p-8 flex justify-center overflow-x-auto">
        <article
          id="printable-resume"
          aria-label="Printable resume preview"
          className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] shadow-xl rounded-sm p-8 sm:p-12 relative print:shadow-none print:p-0 print:m-0 print:border-none print:w-full"
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
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#6D1A36] shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-[#6D1A36]">
                      {name}
                    </h3>
                    <p className="text-sm font-sans font-medium text-slate-700 mt-0.5">
                      {resumeHeadline}
                    </p>
                    <span className="inline-block mt-1.5 text-xs font-mono uppercase tracking-wider text-[#0F766E] font-bold">
                      Target: {targetRole}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex flex-col items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono text-slate-600 font-bold">
                      AI READINESS
                    </span>
                    <span className="text-2xl font-heading font-black text-[#6D1A36] tabular-nums">
                      {readiness}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-slate-200 pb-1 mb-2">
                  Executive Profile &amp; Career Objective
                </h4>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  Targeting a high-impact position as a{" "}
                  <strong>{targetRole}</strong>. Demonstrated competencies across
                  verified disciplines with a structured continuous professional
                  learning trajectory audited through multi-agent career
                  engineering.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-slate-200 pb-1 mb-2.5">
                  Validated Core Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((sk) => (
                    <span
                      key={sk}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                    >
                      &bull; {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-slate-200 pb-1 mb-2">
                  Applied Projects, Research &amp; Work
                </h4>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed">
                  {projects ||
                    "Key applied capstone projects and continuous laboratory coursework."}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-slate-200 pb-1 mb-2">
                  Certifications, Degrees &amp; Credentials
                </h4>
                <p className="text-xs font-sans text-slate-700 leading-relaxed">
                  {certifications ||
                    "Undergraduate degree and professional development credentials."}
                </p>
              </div>

              {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-slate-200 pb-1 mb-2.5">
                    Specialized Advanced Modules (THIRAN VAZHI Engine)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {analysisData.roadmap.slice(0, 4).map((phase) => (
                      <div
                        key={phase.phase}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white"
                      >
                        <span className="font-heading font-bold text-slate-900 block text-xs">
                          {phase.phase}
                        </span>
                        <span className="text-xs text-[#0F766E] font-mono block">
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
                        className="w-24 h-24 rounded-full object-cover border-4 border-white/80"
                      />
                    </div>
                  )}

                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-heading font-bold text-white tracking-tight">
                      {name}
                    </h3>
                    <p className="text-xs text-teal-100 font-sans mt-1">
                      {targetRole}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-teal-100 block border-b border-teal-700 pb-1 mb-2">
                      VERIFIED SKILLS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsList.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-teal-700/80 text-teal-50"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-teal-100 block border-b border-teal-700 pb-1 mb-1.5">
                      CREDENTIALS
                    </span>
                    <p className="text-xs font-sans text-teal-50 leading-relaxed">
                      {certifications}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-teal-700">
                  <span className="text-xs font-mono uppercase text-teal-100 block">
                    BENCHMARK READINESS
                  </span>
                  <span className="text-3xl font-heading font-black text-white tabular-nums">
                    {readiness}%
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-6 pt-4 sm:pt-0">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] block">
                    CAREER TRAJECTORY
                  </span>
                  <h4 className="text-xl font-heading font-bold text-slate-900 mt-0.5">
                    {resumeHeadline}
                  </h4>
                  <p className="text-xs font-sans text-slate-700 mt-2 leading-relaxed">
                    Proactive professional with verified competencies aligned to{" "}
                    <strong>{targetRole}</strong>. Evaluated by multi-agent
                    career intelligence to ensure compliance with modern
                    industry benchmarks.
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] block border-b border-slate-200 pb-1 mb-2">
                    PROJECTS &amp; HANDS-ON ACCOMPLISHMENTS
                  </span>
                  <p className="text-xs font-sans text-slate-800 leading-relaxed">
                    {projects}
                  </p>
                </div>

                {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] block border-b border-slate-200 pb-1 mb-2.5">
                      PHASED TECHNICAL MASTERY CURRICULUM
                    </span>
                    <div className="space-y-2">
                      {analysisData.roadmap.map((phase) => (
                        <div
                          key={phase.phase}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 font-heading">
                              {phase.phase}
                            </strong>
                            <span className="text-xs font-mono text-[#0F766E] font-bold">
                              {phase.duration}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 block mt-0.5">
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
              <div className="text-center border-b border-slate-300 pb-6">
                {profilePhoto && (
                  <div className="flex justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profilePhoto}
                      alt={name}
                      className="w-20 h-20 rounded-full object-cover border border-slate-400"
                    />
                  </div>
                )}
                <h3 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                  {name}
                </h3>
                <p className="text-sm font-heading italic text-slate-700 mt-1">
                  {resumeHeadline}
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-[#6D1A36] font-bold mt-1.5">
                  Candidate for: {targetRole}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
                  I. Professional Statement
                </h4>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  Scholarly and industry competencies developed toward{" "}
                  <strong>{targetRole}</strong>. Assessed through autonomous
                  multi-agent verification yielding an empirical{" "}
                  <strong>{readiness}% readiness index</strong>.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
                  II. Technical Competencies &amp; Methods
                </h4>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {skillsList.join(" · ")}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
                  III. Research, Publications &amp; Applied Projects
                </h4>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {projects}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
                  IV. Academic Degrees &amp; Certifications
                </h4>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  {certifications}
                </p>
              </div>

              {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
                    V. Academic &amp; Clinical Sprint Modules
                  </h4>
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
