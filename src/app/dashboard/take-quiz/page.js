"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function TakeQuiz() {
  const [quizName, setQuizName] = useState("");
  const [text, setText] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return alert("No file selected");
    if (!file.name.endsWith(".pdf")) return alert("Only PDF files are supported");

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }
      setText(fullText);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!quizName.trim()) return alert("Enter a quiz name");
    if (!text.trim()) return alert("Add text or upload a PDF");

    setLoading(true);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: quizName, text, numQuestions: Number(numQuestions) }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/quiz/${data._id}`);
      } else {
        const err = await res.text();
        alert("Failed to generate quiz: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Create Your Quiz</h1>

      <div>
        <label className="block mb-1 font-semibold">Quiz Name</label>
        <input
          type="text"
          placeholder="Enter quiz name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Quiz Content</label>
        <textarea
          placeholder="Type or paste here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer flex flex-col items-center justify-center">
          <span className="text-gray-500">(OR) Upload a PDF</span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          {fileName && <p className="mt-2 text-sm text-green-500">Uploaded: {fileName}</p>}
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="number"
          min={1}
          max={50}
          value={numQuestions}
          onChange={(e) => {
            const val = e.target.value;
            setNumQuestions(val === "" ? "" : parseInt(val, 10));
          }}
          onBlur={() => {
            if (!numQuestions || numQuestions < 1) setNumQuestions(1);
          }}
          className="p-3 border rounded-md w-full sm:w-32 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Questions"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex-1 px-6 py-3 rounded-md text-white font-semibold transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Generating quiz..." : "Generate Quiz"}
        </button>
      </div>
    </div>
  );
}
