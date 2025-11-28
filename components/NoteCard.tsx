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
        bg-yellow-200 
        rounded-lg 
        shadow-md 
        cursor-pointer 
        transition 
        hover:shadow-xl 
        hover:-translate-y-1 
        overflow-hidden
        flex flex-col
      "
    >
      {/* Title */}
      <h3 className="font-bold text-lg mb-2 truncate">
        {title}
      </h3>

      {/*  text preview */}
      <p className="text-sm text-gray-700 line-clamp-6 leading-snug">
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
