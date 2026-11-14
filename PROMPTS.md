# THIRAN VAZHI — Prompt Engineering & Multi-Agent Orchestration Log

> Comprehensive, structured documentation of all prompts, JSON schemas, feedback loops, universal career domain engine architecture, and multi-agent systems behind **THIRAN VAZHI**.

---

## 🧭 Engineering Philosophy: The 5 Universal Tenets

1. **Universal Cross-Disciplinary Intelligence**: All AI agents operate as authoritative domain experts across Science, Engineering, Medicine, Commerce, Law, Humanities, and Agriculture—not just software engineering.
2. **Strict English Executive Output**: Enforcing unambiguous, professional, standard English reasoning, explanations, and dialogues across all backend prompts and user-facing cards.
3. **Zero Schema Drift**: Enforcing rigid JSON output schemas via Gemini's `responseMimeType: "application/json"` and strict `@google/genai` Type definitions to guarantee 100% type safety and prevent UI crashes.
4. **Closed-Loop Failure Adaptation**: Utilizing diagnostic micro-quiz deficits ($<60\%$) as runtime prompt triggers to prepend foundational remedial sprints (`Phase 0 (Emergency Remedial Sprint)`).
5. **Executive Visual & Typographic Standards**: Coupling prompt architecture with a White, Deep Burgundy (`#6D1A36`), and Turquoise Blue (`#0D9488`) design system backed by classic editorial Google Fonts (`Libre_Baskerville`, `Source_Sans_3`, `JetBrains_Mono`).

---

## 📜 Section 1: Universal 4-Agent Pipeline (`analyze_and_plan`)

### Endpoint & Architecture
- **Route**: `POST /api/agents` (`action: "analyze_and_plan"`)
- **Model**: `gemini-2.5-flash` (with resilience fallback to `gemini-3.8-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`)
- **Intent**: Analyzes candidate attributes for ANY career role in the world, assigns a calibrated readiness score (0–100%), generates 5 domain comparison benchmarks authentic to that career, builds a weekly phased roadmap, and generates 3 targeted diagnostic questions.

### Universal Prompt Template
```text
You are orchestrating 4 collaborative AI agents in THIRAN VAZHI as a Universal University & Enterprise Career Engine covering EVERY career domain in the world (Sciences, Engineering, Healthcare, Commerce, Law, Humanities, Agriculture, Technology):
1. Skill Auditor Agent: Evaluates learner profile against the target role (${targetRole}), assigning a realistic 0-100 readiness score and categorizing matched vs missing skills (with priority and reason). Computes 5 domain comparison pillars authentic to ${targetRole}.
2. Curriculum Architect Agent: Designs a phased, structured, practical weekly learning roadmap with authentic hands-on projects, lab simulations, courses, or industry exercises (marking isRemedial: true if remedial intervention is requested).
3. Assessment Examiner Agent: Generates exactly 3 rigorous, domain-accurate diagnostic multiple-choice questions targeting missing skills for ${targetRole}, with 4 options, 0-based correctIndex, and clear technical explanation.
4. Adaptive Mentor Agent: Synthesizes agent findings, provides actionable strategic advice, and explains adjustments (especially if adaptationContext is provided).

Learner Data:
- Name: ${name || "Learner"}
- Current Skills: ${JSON.stringify(currentSkills || ["Core Foundations"])}
- Projects: ${projects || "Applied coursework & practical projects"}
- Certifications: ${certifications || "Degree / Professional Certificate"}
- Target Role: ${targetRole || "Full Stack Developer"}
- Adaptation Context / Failure Telemetry: ${JSON.stringify(adaptationContext || null)}

Output valid JSON strictly adhering to the schema in clear, professional English.
```

