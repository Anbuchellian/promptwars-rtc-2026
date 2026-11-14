import type {
  AgentLog,
  AnalysisData,
  CareerGoal,
  DomainComparison,
  MissingSkill,
  Resource,
  RoadmapPhase,
  SupportedLanguage,
} from "./types";

export const ALLOWED_AGENT_ACTIONS = [
  "parse_profile",
  "mentor_chat",
  "roleplay_simulation",
  "simulate_scenario",
  "analyze_and_plan",
] as const;

export type AgentAction = (typeof ALLOWED_AGENT_ACTIONS)[number];

export const ALLOWED_LANGUAGES: readonly SupportedLanguage[] = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Malayalam",
];

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_REQUEST_BODY_BYTES = 65_536; // 64 KB

const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS_REGEX, "").trim().slice(0, maxLength);
}

export function sanitizeLanguage(value: unknown): SupportedLanguage {
  if (
    typeof value === "string" &&
    (ALLOWED_LANGUAGES as readonly string[]).includes(value)
  ) {
    return value as SupportedLanguage;
  }
  return "English";
}

export function sanitizeStringArray(
  value: unknown,
  maxItems = 50,
  maxItemLength = 100
): string[] {
  const source: unknown[] =
    typeof value === "string"
      ? value.split(",")
      : Array.isArray(value)
      ? value
      : [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of source) {
    const clean = sanitizeText(entry, maxItemLength);
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
    if (result.length >= maxItems) break;
  }
  return result;
}

export function clampScore(value: unknown, fallback = 50): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

export function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const num =
    typeof value === "number"
      ? Math.trunc(value)
      : Number.parseInt(String(value), 10);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeMissingSkillsInput(value: unknown): MissingSkill[] {
  if (!Array.isArray(value)) return [];
  const allowedPriorities = new Set(["High", "Medium", "Low"]);
  return value
    .filter(isPlainObject)
    .slice(0, 20)
    .map((item) => {
      const priority =
        typeof item.priority === "string" && allowedPriorities.has(item.priority)
          ? (item.priority as MissingSkill["priority"])
          : "Medium";
      return {
        skill: sanitizeText(item.skill, 120) || "Core Competency",
        priority,
        reason: sanitizeText(item.reason, 400),
      };
    });
}

function sanitizeScenarioHistoryInput(
  value: unknown
): Array<{ turn: number; dialogue: string; userResponse: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isPlainObject)
    .slice(-10)
    .map((item, idx) => ({
      turn: clampInteger(item.turn ?? item.turnNumber, 1, 10, idx + 1),
      dialogue: sanitizeText(item.dialogue ?? item.scenarioPrompt, 1200),
      userResponse: sanitizeText(item.userResponse, 1200),
    }));
}

export type ValidatedAgentRequest =
  | { action: "parse_profile"; rawText: string }
  | {
      action: "mentor_chat";
      userMessage: string;
      currentProfile: { name?: string; skillsList?: string[]; targetRole?: string };
      readinessScore: number;
      missingSkills: MissingSkill[];
      completedModules: string[];
      preferredLanguage: SupportedLanguage;
    }
  | {
      action: "roleplay_simulation" | "simulate_scenario";
      targetRole: string;
      focusSkill: string;
      turnNumber: number;
      scenarioHistory: Array<{
        turn: number;
        dialogue: string;
        userResponse: string;
      }>;
      userResponse: string;
      preferredLanguage: SupportedLanguage;
    }
  | {
      action: "analyze_and_plan";
      name: string;
      currentSkills: string[];
      projects: string;
      certifications: string;
      targetRole: string;
      adaptationContext: string;
      preferredLanguage: SupportedLanguage;
    };

