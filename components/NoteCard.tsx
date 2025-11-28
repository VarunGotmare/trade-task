"use client";

import DeleteIcon from "@mui/icons-material/Delete";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export default function NoteCard({
  id,
  title,
  content,
  onClick,
  onDelete,
}: NoteCardProps) {
  const plainText = htmlToText(content);

  return (
    <div
      onClick={onClick}
      className="
        relative
        w-60 h-48 
        p-4 
        rounded-lg
        cursor-pointer 
        transition-all
        overflow-hidden
        flex flex-col
        
        bg-[#f5e7a3]
        border border-[#d1b85b]
        shadow-[0_3px_8px_rgba(0,0,0,0.25)]
        hover:shadow-[0_5px_14px_rgba(0,0,0,0.35)]
        hover:-translate-y-1
      "
    >

      {/* Delete Button (bottom-right corner) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(id);
        }}
        className="
          absolute bottom-2 right-2
          bg-[#4b5563] text-white   /* soft slate gray */
          w-8 h-8 flex items-center justify-center
          rounded-full
          shadow-md 
          hover:bg-[#374151] transition
        "
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
      </button>

      {/* Title */}
      <h3 className="font-semibold text-lg mb-2 text-[#5c4a14] truncate">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[#4a3d0f] line-clamp-6 leading-snug">
        {plainText}
      </p>
    </div>
  );
}

function htmlToText(html: string) {
  if (!html) return "";

  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/p>|<\/div>|<\/li>|<\/h[1-6]>/gi, "\n");

  let text = html.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}
