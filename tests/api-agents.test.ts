import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/agents/route";
import { apiRateLimiter } from "@/lib/rate-limit";

function buildRequest(body: unknown, ip = "127.0.0.1") {
  return new NextRequest("http://localhost:3000/api/agents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/agents", () => {
  beforeEach(() => {
    apiRateLimiter.reset();
    delete process.env.GEMINI_API_KEY;
  });

  it("returns 400 for malformed JSON body", async () => {
    const res = await POST(buildRequest("{broken-json"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/malformed json/i);
  });

  it("returns 400 for invalid action", async () => {
    const res = await POST(buildRequest({ action: "unauthorized_action" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when parse_profile rawText is missing", async () => {
    const res = await POST(
      buildRequest({ action: "parse_profile", rawText: "" })
    );
    expect(res.status).toBe(400);
  });

  it("processes analyze_and_plan and returns valid structured payload", async () => {
    const res = await POST(
      buildRequest({
        action: "analyze_and_plan",
        name: "Alex Rivera",
        currentSkills: ["Python", "SQL"],
        targetRole: "Full Stack Developer",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.readinessScore).toBeGreaterThanOrEqual(0);
    expect(json.readinessScore).toBeLessThanOrEqual(100);
    expect(json.roadmap.length).toBeGreaterThan(0);
    expect(json.diagnosticQuiz).toHaveLength(3);
  });

  it("processes roleplay_simulation and mentor_chat", async () => {
    const roleRes = await POST(
      buildRequest({
        action: "roleplay_simulation",
        targetRole: "Financial Analyst",
        turnNumber: 1,
      })
    );
    expect(roleRes.status).toBe(200);
    const roleJson = await roleRes.json();
    expect(roleJson.scenarioPrompt).toBeTruthy();

    const chatRes = await POST(
      buildRequest({
        action: "mentor_chat",
        userMessage: "I am struggling with DCF modeling",
        readinessScore: 45,
      })
    );
    expect(chatRes.status).toBe(200);
    const chatJson = await chatRes.json();
    expect(chatJson.reply).toBeTruthy();
    expect(chatJson.recommendedAdjustment).toBeTruthy();
  });

  it("enforces rate limiting with HTTP 429 after 30 requests per IP", async () => {
    for (let i = 0; i < 30; i++) {
      const res = await POST(
        buildRequest(
          { action: "mentor_chat", userMessage: "hello" },
          "192.0.2.55"
        )
      );
      expect(res.status).toBe(200);
    }

    const limited = await POST(
      buildRequest(
        { action: "mentor_chat", userMessage: "hello" },
        "192.0.2.55"
      )
    );
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBeTruthy();
  });
});
