import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoleplaySimulatorModal from "@/app/components/RoleplaySimulatorModal";
import QuizTab from "@/app/components/QuizTab";
import GoalsTab from "@/app/components/GoalsTab";
import RoadmapTab from "@/app/components/RoadmapTab";
import ReadinessTab from "@/app/components/ReadinessTab";
import ProfileSidebar from "@/app/components/ProfileSidebar";
import ThiranVazhiApp from "@/app/page";
import { generateFallbackAnalysis } from "@/lib/agent-fallbacks";
import { STUDENT_PRESETS } from "@/lib/skills-data";

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

describe("QuizTab accessibility, retake & adaptive hook", () => {
  it("uses fieldset/legend, radio options, supports retake, and triggers remedial adaptation when score < 60%", async () => {
    const analysis = generateFallbackAnalysis({
      name: "Karthik Sundaram",
      targetRole: "Full Stack Developer",
    });
    const onSelectAnswer = vi.fn();
    const onSubmitQuiz = vi.fn();
    const onRetakeQuiz = vi.fn();
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
        onRetakeQuiz={onRetakeQuiz}
        onAutoAdaptRoadmap={onAutoAdapt}
      />
    );

    const fieldsets = document.querySelectorAll("fieldset");
    expect(fieldsets).toHaveLength(3);
    expect(screen.getAllByRole("radio").length).toBeGreaterThan(0);

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
        onRetakeQuiz={onRetakeQuiz}
        onAutoAdaptRoadmap={onAutoAdapt}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Retake Quiz/i }));
    expect(onRetakeQuiz).toHaveBeenCalledTimes(1);

    const adaptBtn = screen.getByRole("button", {
      name: /Auto-Adapt Roadmap with Mentor Agent/i,
    });
    await userEvent.click(adaptBtn);
    expect(onAutoAdapt).toHaveBeenCalledTimes(1);
  });
});

describe("GoalsTab accessibility, filtering & CRUD", () => {
  it("connects labels to inputs, filters goals, and supports adding and deleting milestones", async () => {
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
          {
            id: "g2",
            title: "Publish Long-Term Portfolio Review",
            type: "long",
            deadline: "",
            area: "Corporate Finance",
            completed: true,
            createdAt: "2026-01-02T00:00:00.000Z",
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

    const searchInput = screen.getByLabelText(/Search milestones/i);
    await userEvent.type(searchInput, "Portfolio");
    expect(screen.queryByText("Complete DCF Case Study")).not.toBeInTheDocument();
    expect(
      screen.getByText("Publish Long-Term Portfolio Review")
    ).toBeInTheDocument();

    await userEvent.clear(searchInput);

    const deleteBtn = screen.getByRole("button", {
      name: /Delete milestone: Complete DCF Case Study/i,
    });
    await userEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("g1");
  });
});

describe("RoadmapTab & ReadinessTab new UI features", () => {
  it("filters roadmap modules by search query and resource format", async () => {
    const analysis = generateFallbackAnalysis({
      name: "Mateo Alvarez",
      targetRole: "Robotics Engineer",
      currentSkills: ["SolidWorks", "C / C++"],
    });

    render(
      <RoadmapTab
        targetRole="Robotics Engineer"
        analysisData={analysis}
        completedItems={{}}
        progressPercent={0}
        onToggleItemCompletion={vi.fn()}
        onLaunchSimulator={vi.fn()}
      />
    );

    expect(
      screen.getByText(/ROS 2 Control & Forward\/Inverse Kinematics Workshop/i)
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Hands-on Project" })
    );
    expect(
      screen.queryByText(/ROS 2 Control & Forward\/Inverse Kinematics Workshop/i)
    ).not.toBeInTheDocument();

    const searchInput = screen.getByLabelText(/Search roadmap modules/i);
    await userEvent.type(searchInput, "nonexistent-module-xyz");
    expect(
      screen.getByText(/No roadmap modules match your current filter/i)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Reset Filters/i }));
    expect(
      screen.queryByText(/No roadmap modules match your current filter/i)
    ).not.toBeInTheDocument();
  });

  it("triggers one-click Add Goal from ReadinessTab missing skills", async () => {
    const analysis = generateFallbackAnalysis({
      name: "Karthik Sundaram",
      targetRole: "Full Stack Developer",
      currentSkills: ["Python Programming"],
    });
    const onAddGoalFromSkill = vi.fn();

    render(
      <ReadinessTab
        name="Karthik Sundaram"
        targetRole="Full Stack Developer"
        analysisData={analysis}
        domainComparisonList={analysis.domainComparison || []}
        completedCount={1}
        totalResources={6}
        onAddGoalFromSkill={onAddGoalFromSkill}
      />
    );

    const addGoalButtons = screen.getAllByRole("button", { name: /Add Goal/i });
    expect(addGoalButtons.length).toBeGreaterThan(0);
    await userEvent.click(addGoalButtons[0]);
    expect(onAddGoalFromSkill).toHaveBeenCalledTimes(1);
  });
});

