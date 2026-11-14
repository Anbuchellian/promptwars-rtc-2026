import type { AnalysisData, DomainComparison } from "./types";

export function calculateDomainComparison(
  currentSkillsList: string[],
  targetRole: string
): DomainComparison[] {
  const role = targetRole.toLowerCase();
  const lowerSkills = currentSkillsList.map((s) => s.toLowerCase());

  if (
    role.includes("pharma") ||
    role.includes("chemist") ||
    role.includes("biotech") ||
    role.includes("clinical") ||
    role.includes("toxicolog")
  ) {
    const hasOrgChem = lowerSkills.some(
      (s) => s.includes("chem") || s.includes("synthesis")
    );
    const hasHPLC = lowerSkills.some(
      (s) =>
        s.includes("hplc") ||
        s.includes("chromatograph") ||
        s.includes("titration")
    );
    const hasGMP = lowerSkills.some(
      (s) => s.includes("gmp") || s.includes("safety") || s.includes("quality")
    );

    return [
      {
        domain: "Analytical Chemistry & Assays",
        currentScore: hasHPLC ? 75 : 30,
        requiredScore: 85,
        gapStatus: hasHPLC ? "Strong Match" : "Critical Gap",
        keyMissing: "HPLC Method Validation & Chromatography",
      },
      {
        domain: "Dosage Formulation & Delivery",
        currentScore: hasOrgChem ? 55 : 20,
        requiredScore: 90,
        gapStatus: "Critical Gap",
        keyMissing: "Controlled-Release Drug Delivery Systems",
      },
      {
        domain: "Regulatory Compliance (GMP/GLP)",
        currentScore: hasGMP ? 80 : 35,
        requiredScore: 85,
        gapStatus: hasGMP ? "Strong Match" : "Moderate Gap",
        keyMissing: "FDA 21 CFR Part 211 Documentation",
      },
      {
        domain: "Bioavailability & Pharmacokinetics",
        currentScore: 25,
        requiredScore: 75,
        gapStatus: "Critical Gap",
        keyMissing: "In Vitro-In Vivo Dissolution Correlation (IVIVC)",
      },
      {
        domain: "Instrumental Characterization",
        currentScore: hasOrgChem ? 65 : 25,
        requiredScore: 80,
        gapStatus: "Moderate Gap",
        keyMissing: "Differential Scanning Calorimetry (DSC) & Powder XRD",
      },
    ];
  }

  if (
    role.includes("financ") ||
    role.includes("bank") ||
    role.includes("account") ||
    role.includes("audit") ||
    role.includes("consult")
  ) {
    const hasExcel = lowerSkills.some(
      (s) => s.includes("excel") || s.includes("spreadsheet")
    );
    const hasAccounting = lowerSkills.some(
      (s) => s.includes("account") || s.includes("gaap") || s.includes("tax")
    );
    const hasModeling = lowerSkills.some(
      (s) =>
        s.includes("model") || s.includes("valuation") || s.includes("dcf")
    );

    return [
      {
        domain: "Financial Accounting & Reporting",
        currentScore: hasAccounting ? 85 : 30,
        requiredScore: 80,
        gapStatus: hasAccounting ? "Strong Match" : "Critical Gap",
        keyMissing: "3-Statement Consolidation & IFRS/GAAP",
      },
      {
        domain: "Valuation & DCF Modeling",
        currentScore: hasModeling ? 80 : hasExcel ? 45 : 20,
        requiredScore: 90,
        gapStatus: hasModeling ? "Strong Match" : "Critical Gap",
        keyMissing: "Unlevered Free Cash Flow & WACC Sensitivity Analysis",
      },
      {
        domain: "Advanced Excel & Financial Automation",
        currentScore: hasExcel ? 80 : 25,
        requiredScore: 85,
        gapStatus: hasExcel ? "Strong Match" : "Critical Gap",
        keyMissing: "Dynamic Scenario Switchers & VBA / PowerQuery",
      },
      {
        domain: "Corporate Capital Structure",
        currentScore: 35,
        requiredScore: 75,
        gapStatus: "Moderate Gap",
        keyMissing: "Debt Schedule Optimization & Covenant Analysis",
      },
      {
        domain: "Executive Presentation & Pitchbooks",
        currentScore: 60,
        requiredScore: 80,
        gapStatus: "Moderate Gap",
        keyMissing: "C-Suite Investment Memorandum Synthesis",
      },
    ];
  }

  if (
    role.includes("mechanic") ||
    role.includes("civil") ||
    role.includes("aerospace") ||
    role.includes("embedded") ||
    role.includes("robot") ||
    role.includes("electrochem")
  ) {
    const hasCAD = lowerSkills.some(
      (s) =>
        s.includes("cad") || s.includes("solidworks") || s.includes("autocad")
    );
    const hasMath = lowerSkills.some(
      (s) =>
        s.includes("matlab") || s.includes("python") || s.includes("analysis")
    );

    return [
      {
        domain: "3D CAD & Parametric Modeling",
        currentScore: hasCAD ? 85 : 30,
        requiredScore: 90,
        gapStatus: hasCAD ? "Strong Match" : "Critical Gap",
        keyMissing: "GD&T and Complex Surface Assemblies",
      },
      {
        domain: "Finite Element Analysis (FEA)",
        currentScore: hasMath ? 50 : 20,
        requiredScore: 85,
        gapStatus: "Critical Gap",
        keyMissing: "Structural Stress, Thermal & Modal Simulation",
      },
      {
        domain: "Materials Selection & Metallurgy",
        currentScore: 40,
        requiredScore: 75,
        gapStatus: "Moderate Gap",
        keyMissing: "Fatigue Life & Corrosion Prevention Standards",
      },
      {
        domain: "Design for Manufacturing (DFM/DFA)",
        currentScore: 35,
        requiredScore: 80,
        gapStatus: "Critical Gap",
        keyMissing: "Injection Molding & CNC Machining Tolerancing",
      },
      {
        domain: "Prototyping & Physical Testing",
        currentScore: 55,
        requiredScore: 75,
        gapStatus: "Moderate Gap",
        keyMissing: "Vibration & Dynamic Load Testing Protocols",
      },
    ];
  }

  const isFullStack = role.includes("full stack");
  const isAIML = role.includes("ai") || role.includes("ml");

  let feCurrent = 20;
  if (lowerSkills.some((s) => s.includes("html") || s.includes("css")))
    feCurrent += 15;
  if (lowerSkills.some((s) => s.includes("javascript") || s.includes("react")))
    feCurrent += 45;

  let beCurrent = 20;
  if (
    lowerSkills.some(
      (s) => s.includes("python") || s.includes("node") || s.includes("api")
    )
  )
    beCurrent += 50;

  let dbCurrent = 20;
  if (
    lowerSkills.some(
      (s) =>
        s.includes("sql") || s.includes("database") || s.includes("postgres")
    )
  )
    dbCurrent += 60;

  return [
    {
      domain: "Frontend Architecture",
      currentScore: Math.min(95, feCurrent),
      requiredScore: isFullStack ? 85 : 40,
      gapStatus:
        feCurrent >= 75
          ? "Strong Match"
          : feCurrent >= 40
          ? "Moderate Gap"
          : "Critical Gap",
      keyMissing: "React.js Reactive Component State",
    },
    {
      domain: "Backend Systems & APIs",
      currentScore: Math.min(95, beCurrent),
      requiredScore: 80,
      gapStatus:
        beCurrent >= 70
          ? "Strong Match"
          : beCurrent >= 40
          ? "Moderate Gap"
          : "Critical Gap",
      keyMissing: "RESTful Endpoints & Asynchronous Runtime",
    },
    {
      domain: "Database Architecture",
      currentScore: Math.min(95, dbCurrent),
      requiredScore: 75,
      gapStatus:
        dbCurrent >= 75
          ? "Strong Match"
          : dbCurrent >= 40
          ? "Moderate Gap"
          : "Critical Gap",
      keyMissing: "Relational Normalization & Indexing",
    },
    {
      domain: "DevOps & Cloud Systems",
      currentScore: 35,
      requiredScore: 70,
      gapStatus: "Moderate Gap",
      keyMissing: "Docker Containerization & CI/CD",
    },
    {
      domain: "Distributed System Design",
      currentScore: isAIML ? 45 : 30,
      requiredScore: isAIML ? 90 : 65,
      gapStatus: "Moderate Gap",
      keyMissing: "Microservice Decoupling & Caching Protocols",
    },
  ];
}

