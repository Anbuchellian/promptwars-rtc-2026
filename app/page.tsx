"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Brain,
  BookOpen,
  Award,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Check,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  UploadCloud,
  Database,
  Server,
  Cloud,
  Cpu,
  Monitor,
  Flame,
} from "lucide-react";

interface AgentLog {
  agentName:
    | "Skill Auditor Agent"
    | "Curriculum Architect Agent"
    | "Assessment Examiner Agent"
    | "Adaptive Mentor Agent";
  status: "completed" | "active" | "waiting";
  thought: string;
}

interface MissingSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
}

interface DomainComparison {
  domain: "Frontend" | "Backend" | "Database" | "Cloud/DevOps" | "AI/System Design";
  currentScore: number;
  requiredScore: number;
  gapStatus: "Strong Match" | "Moderate Gap" | "Critical Gap";
  keyMissing: string;
}

interface Resource {
  title: string;
  type: "Course" | "Tutorial" | "Hands-on Project";
  description: string;
}

interface RoadmapPhase {
  phase: string;
  duration: string;
  focusSkill: string;
  isRemedial: boolean;
  resources: Resource[];
}

interface QuizQuestion {
  id: number;
  skill: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AnalysisData {
  agentLogs: AgentLog[];
  readinessScore: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  domainComparison?: DomainComparison[];
  roadmap: RoadmapPhase[];
  diagnosticQuiz: QuizQuestion[];
  mentorAdvice: string;
}

interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
  adjustment?: string;
  timestamp: string;
}

