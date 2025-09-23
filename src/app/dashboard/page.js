"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, History, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xl text-center space-y-8">
        <h2 className="text-xl text-indigo-600 uppercase tracking-wide">AI Quiz Builder</h2>

        <h1 className="text-4xl font-extrabold whitespace-nowrap">
          Welcome, {userName}!
        </h1>

        <p className="text-gray-500">Choose an option below to get started.</p>

        <div className="flex flex-col w-full gap-4 items-center">
          <button
            onClick={() => router.push("/dashboard/take-quiz")}
            className="flex items-center justify-center gap-3 p-4 rounded-2xl shadow bg-blue-600 text-white hover:bg-blue-700 transition w-full max-w-md"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Take a Quiz</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/history")}
            className="flex items-center justify-center gap-3 p-4 rounded-2xl shadow bg-green-600 text-white hover:bg-green-700 transition w-full max-w-md"
          >
            <History className="w-5 h-5" />
            <span className="font-semibold">Quiz History</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 p-4 rounded-2xl shadow bg-red-600 text-white hover:bg-red-700 transition w-full max-w-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}