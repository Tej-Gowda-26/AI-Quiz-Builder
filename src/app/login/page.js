"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-prose">
          <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600 uppercase tracking-wide">AI Quiz Builder</h1>

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
              🏆 Whether you're studying, teaching, or just having fun, AI Quiz Builder makes learning
              interactive, engaging, and effective.
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md border p-8 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-2">Welcome! Please login to continue.</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}