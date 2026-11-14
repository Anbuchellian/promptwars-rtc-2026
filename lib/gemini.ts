import { GoogleGenAI, Type } from "@google/genai";

export const CANDIDATE_MODELS = ["gemini-4-hydrogen", "gemini-2.5-flash"] as const;

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return cachedClient;
}

export async function generateStructuredJson<T>(
  prompt: string,
  responseSchema: Record<string, unknown>,
  systemInstruction?: string
): Promise<T | null> {
  const client = getGeminiClient();
  if (!client) return null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      if (response?.text) {
        return JSON.parse(response.text) as T;
      }
    } catch {
      // Try next candidate model or fall back gracefully
    }
  }

  return null;
}

export const parseProfileSchema = {
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

export const analyzePlanSchema = {
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
        required: [
          "domain",
          "currentScore",
          "requiredScore",
          "gapStatus",
          "keyMissing",
        ],
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
        required: [
          "id",
          "skill",
          "question",
          "options",
          "correctIndex",
          "explanation",
        ],
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

export const roleplaySimulationSchema = {
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

export const mentorChatSchema = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    recommendedAdjustment: { type: Type.STRING },
  },
  required: ["reply", "recommendedAdjustment"],
};