export function parseProfileFallback(rawText: string) {
  const text = rawText || "";
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let name = "Alex Rivera";
  const nameLine = lines.find((l) =>
    /^(name|full name|candidate):\s*/i.test(l)
  );
  if (nameLine) {
    name = nameLine.replace(/^(name|full name|candidate):\s*/i, "").trim();
  } else if (
    lines.length > 0 &&
    lines[0].length < 40 &&
    !lines[0].includes(":")
  ) {
    name = lines[0];
  }

  const skillKeywords: Record<string, string> = {
    python: "Python",
    sql: "SQL",
    postgres: "PostgreSQL",
    javascript: "JavaScript",
    react: "React",
    "node.js": "Node.js",
    docker: "Docker",
    aws: "AWS",
    git: "Git",
    autocad: "AutoCAD",
    solidworks: "SolidWorks",
    matlab: "MATLAB",
    "organic chemistry": "Organic Chemistry",
    titration: "Titration",
    hplc: "HPLC",
    spectroscopy: "Spectroscopy",
    bioinformatics: "Bioinformatics",
    pharmacology: "Pharmacology",
    "cell culture": "Cell Culture",
    pcr: "PCR",
    "gmp/glp": "GMP/GLP Compliance",
    accounting: "Accounting",
    excel: "Excel",
    "financial modeling": "Financial Modeling",
    valuation: "Valuation",
    budgeting: "Budgeting",
    taxation: "Taxation",
    "risk management": "Risk Management",
    "project management": "Project Management",
    "contract law": "Contract Law",
    "intellectual property": "Intellectual Property",
    "public speaking": "Public Speaking",
    negotiation: "Negotiation",
  };

  const detectedSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  for (const [key, normalized] of Object.entries(skillKeywords)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lowerText)) {
      detectedSkills.add(normalized);
    }
  }

  if (detectedSkills.size === 0) {
    detectedSkills.add("Analytical Thinking");
    detectedSkills.add("Problem Solving");
    detectedSkills.add("Project Management");
  }

  const projectLines = lines.filter((l) =>
    /project|built|developed|created|github|app|system|api|synthesis|analysis|audit|research|trial/i.test(
      l
    )
  );
  const projects =
    projectLines.length > 0
      ? projectLines.slice(0, 2).join(". ")
      : "Undergraduate capstone research project and applied industry analysis";

  const certLines = lines.filter((l) =>
    /cert|degree|bachelor|master|certified|licensed|bootcamp|coursera|udemy|cpa|cfa|phd|msc/i.test(
      l
    )
  );
  const certifications =
    certLines.length > 0
      ? certLines.slice(0, 2).join(", ")
      : "Bachelor of Science / Commerce Degree";

  let suggestedTargetRole = "Full Stack Developer";
  if (
    /pharma|chemist|drug|formulation|clinical|biology|medicine/i.test(
      lowerText
    )
  ) {
    suggestedTargetRole = "Pharmaceutical Formulation Scientist";
  } else if (/finance|accounting|bank|audit|financial|cfa/i.test(lowerText)) {
    suggestedTargetRole = "Financial Analyst";
  } else if (/law|legal|contract|patent/i.test(lowerText)) {
    suggestedTargetRole = "Corporate Lawyer";
  } else if (/mechanical|cad|solidworks|robotics/i.test(lowerText)) {
    suggestedTargetRole = "Mechanical Design Engineer";
  } else if (/ai|ml|machine learning|deep learning/i.test(lowerText)) {
    suggestedTargetRole = "AI/ML Engineer";
  }

  return {
    name,
    currentSkills: Array.from(detectedSkills),
    projects,
    certifications,
    suggestedTargetRole,
  };
}

