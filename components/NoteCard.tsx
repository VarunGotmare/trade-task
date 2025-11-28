"use client";

interface NoteCardProps {
  title: string;
  content: string;
  onClick?: () => void;
}

export default function NoteCard({ title, content, onClick }: NoteCardProps) {
  const plainText = htmlToText(content);

  return (
    <div
      onClick={onClick}
      className="
        w-60 h-48 
        p-4 
        rounded-lg 
        cursor-pointer 
        transition-all
        overflow-hidden
        flex flex-col
        
        bg-[#f5e7a3]             /* soft pale muted yellow */
        border border-[#d1b85b]  /* low-contrast gold border */
        shadow-[0_3px_8px_rgba(0,0,0,0.25)]
        hover:shadow-[0_5px_14px_rgba(0,0,0,0.35)]
        hover:-translate-y-1
      "
    >
      <h3 className="font-semibold text-lg mb-2 text-[#5c4a14] truncate">
        {title}
      </h3>

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
