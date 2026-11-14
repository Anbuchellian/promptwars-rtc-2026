export type AgentName =
  | "Skill Auditor Agent"
  | "Curriculum Architect Agent"
  | "Assessment Examiner Agent"
  | "Adaptive Mentor Agent";

export interface AgentLog {
  agentName: AgentName;
  status: "completed" | "active" | "waiting";
  thought: string;
}

export interface MissingSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
}

export interface DomainComparison {
  domain: string;
  currentScore: number;
  requiredScore: number;
  gapStatus: "Strong Match" | "Moderate Gap" | "Critical Gap";
  keyMissing: string;
}

export interface Resource {
  title: string;
  type: "Course" | "Tutorial" | "Hands-on Project";
  description: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  focusSkill: string;
  isRemedial: boolean;
  resources: Resource[];
}

export interface QuizQuestion {
  id: number;
  skill: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnalysisData {
  agentLogs: AgentLog[];
  readinessScore: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  domainComparison?: DomainComparison[];
  roadmap: RoadmapPhase[];
  diagnosticQuiz: QuizQuestion[];
  mentorAdvice: string;
}

export interface RoleplayTurn {
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

export interface CareerGoal {
  id: string;
  title: string;
  type: "short" | "long";
  deadline: string;
  area: string;
  completed: boolean;
  createdAt: string;
}

export interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
  adjustment?: string;
  timestamp: string;
}

export interface CareerDomain {
  category: string;
  iconName: string;
  roles: string[];
}

export type TabId =
  | "readiness"
  | "roadmap"
  | "simulation"
  | "quiz"
  | "mentor"
  | "goals"
  | "resume";

export type ResumeLayout = "executive" | "modern" | "academic";
