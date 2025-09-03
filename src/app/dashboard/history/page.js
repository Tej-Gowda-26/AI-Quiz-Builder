"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/quiz/history");
        if (!res.ok) throw new Error("Failed to fetch quiz history");

        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching quiz history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading quiz history...</p>;
  if (!quizzes.length) return <p className="p-6 text-center">No quizzes taken yet</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => router.push(`/dashboard/history/${quiz._id}`)}
          >
            <p className="font-semibold mb-1">{quiz.name}</p>

            <p className="text-sm text-gray-600">
              Questions: {quiz.totalQuestions} | Taken on:{" "}
              {quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : "N/A"} | Score:{" "}
              {quiz.score !== undefined && quiz.score !== null ? quiz.score : "Not graded yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}