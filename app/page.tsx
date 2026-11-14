"use client";

import React, { useState, useEffect, useMemo } from "react";
import RoleplaySimulatorModal from "./components/RoleplaySimulatorModal";
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
  Search,
  Briefcase,
  Plus,
  X,
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
  domain: string;
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



interface RoleplayTurn {
  turnNumber: number;
  scenarioTitle: string;
  stakeholderName: string;
  stakeholderRole: string;
  dialogue: string;
  userResponse?: string;
  competencyScore: number;
  evaluationFeedback: string;
  consequenceState: string;
  suggestedResponses?: string[];
  isComplete: boolean;
}

interface CareerGoal {
  id: string;
  title: string;
  type: "short" | "long";
  deadline: string;
  area: string;
  completed: boolean;
  createdAt: string;
}

interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
  adjustment?: string;
  timestamp: string;
}

// 150+ Universally Sorted Real-World Skills Across All Disciplines
const UNIVERSAL_SKILLS_DATABASE: string[] = [
  "Accounting",
  "Agile Methodologies",
  "Agronomy",
  "Analytical Chemistry",
  "Animal Physiology",
  "API Development",
  "Architecture (CAD)",
  "Asset Valuation",
  "Audit & Assurance",
  "AutoCAD",
  "AWS Cloud",
  "Bacterial Cell Culture",
  "Battery Chemistry",
  "Big Data Analytics",
  "Biochemistry",
  "Bioinformatics",
  "Bioinstrumentation",
  "Biomaterials Synthesis",
  "Biostatistics",
  "Budgeting & Forecasting",
  "Business Communication",
  "Business Strategy",
  "C / C++",
  "CAD/CAM Modeling",
  "Cell Biology",
  "Chemical Kinetics",
  "Chromatography",
  "Circuit Design",
  "Civil Structural Codes",
  "Clinical Data Management",
  "Clinical Trial Protocols",
  "Cloud Infrastructure",
  "Commercial Law",
  "Communication & Pitching",
  "Compliance & Auditing",
  "Computational Fluid Dynamics (CFD)",
  "Contract Negotiation",
  "Corporate Finance",
  "Critical Care Nursing",
  "Cryptography",
  "Customer Acquisition",
  "Data Analysis",
  "Database Administration",
  "DCF Valuation",
  "Deep Learning",
  "Digital Marketing",
  "Dissolution Testing",
  "Distributed Systems",
  "Docker Containers",
  "Drug Delivery Systems",
  "Econometrics",
  "Electrochemistry",
  "Embedded C",
  "Epidemiology",
  "Ethical Hacking",
  "Excel (Advanced & Modeling)",
  "FDA Regulatory Submissions",
  "Financial Accounting",
  "Financial Modeling",
  "Finite Element Analysis (FEA)",
  "Fluid Mechanics",
  "Food Chemistry",
  "Food Microbiology",
  "Forensic Analysis",
  "GAAP Compliance",
  "Gas Chromatography (GC)",
  "Gel Electrophoresis",
  "Gene Sequencing",
  "Geographic Information Systems (GIS)",
  "Good Clinical Practice (GCP)",
  "Good Laboratory Practice (GLP)",
  "Good Manufacturing Practice (GMP)",
  "Graphic Design",
  "Health Policy",
  "Histopathology",
  "HPLC (High-Performance Liquid Chromatography)",
  "HTML5 & CSS3",
  "Hydrology",
  "Immunology",
  "Intellectual Property Law",
  "Internal Controls",
  "Investment Banking Pitchbooks",
  "ISO 9001 Standards",
  "Java",
  "JavaScript (ES6+)",
  "Kubernetes",
  "Laboratory Safety",
  "Leadership & Team Mentoring",
  "Lean Six Sigma",
  "Machine Learning",
  "Mass Spectrometry (MS)",
  "Materials Characterization",
  "MATLAB",
  "Mechanical Assemblies",
  "Medical Device Design",
  "Medical Terminology",
  "Mergers & Acquisitions (M&A)",
  "Microbiology",
  "Microservices",
  "Molecular Biology",
  "Negotiation Strategy",
  "Next.js",
  "NMR Spectroscopy",
  "Node.js",
  "Noyes-Whitney Dissolution",
  "Numerical Optimization",
  "Nutritional Science",
  "Object-Oriented Programming (OOP)",
  "Organic Synthesis",
  "Patent Filing",
  "PCR & qPCR",
  "Pharmacokinetics (PK/PD)",
  "Pharmacology",
  "Photovoltaics",
  "Physical Chemistry",
  "Physical Therapy Protocols",
  "PLC Programming",
  "Polymer Chemistry",
  "Power Electronics",
  "Precision Agriculture",
  "Predictive Analytics",
  "Private Equity Analysis",
  "Product Management",
  "Program Evaluation",
  "Project Management (PMP/Agile)",
  "Public Health Administration",
  "Public Speaking",
  "Python Programming",
  "PyTorch",
  "Quality Assurance (QA)",
  "Quality Control (QC)",
  "Quantitative Finance",
  "R Programming",
  "React.js",
  "Real Estate Financial Modeling",
  "Regulatory Affairs",
  "Renewable Energy Systems",
  "Restructuring & Turnarounds",
  "Risk Assessment",
  "Robotics Kinematics",
  "Sales Strategy",
  "Scikit-Learn",
  "Scrum",
  "SEO & Content Strategy",
  "Signal Processing",
  "Six Sigma Black Belt",
  "Social Media Strategy",
  "Soil Science",
  "SolidWorks",
  "Spectroscopy",
  "SPSS",
  "SQL & Relational Databases",
  "Statistical Process Control (SPC)",
  "Statistics",
  "Strategic Management",
  "Structural Engineering",
  "Supply Chain Logistics",
  "Sustainable Agriculture",
  "System Architecture",
  "Tableau",
  "Taxation (Corporate & Individual)",
  "Technical Writing",
  "Thermodynamics",
  "Titration Assays",
  "Toxicology",
  "UI/UX Wireframing",
  "Ultrasonic Testing",
  "Unity / Unreal 3D",
  "Usability Testing",
  "User Research",
  "Valuation (Trading Comps)",
  "Vector Databases (RAG)",
  "Venture Capital Diligence",
  "Virology",
  "Water Quality Analysis",
  "Web Development",
];

// Universal Career Domains & Organized Roles
const CAREER_DOMAINS: {
  category: string;
  iconName: string;
  roles: string[];
}[] = [
  {
    category: "Engineering & Core Tech",
    iconName: "Cpu",
    roles: [
      "AI/ML Engineer",
      "Civil & Structural Engineer",
      "Embedded Systems Engineer",
      "Full Stack Developer",
      "Mechanical Design Engineer",
      "Robotics Engineer",
    ],
  },
  {
    category: "Sciences, Chemistry & Pharma",
    iconName: "Beaker",
    roles: [
      "Analytical Chemist",
      "Biotechnology Researcher",
      "Clinical Research Associate",
      "Environmental & Water Quality Scientist",
      "Materials Scientist",
      "Pharmaceutical Formulation Scientist",
    ],
  },
  {
    category: "Healthcare & Medicine",
    iconName: "Stethoscope",
    roles: [
      "Clinical Pharmacist",
      "Healthcare Data Analyst",
      "Medical Doctor / Resident",
      "Physiotherapist",
      "Public Health Specialist",
    ],
  },
  {
    category: "Business, Finance & Management",
    iconName: "Landmark",
    roles: [
      "Chartered Accountant / Financial Auditor",
      "Digital Marketing Strategist",
      "Financial Analyst",
      "HR & Talent Partner",
      "Investment Banking Analyst",
      "Product Manager",
      "Supply Chain & Operations Manager",
    ],
  },
  {
    category: "Law, Policy & Humanities",
    iconName: "Scale",
    roles: [
      "Academic Professor",
      "Corporate Lawyer",
      "Economist",
      "Intellectual Property Attorney",
      "Mass Communication & Media Producer",
      "UX/UI Product Designer",
    ],
  },
  {
    category: "Agriculture & Sustainability",
    iconName: "Leaf",
    roles: [
      "Agronomist",
      "Food Safety & Quality Officer",
      "Renewable Energy Consultant",
    ],
  },
];

