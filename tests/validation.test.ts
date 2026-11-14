import { describe, expect, it } from "vitest";
import {
  clampInteger,
  clampScore,
  isSafeImageDataUrl,
  parseStoredCompletedItems,
  parseStoredGoals,
  sanitizeAnalysisResponse,
  sanitizeLanguage,
  sanitizeStringArray,
  sanitizeText,
  validateAgentPayload,
  validateImageFile,
} from "@/lib/validation";
import { generateFallbackAnalysis } from "@/lib/agent-fallbacks";

describe("sanitizeText, sanitizeLanguage & sanitizeStringArray", () => {
  it("strips ASCII control characters and enforces max length", () => {
    const dirty = "  Hello\x00\x07 World\x1F!  ";
    expect(sanitizeText(dirty, 5)).toBe("Hello");
    expect(sanitizeText(dirty, 50)).toBe("Hello World!");
  });

  it("handles non-string inputs safely", () => {
    expect(sanitizeText(123, 10)).toBe("");
    expect(sanitizeText(null, 10)).toBe("");
    expect(sanitizeText(undefined, 10)).toBe("");
  });

  it("normalizes supported languages and defaults unknown values to English", () => {
    expect(sanitizeLanguage("Tamil")).toBe("Tamil");
    expect(sanitizeLanguage("Malayalam")).toBe("Malayalam");
    expect(sanitizeLanguage("<script>alert(1)</script>")).toBe("English");
  });

  it("deduplicates and caps array items", () => {
    const items = sanitizeStringArray(
      ["Python", "SQL", "Python", "  ", "React"],
      2,
      20
    );
    expect(items).toEqual(["Python", "SQL"]);
  });

  it("splits comma-separated strings into sanitized array", () => {
    expect(sanitizeStringArray("Python, SQL, Python, HTML", 10, 50)).toEqual([
      "Python",
      "SQL",
      "HTML",
    ]);
  });
});

describe("clampScore & clampInteger", () => {
  it("clamps readiness scores between 0 and 100", () => {
    expect(clampScore(-15, 50)).toBe(0);
    expect(clampScore(142, 50)).toBe(100);
    expect(clampScore("74.6", 50)).toBe(75);
    expect(clampScore(Number.NaN, 45)).toBe(45);
  });

  it("clamps integers within range", () => {
    expect(clampInteger(99, 1, 10, 1)).toBe(10);
    expect(clampInteger(0, 1, 10, 1)).toBe(1);
    expect(clampInteger("bad", 1, 10, 3)).toBe(3);
  });
});

describe("validateAgentPayload", () => {
  it("rejects non-object bodies, unknown actions, and prototype pollution keys", () => {
    expect(validateAgentPayload(null).ok).toBe(false);
    expect(validateAgentPayload([]).ok).toBe(false);
    expect(validateAgentPayload({ action: "drop_table" }).ok).toBe(false);

    const protoPayload = JSON.parse(
      '{"action":"mentor_chat","userMessage":"hi","__proto__":{"polluted":true}}'
    );
    expect(validateAgentPayload(protoPayload).ok).toBe(false);
  });

  it("rejects empty rawText for parse_profile", () => {
    const res = validateAgentPayload({ action: "parse_profile", rawText: "   " });
    expect(res.ok).toBe(false);
  });

  it("rejects empty userMessage for mentor_chat", () => {
    const res = validateAgentPayload({
      action: "mentor_chat",
      userMessage: "\x00\x01  ",
    });
    expect(res.ok).toBe(false);
  });

  it("sanitizes valid analyze_and_plan payloads including preferredLanguage", () => {
    const res = validateAgentPayload({
      action: "analyze_and_plan",
      name: "  Ada\x00 Lovelace ",
      currentSkills: ["Python", "Python", "Math"],
      targetRole: "AI/ML Engineer",
      preferredLanguage: "Telugu",
    });
    expect(res.ok).toBe(true);
    if (res.ok && res.data.action === "analyze_and_plan") {
      expect(res.data.name).toBe("Ada Lovelace");
      expect(res.data.currentSkills).toEqual(["Python", "Math"]);
      expect(res.data.targetRole).toBe("AI/ML Engineer");
      expect(res.data.preferredLanguage).toBe("Telugu");
    }
  });
});

describe("image upload validation & data URL verification", () => {
  it("rejects SVG files and mismatched file extensions to prevent embedded script XSS", () => {
    expect(
      validateImageFile({ type: "image/svg+xml", size: 1024, name: "bad.svg" }).ok
    ).toBe(false);
    expect(
      validateImageFile({ type: "image/png", size: 1024, name: "bad.svg" }).ok
    ).toBe(false);
  });

  it("rejects oversized images over 2 MB", () => {
    const res = validateImageFile({
      type: "image/png",
      size: 3 * 1024 * 1024,
      name: "large.png",
    });
    expect(res.ok).toBe(false);
  });

  it("accepts valid PNG/JPEG/WebP files under 2 MB", () => {
    expect(
      validateImageFile({ type: "image/png", size: 50_000, name: "ok.png" }).ok
    ).toBe(true);
    expect(
      validateImageFile({ type: "image/jpeg", size: 50_000, name: "ok.jpg" }).ok
    ).toBe(true);
    expect(
      validateImageFile({ type: "image/webp", size: 50_000, name: "ok.webp" }).ok
    ).toBe(true);
  });

  it("verifies safe base64 image data URLs only", () => {
    expect(isSafeImageDataUrl("data:image/png;base64,iVBORw0KGgo=")).toBe(true);
    expect(isSafeImageDataUrl("data:image/svg+xml;base64,PHN2Zz4=")).toBe(false);
    expect(isSafeImageDataUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("localStorage parsers", () => {
  it("filters corrupted entries in completed modules storage", () => {
    const parsed = parseStoredCompletedItems(
      JSON.stringify({ mod1: true, mod2: "not-a-bool", mod3: false })
    );
    expect(parsed).toEqual({ mod1: true, mod3: false });
    expect(parseStoredCompletedItems("{bad json")).toEqual({});
    expect(parseStoredCompletedItems("[1,2,3]")).toEqual({});
  });

  it("validates stored CareerGoal records", () => {
    const validGoal = {
      id: "1",
      title: "Build portfolio",
      type: "short",
      deadline: "",
      area: "React",
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
    };
    const parsed = parseStoredGoals(
      JSON.stringify([validGoal, { id: 123, title: null }])
    );
    expect(parsed).toEqual([validGoal]);
    expect(parseStoredGoals("not json")).toEqual([]);
  });
});

describe("sanitizeAnalysisResponse", () => {
  it("clamps out-of-range scores, invalid agent names, and invalid quiz correctIndex", () => {
    const fallback = generateFallbackAnalysis({ targetRole: "Full Stack Developer" });
    const sanitized = sanitizeAnalysisResponse(
      {
        ...fallback,
        readinessScore: 999,
        agentLogs: [
          {
            agentName: "Unauthorized Agent",
            status: "completed",
            thought: "Test\x00thought",
          },
        ],
        diagnosticQuiz: [
          {
            id: 1,
            skill: "Testing",
            question: "Sample question?",
            options: ["A", "B"],
            correctIndex: 99,
            explanation: "Because A.",
          },
        ],
      },
      fallback
    );
    expect(sanitized.readinessScore).toBe(100);
    expect(sanitized.diagnosticQuiz[0].correctIndex).toBe(0);
    expect(sanitized.agentLogs[0].agentName).toBe("Skill Auditor Agent");
    expect(sanitized.agentLogs[0].thought).toBe("Testthought");
  });
});