export function validateAgentPayload(
  body: unknown
): { ok: true; data: ValidatedAgentRequest } | { ok: false; error: string } {
  if (!isPlainObject(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  for (const key of Object.keys(body)) {
    if (DANGEROUS_KEYS.has(key)) {
      return { ok: false, error: "Invalid property key in request payload." };
    }
  }

  const rawAction = body.action;
  if (
    typeof rawAction !== "string" ||
    !(ALLOWED_AGENT_ACTIONS as readonly string[]).includes(rawAction)
  ) {
    return { ok: false, error: "Invalid or unsupported action specified." };
  }

  const action = rawAction as AgentAction;
  const preferredLanguage = sanitizeLanguage(body.preferredLanguage);

  if (action === "parse_profile") {
    const rawText = sanitizeText(body.rawText, 15000);
    if (!rawText) {
      return { ok: false, error: "Resume or profile text cannot be empty." };
    }
    return { ok: true, data: { action, rawText } };
  }

  if (action === "mentor_chat") {
    const userMessage = sanitizeText(body.userMessage, 2000);
    if (!userMessage) {
      return { ok: false, error: "Message cannot be empty." };
    }

    const profileObj = isPlainObject(body.currentProfile)
      ? body.currentProfile
      : {};

    return {
      ok: true,
      data: {
        action,
        userMessage,
        currentProfile: {
          name: sanitizeText(profileObj.name, 120) || "Learner",
          skillsList: sanitizeStringArray(profileObj.skillsList, 50, 100),
          targetRole:
            sanitizeText(profileObj.targetRole, 160) || "Full Stack Developer",
        },
        readinessScore: clampScore(body.readinessScore, 45),
        missingSkills: sanitizeMissingSkillsInput(body.missingSkills),
        completedModules: sanitizeStringArray(body.completedModules, 50, 120),
        preferredLanguage,
      },
    };
  }

  if (action === "roleplay_simulation" || action === "simulate_scenario") {
    return {
      ok: true,
      data: {
        action,
        targetRole:
          sanitizeText(body.targetRole, 160) || "Full Stack Developer",
        focusSkill:
          sanitizeText(body.focusSkill, 160) || "Core Domain Execution",
        turnNumber: clampInteger(body.turnNumber, 1, 10, 1),
        scenarioHistory: sanitizeScenarioHistoryInput(body.scenarioHistory),
        userResponse: sanitizeText(body.userResponse, 3000),
        preferredLanguage,
      },
    };
  }

  // analyze_and_plan
  const adaptationContext =
    typeof body.adaptationContext === "string"
      ? sanitizeText(body.adaptationContext, 1500)
      : isPlainObject(body.adaptationContext)
      ? sanitizeText(JSON.stringify(body.adaptationContext), 1500)
      : "";

  return {
    ok: true,
    data: {
      action: "analyze_and_plan",
      name: sanitizeText(body.name, 120) || "Learner",
      currentSkills: sanitizeStringArray(body.currentSkills, 50, 100),
      projects: sanitizeText(body.projects, 2000),
      certifications: sanitizeText(body.certifications, 1000),
      targetRole: sanitizeText(body.targetRole, 160) || "Full Stack Developer",
      adaptationContext,
      preferredLanguage,
    },
  };
}

export function validateImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      error:
        "Unsupported image format. Please upload a PNG, JPEG, or WebP file.",
    };
  }
  if (file.name && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
    return {
      ok: false,
      error:
        "Unsupported file extension. Please upload a .png, .jpg, or .webp image.",
    };
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: "Image file size must be under 2 MB.",
    };
  }
  return { ok: true };
}

export function isSafeImageDataUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  if (url.length > 3 * 1024 * 1024) return false;
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(url);
}

export function parseStoredCompletedItems(
  raw: string | null
): Record<string, boolean> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return {};
    }
    const clean: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (
        !DANGEROUS_KEYS.has(k) &&
        typeof v === "boolean" &&
        k.length > 0 &&
        k.length <= 200
      ) {
        clean[k] = v;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function parseStoredGoals(raw: string | null): CareerGoal[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const results: CareerGoal[] = [];
    for (const item of parsed.slice(0, 100)) {
      if (!isPlainObject(item)) continue;
      if (
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        (item.type !== "short" && item.type !== "long") ||
        typeof item.completed !== "boolean" ||
        typeof item.createdAt !== "string"
      ) {
        continue;
      }
      const cleanTitle = sanitizeText(item.title, 200);
      const cleanId = sanitizeText(item.id, 80);
      if (!cleanTitle || !cleanId) continue;

      const rawDeadline = sanitizeText(item.deadline, 30);
      const safeDeadline = /^\d{4}-\d{2}-\d{2}$/.test(rawDeadline)
        ? rawDeadline
        : "";

      results.push({
        id: cleanId,
        title: cleanTitle,
        type: item.type,
        deadline: safeDeadline,
        area: sanitizeText(item.area, 100),
        completed: item.completed,
        createdAt: sanitizeText(item.createdAt, 60) || new Date().toISOString(),
      });
    }
    return results;
  } catch {
    return [];
  }
}

const VALID_AGENT_NAMES = new Set<AgentLog["agentName"]>([
  "Skill Auditor Agent",
  "Curriculum Architect Agent",
  "Assessment Examiner Agent",
  "Adaptive Mentor Agent",
]);

const VALID_GAP_STATUS = new Set<DomainComparison["gapStatus"]>([
  "Strong Match",
  "Moderate Gap",
  "Critical Gap",
]);

const VALID_RESOURCE_TYPES = new Set<Resource["type"]>([
  "Course",
  "Tutorial",
  "Hands-on Project",
]);