export default function PathForgeApp() {
  // Learner Profile State
  const [name, setName] = useState("Alex Rivera");
  const [skillsList, setSkillsList] = useState<string[]>([
    "Python",
    "SQL",
    "HTML",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [projects, setProjects] = useState(
    "E-commerce relational database schema, Python CLI data scraper"
  );
  const [certifications, setCertifications] = useState(
    "Python Data Analysis Certificate"
  );
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [customRole, setCustomRole] = useState("");

  // Resume / Bio Auto-Import State
  const [isResumeBoxOpen, setIsResumeBoxOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);

  // System & Tabs State
  const [activeTab, setActiveTab] = useState<
    "readiness" | "roadmap" | "quiz" | "mentor"
  >("readiness");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [adaptationAlert, setAdaptationAlert] = useState<string | null>(null);

  // Progress Bar / Checked Roadmap Items State (saved in localStorage)
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  // Mentor Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pathforge_completed_modules");
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress to localStorage
  const toggleItemCompletion = (key: string) => {
    const updated = { ...completedItems, [key]: !completedItems[key] };
    setCompletedItems(updated);
    try {
      localStorage.setItem(
        "pathforge_completed_modules",
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
  };

  // Run Multi-Agent Analysis
  const runAgentPipeline = async (adaptationContext?: string) => {
    setIsLoading(true);
    if (adaptationContext) {
      setAdaptationAlert(
        "🚨 AGENT COLLABORATION ALERT: Adaptive Intervention Protocol Active! Agent 4 (Adaptive Mentor) triggered a priority event. Agent 2 (Curriculum Architect) is injecting Remedial modules into your roadmap!"
      );
    } else {
      setAdaptationAlert(null);
    }

    const effectiveRole = targetRole === "Custom" ? customRole : targetRole;
    const payload = {
      action: "analyze_and_plan",
      name,
      currentSkills: skillsList,
      projects,
      certifications,
      targetRole: effectiveRole,
      adaptationContext,
    };

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AnalysisData = await res.json();
      setAnalysisData(data);
      // Reset quiz state on new plan
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);

      // If this was an adaptation, switch user to roadmap so they immediately see the change!
      if (adaptationContext) {
        setActiveTab("roadmap");
      }
    } catch (err) {
      console.error("Pipeline error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-Import from Resume / Bio
  const handleExtractSkillsFromResume = async () => {
    if (!resumeText.trim()) return;
    setIsParsingResume(true);
    setParseSuccessMsg(null);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse_profile",
          rawText: resumeText,
        }),
      });

      if (!res.ok) throw new Error("Failed to parse resume");

      const parsed = await res.json();
      if (parsed.name) setName(parsed.name);
      if (Array.isArray(parsed.currentSkills) && parsed.currentSkills.length > 0) {
        setSkillsList(parsed.currentSkills);
      }
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.certifications) setCertifications(parsed.certifications);
      if (parsed.suggestedTargetRole) {
        if (
          ["Full Stack Developer", "AI/ML Engineer", "Data Scientist", "Cloud DevOps Engineer"].includes(
            parsed.suggestedTargetRole
          )
        ) {
          setTargetRole(parsed.suggestedTargetRole);
        }
      }

      setParseSuccessMsg(
        `✓ Successfully extracted: ${parsed.currentSkills?.length || 0} skills & candidate profile!`
      );

      // Trigger multi-agent pipeline with extracted profile
      setTimeout(() => {
        runAgentPipeline();
      }, 100);
    } catch (err) {
      console.error("Parse error:", err);
      setParseSuccessMsg("⚠️ Could not extract skills. Try pasting again.");
    } finally {
      setIsParsingResume(false);
    }
  };

  // Run automatically on first load if empty
  useEffect(() => {
    if (!analysisData) {
      runAgentPipeline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One-click Sample Student Loader
  const handleLoadSampleStudent = () => {
    setName("Alex Rivera");
    setSkillsList(["Python", "SQL", "HTML"]);
    setProjects(
      "E-commerce relational database schema, Python CLI web scraper"
    );
    setCertifications("Python Data Fundamentals");
    setTargetRole("Full Stack Developer");
    setCustomRole("");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setAdaptationAlert(null);
    setParseSuccessMsg(null);

    setTimeout(() => {
      runAgentPipeline();
    }, 50);
  };

  // Add / Remove Skill Tags
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    const trimmed = newSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (!analysisData?.diagnosticQuiz) return;
    let correctCount = 0;
    analysisData.diagnosticQuiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    setQuizScore({
      correct: correctCount,
      total: analysisData.diagnosticQuiz.length,
    });
    setQuizSubmitted(true);
  };

  // Trigger Adaptive Re-plan (The Winning Hook)
  const handleAutoAdaptRoadmap = () => {
    const failedQuestions =
      analysisData?.diagnosticQuiz.filter(
        (q) => quizAnswers[q.id] !== q.correctIndex
      ) || [];

    const failedSkills = failedQuestions.map((q) => q.skill).join(", ");
    const adaptationContext = `Student scored ${quizScore?.correct}/${quizScore?.total} on diagnostic quiz. Identified acute conceptual struggle with: ${failedSkills || "Core Foundations"}. Immediate remedial intervention requested.`;

    runAgentPipeline(adaptationContext);
  };

  // Send Mentor Chat Message
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    if (!presetText) setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mentor_chat",
          userMessage: textToSend,
          currentProfile: {
            name,
            skillsList,
            targetRole: targetRole === "Custom" ? customRole : targetRole,
          },
          readinessScore: analysisData?.readinessScore || 45,
          missingSkills: analysisData?.missingSkills || [],
          completedModules: Object.keys(completedItems).filter(
            (k) => completedItems[k]
          ),
        }),
      });

      const data = await res.json();
      const mentorMsg: ChatMessage = {
        sender: "mentor",
        text:
          data.reply ||
          "I have processed your learning trajectory. Keep executing the active modules!",
        adjustment: data.recommendedAdjustment,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, mentorMsg]);

      // If user asks to pivot, trigger the pivot
      if (textToSend.toLowerCase().includes("pivot to ai engineer")) {
        setTargetRole("AI/ML Engineer");
        runAgentPipeline("Learner requested career pivot to AI/ML Engineer.");
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Calculate Roadmap Progress
  const totalResources =
    analysisData?.roadmap.reduce((acc, p) => acc + p.resources.length, 0) || 0;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent =
    totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

  // Domain comparison fallback helper
  const domainComparisonList: DomainComparison[] =
    analysisData?.domainComparison && analysisData.domainComparison.length > 0
      ? analysisData.domainComparison
      : [
          {
            domain: "Frontend",
            currentScore: skillsList.some((s) => /html|css|react|javascript/i.test(s)) ? 30 : 15,
            requiredScore: targetRole.includes("Full Stack") ? 85 : 40,
            gapStatus: "Critical Gap",
            keyMissing: "React.js & State Architecture",
          },
          {
            domain: "Backend",
            currentScore: skillsList.some((s) => /python|node|api/i.test(s)) ? 50 : 20,
            requiredScore: 80,
            gapStatus: "Moderate Gap",
            keyMissing: "Node.js Asynchronous Runtime",
          },
          {
            domain: "Database",
            currentScore: skillsList.some((s) => /sql|postgres|database/i.test(s)) ? 85 : 30,
            requiredScore: 75,
            gapStatus: "Strong Match",
            keyMissing: "Schema Normalization Met",
          },
          {
            domain: "Cloud/DevOps",
            currentScore: skillsList.some((s) => /docker|aws|git/i.test(s)) ? 40 : 20,
            requiredScore: 70,
            gapStatus: "Moderate Gap",
            keyMissing: "CI/CD & Docker Containers",
          },
          {
            domain: "AI/System Design",
            currentScore: skillsList.some((s) => /pytorch|ml|python/i.test(s)) ? 45 : 20,
            requiredScore: targetRole.includes("AI") ? 90 : 65,
            gapStatus: "Moderate Gap",
            keyMissing: "Distributed Architecture Patterns",
          },
        ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                PathForge AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 tracking-wider">
                Multi-Agent Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Skill Audit, Curriculum Architecture & Dynamic Remediation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadSampleStudent}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 transition shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
            title="Load sample candidate with Python & SQL transitioning to Full Stack"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Sample Student (Python/SQL &rarr; Full Stack)</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 Collaborating Agents Live</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 lg:p-6 gap-6">
        {/* Left Sidebar: Profile, Resume Import & Controls */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          {/* Collapsible "Paste Resume or LinkedIn Bio" Box */}
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-2xl p-4 shadow-xl overflow-hidden transition-all">
            <button
              onClick={() => setIsResumeBoxOpen(!isResumeBoxOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Auto-Import from Resume / Bio
              </span>
              <div className="flex items-center gap-1 text-[11px] text-cyan-400/80 font-normal">
                <span>{isResumeBoxOpen ? "Collapse" : "Expand"}</span>
                {isResumeBoxOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {isResumeBoxOpen && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 animate-in fade-in duration-200">
                <p className="text-[11px] text-slate-400">
                  Paste raw resume, LinkedIn summary, or bio to automatically extract your skills,
                  projects, and target role:
                </p>

                {/* Sample Paste Buttons for Instant Demo */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setResumeText(
                        `Candidate: Jordan Hayes\nSkills: Python, Django, PostgreSQL, Git, Docker, Redis\nProjects: Built multi-tenant API gateway and real-time order processing system.\nCertifications: AWS Certified Developer Associate\nAspiration: Transitioning to Senior Full Stack Engineer.`
                      )
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition cursor-pointer"
                  >
                    + Sample: Backend &rarr; Full Stack
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setResumeText(
                        `Candidate: Samantha Chen\nSkills: Python, SQL, Pandas, NumPy, Tableau, Scikit-Learn\nProjects: Predictive churn analytics pipeline and customer segmentation dashboards.\nCertifications: Google Professional Data Analyst\nAspiration: Pivot to Generative AI & Machine Learning Engineering.`
                      )
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition cursor-pointer"
                  >
                    + Sample: Data &rarr; AI/ML
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text, bio summary, or LinkedIn experience here..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition resize-none"
                />

                <button
                  type="button"
                  onClick={handleExtractSkillsFromResume}
                  disabled={isParsingResume || !resumeText.trim()}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/20"
                >
                  {isParsingResume ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing Profile with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Extract Skills Automatically</span>
                    </>
                  )}
                </button>

                {parseSuccessMsg && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {parseSuccessMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Learner Profile Form */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Learner Profile</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Agent Input</span>
            </div>

            {/* Name */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              {/* Target Role */}
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Target Career Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
                  <option value="Custom">Custom Target Role...</option>
                </select>

                {targetRole === "Custom" && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter custom career aspiration..."
                    className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition"
                  />
                )}
              </div>

              {/* Existing Skills */}
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Existing Skills
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-8 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px]"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-400 transition ml-0.5 cursor-pointer"
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add skill (e.g. Git) & press Enter"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Projects & Certifications */}
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Current Projects & Experience
                </label>
                <textarea
                  rows={2}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition text-xs"
                  placeholder="Key projects, coursework, or hands-on repositories..."
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Certifications
                </label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 outline-none transition"
                  placeholder="Degrees, courses, or certifications..."
                />
              </div>

              {/* Trigger Button */}
              <button
                onClick={() => runAgentPipeline()}
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-medium text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Agents Collaborating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Multi-Agent Audit & Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Roadmap Execution
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {completedCount} of {totalResources} hands-on modules mastered
            </p>
          </div>
        </aside>

        {/* Right Main Dashboard */}
        <main className="flex-1 flex flex-col gap-5 overflow-hidden">
          {/* Visible Agent Collaboration Bar */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                  Multi-Agent Live Orchestration Layer
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {isLoading ? "Executing Agent Pipeline..." : "Agents Synced"}
              </span>
            </div>

            {/* 4 Agent Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Agent 1 */}
              <div className="bg-slate-950/80 border border-indigo-900/50 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      Agent 1: Skill Auditor
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {analysisData?.agentLogs?.find(
                      (l) => l.agentName === "Skill Auditor Agent"
                    )?.thought ||
                      "Audits input skills against industry job descriptions; assigns empirical Readiness Score."}
                  </p>
                </div>
                <span className="text-[9px] uppercase font-mono text-indigo-400/80 mt-2 font-semibold">
                  Readiness: {analysisData?.readinessScore ?? "--"}%
                </span>
              </div>

              {/* Agent 2 */}
              <div className="bg-slate-950/80 border border-cyan-900/50 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      Agent 2: Architect
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {analysisData?.agentLogs?.find(
                      (l) => l.agentName === "Curriculum Architect Agent"
                    )?.thought ||
                      "Builds structured, week-by-week personalized learning sequences with real projects."}
                  </p>
                </div>
                <span className="text-[9px] uppercase font-mono text-cyan-400/80 mt-2 font-semibold">
                  Curriculum Generated
                </span>
              </div>

              {/* Agent 3 */}
              <div className="bg-slate-950/80 border border-emerald-900/50 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      Agent 3: Examiner
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {analysisData?.agentLogs?.find(
                      (l) => l.agentName === "Assessment Examiner Agent"
                    )?.thought ||
                      "Generates 3-question diagnostic quiz targeting exact identified missing skills."}
                  </p>
                </div>
                <span className="text-[9px] uppercase font-mono text-emerald-400/80 mt-2 font-semibold">
                  Diagnostic Ready
                </span>
              </div>

              {/* Agent 4 */}
              <div className="bg-slate-950/80 border border-amber-900/60 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[8px] font-bold rounded-bl uppercase">
                  Adaptive Hook
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                      Agent 4: Adaptive Mentor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {analysisData?.agentLogs?.find(
                      (l) => l.agentName === "Adaptive Mentor Agent"
                    )?.thought ||
                      "Monitors quiz performance & career switches; triggers visible remediation alerts."}
                  </p>
                </div>
                <span className="text-[9px] uppercase font-mono text-amber-400/90 mt-2 font-semibold flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5" />
                  Auto-Recovery Guard
                </span>
              </div>
            </div>

            {/* Glowing Agent Collaboration Alert Banner (Adaptive Failure Loop) */}
            {adaptationAlert && (
              <div className="mt-3 p-3 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs flex items-start gap-2.5 shadow-lg shadow-amber-950/50 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    DYNAMIC AGENT COLLABORATION ALERT
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-200/90">
                    {adaptationAlert}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("readiness")}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "readiness"
                  ? "bg-slate-900 border-t border-x border-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Skill Gap & Readiness</span>
            </button>

            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "roadmap"
                  ? "bg-slate-900 border-t border-x border-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Adaptive Roadmap</span>
              {analysisData?.roadmap.some((r) => r.isRemedial) && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full">
                  Remedial Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "quiz"
                  ? "bg-slate-900 border-t border-x border-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Skill Assessment (Triggers Adaptation)</span>
            </button>

            <button
              onClick={() => setActiveTab("mentor")}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "mentor"
                  ? "bg-slate-900 border-t border-x border-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mentor</span>
            </button>
          </div>

          {/* TAB 1: Skill Gap & Readiness */}
          {activeTab === "readiness" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Readiness Score Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                      Audit Synthesis &bull; Agent 1 Evaluator
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {name}&apos;s Job Readiness for {targetRole === "Custom" ? customRole : targetRole}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    Based on algorithmic evaluation against live industry requirements, your existing
                    foundation covers baseline data processing, while production full-stack engineering requires
                    reactive component state and event-driven runtime mechanics.
                  </p>

                  <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-300">
                    <span className="font-semibold text-indigo-400 block mb-1">
                      Strategic Mentor Advice (Agent 4):
                    </span>
                    <p className="text-slate-400 italic">
                      &ldquo;{analysisData?.mentorAdvice || "Analyzing profile trajectory..."}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner min-w-[160px]">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 44}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          44 *
                          (1 - (analysisData?.readinessScore || 45) / 100)
                        }
                        strokeLinecap="round"
                        className="text-cyan-400 transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-100">
                        {analysisData?.readinessScore || 45}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        Readiness
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    {analysisData?.readinessScore && analysisData.readinessScore > 70
                      ? "Advanced Ready"
                      : analysisData?.readinessScore && analysisData.readinessScore > 40
                      ? "Mid-Stage Candidate"
                      : "Foundation Building"}
                  </span>
                </div>
              </div>

              {/* HIGH-IMPACT FEATURE: Visual Skill Gap Comparison Bar Chart (Pure Tailwind CSS) */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Domain Skill Gap & Target Benchmark Analysis
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Empirical evaluation of Current Skill Mastery vs. Target Role Benchmark
                    </p>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-gradient-to-r from-cyan-500 to-indigo-500"></span>
                      <span className="text-slate-300">Candidate Mastery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-slate-700 border border-indigo-400/80"></span>
                      <span className="text-slate-400">Target Role Req</span>
                    </div>
                  </div>
                </div>

                {/* Bars Grid */}
                <div className="space-y-4">
                  {domainComparisonList.map((item) => {
                    const domainIcons: Record<string, React.ReactNode> = {
                      Frontend: <Monitor className="w-3.5 h-3.5 text-cyan-400" />,
                      Backend: <Server className="w-3.5 h-3.5 text-indigo-400" />,
                      Database: <Database className="w-3.5 h-3.5 text-emerald-400" />,
                      "Cloud/DevOps": <Cloud className="w-3.5 h-3.5 text-purple-400" />,
                      "AI/System Design": <Cpu className="w-3.5 h-3.5 text-amber-400" />,
                    };

                    const diff = item.requiredScore - item.currentScore;

                    return (
                      <div
                        key={item.domain}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              {domainIcons[item.domain] || <Target className="w-3.5 h-3.5 text-cyan-400" />}
                            </div>
                            <span className="text-xs font-bold text-slate-200">
                              {item.domain}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                                item.gapStatus === "Strong Match"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : item.gapStatus === "Moderate Gap"
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : "bg-rose-950 text-rose-300 border border-rose-800"
                              }`}
                            >
                              {item.gapStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="text-cyan-400 font-bold">
                              Current: {item.currentScore}%
                            </span>
                            <span className="text-slate-500">/</span>
                            <span className="text-indigo-300">
                              Req: {item.requiredScore}%
                            </span>
                            <span
                              className={`text-[11px] font-bold ${
                                diff <= 0 ? "text-emerald-400" : "text-amber-400"
                              }`}
                            >
                              {diff <= 0 ? `+${Math.abs(diff)}% Met` : `-${diff}% Gap`}
                            </span>
                          </div>
                        </div>

                        {/* Visual Dual Progress Track */}
                        <div className="relative w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          {/* Target Role Requirement Mark Background */}
                          <div
                            className="absolute top-0 bottom-0 bg-slate-800/80 border-r-2 border-indigo-400"
                            style={{ width: `${item.requiredScore}%` }}
                            title={`Target Requirement: ${item.requiredScore}%`}
                          />
                          {/* Current Candidate Mastery Bar */}
                          <div
                            className={`h-full transition-all duration-700 rounded-full relative z-10 ${
                              item.gapStatus === "Strong Match"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                : item.gapStatus === "Moderate Gap"
                                ? "bg-gradient-to-r from-cyan-500 to-indigo-500"
                                : "bg-gradient-to-r from-rose-500 to-amber-500"
                            }`}
                            style={{ width: `${item.currentScore}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>
                            Key Focus:{" "}
                            <strong className="text-slate-400 font-medium">
                              {item.keyMissing}
                            </strong>
                          </span>
                          <span className="text-[10px] font-mono text-slate-600">
                            Scale: 0 &rarr; 100%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matched vs Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Matched Skills */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-200">
                      Validated Strengths & Matched Skills
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Skills verified from your profile that directly transfer to {targetRole}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisData?.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {skill}
                      </span>
                    ))}
                    {(!analysisData?.matchedSkills || analysisData.matchedSkills.length === 0) && (
                      <span className="text-xs text-slate-500">
                        No directly matched skills identified.
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-slate-200">
                      Identified Skill Deficits & Priorities
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {analysisData?.missingSkills.map((item) => (
                      <div
                        key={item.skill}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">
                            {item.skill}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              item.priority === "High"
                                ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                                : item.priority === "Medium"
                                ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                                : "bg-blue-950 text-blue-300 border border-blue-800/60"
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Adaptive Roadmap */}
          {activeTab === "roadmap" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Personalized Phased Learning Roadmap
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Architected by Agent 2 &bull; Check off completed modules to synchronize progress.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">
                    Overall Completion
                  </span>
                  <div className="text-sm font-bold font-mono text-cyan-400">
                    {progressPercent}%
                  </div>
                </div>
              </div>

              {/* Roadmap Phases */}
              <div className="space-y-4">
                {analysisData?.roadmap.map((phase, pIdx) => (
                  <div
                    key={phase.phase}
                    className={`rounded-2xl border p-5 transition ${
                      phase.isRemedial
                        ? "bg-amber-950/20 border-amber-500/70 shadow-lg shadow-amber-950/30"
                        : "bg-slate-900/70 border-slate-800 shadow-xl"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            phase.isRemedial
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "bg-slate-800 text-cyan-400"
                          }`}
                        >
                          {pIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                            {phase.phase}
                            {phase.isRemedial && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] uppercase font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                Remedial Module Injected
                              </span>
                            )}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Focus Skill:{" "}
                            <strong className="text-slate-300">
                              {phase.focusSkill}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                        {phase.duration}
                      </span>
                    </div>

                    {/* Resources List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.resources.map((res, rIdx) => {
                        const itemKey = `${phase.phase}_${rIdx}`;
                        const isDone = Boolean(completedItems[itemKey]);

                        return (
                          <div
                            key={res.title}
                            onClick={() => toggleItemCompletion(itemKey)}
                            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                              isDone
                                ? "bg-slate-950/50 border-emerald-800/50 opacity-80"
                                : phase.isRemedial
                                ? "bg-amber-950/40 border-amber-800/50 hover:border-amber-500"
                                : "bg-slate-950 border-slate-800 hover:border-cyan-500/60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer accent-cyan-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-xs font-semibold ${
                                    isDone
                                      ? "line-through text-slate-500"
                                      : "text-slate-200"
                                  }`}
                                >
                                  {res.title}
                                </span>
                                <span
                                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    res.type === "Hands-on Project"
                                      ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60"
                                      : res.type === "Course"
                                      ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                                      : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                                  }`}
                                >
                                  {res.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {res.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Skill Assessment (Triggers Adaptation) */}
          {activeTab === "quiz" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Instant Diagnostic Assessment (Examiner Agent 3)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Targeting your identified missing skills:{" "}
                      {analysisData?.missingSkills.map((m) => m.skill).join(", ")}.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Threshold: 60% Passing
                  </span>
                </div>

                {/* Questions */}
                <div className="space-y-4 mt-4">
                  {analysisData?.diagnosticQuiz.map((q, idx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isChosen = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-slate-400">
                            Question {idx + 1} &bull; {q.skill}
                          </span>
                          {quizSubmitted && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isCorrect
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-rose-950 text-rose-300 border border-rose-800"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-200 mb-3">
                          {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            let btnStyle =
                              "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700";

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle =
                                  "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle =
                                  "bg-rose-950/70 border-rose-500 text-rose-200";
                              }
                            } else if (isSelected) {
                              btnStyle =
                                "bg-cyan-950/70 border-cyan-500 text-cyan-200 font-medium";
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setQuizAnswers({
                                    ...quizAnswers,
                                    [q.id]: optIdx,
                                  })
                                }
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300 block mb-0.5">
                              Diagnostic Explanation:
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Controls */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={
                        Object.keys(quizAnswers).length <
                        (analysisData?.diagnosticQuiz.length || 3)
                      }
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 disabled:opacity-40 transition cursor-pointer"
                    >
                      Submit Diagnostic Quiz
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-slate-400">Diagnostic Result: </span>
                        <strong
                          className={`font-mono text-sm ${
                            quizScore && quizScore.correct / quizScore.total >= 0.6
                              ? "text-emerald-400"
                              : "text-rose-400 font-bold"
                          }`}
                        >
                          {quizScore?.correct}/{quizScore?.total} Correct (
                          {quizScore
                            ? Math.round(
                                (quizScore.correct / quizScore.total) * 100
                              )
                            : 0}
                          %)
                        </strong>
                      </div>

                      {/* The Crucial Adaptive Hook Button */}
                      {quizScore && quizScore.correct / quizScore.total < 0.6 ? (
                        <button
                          onClick={handleAutoAdaptRoadmap}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer animate-bounce"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>
                            Auto-Adapt Roadmap with Mentor Agent (Inject Remedial Modules)
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Passing Score Met! You are ready to proceed with Phase 1.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Mentor */}
          {activeTab === "mentor" && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between min-h-[450px] animate-in fade-in duration-300">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">
                        Adaptive Mentor Agent Console
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Dynamic pacing, career pivot routing & technical consultation
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                    Live Session Active
                  </span>
                </div>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() =>
                      handleSendChatMessage("Pivot to AI Engineer")
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Pivot to AI Engineer
                  </button>
                  <button
                    onClick={() =>
                      handleSendChatMessage(
                        "I'm struggling with React component lifecycle and closures."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-amber-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    I&apos;m struggling with React
                  </button>
                  <button
                    onClick={() =>
                      handleSendChatMessage(
                        "Explain how JavaScript Event Loop handles Promises vs setTimeout."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    Explain Event Loop
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {chatMessages.length === 0 && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
                      👋 Hello {name}! I am your Adaptive Mentor Agent. I monitor your diagnostic test
                      scores, evaluate your project milestones, and coordinate directly with the Curriculum
                      Architect Agent. If you hit a road-block or want to pivot roles, let me know!
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
                            ? "bg-cyan-600 text-slate-950 font-medium"
                            : "bg-slate-950 border border-slate-800 text-slate-200"
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.adjustment && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            System Adjustment: {msg.adjustment}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                      <span>Mentor Agent synthesizing advice...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  placeholder="Ask a technical question, report a difficulty, or request a career pivot..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 outline-none text-xs transition"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-3 text-center text-slate-600 text-[11px] font-mono">
        PathForge AI &bull; Multi-Agent Adaptive Career Engine &bull; Powered by Google Gemini &amp; Antigravity
      </footer>
    </div>
  );
}