export function generateRoleplayFallback(params: {
  targetRole?: string;
  focusSkill?: string;
  turnNumber?: number;
  scenarioHistory?: unknown[];
  userResponse?: string;
}) {
  const role = (params.targetRole || "Full Stack Developer").toLowerCase();
  const turn = Number(params.turnNumber) || 1;
  const userResp = (params.userResponse || "").toLowerCase();

  if (
    role.includes("pharma") ||
    role.includes("chemist") ||
    role.includes("formulation") ||
    role.includes("biotech")
  ) {
    if (turn === 1) {
      return {
        scenarioTitle: "USP Dissolution Deviation & Emergency Batch Quarantine",
        stakeholderName: "Dr. Harrison Vance, Ph.D.",
        stakeholderRole: "VP of Pharmaceutical Development & Quality Assurance",
        dialogue:
          "We have an urgent issue on Commercial Tableting Line 4. Pilot Batch #BPR-8829 of our Extended-Release Metformin (500mg) just failed Stage 1 USP dissolution testing at the 2-hour interval—Q released is only 26% against our validated 35–50% specification. The press is halted at a burn rate of $18,500/hr, and the regulatory audit team arrives in 72 hours. As Lead Formulation Scientist, what immediate protocol do you execute to investigate and isolate the root cause?",
        turnNumber: 1,
        competencyScore: 50,
        evaluationFeedback:
          "Initial challenge presented. Requires rigorous isolation of analytical testing variables (USP apparatus calibration, dissolution media deaeration) versus physicochemical formulation variables (granulation binder, particle size distribution).",
        consequenceState:
          "Line 4 Quarantined · Investigation Clock Active (0/72 Hours)",
        suggestedResponses: [
          "Quarantine Batch #BPR-8829, verify dissolution apparatus paddle wobble and vessel temperature, and pull retained granule samples for sieve particle size and moisture analysis.",
          "Immediately instruct the line operator to speed up granulation drying time and double the binder ratio for the next batch.",
          "Authorize re-testing of 12 additional dosage units under identical dissolution parameters without calibrating the vessels.",
        ],
        isComplete: false,
      };
    }
    if (turn === 2) {
      const isGood =
        userResp.includes("quarantine") ||
        userResp.includes("paddle") ||
        userResp.includes("particle") ||
        userResp.includes("moisture") ||
        userResp.includes("sieve") ||
        userResp.includes("calibrate");
      return {
        scenarioTitle: "USP Dissolution Deviation & Emergency Batch Quarantine",
        stakeholderName: "Dr. Harrison Vance, Ph.D.",
        stakeholderRole: "VP of Pharmaceutical Development & Quality Assurance",
        dialogue: isGood
          ? "Excellent diagnostic discipline. Your apparatus verification confirmed Paddle #3 had an uncalibrated 1.2mm wobble, but the analytical lab also detected a 14% increase in fines during wet granulation milling, slowing drug diffusion through the hydrogel matrix. The plant director wants to discard the entire $85,000 API lot. How do you salvage or remediate the batch while remaining compliant with FDA 21 CFR Part 211?"
          : "Careful! Proceeding without rigorous apparatus calibration and root-cause verification risks an official FDA 483 audit finding. The QA director has stepped in and halted the entire manufacturing suite. How do you scientifically re-establish control and demonstrate process capability?",
        turnNumber: 2,
        competencyScore: isGood ? 78 : 45,
        evaluationFeedback: isGood
          ? "Strong analytical decision-making. You correctly prioritized GLP apparatus qualification before altering formulation variables, avoiding costly batch rework."
          : "Deficit identified: Bypassing calibration checks in a regulated GMP environment causes regulatory non-compliance. Calibration verification is always Step 1.",
        consequenceState: isGood
          ? "Apparatus Calibrated · Granulation Fines Isolated"
          : "QA Escalation Active · Audit Risk Elevated",
        suggestedResponses: [
          "Initiate an Out-of-Specification (OOS) phase-2 root-cause investigation, conduct a rework feasibility study for dry-blend lubricated re-compression, and document CAPA.",
          "Blend the off-spec granules with an oversized granule batch to artificially meet the mean dissolution rate without filing a deviation.",
          "File an immediate emergency batch release waiver arguing that 26% release is close enough to therapeutic levels.",
        ],
        isComplete: false,
      };
    }
    const isPass =
      userResp.includes("oos") ||
      userResp.includes("capa") ||
      userResp.includes("rework") ||
      userResp.includes("re-compression") ||
      userResp.includes("deviation");
    return {
      scenarioTitle: "USP Dissolution Deviation — Final Executive Resolution",
      stakeholderName: "Dr. Harrison Vance, Ph.D.",
      stakeholderRole: "VP of Pharmaceutical Development & Quality Assurance",
      dialogue: isPass
        ? "Outstanding leadership under regulatory pressure. Your formal OOS and CAPA protocol successfully remediated the batch, satisfied quality compliance, and saved the plant over $85,000 in raw material loss. You have demonstrated senior-level formulation competency."
        : "The simulation concludes. While you demonstrated technical intuition, your procedure exposed the facility to regulatory compliance vulnerabilities. Review FDA 21 CFR Part 211 and OOS investigation protocols in your remedial learning path.",
      turnNumber: 3,
      competencyScore: isPass ? 92 : 58,
      evaluationFeedback: isPass
        ? "Mastery verified: Full compliance with ICH Q10 and FDA OOS guidance. High technical acumen in controlled-release drug delivery systems."
        : "Remedial recommendation: Strengthen knowledge in regulatory deviation documentation and formal CAPA workflows.",
      consequenceState: isPass
        ? "Batch Remediated & Validated · Audit Passed With Commendation"
        : "Investigation Closed with Conditional Corrective Actions",
      suggestedResponses: [],
      isComplete: true,
    };
  }

  if (
    role.includes("financ") ||
    role.includes("bank") ||
    role.includes("analyst") ||
    role.includes("invest")
  ) {
    if (turn === 1) {
      return {
        scenarioTitle: "Project Titan LBO Covenant Breach & Cash Sweep Crisis",
        stakeholderName: "Evelyn Reed",
        stakeholderRole: "Managing Director, Global Leveraged Finance Group",
        dialogue:
          "We have an urgent crisis on the $420M Titan acquisition model. Your revised debt schedule projects a Total Debt/EBITDA leverage ratio of 5.85x at Year 2, which breaches the bank syndicate's senior covenant ceiling of 5.25x by $14.2M of EBITDA shortfall. The credit committee meets in 40 minutes. How do you restructure the capitalization table or cash flow sweep to achieve covenant compliance without diluting sponsor IRR below our 22% hurdle rate?",
        turnNumber: 1,
        competencyScore: 50,
        evaluationFeedback:
          "Initial challenge presented. Requires navigating debt tranches, covenant tests, and sponsor IRR mechanics under strict time constraints.",
        consequenceState:
          "Credit Committee Convening in 40 Mins · Covenant Breach Flagged",
        suggestedResponses: [
          "Introduce a 10% mezzanine debt tranche with PIK interest to reduce senior bank leverage, implement a 75% excess cash sweep, and renegotiate working capital terms.",
          "Arbitrarily inflate the terminal EBITDA multiple from 8.5x to 11.0x to mathematically boost exit valuation and IRR.",
          "Recommend abandoning the transaction immediately because debt covenants cannot be modified.",
        ],
        isComplete: false,
      };
    }
    if (turn === 2) {
      const isGood =
        userResp.includes("mezzanine") ||
        userResp.includes("pik") ||
        userResp.includes("sweep") ||
        userResp.includes("working capital") ||
        userResp.includes("renegotiate");
      return {
        scenarioTitle: "Project Titan LBO Covenant Breach & Cash Sweep Crisis",
        stakeholderName: "Evelyn Reed",
        stakeholderRole: "Managing Director, Global Leveraged Finance Group",
        dialogue: isGood
          ? "Sharp financial engineering. The mezzanine PIK tranche brings Year 2 senior leverage down to 4.95x, comfortably below the 5.25x ceiling. However, the mezzanine lender is demanding a 14% coupon with equity warrants that shave our sponsor IRR to 20.8%. How do you close that 120 bps return gap before we present to the investment committee?"
          : "That will not pass the committee. Manipulating valuation multiples without operational justification destroys our credibility with the investment committee and syndicate banks. How do you structurally resolve the leverage overhang using real capital mechanisms?",
        turnNumber: 2,
        competencyScore: isGood ? 82 : 44,
        evaluationFeedback: isGood
          ? "Excellent capital structuring. Using subordinate PIK debt effectively reduced senior leverage while conserving operating cash flow."
          : "Flaw detected: Changing valuation multiples does not fix a debt covenant breach. Cash flow generation and capital structure dictate leverage ratios.",
        consequenceState: isGood
          ? "Leverage Covenants Restored (4.95x) · IRR Gap: 120 bps"
          : "Committee Skepticism High · Deal at Risk",
        suggestedResponses: [
          "Negotiate a step-down warrant structure tied to early repayment and optimize inventory turnover to unlock $6M of trapped working capital.",
          "Double the Year 1 revenue growth assumption to 25% despite cyclical market headwinds.",
          "Accept the 20.8% IRR and hope the investment committee makes an exception to the mandated 22% mandate.",
        ],
        isComplete: false,
      };
    }
    const isPass =
      userResp.includes("step-down") ||
      userResp.includes("warrant") ||
      userResp.includes("inventory") ||
      userResp.includes("working capital") ||
      userResp.includes("optimize");
    return {
      scenarioTitle: "Project Titan LBO — Investment Committee Verdict",
      stakeholderName: "Evelyn Reed",
      stakeholderRole: "Managing Director, Global Leveraged Finance Group",
      dialogue: isPass
        ? "Flawless execution. Unlocking working capital and structuring the warrant step-down brought sponsor IRR to 22.4% while preserving bank covenant headroom. The investment committee approved the $420M financing unanimously. Exemplary modeling and deal judgment."
        : "The simulation concludes. The deal survived with concessions, but your analysis showed gaps in working capital optimization and subordinated debt structuring. Review LBO debt schedules in your active roadmap.",
      turnNumber: 3,
      competencyScore: isPass ? 94 : 60,
      evaluationFeedback: isPass
        ? "Mastery verified: Institutional-grade financial modeling and debt syndication capability under tight deal deadlines."
        : "Remedial recommendation: Focus on debt covenant formulas, PIK mechanics, and working capital cash flow drivers.",
      consequenceState: isPass
        ? "Unanimous Committee Approval · $420M Financing Secured"
        : "Conditional Approval Granted with Sponsor Equity Infusion",
      suggestedResponses: [],
      isComplete: true,
    };
  }

  if (turn === 1) {
    return {
      scenarioTitle: "Cascading Connection Pool Starvation & Sev-1 Latency Spike",
      stakeholderName: "Devon Chen",
      stakeholderRole: "Principal Systems Architect & Incident Commander",
      dialogue:
        "Sev-1 Incident active! Our primary checkout microservice is throwing 504 Gateway Timeouts on 34% of customer transactions. PostgreSQL connection pool utilization reached 98% (490/500 connections active), and P99 query latency has spiked from 35ms to 4,600ms following our promotional product launch. What immediate triage and mitigation protocol do you execute?",
      turnNumber: 1,
      competencyScore: 50,
      evaluationFeedback:
        "Initial challenge presented. Requires diagnosing database connection pool exhaustion, identifying blocking locks or slow queries, and preventing cascading failures.",
      consequenceState:
        "Sev-1 Outage Active · Error Rate: 34.2% · Latency: 4,600ms",
      suggestedResponses: [
        "Query pg_stat_activity to terminate slow unindexed table queries, enable Redis read-through caching for hot inventory, and enforce circuit breakers on checkout APIs.",
        "Immediately raise max_connections from 500 to 3,000 on the database without restarting or checking RAM limits.",
        "Restart the primary database server immediately during peak traffic without failing over to read replicas.",
      ],
      isComplete: false,
    };
  }
  if (turn === 2) {
    const isGood =
      userResp.includes("pg_stat") ||
      userResp.includes("cache") ||
      userResp.includes("redis") ||
      userResp.includes("circuit") ||
      userResp.includes("terminate") ||
      userResp.includes("index");
    return {
      scenarioTitle: "Cascading Connection Pool Starvation & Sev-1 Latency Spike",
      stakeholderName: "Devon Chen",
      stakeholderRole: "Principal Systems Architect & Incident Commander",
      dialogue: isGood
        ? "Decisive triage. Terminating the unindexed sequential scan query freed 380 idle database connections and dropped P99 latency to 110ms. However, our downstream payment gateway queue is now backing up with 4,200 pending webhooks that risk processing duplicate charges. How do you drain the queue safely without double-charging users?"
        : "Rebooting or multiplying connections blindly causes memory OOM crashes under peak load! Connection pool starvation must be addressed by identifying query bottlenecks. How do you safely stabilize the system and protect database reliability?",
      turnNumber: 2,
      competencyScore: isGood ? 80 : 46,
      evaluationFeedback: isGood
        ? "Excellent incident mitigation. You correctly investigated query execution states and relieved database contention before adjusting infra limits."
        : "Deficit identified: Arbitrarily increasing database connections exhausts server RAM and exacerbates CPU context switching.",
      consequenceState: isGood
        ? "Database Stabilized · P99 Latency: 110ms · Payment Backlog: 4,200"
        : "Database OOM Risk Critical · Sev-1 Escalation",
      suggestedResponses: [
        "Enforce strict idempotency keys in payment headers, process webhooks through an asynchronous rate-limited worker pool with exponential backoff, and verify ledger deduplication.",
        "Flush the entire webhook queue to drop old requests and tell affected customers to retry payment manually.",
        "Spawn 50 concurrent consumer threads to hammer the payment gateway simultaneously without deduplication keys.",
      ],
      isComplete: false,
    };
  }
  const isPass =
    userResp.includes("idempotenc") ||
    userResp.includes("dedup") ||
    userResp.includes("worker") ||
    userResp.includes("backoff") ||
    userResp.includes("rate-limit");
  return {
    scenarioTitle: "Sev-1 Incident Post-Mortem & Architecture Sign-Off",
    stakeholderName: "Devon Chen",
    stakeholderRole: "Principal Systems Architect & Incident Commander",
    dialogue: isPass
      ? "Exemplary engineering under pressure. Idempotency guarantees prevented all duplicate billing, the queue drained in 4 minutes, and zero financial discrepancies were recorded. You handled a high-stakes Sev-1 incident like a true senior architect."
      : "The simulation concludes. The outage was contained, but your webhook triage exposed users to double-billing risks. Review distributed systems idempotency and message queue reliability in your roadmap.",
    turnNumber: 3,
    competencyScore: isPass ? 95 : 62,
    evaluationFeedback: isPass
      ? "Mastery verified: Deep understanding of distributed transactions, connection pooling, and resilient message queue patterns."
      : "Remedial recommendation: Prioritize idempotency patterns and exponential backoff retry algorithms.",
    consequenceState: isPass
      ? "All Services Green (P99: 32ms) · Post-Mortem Signed Off With Commendation"
      : "Incident Closed with Technical Debt Action Items",
    suggestedResponses: [],
    isComplete: true,
  };
}

