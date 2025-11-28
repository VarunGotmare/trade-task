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
    <div className="min-h-screen bg-[#0d0b12] text-[#eae2ff] flex flex-col">

      {/* Header */}
      <header className="w-full bg-[#181322] border-b border-[#2a2338] px-8 py-4 flex items-center justify-between sticky top-0 shadow-lg z-20">
        {loading ? (
          <Skeleton variant="text" width={150} height={35} sx={{ bgcolor: "#2a2338" }} />
        ) : (
          <h1 className="text-2xl font-semibold tracking-wide text-[#d7c5ff]">
            Dashboard
          </h1>
        )}

        <div className="relative" ref={menuRef}>
          {/* Avatar */}
          {loading ? (
            <Skeleton variant="circular" width={45} height={45} sx={{ bgcolor: "#2a2338" }} />
          ) : (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                w-11 h-11 flex items-center justify-center
                bg-[#2a2338] text-[#c8a7ff] 
                font-medium rounded-full 
                border border-[#3b3052]
                hover:bg-[#352b47] transition
              "
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
          )}

          {/* Dropdown */}
          {!loading && menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#181322] border border-[#2a2338] rounded-md shadow-xl py-2 text-[#d7c5ff]">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-[#2a2338]"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-[#2a2338] text-red-400"
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
            <Skeleton variant="text" width={280} height={40} sx={{ bgcolor: "#2a2338" }} />
          ) : (
            <div className="bg-[#181322] border border-[#2a2338] px-6 py-5 rounded-xl shadow">
              <h2 className="text-2xl font-semibold text-[#d7c5ff]">
                Welcome, {user.name.split(" ")[0]}
              </h2>
              <p className="text-[#a78bdc] mt-1 text-sm">
                Your notes are available below.
              </p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="w-full">
          {loading ? (
            <>
              <Skeleton variant="text" width={180} height={30} sx={{ bgcolor: "#2a2338" }} />
              <Skeleton variant="rectangular" width={"100%"} height={160} sx={{ bgcolor: "#2a2338" }} />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#d7c5ff]">
                  Your Notes
                </h3>

                <button
                  onClick={() => router.push("/dashboard/note/new")}
                  className="
                    px-5 py-2 rounded-lg
                    bg-[#9b5bff] text-white 
                    font-medium shadow
                    hover:bg-[#8747e8] transition
                  "
                >
                  New Note
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
            backgroundColor: "#9b5bff",
            color: "white",
            "&:hover": { backgroundColor: "#8747e8" },
            width: 60,
            height: 60,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>
      )}
    </div>
  );
}
