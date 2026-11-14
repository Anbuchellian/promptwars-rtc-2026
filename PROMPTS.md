# PathForge AI - Prompt Engineering Documentation

## Prompt 1: Multi-Agent Personalized Learning & Career Navigation Platform

```text
Build a Multi-Agent Personalized Learning & Career Navigation Platform called "PathForge AI" in this Next.js App Router project using @google/genai (model: "gemini-2.5-flash") and process.env.GEMINI_API_KEY.

1. Create app/api/agents/route.ts that simulates and executes 4 collaborating AI agents using Gemini Structured JSON Output (responseMimeType: "application/json" and strict responseSchema):
   - Support two actions via POST:
     a) action: "analyze_and_plan" (takes user profile: name, currentSkills, projects, certifications, targetRole, and optional adaptationContext like failedTopic or roleChangeReason).
        Returns JSON with:
        - agentLogs: array of 4 objects { agentName: "Skill Auditor Agent" | "Curriculum Architect Agent" | "Assessment Examiner Agent" | "Adaptive Mentor Agent", status: "completed", thought: string } showing how each agent collaborated.
        - readinessScore: number (0-100)
        - matchedSkills: array of strings
        - missingSkills: array of { skill: string, priority: "High" | "Medium" | "Low", reason: string }
        - roadmap: array of { phase: string, duration: string, focusSkill: string, isRemedial: boolean, resources: array of { title: string, type: "Course" | "Tutorial" | "Hands-on Project", description: string } }
        - diagnosticQuiz: array of 3 multiple-choice questions targeting the missingSkills, each with { id: number, skill: string, question: string, options: array of 4 strings, correctIndex: number, explanation: string }
        - mentorAdvice: string (personalized strategic guidance, explicitly explaining any adjustments made if adaptationContext was provided).
     b) action: "mentor_chat" (takes userMessage, currentProfile, readinessScore, missingSkills, and completedModules) and returns { reply: string, recommendedAdjustment: string }.

2. Build a sleek, modern dark-mode UI in app/page.tsx with:
   - Left Sidebar / Top Profile Panel: Learner Profile inputs (Name, Existing Skills tags, Projects/Certifications, and a Target Career Role selector with options like "Full Stack Developer", "AI/ML Engineer", "Data Scientist", "Cloud DevOps Engineer", or custom input) + a one-click "Load Sample Student (Python/SQL -> Full Stack)" button.
   - Live Multi-Agent Collaboration Bar: Visual cards showing the 4 AI agents ("Skill Auditor", "Curriculum Architect", "Assessment Examiner", "Adaptive Mentor") and their live reasoning logs whenever an analysis or adaptation runs.
   - Main Dashboard Tabs:
     1) "Skill Gap & Readiness": Visual readiness score gauge, Matched Skills badges, and prioritized Missing Skills cards.
     2) "Adaptive Roadmap": Interactive week-by-week learning path with checkboxes to track module completion and update a live Progress Bar (saved in localStorage).
     3) "Skill Assessment (Triggers Adaptation)": Interactive 3-question quiz generated for their missing skills. When submitted, calculate the score—if score < 2/3, show an alert and let the user click "Auto-Adapt Roadmap with Mentor Agent" which re-runs the pipeline with failed skills so the Mentor & Architect agents insert remedial foundation modules!
     4) "AI Mentor": Slide-over or tab chat where the learner can ask questions or request career pivots, with quick-action chips like "Pivot to AI Engineer" or "I'm struggling with React".

Keep .env.local untouched and do not run npm install since @google/genai and lucide-react are already installed.
```

---

## Prompt 2: High-Impact Upgrades (Resume Auto-Import & Domain Gap Radar Bars)

```text
Upgrade PathForge AI with two high-impact features while keeping all existing functionality working:
1. "Auto-Import from Resume / Bio": Add a collapsible "Paste Resume or LinkedIn Bio" box in the Learner Profile sidebar with an "Extract Skills Automatically" button (or add a backend action "parse_profile" in app/api/agents/route.ts using gemini-2.5-flash structured JSON) that automatically fills in Name, Current Skills, Projects, and Certifications from raw text.
2. "Visual Skill Gap Radar / Comparison Bars": On the Skill Gap & Readiness tab, add a clean visual comparison bar chart (built with pure Tailwind CSS—no external chart library needed) comparing Current Skill Mastery vs. Target Role Requirement across key domains (Frontend, Backend, Database, Cloud/DevOps, AI/System Design).
3. Keep .env.local untouched and do not run npm install.
```
