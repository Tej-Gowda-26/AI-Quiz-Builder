"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold">Welcome!</h1>

      <div className="flex flex-col w-80 space-y-4">
        <button
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push("/dashboard/take-quiz")}
        >
          Take Quiz
        </button>
        <button
          className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => router.push("/dashboard/history")}
        >
          Quiz History
        </button>
        <button
          className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>
    </div>
  );
}