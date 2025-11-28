"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d0b14] relative overflow-hidden">

      {/*  Purple glow background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[150px] rounded-full opacity-60"></div>

      {/* Glass Card */}
      <form
        onSubmit={handleRegister}
        className="
          w-full max-w-md 
          p-8 
          rounded-2xl 
          bg-white/10 
          backdrop-blur-xl 
          border border-white/20 
          shadow-2xl
          text-white
          relative z-10
        "
      >
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-2 tracking-wide">
          Create Your Account
        </h1>
        <p className="text-center text-gray-300 mb-6">Register to get started</p>

        {/* Error */}
        {error && (
          <p className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm mb-4 border border-red-500/30">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="relative mb-4">
          <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />

          <input
            type="text"
            placeholder="Full Name"
            className="
              w-full p-3 pl-11 rounded-lg
              bg-white/10 border border-white/20 
              text-white
              focus:ring-2 focus:ring-purple-400 
              outline-none
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />

          <input
            type="email"
            placeholder="Email"
            className="
              w-full p-3 pl-11 rounded-lg
              bg-white/10 border border-white/20 
              text-white
              focus:ring-2 focus:ring-purple-400 
              outline-none
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full p-3 pl-11 rounded-lg
              bg-white/10 border border-white/20
              text-white
              focus:ring-2 focus:ring-purple-400 
              outline-none
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-full
            bg-purple-600/80 text-white font-medium tracking-wide
            hover:bg-purple-700 transition
            disabled:opacity-50 shadow-xl
            flex items-center justify-center gap-2
          "
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="mt-5 text-center text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="
              text-purple-300 font-semibold cursor-pointer 
              hover:underline inline-flex items-center gap-1
            "
          >
            <LoginIcon sx={{ fontSize: 18 }} />
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
