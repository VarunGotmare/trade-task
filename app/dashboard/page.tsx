"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import NotesList from "./NotesList";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Dashboard Title */}
          {loading ? (
            <Skeleton variant="text" width={180} height={40} />
          ) : (
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          )}

          {/* Profile Icon + Menu */}
          <div className="relative" ref={menuRef}>
            {/* PROFILE ICON */}
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex justify-center items-center bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
              >
                <span className="text-xl">👤</span>
              </button>
            )}

            {/* Dropdown */}
            {!loading && menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg py-2 z-20">
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WELCOME SECTION */}
        <div className="mb-4">
          {loading ? (
            <>
              <Skeleton variant="text" width={280} height={40} />
            </>
          ) : (
            <h2 className="text-3xl font-medium">
              Welcome To Your Dashboard, {user.name}
            </h2>
          )}
        </div>

        <hr className="my-6" />

        {/* NOTES SECTION */}
        <div>
          {loading ? (
            <>
              <Skeleton variant="text" width={200} height={30} />
              <Skeleton variant="rectangular" width={"100%"} height={120} />
            </>
          ) : (
            <>
              {/* Title + Create Button */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">Your Notes</h3>

                <button
                  onClick={() => router.push("/dashboard/note/new")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  + Create Note
                </button>
              </div>

              {/* Notes List Component */}
              <NotesList />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
