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

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!quiz) return <p className="text-center mt-6">Quiz not found</p>;

  const totalQuestions = quiz.questions?.length || 0;
  const correctAnswers = quiz.questions?.filter(
    (q) => q.userAnswer === q.correctAnswer
  )?.length || 0;
  const score = quiz.score ?? correctAnswers;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 p-4 bg-gray-100 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Quiz Summary</h2>
        <p><strong>Quiz Name:</strong> {quiz.name}</p>
        <p><strong>Number of Questions:</strong> {totalQuestions}</p>
        <p>
          <strong>Date Taken:</strong>{" "}
          {quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : "N/A"}
        </p>
        <p><strong>Score:</strong> {score}/{totalQuestions}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Questions</h2>
        {totalQuestions === 0 ? (
          <p>No questions available.</p>
        ) : (
          quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded shadow-sm">
              <p className="font-semibold mb-2">
                {idx + 1}. {q.question || "Question not found"}
              </p>
              <ul className="list-disc pl-5">
                {q.options?.map((opt, i) => {
                  let bgColor = "";
                  if (opt === q.correctAnswer) bgColor = "bg-green-200";
                  if (opt === q.userAnswer && q.userAnswer !== q.correctAnswer)
                    bgColor = "bg-red-200";

                  return (
                    <li key={i} className={`p-1 rounded mb-1 ${bgColor}`}>
                      {opt}
                      {opt === q.correctAnswer && <span className="ml-2 font-bold">(Correct)</span>}
                      {opt === q.userAnswer && q.userAnswer !== q.correctAnswer && (
                        <span className="ml-2 font-bold">(Your Answer)</span>
                      )}
                    </li>
                  );
                })}
                {!q.userAnswer && <li className="text-gray-500">Not answered</li>}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
