import type { AnalysisData, CareerGoal } from "./types";

export const ALLOWED_AGENT_ACTIONS = [
  "parse_profile",
  "mentor_chat",
  "roleplay_simulation",
  "simulate_scenario",
  "analyze_and_plan",
] as const;

export type AgentAction = (typeof ALLOWED_AGENT_ACTIONS)[number];

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS_REGEX, "").trim().slice(0, maxLength);
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
  const num = typeof value === "number" ? Math.trunc(value) : Number.parseInt(String(value), 10);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export type ValidatedAgentRequest =
  | { action: "parse_profile"; rawText: string }
  | {
      action: "mentor_chat";
      userMessage: string;
      currentProfile: { name?: string; skillsList?: string[]; targetRole?: string };
      readinessScore: number;
      missingSkills: unknown[];
      completedModules: string[];
    }
  | {
      action: "roleplay_simulation" | "simulate_scenario";
      targetRole: string;
      focusSkill: string;
      turnNumber: number;
      scenarioHistory: unknown[];
      userResponse: string;
    }
  | {
      action: "analyze_and_plan";
      name: string;
      currentSkills: string[];
      projects: string;
      certifications: string;
      targetRole: string;
      adaptationContext: string;
    };

export function validateAgentPayload(
  body: unknown
): { ok: true; data: ValidatedAgentRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const record = body as Record<string, unknown>;
  const rawAction = record.action;

  if (
    typeof rawAction !== "string" ||
    !(ALLOWED_AGENT_ACTIONS as readonly string[]).includes(rawAction)
  ) {
    return { ok: false, error: "Invalid or unsupported action specified." };
  }

  const action = rawAction as AgentAction;

  if (action === "parse_profile") {
    const rawText = sanitizeText(record.rawText, 15000);
    if (!rawText) {
      return { ok: false, error: "Resume or profile text cannot be empty." };
    }
    return { ok: true, data: { action, rawText } };
  }

  if (action === "mentor_chat") {
    const userMessage = sanitizeText(record.userMessage, 2000);
    if (!userMessage) {
      return { ok: false, error: "Message cannot be empty." };
    }

    const profileObj =
      record.currentProfile && typeof record.currentProfile === "object"
        ? (record.currentProfile as Record<string, unknown>)
        : {};

    return {
      ok: true,
      data: {
        action,
        userMessage,
        currentProfile: {
          name: sanitizeText(profileObj.name, 120) || "Learner",
          skillsList: sanitizeStringArray(profileObj.skillsList, 50, 100),
          targetRole: sanitizeText(profileObj.targetRole, 160) || "Full Stack Developer",
        },
        readinessScore: clampScore(record.readinessScore, 45),
        missingSkills: Array.isArray(record.missingSkills)
          ? record.missingSkills.slice(0, 20)
          : [],
        completedModules: sanitizeStringArray(record.completedModules, 50, 120),
      },
    };
  }

  if (action === "roleplay_simulation" || action === "simulate_scenario") {
    return {
      ok: true,
      data: {
        action,
        targetRole: sanitizeText(record.targetRole, 160) || "Full Stack Developer",
        focusSkill: sanitizeText(record.focusSkill, 160) || "Core Domain Execution",
        turnNumber: clampInteger(record.turnNumber, 1, 10, 1),
        scenarioHistory: Array.isArray(record.scenarioHistory)
          ? record.scenarioHistory.slice(-10)
          : [],
        userResponse: sanitizeText(record.userResponse, 3000),
      },
    };
  }

  // analyze_and_plan
  const adaptationContext =
    typeof record.adaptationContext === "string"
      ? sanitizeText(record.adaptationContext, 1500)
      : record.adaptationContext && typeof record.adaptationContext === "object"
      ? sanitizeText(JSON.stringify(record.adaptationContext), 1500)
      : "";

  return {
    ok: true,
    data: {
      action: "analyze_and_plan",
      name: sanitizeText(record.name, 120) || "Learner",
      currentSkills: sanitizeStringArray(record.currentSkills, 50, 100),
      projects: sanitizeText(record.projects, 2000),
      certifications: sanitizeText(record.certifications, 1000),
      targetRole: sanitizeText(record.targetRole, 160) || "Full Stack Developer",
      adaptationContext,
    },
  };
}

export function validateImageFile(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; error: string } {
  if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      error: "Unsupported image format. Please upload a PNG, JPEG, or WebP file.",
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
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(url);
}

export function parseStoredCompletedItems(
  raw: string | null
): Record<string, boolean> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const clean: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "boolean" && k.length <= 200) {
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
    return parsed
      .filter((item): item is CareerGoal => {
        if (!item || typeof item !== "object") return false;
        const g = item as Record<string, unknown>;
        return (
          typeof g.id === "string" &&
          typeof g.title === "string" &&
          (g.type === "short" || g.type === "long") &&
          typeof g.completed === "boolean" &&
          typeof g.createdAt === "string"
        );
      })
      .slice(0, 100);
  } catch {
    return [];
  }
}

export function sanitizeAnalysisResponse(
  raw: unknown,
  fallback: AnalysisData
): AnalysisData {
  if (!raw || typeof raw !== "object") return fallback;
  const obj = raw as Record<string, unknown>;

  if (
    !Array.isArray(obj.roadmap) ||
    !Array.isArray(obj.agentLogs) ||
    !Array.isArray(obj.diagnosticQuiz)
  ) {
    return fallback;
  }

  const sanitizedQuiz = obj.diagnosticQuiz
    .filter((q): q is Record<string, unknown> => Boolean(q && typeof q === "object"))
    .map((q, index) => {
      const options = Array.isArray(q.options)
        ? q.options.map((o) => String(o)).slice(0, 6)
        : ["Option A", "Option B", "Option C", "Option D"];
      const safeOptions =
        options.length >= 2 ? options : ["Option A", "Option B", "Option C", "Option D"];
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
    agentLogs:
      obj.agentLogs.length > 0
        ? (obj.agentLogs as AnalysisData["agentLogs"])
        : fallback.agentLogs,
    readinessScore: clampScore(obj.readinessScore, fallback.readinessScore),
    matchedSkills: Array.isArray(obj.matchedSkills)
      ? sanitizeStringArray(obj.matchedSkills, 30, 100)
      : fallback.matchedSkills,
    missingSkills: Array.isArray(obj.missingSkills)
      ? (obj.missingSkills as AnalysisData["missingSkills"]).slice(0, 15)
      : fallback.missingSkills,
    domainComparison:
      Array.isArray(obj.domainComparison) && obj.domainComparison.length > 0
        ? (
            obj.domainComparison as NonNullable<
              AnalysisData["domainComparison"]
            >
          ).map((d) => ({
            ...d,
            currentScore: clampScore(d.currentScore, 50),
            requiredScore: clampScore(d.requiredScore, 80),
          }))
        : fallback.domainComparison,
    roadmap:
      obj.roadmap.length > 0
        ? (obj.roadmap as AnalysisData["roadmap"])
        : fallback.roadmap,
    diagnosticQuiz:
      sanitizedQuiz.length > 0 ? sanitizedQuiz : fallback.diagnosticQuiz,
    mentorAdvice:
      sanitizeText(obj.mentorAdvice, 1000) || fallback.mentorAdvice,
  };
}
