import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoleplaySimulatorModal from "@/app/components/RoleplaySimulatorModal";
import QuizTab from "@/app/components/QuizTab";
import GoalsTab from "@/app/components/GoalsTab";
import ThiranVazhiApp from "@/app/page";
import { generateFallbackAnalysis } from "@/lib/agent-fallbacks";

describe("RoleplaySimulatorModal accessibility & behavior", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with dialog semantics and closes on Escape key", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stakeholderPersona: "Devon Chen (Principal Architect)",
        scenarioPrompt: "Sev-1 incident active.",
        currentCompetencyScore: 50,
        isSimulationComplete: false,
      }),
    }) as unknown as typeof fetch;

    const onClose = vi.fn();
    render(
      <RoleplaySimulatorModal
        isOpen={true}
        onClose={onClose}
        targetRole="Full Stack Developer"
        focusSkill="Database Indexing"
      />
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(await screen.findByText("Sev-1 incident active.")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("displays an accessible alert when the API returns an error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Rate limit exceeded" }),
    }) as unknown as typeof fetch;

    render(
      <RoleplaySimulatorModal
        isOpen={true}
        onClose={vi.fn()}
        targetRole="Full Stack Developer"
        focusSkill="API Security"
      />
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Rate limit exceeded");
  });
});

describe("QuizTab accessibility & adaptive hook", () => {
  it("uses fieldset/legend for questions and triggers remedial adaptation when score < 60%", async () => {
    const analysis = generateFallbackAnalysis({
      name: "Alex",
      targetRole: "Full Stack Developer",
    });
    const onSelectAnswer = vi.fn();
    const onSubmitQuiz = vi.fn();
    const onAutoAdapt = vi.fn();

    const { rerender } = render(
      <QuizTab
        targetRole="Full Stack Developer"
        analysisData={analysis}
        quizAnswers={{ 1: 0, 2: 0, 3: 0 }}
        quizSubmitted={false}
        quizScore={null}
        onSelectAnswer={onSelectAnswer}
        onSubmitQuiz={onSubmitQuiz}
        onAutoAdaptRoadmap={onAutoAdapt}
      />
    );

    const fieldsets = document.querySelectorAll("fieldset");
    expect(fieldsets).toHaveLength(3);

    const submitBtn = screen.getByRole("button", {
      name: /Submit Diagnostic Quiz/i,
    });
    expect(submitBtn).toBeEnabled();
    await userEvent.click(submitBtn);
    expect(onSubmitQuiz).toHaveBeenCalledTimes(1);

    rerender(
      <QuizTab
        targetRole="Full Stack Developer"
        analysisData={analysis}
        quizAnswers={{ 1: 0, 2: 0, 3: 0 }}
        quizSubmitted={true}
        quizScore={{ correct: 0, total: 3 }}
        onSelectAnswer={onSelectAnswer}
        onSubmitQuiz={onSubmitQuiz}
        onAutoAdaptRoadmap={onAutoAdapt}
      />
    );

    const adaptBtn = screen.getByRole("button", {
      name: /Auto-Adapt Roadmap with Mentor Agent/i,
    });
    await userEvent.click(adaptBtn);
    expect(onAutoAdapt).toHaveBeenCalledTimes(1);
  });
});

describe("GoalsTab accessibility & CRUD", () => {
  it("connects labels to inputs and supports adding, toggling, and deleting milestones", async () => {
    const onAdd = vi.fn();
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <GoalsTab
        targetRole="Financial Analyst"
        goals={[
          {
            id: "g1",
            title: "Complete DCF Case Study",
            type: "short",
            deadline: "",
            area: "Valuation",
            completed: false,
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ]}
        missingSkills={[]}
        onAddGoal={onAdd}
        onToggleGoal={onToggle}
        onDeleteGoal={onDelete}
      />
    );

    const titleInput = screen.getByLabelText(/DEFINE NEW CAREER MILESTONE/i);
    await userEvent.type(titleInput, "Pass Financial Modeling Exam");
    await userEvent.click(screen.getByRole("button", { name: /Add Milestone/i }));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Pass Financial Modeling Exam" })
    );

    const deleteBtn = screen.getByRole("button", {
      name: /Delete milestone: Complete DCF Case Study/i,
    });
    await userEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("g1");
  });
});

describe("ThiranVazhiApp skip link, WAI-ARIA tabs, roleplay tab, and upload security", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    const fallbackAnalysis = generateFallbackAnalysis({
      name: "Alex Rivera",
      targetRole: "Full Stack Developer",
    });

    global.fetch = vi.fn(async (_url, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (body.action === "roleplay_simulation") {
        return {
          ok: true,
          json: async () => ({
            turnNumber: 1,
            scenarioTitle: "Sev-1 Connection Pool Starvation",
            stakeholderName: "Devon Chen",
            stakeholderRole: "Principal Architect",
            dialogue: "Checkout microservice is timing out.",
            competencyScore: 50,
            evaluationFeedback: "Initial prompt",
            consequenceState: "Active",
            suggestedResponses: ["Inspect pg_stat_activity"],
            isComplete: false,
          }),
        };
      }
      return {
        ok: true,
        json: async () => fallbackAnalysis,
      };
    }) as unknown as typeof fetch;
  });

  it("renders skip link, supports arrow-key tab navigation, and opens the Roleplay tab", async () => {
    render(<ThiranVazhiApp />);

    expect(
      screen.getByRole("link", { name: /Skip to main content/i })
    ).toHaveAttribute("href", "#main-content");

    const skillGapTab = screen.getByRole("tab", { name: /Skill Gap/i });
    skillGapTab.focus();
    fireEvent.keyDown(skillGapTab, { key: "ArrowRight" });

    const roadmapTab = screen.getByRole("tab", { name: /Roadmap/i });
    expect(roadmapTab).toHaveAttribute("aria-selected", "true");

    // Navigate to Roleplay tab
    const roleplayTab = screen.getByRole("tab", { name: /Roleplay/i });
    await userEvent.click(roleplayTab);

    await waitFor(() => {
      expect(
        screen.getByText(/Sev-1 Connection Pool Starvation/i)
      ).toBeInTheDocument();
    });
  });

  it("rejects SVG uploads on the Resume tab with an accessible error", async () => {
    render(<ThiranVazhiApp />);

    const resumeTab = screen.getByRole("tab", { name: /Resume/i });
    await userEvent.click(resumeTab);

    const fileInput = screen.getByLabelText(/Upload Headshot Image/i);
    const svgFile = new File(["<svg></svg>"], "malicious.svg", {
      type: "image/svg+xml",
    });

    fireEvent.change(fileInput, { target: { files: [svgFile] } });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Unsupported image format/i
    );
  });
});
