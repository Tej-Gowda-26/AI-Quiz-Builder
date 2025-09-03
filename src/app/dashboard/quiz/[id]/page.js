"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        if (!res.ok) throw new Error("Failed to load quiz");
        const data = await res.json();
        setQuiz(data);
        setUserAnswers(data.questions?.map(() => "") || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching quiz");
        router.push("/dashboard");
      }
    };
    fetchQuiz();
  }, [id, router]);

  if (!quiz) return <p className="p-6 text-center">Loading quiz...</p>;

  const question = quiz.questions?.[currentIndex];

  const handleAnswer = (option) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = option;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < (quiz.questions?.length || 0) - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/quiz/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: userAnswers }),
      });

      if (res.ok) {
        alert("Quiz submitted successfully");
        router.push(`/dashboard`);
      } else {
        const err = await res.text();
        alert("Failed to submit quiz: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    }
  };


  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{quiz.name}</h1>

      <div className="mb-6">
        <p className="text-xl font-semibold mb-4">
          Question {currentIndex + 1}/{quiz.questions?.length || 0}
        </p>
        <p className="text-lg mb-4">{question?.question || "Question not found"}</p>

        <div className="space-y-3 mb-6">
          {question?.options?.map((opt) => (
            <div
              key={opt}
              className={`border rounded p-3 cursor-pointer transition-all duration-200
              ${userAnswers[currentIndex] === opt ? "border-green-500 ring-2 ring-green-200" : "border-gray-300"}`}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded ${currentIndex === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Previous
          </button>

          {currentIndex === (quiz.questions?.length || 0) - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}