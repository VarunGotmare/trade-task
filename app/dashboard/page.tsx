"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import NotesList from "./NotesList";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  // Close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#faf5ff] flex flex-col">

      {/* Header */}
      <header className="w-full bg-[#9333ea] text-white px-8 py-5 flex items-center justify-between sticky top-0 shadow-md z-20">
        {loading ? (
          <Skeleton variant="text" width={150} height={35} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
        ) : (
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        )}

        <div className="relative" ref={menuRef}>
          {/* Avatar */}
          {loading ? (
            <Skeleton variant="circular" width={45} height={45} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
          ) : (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-12 h-12 flex items-center justify-center bg-white text-[#9333ea] font-bold rounded-full shadow hover:bg-gray-100 transition"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
          )}

          {/* Dropdown */}
          {!loading && menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 text-gray-700">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-10">

        {/* Greeting Card */}
        <div className="mb-10">
          {loading ? (
            <Skeleton variant="text" width={280} height={40} />
          ) : (
            <div className="bg-[#f3e8ff] border border-[#e9d5ff] px-6 py-5 rounded-xl shadow-sm">
              <h2 className="text-3xl font-semibold text-[#6b21a8]">
                Welcome, {user.name.split(" ")[0]} 👋
              </h2>
              <p className="text-[#9333ea] mt-1 text-sm">Hope you're having a productive day!</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="w-full">
          {loading ? (
            <>
              <Skeleton variant="text" width={180} height={30} />
              <Skeleton variant="rectangular" width={"100%"} height={160} />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#6b21a8]">Your Notes</h3>

                <button
                  onClick={() => router.push("/dashboard/note/new")}
                  className="px-5 py-2 bg-[#9333ea] text-white rounded-lg font-medium shadow hover:bg-[#7e22ce] transition"
                >
                  + New Note
                </button>
              </div>

              <NotesList />
            </>
          )}
        </div>
      </main>

      {/* Floating FAB */}
      {!loading && (
        <Fab
          aria-label="add"
          onClick={() => router.push("/dashboard/note/new")}
          sx={{
            position: "fixed",
            bottom: 28,
            right: 28,
            backgroundColor: "#9333ea",
            color: "white",
            "&:hover": { backgroundColor: "#7e22ce" },
            width: 60,
            height: 60,
            boxShadow: "0px 6px 16px rgba(0,0,0,0.25)",
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>
      )}
    </div>
  );
}
