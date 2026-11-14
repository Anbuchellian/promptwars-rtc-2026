"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Award,
  Bot,
  FileText,
  Layers,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import RoleplaySimulatorModal from "./components/RoleplaySimulatorModal";
import ProfileSidebar from "./components/ProfileSidebar";
import OrchestrationBar from "./components/OrchestrationBar";
import ReadinessTab from "./components/ReadinessTab";
import RoadmapTab from "./components/RoadmapTab";
import RoleplayTab from "./components/RoleplayTab";
import QuizTab from "./components/QuizTab";
import MentorTab from "./components/MentorTab";
import GoalsTab from "./components/GoalsTab";
import ResumeTab from "./components/ResumeTab";
import { DEFAULT_STARTER_GOALS, STUDENT_PRESETS } from "@/lib/skills-data";
import {
  isSafeImageDataUrl,
  parseStoredCompletedItems,
  parseStoredGoals,
  validateImageFile,
} from "@/lib/validation";
import type {
  AnalysisData,
  CareerGoal,
  ChatMessage,
  DomainComparison,
  ResumeLayout,
  RoleplayTurn,
  StudentPresetId,
  SupportedLanguage,
  TabId,
} from "@/lib/types";

const TABS: { id: TabId; label: string }[] = [
  { id: "readiness", label: "Skill Gap" },
  { id: "roadmap", label: "Roadmap" },
  { id: "simulation", label: "Roleplay" },
  { id: "quiz", label: "Assessment" },
  { id: "mentor", label: "AI Mentor" },
  { id: "goals", label: "Goals" },
  { id: "resume", label: "Resume" },
];

const TOP_NAV_LINKS: { id: TabId; label: string }[] = [
  { id: "readiness", label: "Skill Gap" },
  { id: "roadmap", label: "Roadmap" },
  { id: "quiz", label: "Assessment" },
  { id: "resume", label: "Resume" },
];

const FALLBACK_DOMAIN_COMPARISON: DomainComparison[] = [
  {
    domain: "Domain Fundamentals & Theory",
    currentScore: 45,
    requiredScore: 85,
    gapStatus: "Critical Gap",
    keyMissing: "Specialized Principles & Industry Standards",
  },
  {
    domain: "Applied Tools & Methodologies",
    currentScore: 50,
    requiredScore: 80,
    gapStatus: "Moderate Gap",
    keyMissing: "Advanced Instrumentation & Execution",
  },
  {
    domain: "Quality Assurance & Compliance",
    currentScore: 75,
    requiredScore: 80,
    gapStatus: "Strong Match",
    keyMissing: "Standard Operating Procedures (SOP)",
  },
  {
    domain: "System Design & Optimization",
    currentScore: 40,
    requiredScore: 75,
    gapStatus: "Moderate Gap",
    keyMissing: "Scalable Architecture & Risk Mitigation",
  },
  {
    domain: "Professional Capstone Synthesis",
    currentScore: 35,
    requiredScore: 70,
    gapStatus: "Moderate Gap",
    keyMissing: "End-to-End Enterprise Deliverable",
  },
];

const DEFAULT_PRESET = STUDENT_PRESETS[0];

