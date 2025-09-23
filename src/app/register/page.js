"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("User created successfully! Please login to continue.");
      router.push("/login");
    } else {
      if (data?.message) {
        setError(data.message);
      } else {
        setError("Error creating user. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-prose">
          <h1 className="text-4xl font-bold mb-6 text-indigo-600 text-center uppercase tracking-wide">AI Quiz Builder</h1>

          <ul className="text-gray-500 text-xl leading-relaxed space-y-2 text-left list-none">
            <li>
              ✨ AI Quiz Builder is your go-to platform for creating, taking, and keeping track of quizzes effortlessly.
            </li>
            <li>
              ⚡ Generate quizzes on the fly, answer questions at your own pace, and easily revisit your quiz history to track your progress.
            </li>
            <li>
              💻 Built with <span className="font-semibold">Next.js</span>,
              <span className="font-semibold"> Tailwind CSS</span>,
              <span className="font-semibold"> MongoDB</span>, and
              <span className="font-semibold"> NextAuth</span> for secure authentication.
            </li>
            <li>
              🏆 Whether you're studying, teaching, or just having fun, AI Quiz Builder makes learning interactive, engaging, and effective.
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md border p-8 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-center mb-2">Create Your Account</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
