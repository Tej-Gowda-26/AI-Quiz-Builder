import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async (req, context) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    const { id } = await context.params;
    if (!id) return new Response(JSON.stringify({ message: "Quiz ID required" }), { status: 404 });

    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return new Response(JSON.stringify({ message: "Quiz not found" }), { status: 404 });

    return new Response(JSON.stringify(quiz), { status: 200 });
  } catch (err) {
    console.error("Fetch quiz error:", err);
    return new Response(JSON.stringify({ message: "Failed to fetch quiz" }), { status: 500 });
  }
};