### Response Schema Enforcement (`analyzePlanSchema`)
```typescript
const analyzePlanSchema = {
  type: Type.OBJECT,
  properties: {
    agentLogs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          agentName: {
            type: Type.STRING,
            enum: [
              "Skill Auditor Agent",
              "Curriculum Architect Agent",
              "Assessment Examiner Agent",
              "Adaptive Mentor Agent",
            ],
          },
          status: { type: Type.STRING, enum: ["completed"] },
          thought: { type: Type.STRING },
        },
        required: ["agentName", "status", "thought"],
      },
    },
    readinessScore: { type: Type.NUMBER },
    matchedSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          reason: { type: Type.STRING },
        },
        required: ["skill", "priority", "reason"],
      },
    },
    domainComparison: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          currentScore: { type: Type.NUMBER },
          requiredScore: { type: Type.NUMBER },
          gapStatus: {
            type: Type.STRING,
            enum: ["Strong Match", "Moderate Gap", "Critical Gap"],
          },
          keyMissing: { type: Type.STRING },
        },
        required: ["domain", "currentScore", "requiredScore", "gapStatus", "keyMissing"],
      },
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          duration: { type: Type.STRING },
          focusSkill: { type: Type.STRING },
          isRemedial: { type: Type.BOOLEAN },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: {
                  type: Type.STRING,
                  enum: ["Course", "Tutorial", "Hands-on Project"],
                },
                description: { type: Type.STRING },
              },
              required: ["title", "type", "description"],
            },
          },
        },
        required: ["phase", "duration", "focusSkill", "isRemedial", "resources"],
      },
    },
    diagnosticQuiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          skill: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ["id", "skill", "question", "options", "correctIndex", "explanation"],
      },
    },
    mentorAdvice: { type: Type.STRING },
  },
  required: [
    "agentLogs",
    "readinessScore",
    "matchedSkills",
    "missingSkills",
    "roadmap",
    "diagnosticQuiz",
    "mentorAdvice",
  ],
};
```

---

## ⚡ Section 2: 5-Axis Pentagon Radar Telemetry Mapping

The Free Fire-style SVG Pentagon Radar Chart samples 5 core competency dimensions directly from the Skill Auditor Agent's domain comparison telemetry:

1. **Domain Mastery**: Evaluates theoretical depth, scientific principles, or systemic domain concepts.
2. **Practical Execution**: Evaluates lab proficiency, hands-on coding, instrumentation assays, or financial modeling.
3. **Analytical Problem Solving**: Evaluates root-cause diagnosis, quantitative calculations, or structural optimization.
4. **Industry Tools & Compliance**: Evaluates GMP/GLP, regulatory dossiers, CAD/CAM tolerances, or SEC reporting.
5. **Communication & Leadership**: Evaluates technical pitchbooks, memorandum synthesis, and cross-team delivery.

---

## 🎯 Section 3: Goal Setting & Milestone Improvement Tracking

Career goals interface saved and synced with browser `localStorage`:
```typescript
interface CareerGoal {
  id: string;
  title: string;
  type: "short" | "long";
  deadline: string;
  area: string;
  completed: boolean;
  createdAt: string;
}
```
Users can one-click convert any missing skill identified by **Agent 1 (Skill Auditor)** directly into an actionable sprint milestone.

---

## 📄 Section 4: Universal Profile & Resume Parser (`parse_profile`)

### Endpoint & Architecture
- **Route**: `POST /api/agents` (`action: "parse_profile"`)
- **Model**: `gemini-2.5-flash` (with resilience fallback to `gemini-3.8-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`)
- **Intent**: Ingests unstructured resume text, LinkedIn bios, or candidate summaries across all 6 career categories, extracting candidate identity, structured skill arrays, project summaries, credentials, and suggesting a calibrated target career role.

### Universal Prompt Template
```text
You are a Universal AI Resume, Bio & Profile Parser with expertise across all university and industry disciplines (Sciences, Engineering, Healthcare, Finance, Law, Technology, Agriculture, Humanities).
Analyze the following raw resume, bio, or LinkedIn summary:
"${rawText || ""}"

Extract the candidate's:
1. name (string)
2. currentSkills (array of strings, e.g. ["Organic Chemistry", "HPLC", "Excel", "Python", "Contract Law", "CAD", "Six Sigma"])
3. projects (string summary of key projects or research)
4. certifications (string summary of certifications, degrees, or licenses)
5. suggestedTargetRole (string representing their target career aspiration across any discipline)

Return strictly valid JSON adhering to the schema in clear, professional English.
```

