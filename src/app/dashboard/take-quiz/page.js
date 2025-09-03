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
    if (!text.trim()) return alert("Type or upload text");

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
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Quiz</h1>

      <input
        type="text"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <textarea
        placeholder="Type or paste text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 transition cursor-pointer">
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
          <span className="text-gray-600">Click or drag PDF here to upload</span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          {fileName && <p className="mt-2 text-sm text-gray-800">Uploaded: {fileName}</p>}
        </label>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min={1}
          max={50}
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value, 10) || 1)}
          className="p-2 border rounded w-32"
          placeholder="No. of Questions"
        />
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
}
