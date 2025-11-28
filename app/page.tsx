"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 text-center">

      {/* Hero Section */}
      <h1 className="text-4xl font-bold mb-4">Welcome to My App 🚀</h1>
      <p className="text-gray-600 max-w-xl mb-8">
        A modern full-stack application built with Next.js, MongoDB, JWT Authentication
        and a clean dashboard interface.  
        Please login or register to get started.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