### Response Schema Enforcement (`parseProfileSchema`)
```typescript
const parseProfileSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    currentSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    projects: { type: Type.STRING },
    certifications: { type: Type.STRING },
    suggestedTargetRole: { type: Type.STRING },
  },
  required: ["name", "currentSkills", "projects", "certifications"],
};
```

---

## 🎭 Section 5: Roleplay Simulator Agent (`roleplay_simulation` / `simulate_scenario`)

### Endpoint & Architecture
- **Route**: `POST /api/agents` (`action: "roleplay_simulation"` or `"simulate_scenario"`)
- **Model**: `gemini-2.5-flash` (with resilience fallback to `gemini-3.8-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`)
- **Persona**: Operates as a realistic senior stakeholder, lab director, VP of QA, or managing director in the candidate's target role.
- **Protocol**: 3-turn interactive workplace dilemma with consequence escalation, real-time competency score evaluation (0–100), and micro-credential verification upon completion.

### Prompt Specification
```text
You are the Roleplay Simulator Agent in THIRAN VAZHI, operating as a realistic senior stakeholder, lab director, or client in the ${targetRole} domain.

Context:
- Target Role: ${targetRole}
- Focus Skill Being Tested: ${focusSkill}
- Current Simulation Turn: ${turnNumber} of 3
- Previous Scenario State: ${JSON.stringify(scenarioHistory)}
- Learner's Latest Action/Response: "${userResponse}"

Instructions:
1. If turnNumber === 1, present an urgent, domain-authentic workplace dilemma testing ${focusSkill} (e.g., a clinical trial deviation, a financial model audit discrepancy, or a production outage) with concrete numbers and constraints.
2. If turnNumber > 1, evaluate the learner's response rigorously against industry standards for ${targetRole}. Update the Competency Score (0-100), identify specific technical strengths or flaws in their reasoning, and advance the scenario to the next consequence.
3. Keep the tone immersive, demanding, and true to the profession.

Output valid JSON strictly adhering to the schema in clear, professional English.
```

### JSON Schema Enforcement (`roleplaySimulationSchema`)
```typescript
const roleplaySimulationSchema = {
  type: Type.OBJECT,
  properties: {
    scenarioTitle: { type: Type.STRING },
    stakeholderName: { type: Type.STRING },
    stakeholderRole: { type: Type.STRING },
    dialogue: { type: Type.STRING },
    turnNumber: { type: Type.INTEGER },
    competencyScore: { type: Type.NUMBER },
    evaluationFeedback: { type: Type.STRING },
    consequenceState: { type: Type.STRING },
    suggestedResponses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    isComplete: { type: Type.BOOLEAN },
  },
  required: [
    "scenarioTitle",
    "stakeholderName",
    "stakeholderRole",
    "dialogue",
    "turnNumber",
    "competencyScore",
    "evaluationFeedback",
    "consequenceState",
    "isComplete",
  ],
};
```

---

## 🖨️ Section 6: Resume Architect & Multi-Style Print Export

Resume preview templates are dynamically populated from:
- `name`: Candidate name
- `resumeHeadline`: User-defined professional headline
- `targetRole`: Selected university/enterprise role
- `skillsList`: Verified skills inventory
- `projects`: Extracted or input practical project summary
- `certifications`: Degrees and professional credentials
- `analysisData.readinessScore`: Calibrated readiness score
- `analysisData.roadmap`: Advanced specialization modules

Print export is powered by `@media print` CSS and `window.print()` generating pixel-perfect PDFs across 3 distinct archetypes:
1. **Executive Burgundy Classic**
2. **Modern Turquoise Split**
3. **Minimal Academic Serif**
