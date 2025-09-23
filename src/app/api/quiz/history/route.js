import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async () => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    const quizzes = await Quiz.find({ user: session.user.id })
      .select("name score createdAt questions")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = quizzes.map((q) => ({
      _id: q._id,
      name: q.name,
      score: q.score ?? 0,
      totalQuestions: q.questions.length,
      createdAt: q.createdAt,
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error("History fetch error:", err);
    return new Response(JSON.stringify({ message: "Failed to fetch history" }), { status: 500 });
  }
};
