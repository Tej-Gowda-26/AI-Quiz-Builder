"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizHistoryDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching quiz");
        router.push("/dashboard/history");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, router]);

  if (loading) return <p className="text-center mt-6">Loading quiz...</p>;
  if (!quiz) return <p className="text-center mt-6">Quiz not found</p>;

  const totalQuestions = quiz.questions?.length || 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Quiz Summary</h2>
        <div className="flex items-center justify-between px-4 gap-4 flex-wrap">
          <span><strong>Quiz:</strong> {quiz.name}</span>
          <span className="text-gray-300">|</span>
          <span><strong>Questions:</strong> {totalQuestions}</span>
          <span className="text-gray-300">|</span>
          <span><strong>Score:</strong> {quiz.score}/{totalQuestions}</span>
          <span className="text-gray-300">|</span>
          <span><strong>Taken on:</strong> {quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : "N/A"}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">Questions & Answers</h2>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded shadow-sm">
            <p className="font-semibold mb-2">{idx + 1}. {q.question}</p>
            <ul className="space-y-2">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = letter === q.correctAnswer;
                const isUser = letter === q.userAnswer;
                return (
                  <li
                    key={i}
                    className={`p-2 rounded mb-2 ${isCorrect
                      ? "border-2 border-green-500 ring-2 ring-green-200 text-green-100"
                      : isUser && !isCorrect
                        ? "border-2 border-red-500 ring-2 ring-red-200 text-red-100"
                        : ""
                      }`}
                  >
                    <span className="mr-2 font-bold">{letter}.</span>
                    {opt}
                  </li>
                );
              })}
              {!q.userAnswer && <li className="text-red-500 italic">Not answered</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
