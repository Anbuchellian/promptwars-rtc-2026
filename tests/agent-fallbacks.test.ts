import { describe, expect, it } from "vitest";
import {
  calculateDomainComparison,
  generateFallbackAnalysis,
  generateRoleplayFallback,
  parseProfileFallback,
} from "@/lib/agent-fallbacks";

describe("parseProfileFallback", () => {
  it("detects pharma skills and suggests Pharmaceutical Formulation Scientist", () => {
    const parsed = parseProfileFallback(
      "Name: Dr. Elena Vance\nSkills: Organic Chemistry, HPLC, Titration\nProject: Synthesis and formulation analysis\nDegree: MSc Chemistry"
    );
    expect(parsed.name).toBe("Dr. Elena Vance");
    expect(parsed.currentSkills).toContain("Organic Chemistry");
    expect(parsed.currentSkills).toContain("HPLC");
    expect(parsed.suggestedTargetRole).toBe(
      "Pharmaceutical Formulation Scientist"
    );
  });

  it("detects finance skills and suggests Financial Analyst", () => {
    const parsed = parseProfileFallback(
      "Marcus Sterling\nBuilt DCF valuation models using Excel and Accounting"
    );
    expect(parsed.name).toBe("Marcus Sterling");
    expect(parsed.currentSkills).toContain("Excel");
    expect(parsed.suggestedTargetRole).toBe("Financial Analyst");
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
      name: "Alex",
      currentSkills: ["Python", "SQL"],
      targetRole: "Full Stack Developer",
    });
    const adapted = generateFallbackAnalysis({
      name: "Alex",
      currentSkills: ["Python", "SQL"],
      targetRole: "Full Stack Developer",
      adaptationContext: "Student failed diagnostic quiz and is struggling.",
    });

    expect(normal.roadmap.some((r) => r.isRemedial)).toBe(false);
    expect(adapted.roadmap.some((r) => r.isRemedial)).toBe(true);
    expect(adapted.readinessScore).toBeLessThan(normal.readinessScore);
  });
});

describe("generateRoleplayFallback", () => {
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
});
