"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Quill dynamic import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NoteEditorPage({ params }: any) {
  const router = useRouter();

  // ✅ FIX: unwrap async route params using use()
  const { id: noteId } = use(params);

  const isNewNote = noteId === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing note
  useEffect(() => {
    if (isNewNote) return;

    async function loadNote() {
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
    }

    loadNote();
  }, [noteId, isNewNote]);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty");
      return;
    }

    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");

    const url = isNewNote ? "/api/notes" : `/api/notes/${noteId}`;
    const method = isNewNote ? "POST" : "PUT";

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
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <input
          type="text"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold outline-none bg-transparent w-full"
        />

        <button
          onClick={() => router.push("/dashboard")}
          className="ml-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 bg-red-100 px-4 py-2 text-center">
          {error}
        </p>
      )}

      {/* Full Page Editor */}
      <div className="flex-1 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="h-full w-full"
          style={{ height: "calc(100vh - 160px)" }}
        />
      </div>

      {/* Save Button */}
      <button
        disabled={saving}
        onClick={handleSave}
        className="
          fixed bottom-6 right-6
          px-6 py-3 rounded-full
          bg-blue-600 text-white text-lg shadow-lg
          hover:bg-blue-700 transition
          disabled:opacity-50
        "
      >
        {saving ? "Saving..." : isNewNote ? "Create Note" : "Save Changes"}
      </button>
    </div>
  );
}