export default function ThiranVazhiApp() {
  // Learner Profile State
  const [name, setName] = useState("Alex Rivera");
  const [skillsList, setSkillsList] = useState<string[]>([
    "Python",
    "SQL",
    "HTML",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [isSkillPickerOpen, setIsSkillPickerOpen] = useState(false);

  const [projects, setProjects] = useState(
    "E-commerce relational database schema, Python CLI data scraper"
  );
  const [certifications, setCertifications] = useState(
    "Python Data Analysis Certificate"
  );

  // Career Role State
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState("");

  // Resume / Bio Auto-Import State
  const [isResumeBoxOpen, setIsResumeBoxOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);

  // Roleplay Simulator Modal State
  const [simState, setSimState] = useState<{ open: boolean; skill: string }>({ open: false, skill: "" });

  // System & Tabs State
  const [activeTab, setActiveTab] = useState<
    "readiness" | "roadmap" | "quiz" | "simulation" | "mentor" | "goals" | "resume"
  >("readiness");

// Roleplay Simulator Agent State
  const [roleplayData, setRoleplayData] = useState<RoleplayTurn | null>(null);
  const [roleplayHistory, setRoleplayHistory] = useState<RoleplayTurn[]>([]);
  const [roleplayInput, setRoleplayInput] = useState("");
  const [isRoleplayLoading, setIsRoleplayLoading] = useState(false);

  // Goals State
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalType, setNewGoalType] = useState<"short" | "long">("short");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalArea, setNewGoalArea] = useState("");

  // Resume Builder State
  const [resumeLayout, setResumeLayout] = useState<"executive" | "modern" | "academic">("executive");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [resumeHeadline, setResumeHeadline] = useState("Career Professional & Lifelong Learner");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfilePhoto(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };
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

  // Filter skills by search query
  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery.trim()) {
      return UNIVERSAL_SKILLS_DATABASE.slice(0, 40);
    }
    const q = skillSearchQuery.toLowerCase();
    return UNIVERSAL_SKILLS_DATABASE.filter((s) => s.toLowerCase().includes(q));
  }, [skillSearchQuery]);

  // Filter career domains and roles by search query
  const filteredCareerDomains = useMemo(() => {
    if (!roleSearchQuery.trim()) return CAREER_DOMAINS;
    const q = roleSearchQuery.toLowerCase();
    return CAREER_DOMAINS.map((domain) => ({
      ...domain,
      roles: domain.roles.filter(
        (r) => r.toLowerCase().includes(q) || domain.category.toLowerCase().includes(q)
      ),
    })).filter((d) => d.roles.length > 0);
  }, [roleSearchQuery]);

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
    try {
      const savedGoals = localStorage.getItem("pathforge_goals");
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
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



  // Roleplay Simulator Agent Handlers
  const startOrContinueRoleplay = async (customDecision?: string) => {
    setIsRoleplayLoading(true);
    const decisionToSend = customDecision || roleplayInput;
    const nextTurn = roleplayData ? roleplayData.turnNumber + 1 : 1;
    const focusSkill = analysisData?.missingSkills?.[0]?.skill || "Core Domain Standards";

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
}),
      });

      if (!res.ok) throw new Error("Roleplay agent response failed");

      const data: RoleplayTurn = await res.json();
      if (decisionToSend && roleplayData) {
        setRoleplayHistory((prev) => [
          ...prev,
          { ...roleplayData, userResponse: decisionToSend },
        ]);
      }
      setRoleplayData(data);
      setRoleplayInput("");
    } catch (err) {
      console.error("Roleplay error:", err);
    } finally {
      setIsRoleplayLoading(false);
    }
  };

  const handleResetRoleplay = () => {
    setRoleplayData(null);
    setRoleplayHistory([]);
    setRoleplayInput("");
    setTimeout(() => {
      startOrContinueRoleplay("");
    }, 50);
  };

  // Goal CRUD Handlers
  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    const goal: CareerGoal = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      type: newGoalType,
      deadline: newGoalDeadline,
      area: newGoalArea || (analysisData?.missingSkills?.[0]?.skill || "General Competency"),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    try {
      localStorage.setItem("pathforge_goals", JSON.stringify(updated));
    } catch {}
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setNewGoalArea("");
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
    setGoals(updated);
    try {
      localStorage.setItem("pathforge_goals", JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    try {
      localStorage.setItem("pathforge_goals", JSON.stringify(updated));
    } catch {}
  };

  // Run Multi-Agent Analysis
  const runAgentPipeline = async (adaptationContext?: string, explicitRole?: string) => {
    setIsLoading(true);
    if (adaptationContext) {
      setAdaptationAlert(
        "ðŸš¨ AGENT COLLABORATION ALERT: Adaptive Intervention Protocol Active! Agent 4 (Adaptive Mentor) triggered a priority event. Agent 2 (Curriculum Architect) is injecting Remedial modules into your roadmap!"
      );
    } else {
      setAdaptationAlert(null);
    }

    const effectiveRole = explicitRole || targetRole;
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
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);

      if (adaptationContext) {
        setActiveTab("roadmap");
      }
    } catch (err) {
      console.error("Pipeline error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on first load if empty
  useEffect(() => {
    if (!analysisData) {
      runAgentPipeline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3 DIVERSE 1-CLICK SAMPLE PRESETS
  const handleLoadPreset = (presetNumber: 1 | 2 | 3) => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setAdaptationAlert(null);
    setParseSuccessMsg(null);

    if (presetNumber === 1) {
      // 1: CS Student -> Full Stack Developer
      setName("Alex Rivera");
      setTargetRole("Full Stack Developer");
      setCustomRoleInput("");
      setSkillsList(["Python", "SQL", "HTML"]);
      setProjects("E-commerce relational database schema, Python CLI web scraper");
      setCertifications("Python Data Fundamentals");
      setTimeout(() => {
        runAgentPipeline(undefined, "Full Stack Developer");
      }, 50);
    } else if (presetNumber === 2) {
      // 2: Chemistry Grad -> Pharma Formulation Scientist
      setName("Dr. Elena Vance");
      setTargetRole("Pharmaceutical Formulation Scientist");
      setCustomRoleInput("");
      setSkillsList(["Organic Chemistry", "Titration", "HPLC Basics"]);
      setProjects("Synthesis of ester compounds, Spectrophotometry & titration assays");
      setCertifications("GLP Laboratory Safety & Good Manufacturing Practices");
      setTimeout(() => {
        runAgentPipeline(undefined, "Pharmaceutical Formulation Scientist");
      }, 50);
    } else if (presetNumber === 3) {
      // 3: Commerce Grad -> Financial Analyst
      setName("Marcus Sterling");
      setTargetRole("Financial Analyst");
      setCustomRoleInput("");
      setSkillsList(["Excel", "Accounting", "Business Communication"]);
      setProjects("3-statement financial modeling, DCF company valuation, variance analysis");
      setCertifications("Financial Modeling & Valuation Analyst (FMVA)");
      setTimeout(() => {
        runAgentPipeline(undefined, "Financial Analyst");
      }, 50);
    }
  };

  // Select Career Role from Universal Picker
  const handleSelectRole = (role: string) => {
    setTargetRole(role);
    setCustomRoleInput("");
    setIsRolePickerOpen(false);
  };

  const handleApplyCustomRole = () => {
    if (customRoleInput.trim()) {
      const formatted = customRoleInput.trim();
      setTargetRole(formatted);
      setIsRolePickerOpen(false);
    }
  };

  // Skills Handling
  const handleToggleSkillFromList = (skillName: string) => {
    if (skillsList.includes(skillName)) {
      setSkillsList(skillsList.filter((s) => s !== skillName));
    } else {
      setSkillsList([...skillsList, skillName]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
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
        setTargetRole(parsed.suggestedTargetRole);
      }

      setParseSuccessMsg(
        `âœ“ Extracted: ${parsed.currentSkills?.length || 0} skills & candidate profile!`
      );

      setTimeout(() => {
        runAgentPipeline(undefined, parsed.suggestedTargetRole || targetRole);
      }, 100);
    } catch (err) {
      console.error("Parse error:", err);
      setParseSuccessMsg("âš ï¸ Could not extract skills. Try pasting again.");
    } finally {
      setIsParsingResume(false);
    }
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
            targetRole,
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

      if (textToSend.toLowerCase().includes("pivot to ai engineer")) {
        setTargetRole("AI/ML Engineer");
        runAgentPipeline("Learner requested career pivot to AI/ML Engineer.", "AI/ML Engineer");
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar: Clean White Executive Header */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-4 lg:px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6D1A36] p-1.5 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="THIRAN VAZHI"
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-heading font-bold tracking-tight text-[#6D1A36]">
                THIRAN VAZHI
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
                UNIVERSAL ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Powered by Gemini 2.5 Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full bg-[#0D9488]/[0.08] border border-[#0D9488]/20 text-[#0D9488] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse"></span>
            <span>✦ Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl w-full mx-auto p-4 lg:p-6 gap-6">
        {/* Left Sidebar: Profile, Universal Role Picker & Skills Search */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
          {/* 3 Diverse 1-Click Sample Presets */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block mb-3">
              1-CLICK STUDENT PRESETS
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset(1)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0D9488]/[0.05] border border-slate-200 hover:border-[#0D9488]/30 transition text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">💻</span>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">CS Student</span>
                    <span className="text-slate-500 text-[10px]">→ Full Stack Developer</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-md border border-[#0D9488]/20">Python/SQL</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(2)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0D9488]/[0.05] border border-slate-200 hover:border-[#0D9488]/30 transition text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🧪</span>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">Chemistry</span>
                    <span className="text-slate-500 text-[10px]">→ Pharma Scientist</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-md border border-[#0D9488]/20">HPLC/Titration</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(3)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0D9488]/[0.05] border border-slate-200 hover:border-[#0D9488]/30 transition text-xs font-medium text-slate-800 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">Commerce</span>
                    <span className="text-slate-500 text-[10px]">→ Financial Analyst</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-md border border-[#0D9488]/20">Excel/Accounting</span>
              </button>
            </div>
          </div>

          {/* Collapsible "Paste Resume or LinkedIn Bio" Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 hover:border-slate-300 transition-colors overflow-hidden">
            <button
              onClick={() => setIsResumeBoxOpen(!isResumeBoxOpen)}
              className="w-full flex items-center justify-between text-xs font-heading font-bold tracking-tight text-[#6D1A36] hover:text-[#521228] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Auto-Import from Resume / Bio
              </span>
              <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                <span>{isResumeBoxOpen ? "Collapse" : "Expand"}</span>
                {isResumeBoxOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {isResumeBoxOpen && (
              <div className="mt-3 pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in duration-200">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Paste any resume, bio, or LinkedIn summary across any discipline:
                </p>

                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text or experience across any science, engineering, business, law, or humanities role..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition resize-none placeholder:text-slate-400 font-sans"
                />

                <button
                  type="button"
                  onClick={handleExtractSkillsFromResume}
                  disabled={isParsingResume || !resumeText.trim()}
                  className="w-full py-2 px-3 rounded-xl text-xs font-heading font-bold tracking-tight bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-teal-600/20"
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
                  <p className="text-[11px] text-teal-700 font-semibold font-sans">
                    {parseSuccessMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Learner Profile Form with Universal Role & Skills Pickers */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2 text-[#6D1A36] font-heading font-bold text-sm tracking-tight">
                <Target className="w-4 h-4 text-teal-600" />
                <span>Learner Profile</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                UNIVERSAL
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Candidate Name */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition placeholder:text-slate-400 font-sans"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              {/* FEATURE 1: Universal Searchable Career Role Picker */}
              <div className="relative">
                <label className="text-slate-700 font-semibold block mb-1">
                  Target Career Role (Any Discipline)
                </label>
                <div
                  onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 hover:border-teal-600 cursor-pointer flex items-center justify-between text-slate-800 font-semibold transition"
                >
                  <span className="truncate">{targetRole}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                </div>

                {isRolePickerOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-300 rounded-xl shadow-xl z-50 p-3 max-h-80 overflow-y-auto animate-in fade-in duration-150">
                    {/* Search Role Input */}
                    <div className="relative mb-2.5">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={roleSearchQuery}
                        onChange={(e) => setRoleSearchQuery(e.target.value)}
                        placeholder="Search 30+ university & enterprise roles..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 text-slate-800 font-sans"
                      />
                    </div>

                    {/* Custom Career Role Input Box */}
                    <div className="p-2 mb-2 rounded-lg bg-teal-50 border border-teal-200">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-800 block mb-1">
                        + TYPE ANY CUSTOM CAREER IN THE WORLD:
                      </span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customRoleInput}
                          onChange={(e) => setCustomRoleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleApplyCustomRole();
                          }}
                          placeholder="e.g. Battery Electrochemist, Sports Psychologist..."
                          className="flex-1 px-2.5 py-1 text-xs rounded bg-white border border-teal-300 outline-none text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustomRole}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                        >
                          Set
                        </button>
                      </div>
                    </div>

                    {/* Categorized Domains */}
                    <div className="space-y-3">
                      {filteredCareerDomains.map((domain) => (
                        <div key={domain.category} className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block px-1">
                            {domain.category}
                          </span>
                          <div className="grid grid-cols-1 gap-1">
                            {domain.roles.map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => handleSelectRole(r)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                                  targetRole === r
                                    ? "bg-teal-100 text-teal-900 font-bold"
                                    : "hover:bg-stone-100 text-slate-700"
                                }`}
                              >
                                <span>{r}</span>
                                {targetRole === r && <Check className="w-3.5 h-3.5 text-teal-700" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FEATURE 2: Universal Searchable Existing Skills Selector (150+ Skills) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">
                    Existing Skills ({skillsList.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSkillPickerOpen(!isSkillPickerOpen)}
                    className="text-[11px] text-teal-700 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{isSkillPickerOpen ? "Hide Database" : "Browse 150+ Skills"}</span>
                    {isSkillPickerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Selected Skills Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-8 p-1.5 bg-stone-50 rounded-lg border border-stone-200">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0D9488]/[0.08] border border-[#0D9488]/20 text-[#0D9488] text-[11px] font-mono font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-teal-600 hover:text-rose-600 transition ml-0.5 cursor-pointer font-sans"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {skillsList.length === 0 && (
                    <span className="text-slate-400 text-[11px] p-0.5">
                      No skills added yet
                    </span>
                  )}
                </div>

                {/* Add Custom Skill Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Type ANY skill & press Enter"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition text-xs placeholder:text-slate-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-700 rounded-lg font-heading font-bold text-xs transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Expandable Alphabetical Skills Database Browser */}
                {isSkillPickerOpen && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 max-h-48 overflow-y-auto animate-in fade-in duration-150">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
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
                            onClick={() => handleToggleSkillFromList(sk)}
                            className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer font-sans ${
                              isSelected
                                ? "bg-teal-600 text-white border-teal-600 font-bold"
                                : "bg-white text-slate-700 border-stone-300 hover:border-teal-500 hover:text-teal-700"
                            }`}
                          >
                            {isSelected ? `âœ“ ${sk}` : `+ ${sk}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Projects & Experience */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Projects / Research / Experience
                </label>
                <textarea
                  rows={2}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition text-xs placeholder:text-slate-400 font-sans"
                  placeholder="Key projects, lab coursework, or thesis research..."
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Certifications / Degrees / Licenses
                </label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none transition placeholder:text-slate-400 font-sans"
                  placeholder="Degrees, professional licenses, or credentials..."
                />
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => runAgentPipeline()}
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-full font-heading font-bold tracking-tight text-xs bg-[#6D1A36] hover:bg-[#521228] text-white shadow-md shadow-[#6D1A36]/20 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
                    <span>Universal Agents Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>Run Multi-Agent Audit &amp; Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-heading font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                Roadmap Execution
              </span>
              <span className="text-xs font-mono font-bold text-teal-700">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] font-sans text-slate-500 mt-2">
              {completedCount} of {totalResources} hands-on modules mastered
            </p>
          </div>
        </aside>

        {/* Right Main Dashboard */}
        <main className="flex-1 flex flex-col gap-5 overflow-hidden">
          {/* Visible Multi-Agent Collaboration Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#6D1A36]" />
                <span className="text-xs font-heading font-bold text-[#6D1A36] tracking-tight uppercase">
                  Multi-Agent Live Orchestration Layer
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/[0.08] border border-[#0D9488]/20 px-2.5 py-0.5 rounded-full font-bold">
                {isLoading ? "EXECUTING PIPELINE..." : "4 AGENTS ACTIVE"}
              </span>
            </div>

            {/* 4 Agent Cards â€” Google Stepper Style */}
            <div className="space-y-2">
              {/* Agent 1: Skill Auditor */}
              <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">Skill Auditor</span>
                    <span className="text-[10px] font-mono text-[#0D9488] font-bold">READINESS: {analysisData?.readinessScore ?? "--"}%</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-500 leading-relaxed line-clamp-2">
                    {analysisData?.agentLogs?.find((l) => l.agentName === "Skill Auditor Agent")?.thought ||
                      "Audits input skills against industry job descriptions; assigns empirical Readiness Score."}
                  </p>
                </div>
              </div>
              {/* Agent 2: Curriculum Architect */}
              <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
                <BookOpen className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">Curriculum Architect</span>
                    <span className="text-[10px] font-mono text-[#0D9488] font-bold">CURRICULUM READY</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-500 leading-relaxed line-clamp-2">
                    {analysisData?.agentLogs?.find((l) => l.agentName === "Curriculum Architect Agent")?.thought ||
                      "Builds structured, week-by-week personalized learning sequences with real projects."}
                  </p>
                </div>
              </div>
              {/* Agent 3: Assessment Examiner */}
              <div className="border-l-2 border-[#0D9488] bg-[#0D9488]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#0D9488]/[0.06] transition-colors">
                <Award className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-800">Assessment Examiner</span>
                    <span className="text-[10px] font-mono text-[#0D9488] font-bold">DIAGNOSTIC ACTIVE</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-500 leading-relaxed line-clamp-2">
                    {analysisData?.agentLogs?.find((l) => l.agentName === "Assessment Examiner Agent")?.thought ||
                      "Generates 3-question diagnostic quiz targeting exact identified missing skills."}
                  </p>
                </div>
              </div>
              {/* Agent 4: Adaptive Mentor */}
              <div className="border-l-2 border-[#6D1A36] bg-[#6D1A36]/[0.03] rounded-xl p-3.5 flex items-start gap-3 hover:bg-[#6D1A36]/[0.06] transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-[#6D1A36] text-white text-[8px] font-mono uppercase tracking-wider font-bold rounded-bl">ADAPTIVE HOOK</div>
                <Bot className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#6D1A36]">Adaptive Mentor</span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-500 leading-relaxed line-clamp-2">
                    {analysisData?.agentLogs?.find((l) => l.agentName === "Adaptive Mentor Agent")?.thought ||
                      "Monitors quiz performance & career switches; triggers visible remediation alerts."}
                  </p>
                </div>
              </div>
            </div>

            {/* Glowing Agent Collaboration Alert Banner (Adaptive Failure Loop) */}
            {adaptationAlert && (
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5 shadow-sm">
                <AlertTriangle className="w-4 h-4 text-[#6D1A36] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-0.5">
                    DYNAMIC AGENT COLLABORATION ALERT
                  </span>
                  <p className="text-[11px] font-sans leading-relaxed text-slate-700">
                    {adaptationAlert}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs â€” Pill Container Style */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl mb-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("readiness")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "readiness"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Skill Gap</span>
            </button>

            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "roadmap"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Roadmap</span>
              {analysisData?.roadmap.some((r) => r.isRemedial) && (
                <span className="px-1.5 py-0.5 bg-[#6D1A36] text-white font-mono uppercase tracking-wider font-bold text-[8px] rounded-full">
                  REMEDIAL
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("simulation");
                if (!roleplayData) {
                  startOrContinueRoleplay("");
                }
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "simulation"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Roleplay</span>
              <span className="px-1.5 py-0.5 bg-[#6D1A36] text-white font-mono uppercase tracking-wider font-bold text-[8px] rounded-full">
                NEW
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "quiz"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab("mentor")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "mentor"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mentor</span>
            </button>

            <button
              onClick={() => setActiveTab("goals")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "goals"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goals</span>
              {goals.filter((g) => !g.completed).length > 0 && (
                <span className="px-1.5 py-0.5 bg-[#0D9488] text-white font-mono uppercase tracking-wider font-bold text-[8px] rounded-full">
                  {goals.filter((g) => !g.completed).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "resume"
                  ? "bg-white shadow-sm text-[#6D1A36] font-bold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>

          {/* TAB 1: Skill Gap & Readiness */}
          {activeTab === "readiness" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Readiness Score Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-700">
                      AUDIT SYNTHESIS &bull; AGENT 1 EVALUATOR
                    </span>
                  </div>
                  <h2 className="text-xl font-heading font-bold tracking-tight text-[#6D1A36]">
                    {name}&apos;s Job Readiness for {targetRole}
                  </h2>
                  <p className="text-xs font-sans text-slate-600 mt-1 max-w-xl leading-relaxed">
                    Evaluated against contemporary academic and industry competencies for{" "}
                    <strong>{targetRole}</strong> across professional requirements and applied standards.
                  </p>

                  <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-700">
                    <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-1">
                      Strategic Mentor Advice (Agent 4):
                    </span>
                    <p className="text-slate-600 italic font-sans leading-relaxed">
                      &ldquo;{analysisData?.mentorAdvice || "Analyzing profile trajectory..."}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center p-5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl shadow-inner min-w-[160px]">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-stone-200"
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
                        className="text-teal-600 transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-heading font-black tracking-tight text-[#6D1A36]">
                        {analysisData?.readinessScore || 45}%
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                        READINESS
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] font-mono uppercase tracking-wider font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {analysisData?.readinessScore && analysisData.readinessScore > 70
                      ? "ADVANCED READY"
                      : analysisData?.readinessScore && analysisData.readinessScore > 40
                      ? "MID-STAGE"
                      : "FOUNDATION"}
                  </span>
                </div>
              </div>

              {/* Free Fire-Style 5-Axis Pentagon Radar Chart (Pure SVG Component) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-600" />
                      Competency Attribute Radar &bull; 5 Core Dimensions
                    </h3>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      Multi-axis attribute evaluation for <strong>{targetRole}</strong> with empirical benchmark thresholds
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                      <span className="text-slate-700 font-bold text-[10px]">Candidate Profile</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-rose-100 border border-[#6D1A36]"></span>
                      <span className="text-slate-500 font-bold text-[10px]">Benchmark Target</span>
                    </div>
                  </div>
                </div>

                {(() => {
                  const dimensions = [
                    { name: "Domain Mastery", desc: "Core Theoretical & Field Fundamentals" },
                    { name: "Practical Execution", desc: "Hands-on Tools & Implementation" },
                    { name: "Analytical Problem Solving", desc: "Algorithmic & Critical Diagnostics" },
                    { name: "Industry Tools & Compliance", desc: "Regulatory SOPs & Professional Tooling" },
                    { name: "Communication & Leadership", desc: "Technical Synthesis & Cross-team Delivery" },
                  ];

                  const radarValues = dimensions.map((dim, idx) => {
                    const fallbackItem = domainComparisonList[idx] || domainComparisonList[0];
                    const current = fallbackItem ? fallbackItem.currentScore : 55;
                    const target = fallbackItem ? fallbackItem.requiredScore : 80;
                    return {
                      label: dim.name,
                      sub: dim.desc,
                      current: Math.min(100, Math.max(15, current)),
                      target: Math.min(100, Math.max(25, target)),
                    };
                  });

                  const cx = 200;
                  const cy = 190;
                  const maxR = 125;
                  const numAxes = 5;
                  const angleStep = (2 * Math.PI) / numAxes;
                  const startAngle = -Math.PI / 2; // Point straight up at top

                  const polarToCartesian = (radius: number, index: number) => {
                    const angle = startAngle + index * angleStep;
                    return {
                      x: cx + radius * Math.cos(angle),
                      y: cy + radius * Math.sin(angle),
                    };
                  };

                  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

                  const pentagonPaths = levels.map((lvl) => {
                    return Array.from({ length: numAxes }, (_, i) => {
                      const pt = polarToCartesian(maxR * lvl, i);
                      return `${pt.x},${pt.y}`;
                    }).join(" ");
                  });

                  const candidatePoints = radarValues.map((v, i) => {
                    const pt = polarToCartesian(maxR * (v.current / 100), i);
                    return `${pt.x},${pt.y}`;
                  }).join(" ");

                  const targetPoints = radarValues.map((v, i) => {
                    const pt = polarToCartesian(maxR * (v.target / 100), i);
                    return `${pt.x},${pt.y}`;
                  }).join(" ");

                  const candidateVertices = radarValues.map((v, i) =>
                    polarToCartesian(maxR * (v.current / 100), i)
                  );

                  return (
                    <div className="flex flex-col lg:flex-row items-center justify-around gap-6 pt-2">
                      {/* SVG Radar Graphic */}
                      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
                        <svg
                          viewBox="0 0 400 400"
                          className="w-full h-full overflow-visible drop-shadow-sm select-none"
                        >
                          <defs>
                            <radialGradient id="candidateGradient" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.55" />
                              <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.25" />
                            </radialGradient>
                            <linearGradient id="targetBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6D1A36" />
                              <stop offset="100%" stopColor="#800020" />
                            </linearGradient>
                          </defs>

                          {/* Concentric Pentagon Background Grids */}
                          {pentagonPaths.map((pts, li) => (
                            <polygon
                              key={li}
                              points={pts}
                              fill={li % 2 === 0 ? "#F8FAFC" : "#FFFFFF"}
                              stroke="#E2E8F0"
                              strokeWidth={li === 4 ? "1.8" : "1"}
                            />
                          ))}

                          {/* Grid Axis Lines */}
                          {Array.from({ length: numAxes }, (_, i) => {
                            const outerPt = polarToCartesian(maxR, i);
                            return (
                              <line
                                key={i}
                                x1={cx}
                                y1={cy}
                                x2={outerPt.x}
                                y2={outerPt.y}
                                stroke="#CBD5E1"
                                strokeWidth="1"
                                strokeDasharray={i % 2 === 1 ? "2 2" : undefined}
                              />
                            );
                          })}

                          {/* Scale Level Ticks (20%, 40%, 60%, 80%, 100%) */}
                          {levels.map((lvl, li) => {
                            const pt = polarToCartesian(maxR * lvl, 0);
                            return (
                              <text
                                key={li}
                                x={pt.x + 4}
                                y={pt.y - 2}
                                fontSize="8"
                                fill="#94A3B8"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {Math.round(lvl * 100)}%
                              </text>
                            );
                          })}

                          {/* Target Benchmark Polygon (Burgundy Dashed) */}
                          <polygon
                            points={targetPoints}
                            fill="#6D1A36"
                            fillOpacity="0.08"
                            stroke="url(#targetBorderGradient)"
                            strokeWidth="1.8"
                            strokeDasharray="4 3"
                          />

                          {/* Candidate Mastery Polygon (Vibrant Turquoise Glow) */}
                          <polygon
                            points={candidatePoints}
                            fill="url(#candidateGradient)"
                            stroke="#0D9488"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          />

                          {/* Candidate Vertex Dots */}
                          {candidateVertices.map((pt, i) => (
                            <g key={i}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="5"
                                fill="#0D9488"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                              />
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="2"
                                fill="#FFFFFF"
                              />
                            </g>
                          ))}

                          {/* Outer Axis Labels */}
                          {radarValues.map((v, i) => {
                            const labelPt = polarToCartesian(maxR + 24, i);
                            const isLeft = labelPt.x < cx - 20;
                            const isRight = labelPt.x > cx + 20;
                            const anchor = isLeft ? "end" : isRight ? "start" : "middle";

                            return (
                              <g key={i}>
                                <text
                                  x={labelPt.x}
                                  y={labelPt.y}
                                  textAnchor={anchor}
                                  fontSize="9.5"
                                  fontWeight="700"
                                  fill="#1E293B"
                                  fontFamily="system-ui, sans-serif"
                                >
                                  {v.label}
                                </text>
                                <text
                                  x={labelPt.x}
                                  y={labelPt.y + 11}
                                  textAnchor={anchor}
                                  fontSize="9"
                                  fontWeight="bold"
                                  fill="#0D9488"
                                  fontFamily="monospace"
                                >
                                  {v.current}% / {v.target}%
                                </text>
                              </g>
                            );
                          })}

                          {/* Center Pivot Point */}
                          <circle cx={cx} cy={cy} r="3" fill="#6D1A36" />
                        </svg>
                      </div>

                      {/* Dimension Attribute Breakdown Cards */}
                      <div className="w-full lg:w-72 space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block">
                          5-AXIS ATTRIBUTE BREAKDOWN
                        </span>
                        {radarValues.map((item, idx) => {
                          const gap = item.target - item.current;
                          return (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                            >
                              <div className="flex-1 pr-2">
                                <span className="font-heading font-bold text-slate-800 block text-[11px] leading-tight">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-sans block truncate">
                                  {item.sub}
                                </span>
                              </div>
                              <div className="text-right shrink-0 font-mono">
                                <span className="font-bold text-teal-700">{item.current}%</span>
                                <span className="text-slate-400 mx-1">/</span>
                                <span className="text-slate-600">{item.target}%</span>
                                <span
                                  className={`block text-[9px] font-bold ${
                                    gap <= 0 ? "text-teal-700" : "text-rose-700"
                                  }`}
                                >
                                  {gap <= 0 ? "âœ“ Benchmarked" : `-${gap}% Gap`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Visual Skill Gap Comparison Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      Domain Skill Gap &amp; Benchmark Analysis ({targetRole})
                    </h3>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      Empirical evaluation of Candidate Competencies vs. Industry Target Requirements
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                      <span className="text-slate-700 font-bold text-[10px]">Candidate Mastery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded bg-stone-300 border border-[#6D1A36]/60"></span>
                      <span className="text-slate-500 font-bold text-[10px]">Target Req</span>
                    </div>
                  </div>
                </div>

                {/* Bars Grid */}
                <div className="space-y-4">
                  {domainComparisonList.map((item) => {
                    const diff = item.requiredScore - item.currentScore;

                    return (
                      <div
                        key={item.domain}
                        className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-teal-300 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-heading font-bold tracking-tight text-slate-900">
                              {item.domain}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                                item.gapStatus === "Strong Match"
                                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                                  : item.gapStatus === "Moderate Gap"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-rose-50 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {item.gapStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono font-bold">
                            <span className="text-teal-700">Current: {item.currentScore}%</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-[#6D1A36]">Req: {item.requiredScore}%</span>
                            <span className={`text-[11px] ${diff <= 0 ? "text-teal-700" : "text-rose-700"}`}>
                              {diff <= 0 ? `+${Math.abs(diff)}% Met` : `-${diff}% Gap`}
                            </span>
                          </div>
                        </div>

                        {/* Visual Dual Progress Track */}
                        <div className="relative w-full h-3.5 bg-stone-200 rounded-full overflow-hidden border border-stone-200">
                          <div
                            className="absolute top-0 bottom-0 bg-stone-300 border-r-2 border-[#6D1A36]"
                            style={{ width: `${item.requiredScore}%` }}
                            title={`Target Requirement: ${item.requiredScore}%`}
                          />
                          <div
                            className={`h-full transition-all duration-700 rounded-full relative z-10 ${
                              item.gapStatus === "Strong Match"
                                ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                                : item.gapStatus === "Moderate Gap"
                                ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                                : "bg-gradient-to-r from-rose-500 to-amber-500"
                            }`}
                            style={{ width: `${item.currentScore}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 mt-1.5">
                          <span>
                            Key Focus:{" "}
                            <strong className="text-slate-800 font-semibold">{item.keyMissing}</strong>
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            SCALE: 0 &rarr; 100%
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
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
                      Validated Strengths &amp; Matched Skills
                    </h3>
                  </div>
                  <p className="text-xs font-sans text-slate-500 mb-3">
                    Skills verified from your profile that directly transfer to {targetRole}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisData?.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-600 font-sans" />
                        {skill}
                      </span>
                    ))}
                    {(!analysisData?.matchedSkills || analysisData.matchedSkills.length === 0) && (
                      <span className="text-xs text-slate-400 font-sans">
                        No directly matched skills identified yet.
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36]">
                      Identified Skill Deficits &amp; Priorities
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {analysisData?.missingSkills.map((item) => (
                      <div
                        key={item.skill}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-heading font-bold tracking-tight text-slate-900">
                            {item.skill}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              item.priority === "High"
                                ? "bg-rose-50 text-rose-800 border border-rose-200"
                                : item.priority === "Medium"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-teal-50 text-teal-800 border border-teal-200"
                            }`}
                          >
                            {item.priority} PRIORITY
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-slate-600 leading-relaxed">
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
              <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    Personalized Phased Learning Roadmap ({targetRole})
                  </h3>
                  <p className="text-xs font-sans text-slate-500 mt-0.5">
                    Architected by Agent 2 &bull; Check off completed modules to synchronize progress.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-sans text-slate-500 font-medium">Overall Completion</span>
                  <div className="text-sm font-mono font-bold text-teal-700">{progressPercent}%</div>
                </div>
              </div>

              {/* Roadmap Phases */}
              <div className="space-y-4">
                {analysisData?.roadmap.map((phase, pIdx) => (
                  <div
                    key={phase.phase}
                    className={`rounded-2xl border p-5 transition ${
                      phase.isRemedial
                        ? "bg-rose-50/60 border-rose-300 shadow-sm"
                        : "bg-white border-stone-200 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-heading font-bold ${
                            phase.isRemedial ? "bg-[#6D1A36] text-white" : "bg-teal-600 text-white"
                          }`}
                        >
                          {pIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-heading font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            {phase.phase}
                            {phase.isRemedial && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#6D1A36] border border-rose-200 text-[9px] font-mono uppercase tracking-wider font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-[#6D1A36]" />
                                REMEDIAL MODULE INJECTED
                              </span>
                            )}
                          </h4>
                          <span className="text-xs font-sans text-slate-500">
                            Focus Skill: <strong className="text-slate-800">{phase.focusSkill}</strong>
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-slate-700">
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
                                ? "bg-stone-50 border-teal-300 opacity-80"
                                : phase.isRemedial
                                ? "bg-white border-rose-200 hover:border-[#6D1A36]"
                                : "bg-stone-50/50 border-stone-200 hover:border-teal-500"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-1 w-4 h-4 rounded text-teal-600 bg-white border-stone-300 cursor-pointer accent-teal-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-xs font-heading font-bold tracking-tight ${
                                    isDone ? "line-through text-slate-400" : "text-slate-900"
                                  }`}
                                >
                                  {res.title}
                                </span>
                                <span
                                  className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                                    res.type === "Hands-on Project"
                                      ? "bg-teal-50 text-teal-800 border border-teal-200"
                                      : res.type === "Course"
                                      ? "bg-rose-50 text-[#6D1A36] border border-rose-200"
                                      : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                                  }`}
                                >
                                  {res.type}
                                </span>
                              </div>
                              <p className="text-[11px] font-sans text-slate-600 leading-relaxed">
                                {res.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Launch Roleplay Simulator Button */}
                    <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-sans text-slate-500">
                        Test <strong>{phase.focusSkill}</strong> in a live stakeholder workplace dilemma:
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSimState({ open: true, skill: phase.focusSkill });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#6D1A36] hover:bg-[#521228] px-3 py-1.5 text-xs font-heading font-semibold text-white shadow-xs transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                        <span>Launch Live Roleplay Simulation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Skill Assessment (Triggers Adaptation) */}
          {activeTab === "quiz" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      Instant Diagnostic Assessment (Examiner Agent 3)
                    </h3>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      Targeting missing skills for {targetRole}:{" "}
                      {analysisData?.missingSkills.map((m) => m.skill).join(", ")}.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-slate-700">
                    THRESHOLD: 60%
                  </span>
                </div>

                {/* Questions */}
                <div className="space-y-4 mt-4">
                  {analysisData?.diagnosticQuiz.map((q, idx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isChosen = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div key={q.id} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-700">
                            QUESTION {idx + 1} &bull; {q.skill}
                          </span>
                          {quizSubmitted && (
                            <span
                              className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                                isCorrect
                                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                                  : "bg-rose-50 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {isCorrect ? "CORRECT" : "INCORRECT"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-heading font-bold tracking-tight text-slate-900 mb-3">
                          {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            let btnStyle =
                              "bg-white border-stone-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/30";

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = "bg-teal-50 border-teal-600 text-teal-900 font-bold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-rose-50 border-rose-400 text-rose-900 font-medium";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-teal-50 border-teal-600 text-teal-900 font-bold shadow-xs";
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
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-sans transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3 p-2.5 rounded-lg bg-white border border-stone-200 text-[11px] font-sans text-slate-600">
                            <span className="font-heading font-bold text-[#6D1A36] tracking-tight block mb-0.5">
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
                <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={
                        Object.keys(quizAnswers).length <
                        (analysisData?.diagnosticQuiz.length || 3)
                      }
                      className="px-5 py-2 rounded-xl text-xs font-heading font-bold tracking-tight bg-[#6D1A36] hover:bg-[#521228] text-white shadow-md shadow-[#6D1A36]/20 disabled:opacity-40 transition cursor-pointer"
                    >
                      Submit Diagnostic Quiz
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-sans">
                        <span className="text-slate-600 font-medium">Diagnostic Result: </span>
                        <strong
                          className={`font-mono text-sm ${
                            quizScore && quizScore.correct / quizScore.total >= 0.6
                              ? "text-teal-700 font-bold"
                              : "text-rose-700 font-bold"
                          }`}
                        >
                          {quizScore?.correct}/{quizScore?.total} Correct (
                          {quizScore ? Math.round((quizScore.correct / quizScore.total) * 100) : 0}%)
                        </strong>
                      </div>

                      {/* The Crucial Adaptive Hook Button */}
                      {quizScore && quizScore.correct / quizScore.total < 0.6 ? (
                        <button
                          onClick={handleAutoAdaptRoadmap}
                          className="px-4 py-2.5 rounded-xl text-xs font-heading font-bold tracking-tight bg-gradient-to-r from-[#6D1A36] to-rose-700 hover:from-[#521228] hover:to-rose-800 text-white shadow-md shadow-rose-900/20 transition flex items-center gap-2 cursor-pointer animate-bounce"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>
                            Auto-Adapt Roadmap with Mentor Agent (Inject Remedial Modules)
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-teal-700 font-heading font-bold tracking-tight flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-teal-600" />
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
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[450px] animate-in fade-in duration-300">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#6D1A36]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36]">
                        Universal Adaptive Mentor Console
                      </h3>
                      <p className="text-[10px] font-sans text-slate-500">
                        Targeting: <strong>{targetRole}</strong> &bull; Cross-disciplinary consultation
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                    SESSION ACTIVE
                  </span>
                </div>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => handleSendChatMessage("What are the top 3 interview topics for " + targetRole + "?")}
                    className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-teal-50 border border-stone-200 text-[11px] text-[#6D1A36] hover:border-teal-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Top Interview Focus
                  </button>
                  <button
                    onClick={() => handleSendChatMessage("I'm struggling with the core technical prerequisites for this role.")}
                    className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-rose-50 border border-stone-200 text-[11px] text-rose-800 hover:border-rose-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    I&apos;m struggling with prerequisites
                  </button>
                  <button
                    onClick={() => handleSendChatMessage("Pivot to AI Engineer")}
                    className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-teal-50 border border-stone-200 text-[11px] text-teal-800 hover:border-teal-300 transition cursor-pointer flex items-center gap-1 font-heading font-bold tracking-tight"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                    Pivot to AI Engineer
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {chatMessages.length === 0 && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-sans text-slate-600 leading-relaxed">
                      ðŸ‘‹ Hello {name}! I am your Universal Adaptive Mentor Agent. I monitor your diagnostic evaluations,
                      track your project deliverables for <strong>{targetRole}</strong>, and coordinate directly with the Curriculum
                      Architect Agent. How can I help accelerate your path today?
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col text-xs ${msg.sender === "user" ? "items-end" : "items-start"}`}
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
                          <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-teal-700 font-mono font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-teal-600 font-sans" />
                            ADJUSTMENT: {msg.adjustment}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">{msg.timestamp}</span>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                      <RefreshCw className="w-3 h-3 animate-spin text-teal-600" />
                      <span>Mentor Agent synthesizing advice...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  placeholder={`Ask a question or request a career adjustment for ${targetRole}...`}
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs transition placeholder:text-slate-400 font-sans"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl font-heading font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}


          {/* TAB 5: Personal Goals & Milestones */}
          {activeTab === "goals" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Goal Stats Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <Target className="w-4 h-4 text-teal-600" />
                      Personal Career Goals &amp; Improvement Milestones
                    </h3>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      Empower your transition to <strong>{targetRole}</strong> with time-bound milestones and actionable skill sprints
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                      {goals.filter((g) => g.completed).length} / {goals.length} Completed
                    </span>
                    <span className="text-slate-500 font-medium">
                      {goals.filter((g) => g.type === "short").length} Short-Term
                    </span>
                    <span className="text-slate-500 font-medium">
                      {goals.filter((g) => g.type === "long").length} Long-Term
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {goals.length > 0 && (
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Milestone Completion Track</span>
                      <span className="font-bold text-teal-700">
                        {Math.round(
                          (goals.filter((g) => g.completed).length / goals.length) * 100
                        )}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                        style={{
                          width: `${
                            goals.length > 0
                              ? Math.round(
                                  (goals.filter((g) => g.completed).length / goals.length) * 100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Add New Goal Input Form */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36]">
                      + DEFINE NEW CAREER MILESTONE
                    </span>
                    <span className="text-[10px] font-sans text-slate-400">
                      Auto-synced with browser storage
                    </span>
                  </div>

                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddGoal();
                    }}
                    placeholder={`e.g. Master HPLC column calibration or complete 3-statement model for ${targetRole}...`}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs font-sans placeholder:text-slate-400"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                        Horizon Type
                      </label>
                      <select
                        value={newGoalType}
                        onChange={(e) => setNewGoalType(e.target.value as "short" | "long")}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-700 outline-none focus:border-teal-600 font-sans cursor-pointer"
                      >
                        <option value="short">âš¡ Short-term Sprint (1-4 wks)</option>
                        <option value="long">ðŸŽ¯ Long-term Goal (1-6 mos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                        Target Deadline
                      </label>
                      <input
                        type="date"
                        value={newGoalDeadline}
                        onChange={(e) => setNewGoalDeadline(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-700 outline-none focus:border-teal-600 font-sans cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                        Competency Domain / Tag
                      </label>
                      <input
                        type="text"
                        value={newGoalArea}
                        onChange={(e) => setNewGoalArea(e.target.value)}
                        placeholder="e.g. Practical Lab, System Design"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-slate-700 outline-none focus:border-teal-600 font-sans placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleAddGoal}
                        disabled={!newGoalTitle.trim()}
                        className="w-full py-2 px-3 bg-[#6D1A36] hover:bg-[#521228] disabled:opacity-40 text-white rounded-lg text-xs font-heading font-bold tracking-tight transition cursor-pointer shadow-sm shadow-[#6D1A36]/20 flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Add from Identified Missing Skills (Agent 1 Output) */}
              {analysisData?.missingSkills && analysisData.missingSkills.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      One-Click Goal Suggestions from Skill Auditor (Agent 1)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tap to auto-generate targeted milestone
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missingSkills.slice(0, 5).map((ms) => (
                      <button
                        key={ms.skill}
                        type="button"
                        onClick={() => {
                          const goal: CareerGoal = {
                            id: Date.now().toString() + ms.skill,
                            title: `Master & verify ${ms.skill} through capstone exercises`,
                            type: ms.priority === "High" ? "short" : "long",
                            deadline: "",
                            area: ms.skill,
                            completed: false,
                            createdAt: new Date().toISOString(),
                          };
                          const updated = [...goals, goal];
                          setGoals(updated);
                          localStorage.setItem("pathforge_goals", JSON.stringify(updated));
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-sans flex items-center gap-1.5 ${
                          ms.priority === "High"
                            ? "border-rose-200 bg-rose-50 text-rose-800 hover:border-rose-400 hover:bg-rose-100"
                            : "border-stone-200 bg-stone-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                        }`}
                      >
                        <Plus className="w-3 h-3 text-teal-600" />
                        <span>{ms.skill}</span>
                        <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-white border border-stone-200 font-bold opacity-80">
                          {ms.priority}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals List Sections (Short & Long Term) */}
              <div className="space-y-4">
                {goals.length === 0 && (
                  <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center">
                    <Target className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-heading font-bold text-slate-600">
                      No career milestones recorded yet.
                    </p>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Add a custom milestone above or tap one of the suggested skills from Agent 1!
                    </p>
                  </div>
                )}

                {(["short", "long"] as const).map((type) => {
                  const typeGoals = goals.filter((g) => g.type === type);
                  if (typeGoals.length === 0) return null;

                  return (
                    <div key={type} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <h4 className="text-xs font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                          {type === "short" ? "âš¡ Short-Term Sprints (1-4 Weeks)" : "ðŸŽ¯ Long-Term Career Objectives (1-6 Months)"}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {typeGoals.filter((g) => g.completed).length} / {typeGoals.length} Done
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {typeGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className={`p-3.5 rounded-xl border transition flex items-start gap-3 select-none ${
                              goal.completed
                                ? "bg-stone-50 border-teal-300 opacity-80"
                                : "bg-white border-stone-200 hover:border-teal-400 shadow-2xs"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => handleToggleGoal(goal.id)}
                              className="mt-1 w-4 h-4 rounded text-teal-600 bg-white border-stone-300 cursor-pointer accent-teal-600 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-xs font-heading font-bold tracking-tight ${
                                    goal.completed ? "line-through text-slate-400" : "text-slate-900"
                                  }`}
                                >
                                  {goal.title}
                                </span>
                                {goal.completed && (
                                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                                    âœ“ ACHIEVED
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-slate-500">
                                {goal.area && (
                                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                                    {goal.area}
                                  </span>
                                )}
                                {goal.deadline && (
                                  <span className="text-slate-600 font-mono text-[10px]">
                                    Deadline: {new Date(goal.deadline).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-slate-300 hover:text-rose-600 transition p-1 cursor-pointer shrink-0"
                              title="Delete Goal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: Interactive Resume Builder & Instant Download */}
          {activeTab === "resume" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Configuration Panel */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-sm font-heading font-bold tracking-tight text-[#6D1A36] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      Executive Resume Architect &bull; Live Preview &amp; Export
                    </h3>
                    <p className="text-xs font-sans text-slate-500 mt-0.5">
                      Tailored for <strong>{targetRole}</strong> with live profile synchronization and export-ready formatting
                    </p>
                  </div>

                  {/* Print / Download Button */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#6D1A36] hover:bg-[#521228] text-white rounded-xl text-xs font-heading font-bold tracking-tight transition flex items-center gap-2 shadow-md shadow-[#6D1A36]/20 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-300" />
                    <span>Download / Print Resume (PDF)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Style Selector */}
                  <div>
                    <label className="text-xs font-heading font-bold text-slate-800 block mb-2">
                      Choose Resume Layout Archetype
                    </label>
                    <div className="space-y-2">
                      {([
                        {
                          id: "executive" as const,
                          name: "Executive Burgundy Classic",
                          desc: "Prestige header banner with burgundy accent borders and structured competence columns",
                        },
                        {
                          id: "modern" as const,
                          name: "Modern Turquoise Split",
                          desc: "Two-column contemporary sidebar layout emphasizing verified technical stacks & readiness",
                        },
                        {
                          id: "academic" as const,
                          name: "Minimal Academic Serif",
                          desc: "Refined single-column typographic layout ideal for research, medicine, sciences & law",
                        },
                      ]).map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setResumeLayout(style.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                            resumeLayout === style.id
                              ? "bg-teal-50 border-teal-600 text-teal-950 font-semibold shadow-xs"
                              : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100 hover:border-stone-300"
                          }`}
                        >
                          <div>
                            <span className="font-heading font-bold text-slate-900 block text-xs">
                              {style.name}
                            </span>
                            <span className="text-[11px] font-sans text-slate-500 block mt-0.5">
                              {style.desc}
                            </span>
                          </div>
                          {resumeLayout === style.id && (
                            <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photo & Professional Summary Settings */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-heading font-bold text-slate-800 block mb-1">
                        Professional Profile Photo (Optional)
                      </label>
                      <div className="flex items-center gap-3">
                        {profilePhoto ? (
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-teal-500 shadow-sm shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={profilePhoto}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setProfilePhoto(null)}
                              className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition text-[9px] font-mono"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-[10px] font-mono shrink-0">
                            No Photo
                          </div>
                        )}

                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-700 text-xs font-heading font-bold transition">
                            <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                            <span>Upload Headshot Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[10px] text-slate-400 font-sans mt-1">
                            Supported: PNG, JPG, WebP. Encoded in browser (no uploads stored remotely).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-heading font-bold text-slate-800 block mb-1">
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        value={resumeHeadline}
                        onChange={(e) => setResumeHeadline(e.target.value)}
                        placeholder={`e.g. Dedicated ${targetRole} with Analytical Rigor & Domain Expertise`}
                        className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 text-slate-800 outline-none text-xs font-sans placeholder:text-slate-400"
                      />
                    </div>

                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-sans text-slate-600">
                      <span className="font-heading font-bold text-[#6D1A36] block mb-0.5">
                        Pro-Tip for Job Applicants:
                      </span>
                      Your verified skills ({skillsList.length}), projects, certifications, and AI Readiness Score ({analysisData?.readinessScore ?? 45}%) are dynamically mapped into the selected resume template below!
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Resume Sheet Preview Container */}
              <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 sm:p-8 flex justify-center shadow-inner overflow-x-auto">
                <div
                  id="printable-resume"
                  className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] shadow-2xl rounded-sm p-8 sm:p-12 relative print:shadow-none print:p-0 print:m-0 print:border-none print:w-full"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {/* STYLE 1: Executive Burgundy Classic */}
                  {resumeLayout === "executive" && (
                    <div className="space-y-6">
                      {/* Top Header */}
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
                            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-[#6D1A36]">
                              {name}
                            </h1>
                            <p className="text-sm font-sans font-medium text-slate-700 mt-0.5">
                              {resumeHeadline}
                            </p>
                            <span className="inline-block mt-1 text-[11px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                              TARGET: {targetRole}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="inline-flex flex-col items-center p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">
                              AI READINESS
                            </span>
                            <span className="text-2xl font-heading font-black text-[#6D1A36]">
                              {analysisData?.readinessScore ?? 45}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Strategic Objective & Summary */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                          Executive Profile &amp; Career Objective
                        </h2>
                        <p className="text-xs font-sans text-slate-700 leading-relaxed">
                          Targeting a high-impact position as a <strong>{targetRole}</strong>. Demonstrated competencies across verified disciplines with a structured continuous professional learning trajectory audited through multi-agent career engineering.
                        </p>
                      </div>

                      {/* Skills Inventory */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2.5">
                          Validated Core Competencies
                        </h2>
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

                      {/* Projects & Practical Research */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                          Applied Projects, Research &amp; Work
                        </h2>
                        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 text-xs font-sans text-slate-800 leading-relaxed">
                          {projects || "Key applied capstone projects and continuous laboratory coursework."}
                        </div>
                      </div>

                      {/* Certifications & Degrees */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2">
                          Certifications, Degrees &amp; Credentials
                        </h2>
                        <p className="text-xs font-sans text-slate-700 leading-relaxed">
                          {certifications || "Undergraduate degree and professional development credentials."}
                        </p>
                      </div>

                      {/* Curriculum Execution Roadmap */}
                      {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                        <div>
                          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6D1A36] border-b border-stone-200 pb-1 mb-2.5">
                            Specialized Advanced Modules (THIRAN VAZHI Engine)
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {analysisData.roadmap.slice(0, 4).map((phase) => (
                              <div
                                key={phase.phase}
                                className="p-2.5 rounded-lg border border-stone-200 bg-white"
                              >
                                <span className="font-heading font-bold text-slate-900 block text-[11px]">
                                  {phase.phase}
                                </span>
                                <span className="text-[10px] text-teal-700 font-mono block">
                                  Focus: {phase.focusSkill} ({phase.duration})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STYLE 2: Modern Turquoise Split */}
                  {resumeLayout === "modern" && (
                    <div className="flex flex-col sm:flex-row gap-8 min-h-[900px]">
                      {/* Left Sidebar */}
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
                            <h1 className="text-xl font-heading font-bold text-white tracking-tight">
                              {name}
                            </h1>
                            <p className="text-xs text-teal-100 font-sans mt-1">
                              {targetRole}
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-200 block border-b border-teal-700 pb-1 mb-2">
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
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-200 block border-b border-teal-700 pb-1 mb-1.5">
                              CREDENTIALS
                            </span>
                            <p className="text-[11px] font-sans text-teal-100 leading-relaxed">
                              {certifications}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-teal-700">
                          <span className="text-[9px] font-mono uppercase text-teal-200 block">
                            BENCHMARK READINESS
                          </span>
                          <span className="text-3xl font-heading font-black text-white">
                            {analysisData?.readinessScore ?? 45}%
                          </span>
                        </div>
                      </div>

                      {/* Right Main Content */}
                      <div className="flex-1 space-y-6 pt-4 sm:pt-0">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6D1A36] block">
                            CAREER TRAJECTORY
                          </span>
                          <h2 className="text-xl font-heading font-bold text-slate-900 mt-0.5">
                            {resumeHeadline}
                          </h2>
                          <p className="text-xs font-sans text-slate-600 mt-2 leading-relaxed">
                            Proactive professional with verified competencies aligned to <strong>{targetRole}</strong>. Evaluated by multi-agent career intelligence to ensure compliance with modern industry benchmarks.
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
                                    <span className="text-[10px] font-mono text-teal-700 font-bold">
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

                  {/* STYLE 3: Minimal Academic Serif */}
                  {resumeLayout === "academic" && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                      {/* Centered Academic Header */}
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
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                          {name}
                        </h1>
                        <p className="text-sm font-heading italic text-slate-700 mt-1">
                          {resumeHeadline}
                        </p>
                        <p className="text-xs font-mono uppercase tracking-widest text-[#6D1A36] font-bold mt-1.5">
                          Candidate for: {targetRole}
                        </p>
                      </div>

                      {/* Scholarly / Professional Summary */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 border-b border-stone-200 pb-1 mb-2">
                          I. Professional Statement
                        </h2>
                        <p className="text-xs font-sans text-slate-800 leading-relaxed">
                          Scholarly and industry competencies developed toward <strong>{targetRole}</strong>. Assessed through autonomous multi-agent verification yielding an empirical <strong>{analysisData?.readinessScore ?? 45}% readiness index</strong>.
                        </p>
                      </div>

                      {/* Competencies */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 border-b border-stone-200 pb-1 mb-2">
                          II. Technical Competencies &amp; Methods
                        </h2>
                        <p className="text-xs font-sans text-slate-800 leading-relaxed">
                          {skillsList.join(" &bull; ")}
                        </p>
                      </div>

                      {/* Projects & Research */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 border-b border-stone-200 pb-1 mb-2">
                          III. Research, Publications &amp; Applied Projects
                        </h2>
                        <p className="text-xs font-sans text-slate-800 leading-relaxed">
                          {projects}
                        </p>
                      </div>

                      {/* Credentials */}
                      <div>
                        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 border-b border-stone-200 pb-1 mb-2">
                          IV. Academic Degrees &amp; Certifications
                        </h2>
                        <p className="text-xs font-sans text-slate-800 leading-relaxed">
                          {certifications}
                        </p>
                      </div>

                      {/* Roadmap Milestones */}
                      {analysisData?.roadmap && analysisData.roadmap.length > 0 && (
                        <div>
                          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 border-b border-stone-200 pb-1 mb-2">
                            V. Academic &amp; Clinical Sprint Modules
                          </h2>
                          <ul className="list-disc list-inside text-xs font-sans text-slate-700 space-y-1">
                            {analysisData.roadmap.map((p) => (
                              <li key={p.phase}>
                                <strong>{p.phase}</strong> ({p.duration}): {p.focusSkill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>


      {/* Roleplay Simulator Agent Modal */}
      <RoleplaySimulatorModal
        isOpen={simState.open}
        onClose={() => setSimState({ open: false, skill: "" })}
        targetRole={targetRole}
        focusSkill={simState.skill || (analysisData?.missingSkills?.[0]?.skill || "Core Technical Standards")}
      />
      {/* Footer */}
      <footer className="border-t border-stone-200 py-3 text-center text-slate-500 text-[11px] font-mono bg-white">
        THIRAN VAZHI &bull; Universal Multi-Agent Career Engine &bull; Powered by Google Gemini &amp; Antigravity
      </footer>
    </div>
  );
}


