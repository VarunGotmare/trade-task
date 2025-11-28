"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Quill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: noteId } = use(params);

  const isNew = noteId === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing note
  useEffect(() => {
    if (isNew) return;

    const fetchNote = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load note");
        setLoading(false);
        return;
      }

      setTitle(data.note.title);
      setContent(data.note.content);
      setLoading(false);
    };

    fetchNote();
  }, [noteId, isNew]);

  // Save note
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty");
      return;
    }

    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    const url = isNew ? "/api/notes" : `/api/notes/${noteId}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save note");
      return;
    }

    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0a18] text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2140] bg-[#1a132b] shadow-sm">
        <input
          type="text"
          placeholder="Untitled Note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full text-2xl font-semibold outline-none
            bg-transparent text-white placeholder:text-gray-500
          "
        />

        <button
          onClick={() => router.push("/dashboard")}
          className="
            ml-4 px-4 py-2 rounded-lg 
            bg-[#2a2140] text-gray-200
            hover:bg-[#3a2f55] transition
          "
        >
          Back
        </button>
      </div>

      {error && (
        <p className="text-red-400 bg-red-900/30 border border-red-800 px-4 py-2 text-center text-sm">
          {error}
        </p>
      )}

      {/* Editor (fills the page fully) */}
      <div className="flex-1 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="h-full dark-quill"
          style={{ height: "100%", border: "none" }}
        />
      </div>

      {/* Floating Save Button */}
      <button
        disabled={saving}
        onClick={handleSave}
        className="
          fixed bottom-6 right-6
          px-6 py-3 rounded-full
          bg-[#742dc6] text-white text-lg 
          shadow-lg hover:bg-[#6023a0]
          transition disabled:opacity-50
        "
      >
        {saving ? "Saving…" : isNew ? "Create Note" : "Save Changes"}
      </button>
    </div>
  );
}