export function formatRoleplayPayload(
  raw: Record<string, unknown>,
  targetRole: string,
  focusSkill: string,
  turnNumber: number
) {
  const stakeholderName =
    typeof raw.stakeholderName === "string" && raw.stakeholderName
      ? raw.stakeholderName
      : "Senior Director";
  const stakeholderRole =
    typeof raw.stakeholderRole === "string" && raw.stakeholderRole
      ? raw.stakeholderRole
      : `${targetRole} Executive Lead`;

  const persona =
    typeof raw.stakeholderPersona === "string" && raw.stakeholderPersona
      ? raw.stakeholderPersona
      : `${stakeholderName} (${stakeholderRole})`;

  const promptText =
    typeof raw.scenarioPrompt === "string" && raw.scenarioPrompt
      ? raw.scenarioPrompt
      : typeof raw.dialogue === "string"
      ? raw.dialogue
      : "Evaluate the operational scenario and propose a corrective protocol.";

  const compScore =
    typeof raw.currentCompetencyScore === "number"
      ? raw.currentCompetencyScore
      : typeof raw.competencyScore === "number"
      ? raw.competencyScore
      : 50;

  const isDone = Boolean(
    raw.isSimulationComplete ?? raw.isComplete ?? turnNumber >= 3
  );

  const badge =
    typeof raw.certificationBadgeEarned === "string" &&
    raw.certificationBadgeEarned
      ? raw.certificationBadgeEarned
      : isDone && compScore >= 70
      ? `${focusSkill} Master Practitioner`
      : null;

  const delta =
    typeof raw.competencyDelta === "number"
      ? raw.competencyDelta
      : turnNumber === 2
      ? compScore >= 70
        ? 28
        : -10
      : compScore >= 70
      ? 14
      : -6;

  return {
    ...raw,
    stakeholderPersona: persona,
    scenarioPrompt: promptText,
    currentCompetencyScore: compScore,
    isSimulationComplete: isDone,
    certificationBadgeEarned: badge,
    competencyDelta: delta,
    agentLog: {
      thought:
        typeof raw.evaluationFeedback === "string"
          ? raw.evaluationFeedback
          : "Evaluated action against domain telemetry.",
    },
  };
}

