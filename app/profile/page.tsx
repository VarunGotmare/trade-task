"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user info on mount
  useEffect(() => {
    async function fetchUser() {
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

    fetchUser();
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">User ID:</span> {user._id}
          </p>
        </div>

        <hr className="my-6" />

        {/* Action */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
