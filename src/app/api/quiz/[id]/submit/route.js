import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const POST = async (req, { params }) => {
  try {
    const { answers } = await req.json();
    const { id } = params;

    if (!answers) return new Response("No answers submitted", { status: 400 });

    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const quiz = await Quiz.findById(id);
    if (!quiz) return new Response("Quiz not found", { status: 404 });

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      q.userAnswer = answers[idx] || "";
      if (q.userAnswer === q.correctAnswer) correctCount++;
    });

    quiz.score = correctCount;
    await quiz.save();

    return new Response(
      JSON.stringify({ message: "Quiz submitted", score: correctCount }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Quiz submit error:", err);
    return new Response("Failed to submit quiz", { status: 500 });
  }
};
