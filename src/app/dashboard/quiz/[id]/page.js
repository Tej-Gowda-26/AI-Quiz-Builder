"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleAnswer = (optionIndex) => {
    const letter = String.fromCharCode(65 + optionIndex);
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = letter;
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
      setSubmitting(true);
      const res = await fetch(`/api/quiz/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: userAnswers }),
      });

      if (res.ok) {
        await res.json();
        alert("Quiz submitted successfully!");
        router.push("/dashboard");
      } else {
        const err = await res.text();
        alert("Failed to submit quiz: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-24 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">{quiz.name}</h1>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold">
            Question {currentIndex + 1} / {quiz.questions?.length || 0}
          </p>
        </div>

        <p className="text-lg mb-4">{question?.question || "Question not found"}</p>

        <div className="space-y-3">
          {question?.options?.map((opt, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 cursor-pointer flex items-center justify-start
                  ${userAnswers[currentIndex] === String.fromCharCode(65 + i)
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-300"
                }`}
              onClick={() => handleAnswer(i)}
            >
              <span className="font-medium">{String.fromCharCode(65 + i)}. {opt}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitting}
            className={`px-5 py-2 rounded-lg font-semibold transition ${currentIndex === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Previous
          </button>

          {currentIndex === (quiz.questions?.length || 0) - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-5 py-2 rounded-lg font-semibold transition ${submitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}