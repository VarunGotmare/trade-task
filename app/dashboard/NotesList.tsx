"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NoteCard from "@/components/NoteCard";
import Skeleton from "@mui/material/Skeleton";

export default function NotesList() {
  const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        setNotes([]);
        setLoading(false);
        return;
      }

      setNotes(data.notes);
      setLoading(false);
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  // --- Loading skeletons ---
  if (loading) {
    return (
      <div className="
        grid 
        gap-6 
        grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
      ">
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={180} />
      </div>
    );
  }

  // --- Empty state ---
  if (!loading && notes.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <p>No notes found.</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first note using the button above.
        </p>
      </div>
    );
  }

  // --- Actual Notes Grid ---
  return (
    <div
      className="
        grid 
        gap-6 
        grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
        pb-8
      "
    >
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          title={note.title}
          content={note.content}
          onClick={() => router.push(`/dashboard/note/${note._id}`)}
        />
      ))}
    </div>
  );
}
