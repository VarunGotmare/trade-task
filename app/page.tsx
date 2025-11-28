"use client";

import { useRouter } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import FloatingLines from "../components/FloatingLines";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative bg-black min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">

      {/* FloatingLines Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.65]">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[10, 4, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl flex flex-col items-center text-center px-4">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-white mb-5">
          Welcome to Your Notes App ✨
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-200 max-w-xl mb-12 tracking-wide leading-relaxed">
          A clean, modern note-taking platform built for the Primetrade.ai frontend task.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">

          {/* Login Button (Glassmorphic) */}
          <button
            onClick={() => router.push("/login")}
            className="
              px-8 py-3 rounded-full
              text-white font-medium tracking-wide
              flex items-center justify-center gap-2
              w-full sm:w-auto

              bg-white/10 
              backdrop-blur-md 
              border border-white/20 
              shadow-lg

              hover:bg-white/20 hover:border-white/30 transition
            "
          >
            <LoginIcon />
            Login
          </button>

          {/* Register Button (Glassmorphic) */}
          <button
            onClick={() => router.push("/register")}
            className="
              px-8 py-3 rounded-full
              text-white font-medium tracking-wide
              flex items-center justify-center gap-2
              w-full sm:w-auto

              bg-white/10 
              backdrop-blur-md 
              border border-white/20 
              shadow-lg

              hover:bg-white/20 hover:border-white/30 transition
            "
          >
            <PersonAddAltIcon />
            Register
          </button>

        </div>
      </div>
    </div>
  );
}
