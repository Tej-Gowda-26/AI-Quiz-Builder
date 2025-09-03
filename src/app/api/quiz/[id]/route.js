import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async (req, { params }) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { id } = params;
    if (!id) return new Response("Quiz id is required", { status: 404 });

    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return new Response("Quiz not found", { status: 404 });

    if (quiz.user.toString() !== session.user.id)
      return new Response("Forbidden", { status: 403 });

    return new Response(JSON.stringify(quiz), { status: 200 });
  } catch (err) {
    console.error("Quiz fetch error:", err);
    return new Response("Failed to fetch quiz", { status: 500 });
  }
};
