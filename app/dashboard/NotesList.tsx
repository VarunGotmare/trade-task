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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const refreshNotes = () => loadNotes();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton variant="rectangular" width={240} height={200} />
        <Skeleton variant="rectangular" width={240} height={200} />
        <Skeleton variant="rectangular" width={240} height={200} />
      </div>
    );
  }

  if (!loading && notes.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No notes found. Click “Create Note” to add one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
