import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseGeminiOutput = (text) => {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    const questions = [];
    const regex = /(\d+)\.\s*(.*?)\s*A\.(.*?)B\.(.*?)C\.(.*?)D\.(.*?)Correct:?\s*([A-D])/gms;
    let match;

    while ((match = regex.exec(text)) !== null) {
      questions.push({
        question: match[2].trim(),
        options: [match[3].trim(), match[4].trim(), match[5].trim(), match[6].trim()],
        correctAnswer: match[7].trim(),
      });
    }
    return questions;
  }
  return [];
};

const generateQuiz = async (text, numQuestions) => {
  const prompt = `
    Generate ${numQuestions} multiple-choice questions from the following text.
    Each question must have 4 options (A-D) and specify the correct answer.
    Format as JSON array or plain text like:
    1. Question text
       A. option1 B. option2 C. option3 D. option4
       Correct: A
    Text: """${text}"""
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const outputText = response.text || response.contents?.[0]?.text || "";
  return parseGeminiOutput(outputText);
};

export const POST = async (req) => {
  try {
    const { name, text, numQuestions } = await req.json();

    if (!text || !numQuestions) {
      return new Response(JSON.stringify({ message: "Text and number of questions are required." }), { status: 400 });
    }

    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    const questions = await generateQuiz(text, numQuestions);
    if (!questions.length) {
      return new Response(JSON.stringify({ message: "No questions could be generated" }), { status: 400 });
    }

    const quiz = await Quiz.create({
      user: session.user.id,
      name: name || "Untitled Quiz",
      text,
      questions,
    });

    return new Response(JSON.stringify(quiz), { status: 201 });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return new Response(JSON.stringify({ message: "Failed to generate quiz" }), { status: 500 });
  }
};