export function sanitizeAnalysisResponse(
  raw: unknown,
  fallback: AnalysisData
): AnalysisData {
  if (!isPlainObject(raw)) return fallback;

  if (
    !Array.isArray(raw.roadmap) ||
    !Array.isArray(raw.agentLogs) ||
    !Array.isArray(raw.diagnosticQuiz)
  ) {
    return fallback;
  }

  const sanitizedLogs: AgentLog[] = raw.agentLogs
    .filter(isPlainObject)
    .slice(0, 6)
    .map((log, idx) => ({
      agentName:
        typeof log.agentName === "string" &&
        VALID_AGENT_NAMES.has(log.agentName as AgentLog["agentName"])
          ? (log.agentName as AgentLog["agentName"])
          : fallback.agentLogs[idx % fallback.agentLogs.length].agentName,
      status: "completed" as const,
      thought: sanitizeText(log.thought, 800) || "Agent analysis completed.",
    }));

  const sanitizedMissing = sanitizeMissingSkillsInput(raw.missingSkills).slice(
    0,
    15
  );

  const sanitizedDomainComparison: DomainComparison[] | undefined =
    Array.isArray(raw.domainComparison) && raw.domainComparison.length > 0
      ? raw.domainComparison
          .filter(isPlainObject)
          .slice(0, 8)
          .map((d) => ({
            domain: sanitizeText(d.domain, 120) || "Domain Competency",
            currentScore: clampScore(d.currentScore, 50),
            requiredScore: clampScore(d.requiredScore, 80),
            gapStatus:
              typeof d.gapStatus === "string" &&
              VALID_GAP_STATUS.has(d.gapStatus as DomainComparison["gapStatus"])
                ? (d.gapStatus as DomainComparison["gapStatus"])
                : "Moderate Gap",
            keyMissing: sanitizeText(d.keyMissing, 180) || "Core Standards",
          }))
      : fallback.domainComparison;

  const sanitizedRoadmap: RoadmapPhase[] = raw.roadmap
    .filter(isPlainObject)
    .slice(0, 8)
    .map((phase, idx) => {
      const rawResources = Array.isArray(phase.resources)
        ? phase.resources.filter(isPlainObject).slice(0, 8)
        : [];
      const resources: Resource[] = rawResources.map((r) => ({
        title: sanitizeText(r.title, 180) || "Learning Module",
        type:
          typeof r.type === "string" &&
          VALID_RESOURCE_TYPES.has(r.type as Resource["type"])
            ? (r.type as Resource["type"])
            : "Hands-on Project",
        description:
          sanitizeText(r.description, 500) ||
          "Structured applied module aligned to role benchmarks.",
      }));

      return {
        phase: sanitizeText(phase.phase, 140) || `Phase ${idx + 1}`,
        duration: sanitizeText(phase.duration, 60) || "Weeks 1-2",
        focusSkill: sanitizeText(phase.focusSkill, 140) || "Core Execution",
        isRemedial: Boolean(phase.isRemedial),
        resources:
          resources.length > 0
            ? resources
            : fallback.roadmap[0]?.resources ?? [],
      };
    });

  const sanitizedQuiz = raw.diagnosticQuiz
    .filter(isPlainObject)
    .slice(0, 6)
    .map((q, index) => {
      const options = Array.isArray(q.options)
        ? q.options.map((o) => sanitizeText(String(o), 300)).filter(Boolean).slice(0, 6)
        : ["Option A", "Option B", "Option C", "Option D"];
      const safeOptions =
        options.length >= 2
          ? options
          : ["Option A", "Option B", "Option C", "Option D"];
      const rawIdx = typeof q.correctIndex === "number" ? q.correctIndex : 0;
      const correctIndex =
        rawIdx >= 0 && rawIdx < safeOptions.length ? Math.trunc(rawIdx) : 0;

      return {
        id: typeof q.id === "number" ? q.id : index + 1,
        skill: sanitizeText(q.skill, 120) || "Core Competency",
        question: sanitizeText(q.question, 600) || "Diagnostic question",
        options: safeOptions,
        correctIndex,
        explanation:
          sanitizeText(q.explanation, 800) || "Review domain best practices.",
      };
    });

  return {
    agentLogs: sanitizedLogs.length > 0 ? sanitizedLogs : fallback.agentLogs,
    readinessScore: clampScore(raw.readinessScore, fallback.readinessScore),
    matchedSkills: Array.isArray(raw.matchedSkills)
      ? sanitizeStringArray(raw.matchedSkills, 30, 100)
      : fallback.matchedSkills,
    missingSkills:
      sanitizedMissing.length > 0 ? sanitizedMissing : fallback.missingSkills,
    domainComparison: sanitizedDomainComparison,
    roadmap: sanitizedRoadmap.length > 0 ? sanitizedRoadmap : fallback.roadmap,
    diagnosticQuiz:
      sanitizedQuiz.length > 0 ? sanitizedQuiz : fallback.diagnosticQuiz,
    mentorAdvice:
      sanitizeText(raw.mentorAdvice, 1000) || fallback.mentorAdvice,
  };
}