export function generateMentorChatFallback(
  userMessage: string,
  readinessScore: number
) {
  const lowerMsg = (userMessage || "").toLowerCase();
  let reply = `Great question! Given your current roadmap and ${
    readinessScore || 45
  }% readiness score, mastering the fundamentals before jumping to advanced practice is the key to passing professional evaluations.`;
  let recommendedAdjustment =
    "Focus on the upcoming week's hands-on project to solidify core competencies.";

  if (
    lowerMsg.includes("pivot") ||
    lowerMsg.includes("ai engineer") ||
    lowerMsg.includes("switch")
  ) {
    reply =
      "Exciting pivot! Your verified foundation provides directly transferable competencies. We will adapt your target career role and pivot your roadmap toward high-impact methodologies.";
    recommendedAdjustment =
      "Switch target role and regenerate diagnostic assessment.";
  } else if (
    lowerMsg.includes("struggling") ||
    lowerMsg.includes("hard") ||
    lowerMsg.includes("fail")
  ) {
    reply =
      "Encountering difficult hurdles is completely natural when bridging into a specialized career. The key is isolating the exact conceptual trap and running focused diagnostic labs.";
    recommendedAdjustment =
      "Add a targeted Remedial Foundation Module to your active roadmap.";
  }

  return { reply, recommendedAdjustment };
}

