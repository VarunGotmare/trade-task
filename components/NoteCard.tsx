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
        shadow 
        cursor-pointer 
        transition 
        hover:shadow-xl 
        hover:-translate-y-1 
        overflow-hidden
        flex flex-col
        bg-yellow-100 
        border border-yellow-400
      "
    >
      {/* Title */}
      <h3 className="font-bold text-lg mb-2 text-yellow-900 truncate">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-yellow-800 line-clamp-6 leading-snug">
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
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
