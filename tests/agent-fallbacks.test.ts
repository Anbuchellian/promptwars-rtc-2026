import { describe, expect, it } from "vitest";
import {
  calculateDomainComparison,
  formatRoleplayPayload,
  generateFallbackAnalysis,
  generateRoleplayFallback,
  parseProfileFallback,
} from "@/lib/agent-fallbacks";
import { STUDENT_PRESETS } from "@/lib/skills-data";

describe("STUDENT_PRESETS (4 records)", () => {
  it("provides 4 distinct realistic domain records", () => {
    expect(STUDENT_PRESETS).toHaveLength(4);
    const names = new Set(STUDENT_PRESETS.map((p) => p.name));
    const roles = new Set(STUDENT_PRESETS.map((p) => p.targetRole));
    expect(names.size).toBe(4);
    expect(roles.size).toBe(4);
  });
});

describe("parseProfileFallback", () => {
  it("detects pharma skills and suggests Pharmaceutical Formulation Scientist", () => {
    const parsed = parseProfileFallback(
      "Name: Dr. Ananya Deshmukh\nSkills: Organic Chemistry, HPLC, Titration\nProject: Extended-release bilayer tablet study\nDegree: Ph.D. Pharmaceutics"
    );
    expect(parsed.name).toBe("Dr. Ananya Deshmukh");
    expect(parsed.currentSkills).toContain("Organic Chemistry");
    expect(parsed.currentSkills).toContain("HPLC");
    expect(parsed.suggestedTargetRole).toBe(
      "Pharmaceutical Formulation Scientist"
    );
  });

  it("detects finance skills and suggests Financial Analyst", () => {
    const parsed = parseProfileFallback(
      "Nadia Al-Mansoor\nBuilt 3-statement valuation models using Excel and Accounting"
    );
    expect(parsed.name).toBe("Nadia Al-Mansoor");
    expect(parsed.currentSkills).toContain("Excel");
    expect(parsed.suggestedTargetRole).toBe("Financial Analyst");
  });

  it("defaults fallback name to Karthik Sundaram when unnamed", () => {
    const parsed = parseProfileFallback("Skills: Python, SQL, React");
    expect(parsed.name).toBe("Karthik Sundaram");
  });
});

describe("calculateDomainComparison", () => {
  it("scores matched chemistry skills accurately for Pharma roles", () => {
    const result = calculateDomainComparison(
      ["Organic Chemistry", "HPLC", "GMP"],
      "Pharmaceutical Formulation Scientist"
    );
    expect(result).toHaveLength(5);
    expect(result[0].gapStatus).toBe("Strong Match");
    expect(result[2].gapStatus).toBe("Strong Match");
  });
});

describe("generateFallbackAnalysis", () => {
  it("injects remedial Phase 0 modules when adaptationContext indicates quiz failure", () => {
    const normal = generateFallbackAnalysis({
      name: "Karthik Sundaram",
      currentSkills: ["Python", "SQL"],
      targetRole: "Full Stack Developer",
    });
    const adapted = generateFallbackAnalysis({
      name: "Karthik Sundaram",
      currentSkills: ["Python", "SQL"],
      targetRole: "Full Stack Developer",
      adaptationContext: "Student failed diagnostic quiz and is struggling.",
    });

    expect(normal.roadmap.some((r) => r.isRemedial)).toBe(false);
    expect(adapted.roadmap.some((r) => r.isRemedial)).toBe(true);
    expect(adapted.readinessScore).toBeLessThan(normal.readinessScore);
  });

  it("generates domain-specific Robotics Engineer analysis for Record 4 (Mateo Alvarez)", () => {
    const robotics = generateFallbackAnalysis({
      name: "Mateo Alvarez",
      currentSkills: ["SolidWorks", "C / C++", "Embedded C", "MATLAB"],
      targetRole: "Robotics Engineer",
    });

    expect(robotics.missingSkills.map((m) => m.skill)).toContain(
      "ROS 2 & Real-Time Trajectory Control (DLS Kinematics)"
    );
    expect(robotics.roadmap.length).toBeGreaterThanOrEqual(3);
    expect(robotics.diagnosticQuiz).toHaveLength(3);
  });
});

describe("generateRoleplayFallback & formatRoleplayPayload", () => {
  it("advances competency score on sound engineering response and completes on turn 3", () => {
    const turn1 = generateRoleplayFallback({
      targetRole: "Full Stack Developer",
      turnNumber: 1,
    });
    expect(turn1.isComplete).toBe(false);

    const turn2 = generateRoleplayFallback({
      targetRole: "Full Stack Developer",
      turnNumber: 2,
      userResponse: "Query pg_stat_activity and enable Redis cache",
    });
    expect(turn2.competencyScore).toBeGreaterThan(turn1.competencyScore);

    const turn3 = generateRoleplayFallback({
      targetRole: "Full Stack Developer",
      turnNumber: 3,
      userResponse: "Enforce idempotency keys and exponential backoff worker pool",
    });
    expect(turn3.isComplete).toBe(true);
    expect(turn3.competencyScore).toBeGreaterThanOrEqual(90);
  });

  it("supports 3-turn Robotics Engineer roleplay scenarios", () => {
    const t1 = generateRoleplayFallback({
      targetRole: "Robotics Engineer",
      turnNumber: 1,
    });
    expect(t1.scenarioTitle).toMatch(/Manipulator Torque Spike/i);

    const t2 = generateRoleplayFallback({
      targetRole: "Robotics Engineer",
      turnNumber: 2,
      userResponse: "Isolate STO safety loop and capture CAN-FD telemetry",
    });
    expect(t2.competencyScore).toBeGreaterThan(t1.competencyScore);

    const t3 = generateRoleplayFallback({
      targetRole: "Robotics Engineer",
      turnNumber: 3,
      userResponse: "Apply minimum-jerk trajectory filter and ISO 10218 verification",
    });
    expect(t3.isComplete).toBe(true);
  });

  it("strips control characters and unexpected keys in formatRoleplayPayload", () => {
    const formatted = formatRoleplayPayload(
      {
        dialogue: "Hello\x00 World",
        competencyScore: 999,
        unexpectedKey: "should-be-stripped",
      },
      "Full Stack Developer",
      "Database Indexing",
      1
    ) as Record<string, unknown>;

    expect(formatted.dialogue).toBe("Hello World");
    expect(formatted.competencyScore).toBe(100);
    expect(formatted.unexpectedKey).toBeUndefined();
  });
});