export function generateFallbackAnalysis(profile: {
  name?: string;
  currentSkills?: string[] | string;
  projects?: string;
  certifications?: string;
  targetRole?: string;
  adaptationContext?:
    | string
    | { failedTopic?: string; failedScore?: number; roleChangeReason?: string };
}): AnalysisData {
  const targetRole = profile.targetRole || "Full Stack Developer";
  const name = profile.name || "Learner";
  const currentSkillsList = Array.isArray(profile.currentSkills)
    ? profile.currentSkills
    : (profile.currentSkills || "Python, SQL, HTML")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const hasAdaptation = Boolean(profile.adaptationContext);
  const adaptationText =
    typeof profile.adaptationContext === "object"
      ? JSON.stringify(profile.adaptationContext)
      : profile.adaptationContext || "";

  const isFailedQuizAdaptation =
    hasAdaptation &&
    (adaptationText.toLowerCase().includes("fail") ||
      adaptationText.toLowerCase().includes("quiz") ||
      adaptationText.toLowerCase().includes("struggling"));

  const role = targetRole.toLowerCase();

  if (
    role.includes("pharma") ||
    role.includes("chemist") ||
    role.includes("formulation")
  ) {
    const matchedSkills = currentSkillsList.filter((s) =>
      /chem|titration|hplc|spectroscopy|lab|gmp|biology|organic/i.test(s)
    );
    if (matchedSkills.length === 0)
      matchedSkills.push("Organic Chemistry", "Titration", "HPLC Basics");

    const missingSkills = [
      {
        skill: "Controlled-Release Formulation (Pellets & Bilayer Tablets)",
        priority: "High" as const,
        reason:
          "Core pharmaceutical engineering principle for modifying drug release kinetics and targeting therapeutic absorption.",
      },
      {
        skill: "In Vitro Dissolution Testing & IVIVC (USP Apparatus I & II)",
        priority: "High" as const,
        reason:
          "Mandatory regulatory standard to establish bioequivalence and correlate lab dissolution with in-vivo bioavailability.",
      },
      {
        skill: "Preformulation Polymorphism & Stability Testing (ICH Q1A)",
        priority: "Medium" as const,
        reason:
          "Ensures crystal lattice stability and prevents active pharmaceutical ingredient degradation under thermal stress.",
      },
    ];

    const readinessScore = isFailedQuizAdaptation ? 36 : 46;
    const domainComparison = calculateDomainComparison(
      currentSkillsList,
      targetRole
    );

    const roadmap = isFailedQuizAdaptation
      ? [
          {
            phase: "Phase 0 (Emergency Remedial Lab Sprint)",
            duration: "Week 1",
            focusSkill: "Dissolution Mechanics & Noyes-Whitney Equation",
            isRemedial: true,
            resources: [
              {
                title:
                  "Virtual Dissolution Lab: USP Apparatus II Paddle Simulation",
                type: "Hands-on Project" as const,
                description:
                  "Interactive laboratory sandbox calibrating dissolution profiles against Noyes-Whitney dissolution kinetics.",
              },
              {
                title:
                  "ICH Q1A Stability & Excipient Compatibility Crash Course",
                type: "Tutorial" as const,
                description:
                  "Step-by-step remedial guide breaking down common preformulation traps and excipient degradation pathways.",
              },
            ],
          },
          {
            phase: "Phase 1 (Solid Oral Dosage Engineering)",
            duration: "Weeks 2-3",
            focusSkill: "Granulation & Tablet Compression",
            isRemedial: true,
            resources: [
              {
                title:
                  "Direct Compression vs Wet Granulation Pilot Batch Simulation",
                type: "Hands-on Project" as const,
                description:
                  "Analyze tablet friability, hardness, and disintegration parameters across 5 test binder formulations.",
              },
              {
                title:
                  "GMP Cleanroom Protocol & Batch Production Records (BPR)",
                type: "Course" as const,
                description:
                  "Master FDA 21 CFR Part 211 validation standards and deviation management.",
              },
            ],
          },
          {
            phase: "Phase 2 (Target Role Regulatory Capstone)",
            duration: "Weeks 4-6",
            focusSkill: "Novel Drug Delivery & Regulatory Dossier",
            isRemedial: false,
            resources: [
              {
                title: "End-to-End Generic Formulation Dossier (eCTD Module 3)",
                type: "Hands-on Project" as const,
                description:
                  "Prepare an abbreviated new drug application (ANDA) Module 3 Quality Section for an extended-release formulation.",
              },
              {
                title: "Advanced Biopharmaceutics Classification System (BCS)",
                type: "Course" as const,
                description:
                  "Predict permeability vs solubility hurdles for poorly water-soluble BCS Class II and IV drug candidates.",
              },
            ],
          },
        ]
      : [
          {
            phase: "Phase 1: Preformulation & Physicochemical Profiling",
            duration: "Weeks 1-2",
            focusSkill: "Active Ingredient Characterization",
            isRemedial: false,
            resources: [
              {
                title:
                  "Preformulation Testing Protocol: pKa, LogP, and Solubility Profiling",
                type: "Course" as const,
                description:
                  "Determine thermodynamic equilibrium solubility across pH buffers 1.2 to 7.4.",
              },
              {
                title: "HPLC Assay Method Validation Sandbox",
                type: "Hands-on Project" as const,
                description:
                  "Execute a full ICH Q2(R1) precision, linearity, and robustness protocol using simulated chromatograms.",
              },
            ],
          },
          {
            phase: "Phase 2: Solid Oral Formulation & Granulation",
            duration: "Weeks 3-4",
            focusSkill: "Dosage Form Manufacturing",
            isRemedial: false,
            resources: [
              {
                title: "Fluidized Bed Granulation & Fluid Mechanics Lab",
                type: "Hands-on Project" as const,
                description:
                  "Optimize spray rate, inlet air temperature, and binder addition to prevent tablet capping.",
              },
              {
                title:
                  "Pharmacopoeial Standards: USP Dissolution & Disintegration",
                type: "Tutorial" as const,
                description:
                  "Standard operating procedures for calibrating dissolution bath baskets and autosamplers.",
              },
            ],
          },
          {
            phase: "Phase 3: Extended Release & Regulatory Submission",
            duration: "Weeks 5-6",
            focusSkill: "Regulatory Dossier & Scale-Up",
            isRemedial: false,
            resources: [
              {
                title: "Full eCTD Module 3 Pharmaceutical Dossier Project",
                type: "Hands-on Project" as const,
                description:
                  "Draft critical quality attributes (CQAs) and design space parameters for commercial regulatory submission.",
              },
            ],
          },
        ];

    const diagnosticQuiz = [
      {
        id: 1,
        skill: "Dissolution Kinetics",
        question:
          "According to the Noyes-Whitney equation, which intervention will directly increase the dissolution rate (dC/dt) of a poorly water-soluble active pharmaceutical ingredient?",
        options: [
          "Increasing the viscosity of the dissolution medium",
          "Micronization of the drug particles to increase effective surface area (A)",
          "Increasing the thickness of the stagnant hydrodynamic diffusion layer (h)",
          "Decreasing the saturation solubility of the drug in the gastrointestinal fluids (Cs)",
        ],
        correctIndex: 1,
        explanation:
          "The Noyes-Whitney equation is dC/dt = (D * A / h) * (Cs - C). Micronization dramatically increases the effective surface area (A), directly increasing the rate of dissolution.",
      },
      {
        id: 2,
        skill: "USP Dissolution Testing",
        question:
          "In pharmaceutical quality control, what is the primary difference between USP Apparatus 1 and USP Apparatus 2?",
        options: [
          "Apparatus 1 uses a rotating paddle while Apparatus 2 uses a reciprocating cylinder",
          "Apparatus 1 uses a rotating wire mesh basket while Apparatus 2 uses a rotating paddle blade",
          "Apparatus 1 is exclusively for parenteral injectables while Apparatus 2 is for topical creams",
          "Apparatus 1 operates without temperature control while Apparatus 2 requires liquid nitrogen",
        ],
        correctIndex: 1,
        explanation:
          "USP Apparatus 1 is the Rotating Basket (ideal for capsules that float), whereas USP Apparatus 2 is the Rotating Paddle (standard for immediate-release tablets).",
      },
      {
        id: 3,
        skill: "GMP Regulatory Stability",
        question:
          "Under ICH Q1A guidelines, what are the standard storage test conditions for Long-Term room temperature stability testing of pharmaceutical products intended for Climatic Zone II?",
        options: [
          "40C +/- 2C / 75% RH +/- 5% RH for 6 months",
          "25C +/- 2C / 60% RH +/- 5% RH for 12 months minimum",
          "5C +/- 3C for refrigerated storage only",
          "50C +/- 2C / 80% RH for accelerated stress testing",
        ],
        correctIndex: 1,
        explanation:
          "ICH Q1A defines standard room-temperature long-term stability testing as 25C +/- 2C at 60% RH +/- 5% RH for a minimum of 12 months, while 40C/75% RH represents accelerated testing.",
      },
    ];

    const agentLogs = [
      {
        agentName: "Skill Auditor Agent" as const,
        status: "completed" as const,
        thought: `Audited candidate ${name}'s verified chemical laboratory competencies (${matchedSkills.join(
          ", "
        )}). Identified critical gaps for ${targetRole}: ${missingSkills
          .map((m) => m.skill)
          .join(", ")}. Computed baseline readiness score of ${readinessScore}%.`,
      },
      {
        agentName: "Curriculum Architect Agent" as const,
        status: "completed" as const,
        thought: isFailedQuizAdaptation
          ? "ALERT RECEIVED: Diagnostic assessment triggered adaptation request. Injecting foundational USP Dissolution and Noyes-Whitney remedial modules into Week 1. Deprecating commercial submission until core biopharmaceutics mastery is verified."
          : "Synthesized 3-phase curriculum bridging undergraduate chemistry assays to commercial pharmaceutical dosage form design and FDA regulatory compliance.",
      },
      {
        agentName: "Assessment Examiner Agent" as const,
        status: "completed" as const,
        thought:
          "Generated 3 targeted diagnostic pharmaceutical multiple-choice challenges pinpointing dissolution kinetics, USP testing apparatus, and ICH stability standards.",
      },
      {
        agentName: "Adaptive Mentor Agent" as const,
        status: "completed" as const,
        thought: isFailedQuizAdaptation
          ? "COLLABORATION ALERT: Adaptive Intervention Protocol active. Diagnosed comprehension struggle with biopharmaceutical kinetics. Re-orchestrated roadmap priorities with targeted laboratory simulations."
          : `Monitoring learning telemetry. Profile established for ${name} targeting ${targetRole}. Ready to calibrate pacing based on diagnostic quiz results.`,
      },
    ];

    const mentorAdvice = isFailedQuizAdaptation
      ? "Adaptive Alert Triggered: I noticed you encountered difficulty with dissolution kinetics and USP testing standards. Biopharmaceutics calculations are tricky—I collaborated with the Curriculum Architect Agent to insert Remedial Phase 0 modules with a virtual dissolution sandbox before we tackle advanced solid oral dosage design."
      : `Welcome ${name}! Your background in ${matchedSkills.join(
          " & "
        )} provides a solid analytical laboratory foundation. To transition into an industry-leading ${targetRole}, our immediate focus is mastering controlled-release mechanisms and USP dissolution standards. Complete the 3-question diagnostic quiz below!`;

    return {
      agentLogs,
      readinessScore,
      matchedSkills,
      missingSkills,
      domainComparison,
      roadmap,
      diagnosticQuiz,
      mentorAdvice,
    };
  }

  if (
    role.includes("financ") ||
    role.includes("bank") ||
    (role.includes("analyst") && !role.includes("data"))
  ) {
    const matchedSkills = currentSkillsList.filter((s) =>
      /excel|account|financ|communicat|budget|gaap|tax|math/i.test(s)
    );
    if (matchedSkills.length === 0)
      matchedSkills.push("Excel", "Accounting", "Business Communication");

    const missingSkills = [
      {
        skill: "3-Statement Dynamic Financial Modeling & Consolidation",
        priority: "High" as const,
        reason:
          "The foundational core requirement for investment banking, private equity, and corporate financial planning.",
      },
      {
        skill: "Discounted Cash Flow (DCF) Valuation & WACC Sensitivity Analysis",
        priority: "High" as const,
        reason:
          "Essential for valuing enterprise assets, conducting equity research, and structuring M&A transactions.",
      },
      {
        skill: "LBO & Debt Schedule Restructuring",
        priority: "Medium" as const,
        reason:
          "Required to analyze financial sponsors, credit risk, and returns on leveraged transactions.",
      },
    ];

    const readinessScore = isFailedQuizAdaptation ? 40 : 52;
    const domainComparison = calculateDomainComparison(
      currentSkillsList,
      targetRole
    );

    const roadmap = isFailedQuizAdaptation
      ? [
          {
            phase: "Phase 0 (Emergency Financial Modeling Sprint)",
            duration: "Week 1",
            focusSkill: "Circular Debt Schedules & Balance Sheet Balancing",
            isRemedial: true,
            resources: [
              {
                title: "Interactive 3-Statement Troubleshooting Sandbox",
                type: "Hands-on Project" as const,
                description:
                  "Debug a broken 3-statement model where cash from operations and net income fail to balance.",
              },
              {
                title: "WACC & Cost of Equity Mechanics Crash Course",
                type: "Tutorial" as const,
                description:
                  "Demystifying unlevered beta, debt-to-equity ratios, and capital asset pricing model (CAPM).",
              },
            ],
          },
          {
            phase: "Phase 1 (Advanced Valuation Mastery)",
            duration: "Weeks 2-3",
            focusSkill: "DCF & Trading Comps",
            isRemedial: true,
            resources: [
              {
                title: "Live Public Company Valuation Model (Tesla or Apple)",
                type: "Hands-on Project" as const,
                description:
                  "Build a 5-year forecast with revenue drivers, operating margins, and terminal value sensitivity tables.",
              },
            ],
          },
          {
            phase: "Phase 2 (M&A & Deal Structuring Capstone)",
            duration: "Weeks 4-6",
            focusSkill: "Accretion/Dilution & Investment Memorandum",
            isRemedial: false,
            resources: [
              {
                title: "Mergers & Acquisitions Deal Model Project",
                type: "Hands-on Project" as const,
                description:
                  "Model pro-forma synergy realization, EPS accretion/dilution, and transaction financing structures.",
              },
            ],
          },
        ]
      : [
          {
            phase: "Phase 1: Dynamic 3-Statement Integration",
            duration: "Weeks 1-2",
            focusSkill: "Financial Modeling Architecture",
            isRemedial: false,
            resources: [
              {
                title: "Wall Street Prep: Advanced Excel Financial Modeling",
                type: "Course" as const,
                description:
                  "Master dynamic INDEX/MATCH formulas, circularity breakers, and clean model layout conventions.",
              },
              {
                title: "Hands-on Corporate P&L & Cash Flow Integration Lab",
                type: "Hands-on Project" as const,
                description:
                  "Build an audited 3-statement model linking net income to cash flow and balance sheet reserves.",
              },
            ],
          },
          {
            phase: "Phase 2: Valuation Methodologies (DCF & Comps)",
            duration: "Weeks 3-4",
            focusSkill: "Valuation Engineering",
            isRemedial: false,
            resources: [
              {
                title: "Discounted Cash Flow Model with Monte Carlo Simulation",
                type: "Hands-on Project" as const,
                description:
                  "Calculate Free Cash Flow to Firm (FCFF) and apply Gordon Growth vs Exit Multiple methodologies.",
              },
            ],
          },
          {
            phase: "Phase 3: Investment Banking Presentation & Pitchbook",
            duration: "Weeks 5-6",
            focusSkill: "Executive Financial Synthesis",
            isRemedial: false,
            resources: [
              {
                title: "Comprehensive M&A Investment Memorandum Capstone",
                type: "Hands-on Project" as const,
                description:
                  "Deliver a 15-slide institutional pitchbook with football-field valuation charts and strategic rationale.",
              },
            ],
          },
        ];

    const diagnosticQuiz = [
      {
        id: 1,
        skill: "Accounting & Cash Flow",
        question:
          "If a company increases Depreciation by $100 on the Income Statement and the corporate tax rate is 25%, what is the net impact on the Cash Flow from Operations?",
        options: [
          "Cash increases by $25 due to the depreciation tax shield",
          "Cash decreases by $75 because net income was reduced",
          "Cash increases by $75 because $100 non-cash expense is added back while net income drops by $25",
          "There is zero net impact on cash because depreciation is entirely non-cash",
        ],
        correctIndex: 0,
        explanation:
          "Pre-tax income decreases by $100, saving $25 in taxes. Net income falls by $75. On the Cash Flow statement, Net Income (-$75) is added to Depreciation (+$100), yielding a net positive cash flow impact of +$25 (the tax shield).",
      },
      {
        id: 2,
        skill: "DCF Valuation & WACC",
        question:
          "In calculating Free Cash Flow to Firm (FCFF) for a Discounted Cash Flow model, why is Interest Expense excluded from Operating Cash Flows?",
        options: [
          "Because interest expense is a non-deductible tax penalty",
          "Because FCFF represents cash available to all capital providers, and cost of debt is already accounted for in the WACC discount rate",
          "Because GAAP accounting classifies interest strictly under Financing Activities",
          "Because interest payments are considered variable working capital investments",
        ],
        correctIndex: 1,
        explanation:
          "FCFF is an unlevered metric representing cash flow generated by core operations available to both debt and equity holders. Deducting interest would double-count financing costs, which are already reflected in the WACC discount rate.",
      },
      {
        id: 3,
        skill: "Financial Modeling",
        question:
          "When modeling Enterprise Value (EV) from Equity Value, why is Cash subtracted while Total Debt is added?",
        options: [
          "Cash reduces liquidity while debt increases company equity value",
          "Because an acquirer would assume the target's debt obligations but can immediately use the target's cash to pay down that debt",
          "Because cash generates taxable interest while debt creates tax liabilities",
          "To comply with Basel III banking capital reserve guidelines",
        ],
        correctIndex: 1,
        explanation:
          "Enterprise Value represents the true economic cost to acquire the entire operating business: EV = Equity Value + Total Debt - Cash, because the acquirer assumes the debt but receives the cash balance.",
      },
    ];

    const agentLogs = [
      {
        agentName: "Skill Auditor Agent" as const,
        status: "completed" as const,
        thought: `Audited candidate ${name}'s verified commerce and accounting competencies (${matchedSkills.join(
          ", "
        )}). Identified critical gaps for ${targetRole}: ${missingSkills
          .map((m) => m.skill)
          .join(", ")}. Computed baseline readiness score of ${readinessScore}%.`,
      },
      {
        agentName: "Curriculum Architect Agent" as const,
        status: "completed" as const,
        thought: isFailedQuizAdaptation
          ? "ALERT RECEIVED: Diagnostic assessment triggered adaptation request. Injecting foundational 3-statement reconciliation and tax-shield mechanics into Week 1. Deprecating LBO modeling until core valuation fluency is established."
          : "Synthesized 3-phase curriculum bridging baseline accounting to Wall Street-grade financial modeling, DCF valuation, and M&A pitchbook synthesis.",
      },
      {
        agentName: "Assessment Examiner Agent" as const,
        status: "completed" as const,
        thought:
          "Generated 3 targeted diagnostic finance multiple-choice challenges evaluating depreciation tax-shield mechanics, FCFF unlevered cash flows, and Enterprise Value bridge logic.",
      },
      {
        agentName: "Adaptive Mentor Agent" as const,
        status: "completed" as const,
        thought: isFailedQuizAdaptation
          ? "COLLABORATION ALERT: Adaptive Intervention Protocol active. Diagnosed struggle in core accounting flow mechanics. Restructured roadmap with hands-on 3-statement balancing sandboxes."
          : `Monitoring learning telemetry. Profile established for ${name} targeting ${targetRole}. Ready to adapt roadmap dynamically based on diagnostic quiz evaluation.`,
      },
    ];

    const mentorAdvice = isFailedQuizAdaptation
      ? "Adaptive Alert Triggered: I noticed you ran into difficulty with the depreciation tax-shield or cash flow mechanics. That is a classic investment banking interview trap—I coordinated with the Curriculum Architect Agent to insert Remedial Phase 0 modules with interactive balance sheet debugging before we move to complex DCF valuation."
      : `Welcome ${name}! Your background in ${matchedSkills.join(
          " & "
        )} provides an excellent foundation. To break into a competitive ${targetRole}, our immediate focus is mastering dynamic 3-statement modeling and DCF sensitivity analysis. Take the 3-question diagnostic quiz below!`;

    return {
      agentLogs,
      readinessScore,
      matchedSkills,
      missingSkills,
      domainComparison,
      roadmap,
      diagnosticQuiz,
      mentorAdvice,
    };
  }

  const matchedSkills = currentSkillsList.filter((s) =>
    ["python", "sql", "html", "css", "git", "database"].some((m) =>
      s.toLowerCase().includes(m)
    )
  );
  if (matchedSkills.length === 0)
    matchedSkills.push(currentSkillsList[0] || "Foundational Knowledge");

  const missingSkills = [
    {
      skill: `${targetRole} Core Standards & Modern Toolchains`,
      priority: "High" as const,
      reason: `Essential methodologies, regulatory practices, and technical standards required for modern ${targetRole} practitioners.`,
    },
    {
      skill: "Applied Industry Problem Solving & Methodology",
      priority: "High" as const,
      reason: `Translating theoretical principles into production-ready execution and validated workflows in ${targetRole}.`,
    },
    {
      skill: "Quality Assurance, Risk Management & Compliance",
      priority: "Medium" as const,
      reason: `Ensuring rigorous compliance with professional bodies, quality control guidelines, and industry safety standards.`,
    },
  ];

  const readinessScore = isFailedQuizAdaptation ? 38 : 48;
  const domainComparison = calculateDomainComparison(
    currentSkillsList,
    targetRole
  );

  const roadmap = [
    {
      phase: isFailedQuizAdaptation
        ? "Phase 0 (Emergency Remedial Foundations)"
        : "Phase 1: Core Domain Foundations",
      duration: "Weeks 1-2",
      focusSkill: `${targetRole} Fundamentals`,
      isRemedial: isFailedQuizAdaptation,
      resources: [
        {
          title: `Accelerated ${targetRole} Methodologies for Professionals`,
          type: "Course" as const,
          description:
            "Targeted curriculum bridging your verified strengths to modern industry best practices.",
        },
        {
          title: "Interactive Practical Laboratory & Exercise",
          type: "Hands-on Project" as const,
          description:
            "Hands-on simulation solidifying core foundational concepts with automated validation.",
        },
      ],
    },
    {
      phase: "Phase 2: Applied Workflow & Technical Standards",
      duration: "Weeks 3-4",
      focusSkill: "Advanced Implementation",
      isRemedial: false,
      resources: [
        {
          title: `Comprehensive ${targetRole} Practice & System Execution`,
          type: "Hands-on Project" as const,
          description:
            "End-to-end applied project meeting full industry quality and technical compliance.",
        },
      ],
    },
    {
      phase: "Phase 3: Executive Professional Capstone",
      duration: "Weeks 5-6",
      focusSkill: "Professional Mastery",
      isRemedial: false,
      resources: [
        {
          title: `Live Production Capstone: Enterprise ${targetRole} Portfolio`,
          type: "Hands-on Project" as const,
          description:
            "Deliver a portfolio-grade capstone project ready for technical interviews and professional certification.",
        },
      ],
    },
  ];

  const diagnosticQuiz = [
    {
      id: 1,
      skill: `${targetRole} Problem Solving`,
      question: `In evaluating a critical operational failure in ${targetRole}, what is the first rigorous troubleshooting step prescribed by international standards?`,
      options: [
        "Immediately overwrite existing parameters with speculative settings",
        "Perform root-cause analysis (RCA) and isolate variables while documenting baseline telemetry",
        "Restart all systems simultaneously without recording diagnostic logs",
        "Delegate troubleshooting entirely to external vendors without internal documentation",
      ],
      correctIndex: 1,
      explanation:
        "International quality engineering standards (e.g. ISO, Six Sigma) mandate conducting structured root-cause analysis and isolating controlled variables while preserving diagnostic telemetry.",
    },
    {
      id: 2,
      skill: "Quality & Compliance",
      question: `Under professional ethics and regulatory compliance frameworks for ${targetRole}, how must critical discrepancies or safety deviations be handled?`,
      options: [
        "Discrepancies should be minimized in internal notes if performance quotas are at risk",
        "Formal Corrective and Preventive Actions (CAPA) must be logged and reviewed by quality assurance",
        "Deviations are only documented if requested by third-party auditors during annual reviews",
        "Discrepancies can be cleared by self-authorization if resolved within 48 hours",
      ],
      correctIndex: 1,
      explanation:
        "Regulatory compliance universally requires formal Corrective and Preventive Actions (CAPA) tracking with independent quality oversight to ensure auditability and prevent recurrence.",
    },
    {
      id: 3,
      skill: "System Optimization",
      question: `When optimizing efficiency versus risk in a high-consequence ${targetRole} environment, which strategy provides the highest verifiable resilience?`,
      options: [
        "Maximizing single-point efficiency by eliminating all redundant safety checks",
        "Implementing defense-in-depth with modular verification checkpoints and automated rollback triggers",
        "Relying solely on post-launch manual inspection to reduce initial setup time",
        "Standardizing on untested experimental methodologies to gain short-term velocity",
      ],
      correctIndex: 1,
      explanation:
        "Defense-in-depth architecture with modular verification checkpoints ensures high resilience and rapid containment in high-consequence operational environments.",
    },
  ];

  const agentLogs = [
    {
      agentName: "Skill Auditor Agent" as const,
      status: "completed" as const,
      thought: `Audited candidate ${name}'s verified competencies (${matchedSkills.join(
        ", "
      )}). Identified critical gaps for ${targetRole}: ${missingSkills
        .map((m) => m.skill)
        .join(", ")}. Computed baseline readiness score of ${readinessScore}%.`,
    },
    {
      agentName: "Curriculum Architect Agent" as const,
      status: "completed" as const,
      thought: isFailedQuizAdaptation
        ? "ALERT RECEIVED: Diagnostic assessment triggered adaptation request. Injecting foundational Remedial modules into Week 1. Deprecating advanced capstone until core prerequisite mastery is verified."
        : `Constructed personalized 3-phase curriculum tailored specifically to ${targetRole} industry standards.`,
    },
    {
      agentName: "Assessment Examiner Agent" as const,
      status: "completed" as const,
      thought: `Generated 3 targeted diagnostic challenges evaluating operational problem solving, quality assurance, and system optimization for ${targetRole}.`,
    },
    {
      agentName: "Adaptive Mentor Agent" as const,
      status: "completed" as const,
      thought: isFailedQuizAdaptation
        ? "COLLABORATION ALERT: Adaptive Intervention Protocol active. Diagnosed struggling comprehension in prerequisite skills. Re-orchestrated roadmap priorities with targeted remedial modules."
        : `Monitoring learning telemetry. Profile established for ${name} targeting ${targetRole}. System ready to adapt dynamically based on diagnostic quiz results.`,
    },
  ];

  const mentorAdvice = isFailedQuizAdaptation
    ? `Adaptive Alert Triggered: I noticed you encountered difficulty on foundational concepts. This is how THIRAN VAZHI personalizes your journey—I worked with the Curriculum Architect Agent to insert Remedial Phase 0 modules tailored to ${targetRole} before proceeding.`
    : `Welcome ${name}! Your background in ${matchedSkills.join(
        " & "
      )} gives you a strong starting point. To transition into an industry-leading ${targetRole}, our focus is mastering core technical execution and regulatory standards. Complete the 3-question diagnostic quiz below!`;

  return {
    agentLogs,
    readinessScore,
    matchedSkills,
    missingSkills,
    domainComparison,
    roadmap,
    diagnosticQuiz,
    mentorAdvice,
  };
}