describe("ProfileSidebar 4 candidate records & language selector", () => {
  it("renders all 4 candidate records and notifies on preset selection and language change", async () => {
    const onLoadPreset = vi.fn();
    const onPreferredLanguageChange = vi.fn();

    render(
      <ProfileSidebar
        name={STUDENT_PRESETS[0].name}
        onNameChange={vi.fn()}
        targetRole={STUDENT_PRESETS[0].targetRole}
        onTargetRoleChange={vi.fn()}
        preferredLanguage="English"
        onPreferredLanguageChange={onPreferredLanguageChange}
        skillsList={STUDENT_PRESETS[0].skills}
        onToggleSkill={vi.fn()}
        onAddSkill={vi.fn()}
        onRemoveSkill={vi.fn()}
        projects={STUDENT_PRESETS[0].projects}
        onProjectsChange={vi.fn()}
        certifications={STUDENT_PRESETS[0].certifications}
        onCertificationsChange={vi.fn()}
        resumeText=""
        onResumeTextChange={vi.fn()}
        isParsingResume={false}
        parseSuccessMsg={null}
        onExtractSkillsFromResume={vi.fn()}
        activePresetId={1}
        onLoadPreset={onLoadPreset}
        onResetProfile={vi.fn()}
        onRunPipeline={vi.fn()}
        isLoading={false}
        progressPercent={0}
        completedCount={0}
        totalResources={6}
      />
    );

    for (const preset of STUDENT_PRESETS) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
    }

    await userEvent.click(screen.getByText("Mateo Alvarez"));
    expect(onLoadPreset).toHaveBeenCalledWith(4);

    const langSelect = screen.getByLabelText(/Guidance Language/i);
    await userEvent.selectOptions(langSelect, "Tamil");
    expect(onPreferredLanguageChange).toHaveBeenCalledWith("Tamil");
  });
});

describe("ThiranVazhiApp skip link, starter goals, WAI-ARIA tabs, roleplay tab, and upload security", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    const fallbackAnalysis = generateFallbackAnalysis({
      name: "Karthik Sundaram",
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

  it("renders skip link, seeds 4 starter goals, supports arrow-key tab navigation, and opens Roleplay tab", async () => {
    render(<ThiranVazhiApp />);

    expect(
      screen.getByRole("link", { name: /Skip to main content/i })
    ).toHaveAttribute("href", "#main-content");

    const skillGapTab = screen.getByRole("tab", { name: /Skill Gap/i });
    skillGapTab.focus();
    fireEvent.keyDown(skillGapTab, { key: "ArrowRight" });

    const roadmapTab = screen.getByRole("tab", { name: /Roadmap/i });
    expect(roadmapTab).toHaveAttribute("aria-selected", "true");

    const goalsTab = screen.getByRole("tab", { name: /Goals/i });
    await userEvent.click(goalsTab);
    expect(
      screen.getByText(/Build idempotent webhook worker queue/i)
    ).toBeInTheDocument();

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
