import { NextResponse } from "next/server";
import OpenAI from "openai";

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY || "up_jskRfswj0ZmfhlfDvjyVBSY81iuh2";
const UPSTAGE_BASE_URL = "https://api.upstage.ai/v1";

const client = new OpenAI({
  apiKey: UPSTAGE_API_KEY,
  baseURL: UPSTAGE_BASE_URL,
});

function getSystemPrompt(level?: string) {
  const isBeginner = level === "beginner";

  return `You are an expert GRE Analytical Writing (AWA) Examiner. Your task is to grade the student's essay based on the official ETS "Analyze an Issue" scoring guide.

Official ETS "Analyze an Issue" Scoring Rubrics:
- Score 6 (Outstanding): Presents a cogent, well-articulated analysis of the issue. Articulates a clear and insightful position in accordance with the assigned task. Develops the position fully with compelling reasons and/or persuasive examples. Sustains a well-focused, well-organized analysis, connecting ideas logically. Conveys ideas fluently and precisely, using effective vocabulary and sentence variety. Superior grammar/mechanics.
- Score 5 (Strong): Presents a generally thoughtful, well-developed analysis. Clear and well-considered position. Logically sound reasons and/or well-chosen examples. Focused and generally well-organized, connecting ideas appropriately. Convey ideas clearly and well, using appropriate vocabulary/sentence variety. Minor errors.
- Score 4 (Adequate): Presents a competent analysis. Clear position. Develops the position with relevant reasons and/or examples. Adequately focused and organized. Sufficient control of language to express ideas with acceptable clarity. Some errors.
- Score 3 (Limited): Vague or limited in addressing the directions. Weak in the use of relevant reasons/examples or relies largely on unsupported claims. Limited focus/organization. Problems in language resulting in lack of clarity. Occasional major or frequent minor errors.
- Score 2 (Seriously Flawed): Largely disregards specific task directions. Serious weaknesses in analytical writing. Few, if any, relevant reasons/examples. Poorly focused/organized. Serious language problems frequently interfering with meaning.
- Score 1 (Fundamentally Deficient): Fundamental deficiencies. Little or no evidence of understanding the issue or ability to develop an organized response. Severe language problems persistently interfering with meaning.
- Score 0: Off-topic, blank, foreign language, copied topic, etc.

${isBeginner ? `[CRITICAL NOTE FOR BEGINNER LEVEL (1단계)]
The user is an absolute beginner. They were instructed to write a short-form draft containing ONLY the Introduction and ONE Body paragraph (around 150-250 words goal).
Do NOT penalize them for not writing a full 5-paragraph essay, and do NOT penalize them for missing a second body paragraph or conclusion.
Instead, evaluate them on a relative scale based on:
1. Thesis Statement Clarity: Did they articulate a clear stance in the introduction?
2. Body Paragraph Structure: Did they structure the body paragraph using the PEEL format (Point, Explanation, Example, Link) and support it with a valid US example?
3. Grammar and Mechanics.
Give them a realistic yet encouraging score (e.g., up to 6.0 based on these simplified beginner criteria). Provide constructive feedback in Korean, explaining how they can expand this draft into a full essay (e.g., adding a second body paragraph, a concession, and a conclusion).` : `[CRITICAL NOTE FOR FULL ESSAY LEVEL (2, 3단계)]
The user is writing a full-length essay. Grade their draft strictly according to the official ETS standards. Look for a complete introduction, multiple body paragraphs, a concession/rebuttal section, and a conclusion.`}

You must evaluate:
1. Issue Response (주제 대응)
2. Argument Development (논증 전개)
3. Organization (조직력)
4. Grammar/Vocabulary (문법/어휘)

For output, you MUST return a single, valid JSON object with EXACTLY the following structure (no other conversational text, just the raw JSON):
{
  "score": 4.5, // Float between 0.0 and 6.0 in 0.5 increments.
  "feedback": "Overall summary feedback in Korean, explaining why the student got this score and what areas they need to focus on to get to the next level.",
  "criteria": {
    "issueResponse": {
      "grade": "Adequate", // Outstanding, Strong, Adequate, Limited, Seriously Flawed, Fundamentally Deficient
      "explanation": "Specific feedback in Korean about how well they addressed the prompt and directions."
    },
    "argumentDevelopment": {
      "grade": "Strong",
      "explanation": "Specific feedback in Korean about logic, reasons, and examples."
    },
    "organization": {
      "grade": "Adequate",
      "explanation": "Specific feedback in Korean about structure, logical flow, and transitions."
    },
    "grammarVocabulary": {
      "grade": "Adequate",
      "explanation": "Specific feedback in Korean about vocabulary, syntax, grammar, and mechanics."
    }
  },
  "corrections": [
    {
      "original": "The exact sentence from the user's essay that contains grammatical mistakes or weak vocabulary.",
      "explanation": "Explanation in Korean of what is wrong with the original sentence (grammar, spelling, or formal academic register).",
      "improved": "A high-scoring, 6.0-level academic alternative for the sentence."
    }
  ], // Provide 2 to 4 corrections.
  "modelOutline": "A high-scoring markdown outline for this specific prompt, written in English (roman numerals I, II, III...).",
  "modelEssay": "A high-scoring, 6.0-level model essay for this specific prompt, written in English. Ensure it is around 400-550 words and demonstrates superior sentence variety and compelling reasoning."
}
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, instruction, essay, mode, outline, stance, summary, level } = body;

    if (!essay || essay.trim().length === 0) {
      return NextResponse.json(
        { error: "Essay content is required" },
        { status: 400 }
      );
    }

    const userPrompt = `
[CONTEXT]
Practice Mode: ${mode}
Level: ${level || "full"}
${stance ? `Selected Stance: ${stance}` : ""}
${summary ? `User's Core Tension Summary: ${summary}` : ""}
${outline ? `User's Outline Plan:
- Reason 1: ${outline.reason1}
- Reason 2: ${outline.reason2}
- Rebuttal: ${outline.rebuttal}` : ""}

[GRE ISSUE PROMPT]
"${prompt}"

[TASK INSTRUCTIONS]
"${instruction}"

[USER'S ESSAY DRAFT]
"${essay}"

Please evaluate this draft. Check if the user followed the specific task instructions. Rate the grammar, essay structure, logical cohesion, and examples. Format your final evaluation as a JSON object matching the requested schema.
`;

    // Call Upstage Solar Pro API
    const response = await client.chat.completions.create({
      model: "solar-pro3",
      messages: [
        { role: "system", content: getSystemPrompt(level) },
        { role: "user", content: userPrompt }
      ],
      // @ts-ignore
      reasoning_effort: "high",
      temperature: 0.1, // low temperature for structured consistency
    });

    let content = response.choices[0].message.content || "";
    
    // Clean code fences if outputted by the model
    if (content.includes("```json")) {
      content = content.split("```json")[1].split("```")[0].trim();
    } else if (content.includes("```")) {
      content = content.split("```")[1].split("```")[0].trim();
    }

    const parsedResult = JSON.parse(content.trim());
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("Upstage API Error:", error);
    
    // Return a 500 error but the page frontend will handle it by falling back to high-fidelity mock feedback 
    // to maintain a fully operational UI experience.
    return NextResponse.json(
      { error: "Failed to query AI grading service", details: error.message },
      { status: 500 }
    );
  }
}