export default function ThiranVazhiApp() {
  // Learner Profile State (initialized to Record 1: Karthik Sundaram)
  const [activePresetId, setActivePresetId] = useState<StudentPresetId | null>(
    DEFAULT_PRESET.id
  );
  const [name, setName] = useState(DEFAULT_PRESET.name);
  const [skillsList, setSkillsList] = useState<string[]>(DEFAULT_PRESET.skills);
  const [projects, setProjects] = useState(DEFAULT_PRESET.projects);
  const [certifications, setCertifications] = useState(
    DEFAULT_PRESET.certifications
  );
  const [targetRole, setTargetRole] = useState(DEFAULT_PRESET.targetRole);
  const [preferredLanguage, setPreferredLanguage] =
    useState<SupportedLanguage>("English");

  // Resume / Bio Auto-Import State
  const [resumeText, setResumeText] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);

  // Roleplay Simulator Modal State
  const [simState, setSimState] = useState<{ open: boolean; skill: string }>({
    open: false,
    skill: "",
  });

  // System & Tabs State
  const [activeTab, setActiveTab] = useState<TabId>("readiness");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    readiness: null,
    roadmap: null,
    simulation: null,
    quiz: null,
    mentor: null,
    goals: null,
    resume: null,
  });

  // Live Status Announcement for screen readers & subtle feedback
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  // Inline Roleplay Simulator Agent State
  const [roleplayData, setRoleplayData] = useState<RoleplayTurn | null>(null);
  const [roleplayHistory, setRoleplayHistory] = useState<RoleplayTurn[]>([]);
  const [roleplayInput, setRoleplayInput] = useState("");
  const [isRoleplayLoading, setIsRoleplayLoading] = useState(false);
  const [roleplayError, setRoleplayError] = useState<string | null>(null);

  // Goals State (seeded with starter goals on first visit)
  const [goals, setGoals] = useState<CareerGoal[]>(DEFAULT_STARTER_GOALS);

  // Resume Builder State
  const [resumeLayout, setResumeLayout] = useState<ResumeLayout>("executive");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [resumeHeadline, setResumeHeadline] = useState(
    "Full Stack Engineer & Continuous Systems Learner"
  );

  // Pipeline Analysis State
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [adaptationAlert, setAdaptationAlert] = useState<string | null>(null);

  // Progress Bar / Checked Roadmap Items State
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

  // Load saved progress and goals from localStorage with runtime validation
  useEffect(() => {
    try {
      setCompletedItems(
        parseStoredCompletedItems(
          localStorage.getItem("pathforge_completed_modules")
        )
      );
      const rawGoals = localStorage.getItem("pathforge_goals");
      if (rawGoals !== null) {
        setGoals(parseStoredGoals(rawGoals));
      } else {
        setGoals(DEFAULT_STARTER_GOALS);
        localStorage.setItem(
          "pathforge_goals",
          JSON.stringify(DEFAULT_STARTER_GOALS)
        );
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
  }, []);

  const persistGoals = (updated: CareerGoal[]) => {
    setGoals(updated);
    try {
      localStorage.setItem("pathforge_goals", JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  };

  const toggleItemCompletion = (key: string) => {
    const updated = { ...completedItems, [key]: !completedItems[key] };
    setCompletedItems(updated);
    try {
      localStorage.setItem(
        "pathforge_completed_modules",
        JSON.stringify(updated)
      );
    } catch {
      // Ignore storage quota errors
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.ok) {
      setPhotoUploadError(validation.error);
      e.target.value = "";
      return;
    }

    setPhotoUploadError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (isSafeImageDataUrl(result)) {
        setProfilePhoto(result);
      } else {
        setPhotoUploadError(
          "Uploaded file could not be verified as a safe PNG, JPEG, or WebP image."
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Inline Roleplay Simulator Handlers
  const startOrContinueRoleplay = async (customDecision?: string) => {
    setIsRoleplayLoading(true);
    setRoleplayError(null);
    const decisionToSend = customDecision || roleplayInput;
    const nextTurn = roleplayData ? roleplayData.turnNumber + 1 : 1;
    const focusSkill =
      analysisData?.missingSkills?.[0]?.skill || "Core Domain Standards";

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "roleplay_simulation",
          targetRole,
          focusSkill,
          turnNumber: nextTurn,
          scenarioHistory: roleplayHistory,
          userResponse: decisionToSend,
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Roleplay agent response failed");
      }

      if (decisionToSend && roleplayData) {
        setRoleplayHistory((prev) => [
          ...prev,
          { ...roleplayData, userResponse: decisionToSend },
        ]);
      }
      setRoleplayData(data);
      setRoleplayInput("");
    } catch (err) {
      setRoleplayError(
        err instanceof Error
          ? err.message
          : "Unable to run roleplay turn. Please try again."
      );
    } finally {
      setIsRoleplayLoading(false);
    }
  };

  const handleResetRoleplay = () => {
    setRoleplayData(null);
    setRoleplayHistory([]);
    setRoleplayInput("");
    setRoleplayError(null);
    window.setTimeout(() => {
      startOrContinueRoleplay("");
    }, 50);
  };

  // Goal CRUD Handlers
  const handleAddGoal = (newGoal: {
    title: string;
    type: "short" | "long";
    deadline: string;
    area: string;
  }) => {
    const goal: CareerGoal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: newGoal.title,
      type: newGoal.type,
      deadline: newGoal.deadline,
      area: newGoal.area,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persistGoals([...goals, goal]);
    setLiveAnnouncement(`Added milestone: ${newGoal.title}`);
  };

  const handleAddGoalFromSkill = (
    skill: string,
    priority: "High" | "Medium" | "Low"
  ) => {
    const goalTitle = `Master & verify ${skill} through applied project deliverables`;
    const alreadyExists = goals.some(
      (g) => g.area.toLowerCase() === skill.toLowerCase()
    );
    if (alreadyExists) {
      setActiveTab("goals");
      setLiveAnnouncement(`Viewing existing goal for ${skill}.`);
      return;
    }

    handleAddGoal({
      title: goalTitle,
      type: priority === "High" ? "short" : "long",
      deadline: "",
      area: skill,
    });
    setLiveAnnouncement(`Added ${skill} goal to Goals tracker.`);
  };

  const handleToggleGoal = (id: string) => {
    persistGoals(
      goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    persistGoals(goals.filter((g) => g.id !== id));
  };

  // Run Multi-Agent Analysis
  const runAgentPipeline = async (
    adaptationContext?: string,
    explicitProfile?: {
      name?: string;
      skills?: string[];
      projects?: string;
      certifications?: string;
      targetRole?: string;
      preferredLanguage?: SupportedLanguage;
    }
  ) => {
    setIsLoading(true);
    setPipelineError(null);

    if (adaptationContext) {
      setAdaptationAlert(
        "Adaptive Intervention Active: Adaptive Mentor triggered a priority event and Curriculum Architect is injecting remedial modules."
      );
    } else {
      setAdaptationAlert(null);
    }

    const activeName = explicitProfile?.name ?? name;
    const activeRole = explicitProfile?.targetRole ?? targetRole;

    const payload = {
      action: "analyze_and_plan",
      name: activeName,
      currentSkills: explicitProfile?.skills ?? skillsList,
      projects: explicitProfile?.projects ?? projects,
      certifications: explicitProfile?.certifications ?? certifications,
      targetRole: activeRole,
      preferredLanguage:
        explicitProfile?.preferredLanguage ?? preferredLanguage,
      adaptationContext,
    };

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Server returned ${res.status}`);
      }

      setAnalysisData(data as AnalysisData);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setLiveAnnouncement(
        `Completed skill gap audit for ${activeName} targeting ${activeRole}.`
      );

      if (adaptationContext) {
        setActiveTab("roadmap");
      }
    } catch (err) {
      setPipelineError(
        err instanceof Error
          ? err.message
          : "Unable to complete multi-agent analysis. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on first load
  useEffect(() => {
    if (!analysisData) {
      runAgentPipeline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadPreset = (presetNumber: StudentPresetId) => {
    const preset = STUDENT_PRESETS.find((p) => p.id === presetNumber);
    if (!preset) return;

    setActivePresetId(preset.id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setAdaptationAlert(null);
    setParseSuccessMsg(null);
    setRoleplayData(null);
    setRoleplayHistory([]);

    setName(preset.name);
    setTargetRole(preset.targetRole);
    setSkillsList(preset.skills);
    setProjects(preset.projects);
    setCertifications(preset.certifications);
    setResumeHeadline(
      `${preset.targetRole} Candidate · ${preset.metaSummary}`
    );

    runAgentPipeline(undefined, {
      name: preset.name,
      skills: preset.skills,
      projects: preset.projects,
      certifications: preset.certifications,
      targetRole: preset.targetRole,
    });
  };

  const handleResetProfile = () => {
    handleLoadPreset(DEFAULT_PRESET.id);
    setPreferredLanguage("English");
    setLiveAnnouncement("Reset learner profile to default candidate record.");
  };

  const handleToggleSkill = (skillName: string) => {
    setActivePresetId(null);
    setSkillsList((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  const handleAddSkill = (skillName: string) => {
    setActivePresetId(null);
    if (!skillsList.includes(skillName)) {
      setSkillsList((prev) => [...prev, skillName]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setActivePresetId(null);
    setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
  };

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

      const parsed = await res.json();
      if (!res.ok) {
        throw new Error(parsed?.error || "Failed to parse resume");
      }

      const nextName = parsed.name || name;
      const nextSkills =
        Array.isArray(parsed.currentSkills) && parsed.currentSkills.length > 0
          ? parsed.currentSkills
          : skillsList;
      const nextProjects = parsed.projects || projects;
      const nextCerts = parsed.certifications || certifications;
      const nextRole = parsed.suggestedTargetRole || targetRole;

      setActivePresetId(null);
      setName(nextName);
      setSkillsList(nextSkills);
      setProjects(nextProjects);
      setCertifications(nextCerts);
      setTargetRole(nextRole);

      setParseSuccessMsg(
        `Extracted ${parsed.currentSkills?.length || 0} skills and candidate profile.`
      );

      runAgentPipeline(undefined, {
        name: nextName,
        skills: nextSkills,
        projects: nextProjects,
        certifications: nextCerts,
        targetRole: nextRole,
      });
    } catch (err) {
      setParseSuccessMsg(
        err instanceof Error
          ? err.message
          : "Could not extract skills. Try pasting again."
      );
    } finally {
      setIsParsingResume(false);
    }
  };

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

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setLiveAnnouncement("Diagnostic quiz reset for retake.");
  };

  const handleAutoAdaptRoadmap = () => {
    const failedQuestions =
      analysisData?.diagnosticQuiz.filter(
        (q) => quizAnswers[q.id] !== q.correctIndex
      ) || [];

    const failedSkills = failedQuestions.map((q) => q.skill).join(", ");
    const adaptationContext = `Student scored ${quizScore?.correct}/${quizScore?.total} on diagnostic quiz. Identified acute conceptual struggle with: ${
      failedSkills || "Core Foundations"
    }. Immediate remedial intervention requested.`;

    runAgentPipeline(adaptationContext);
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = (presetText || chatInput).trim();
    if (!textToSend) return;

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
          currentProfile: { name, skillsList, targetRole },
          readinessScore: analysisData?.readinessScore || 45,
          missingSkills: analysisData?.missingSkills || [],
          completedModules: Object.keys(completedItems).filter(
            (k) => completedItems[k]
          ),
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to reach Mentor Agent");
      }

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

      if (textToSend.toLowerCase().includes("pivot to ai engineer")) {
        setActivePresetId(null);
        setTargetRole("AI/ML Engineer");
        runAgentPipeline("Learner requested career pivot to AI/ML Engineer.", {
          targetRole: "AI/ML Engineer",
        });
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "mentor",
          text:
            err instanceof Error
              ? err.message
              : "Temporary issue contacting Mentor Agent. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTabSelection = (tabId: TabId) => {
    setActiveTab(tabId);
    if (tabId === "simulation" && !roleplayData && !isRoleplayLoading) {
      startOrContinueRoleplay("");
    }
  };

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = TABS[nextIndex];
      handleTabSelection(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  const totalResources =
    analysisData?.roadmap.reduce((acc, p) => acc + p.resources.length, 0) || 0;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent =
    totalResources > 0
      ? Math.round((completedCount / totalResources) * 100)
      : 0;

  const domainComparisonList = useMemo<DomainComparison[]>(
    () =>
      analysisData?.domainComparison &&
      analysisData.domainComparison.length > 0
        ? analysisData.domainComparison
        : FALLBACK_DOMAIN_COMPARISON,
    [analysisData]
  );

  const openGoalsCount = goals.filter((g) => !g.completed).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#6D1A36] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Live region for polite status updates */}
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* Top Navbar: 3-Zone Header Contract */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-lg bg-[#6D1A36] p-1.5 flex items-center justify-center shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt=""
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-base font-heading font-bold tracking-tight text-[#6D1A36] whitespace-nowrap">
                THIRAN VAZHI
              </h1>
              <p className="text-xs text-slate-600 hidden sm:block whitespace-nowrap">
                Multi-Agent Career Intelligence
              </p>
            </div>
          </div>

          {/* Zone 2: 4 Single-Line Workspace Links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-6"
          >
            {TOP_NAV_LINKS.map((item) => {
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelection(item.id)}
                  className={`min-h-[40px] px-2 text-xs font-heading font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isCurrent
                      ? "border-[#6D1A36] text-[#6D1A36]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => runAgentPipeline()}
              disabled={isLoading}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-50 text-white text-xs font-heading font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            >
              {isLoading ? (
                <>
                  <RefreshCw
                    className="w-3.5 h-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Running Audit...</span>
                </>
              ) : (
                <span>Run Audit &amp; Plan</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 lg:p-6 gap-6">
        <ProfileSidebar
          name={name}
          onNameChange={(val) => {
            setActivePresetId(null);
            setName(val);
          }}
          targetRole={targetRole}
          onTargetRoleChange={(val) => {
            setActivePresetId(null);
            setTargetRole(val);
          }}
          preferredLanguage={preferredLanguage}
          onPreferredLanguageChange={setPreferredLanguage}
          skillsList={skillsList}
          onToggleSkill={handleToggleSkill}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          projects={projects}
          onProjectsChange={(val) => {
            setActivePresetId(null);
            setProjects(val);
          }}
          certifications={certifications}
          onCertificationsChange={(val) => {
            setActivePresetId(null);
            setCertifications(val);
          }}
          resumeText={resumeText}
          onResumeTextChange={setResumeText}
          isParsingResume={isParsingResume}
          parseSuccessMsg={parseSuccessMsg}
          onExtractSkillsFromResume={handleExtractSkillsFromResume}
          activePresetId={activePresetId}
          onLoadPreset={handleLoadPreset}
          onResetProfile={handleResetProfile}
          onRunPipeline={() => runAgentPipeline()}
          isLoading={isLoading}
          progressPercent={progressPercent}
          completedCount={completedCount}
          totalResources={totalResources}
        />

        {/* Right Main Dashboard */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 flex flex-col gap-5 overflow-hidden focus:outline-none"
        >
          {pipelineError && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5"
            >
              <AlertTriangle
                className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <strong className="font-heading block">
                  Analysis Request Error
                </strong>
                <span>{pipelineError}</span>
              </div>
            </div>
          )}

          <OrchestrationBar
            analysisData={analysisData}
            isLoading={isLoading}
            adaptationAlert={adaptationAlert}
          />

          {/* WAI-ARIA Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Career intelligence workspace sections"
            className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto"
          >
            {TABS.map((tab, index) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleTabSelection(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                    isSelected
                      ? "bg-white border border-slate-200 text-[#6D1A36] font-bold"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab.id === "readiness" && (
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "roadmap" && (
                    <Layers className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "simulation" && (
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "quiz" && (
                    <Award className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "mentor" && (
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "goals" && (
                    <Target className="w-4 h-4" aria-hidden="true" />
                  )}
                  {tab.id === "resume" && (
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{tab.label}</span>
                  {tab.id === "roadmap" &&
                    analysisData?.roadmap.some((r) => r.isRemedial) && (
                      <span className="text-xs font-mono font-bold text-[#6D1A36]">
                        (Remedial)
                      </span>
                    )}
                  {tab.id === "goals" && openGoalsCount > 0 && (
                    <span className="text-xs font-mono font-bold text-[#0F766E] tabular-nums">
                      ({openGoalsCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="flex-1 flex flex-col"
          >
            {activeTab === "readiness" && (
              <ReadinessTab
                name={name}
                targetRole={targetRole}
                analysisData={analysisData}
                domainComparisonList={domainComparisonList}
                completedCount={completedCount}
                totalResources={totalResources}
                onAddGoalFromSkill={handleAddGoalFromSkill}
              />
            )}

            {activeTab === "roadmap" && (
              <RoadmapTab
                targetRole={targetRole}
                analysisData={analysisData}
                completedItems={completedItems}
                progressPercent={progressPercent}
                onToggleItemCompletion={toggleItemCompletion}
                onLaunchSimulator={(skill) =>
                  setSimState({ open: true, skill })
                }
              />
            )}

            {activeTab === "simulation" && (
              <RoleplayTab
                targetRole={targetRole}
                roleplayData={roleplayData}
                roleplayHistory={roleplayHistory}
                roleplayInput={roleplayInput}
                isRoleplayLoading={isRoleplayLoading}
                roleplayError={roleplayError}
                onRoleplayInputChange={setRoleplayInput}
                onContinueRoleplay={startOrContinueRoleplay}
                onResetRoleplay={handleResetRoleplay}
              />
            )}

            {activeTab === "quiz" && (
              <QuizTab
                targetRole={targetRole}
                analysisData={analysisData}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                onSelectAnswer={(qId, optIdx) =>
                  setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }))
                }
                onSubmitQuiz={handleQuizSubmit}
                onRetakeQuiz={handleRetakeQuiz}
                onAutoAdaptRoadmap={handleAutoAdaptRoadmap}
              />
            )}

            {activeTab === "mentor" && (
              <MentorTab
                name={name}
                targetRole={targetRole}
                chatMessages={chatMessages}
                chatInput={chatInput}
                isChatLoading={isChatLoading}
                onChatInputChange={setChatInput}
                onSendMessage={handleSendChatMessage}
                onClearChat={() => {
                  setChatMessages([]);
                  setLiveAnnouncement("Cleared Mentor Agent chat transcript.");
                }}
              />
            )}

            {activeTab === "goals" && (
              <GoalsTab
                targetRole={targetRole}
                goals={goals}
                missingSkills={analysisData?.missingSkills || []}
                onAddGoal={handleAddGoal}
                onToggleGoal={handleToggleGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            )}

            {activeTab === "resume" && (
              <ResumeTab
                name={name}
                targetRole={targetRole}
                skillsList={skillsList}
                projects={projects}
                certifications={certifications}
                analysisData={analysisData}
                resumeLayout={resumeLayout}
                onResumeLayoutChange={setResumeLayout}
                profilePhoto={profilePhoto}
                onRemovePhoto={() => {
                  setProfilePhoto(null);
                  setPhotoUploadError(null);
                }}
                onPhotoUpload={handlePhotoUpload}
                photoUploadError={photoUploadError}
                resumeHeadline={resumeHeadline}
                onResumeHeadlineChange={setResumeHeadline}
              />
            )}
          </div>
        </main>
      </div>

      <RoleplaySimulatorModal
        isOpen={simState.open}
        onClose={() => setSimState({ open: false, skill: "" })}
        targetRole={targetRole}
        focusSkill={
          simState.skill ||
          analysisData?.missingSkills?.[0]?.skill ||
          "Core Technical Standards"
        }
        preferredLanguage={preferredLanguage}
      />

      <footer className="border-t border-slate-200 py-3.5 text-center text-slate-600 text-xs font-mono bg-white">
        THIRAN VAZHI &middot; Universal Multi-Agent Career Engine
      </footer>
    </div>
  );
}
