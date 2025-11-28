import { getDB } from "@/lib/db";
import { INote } from "@/types/Note";

export async function NotesCollection() {
  const db = await getDB();
  return db.collection<INote>("notes");
}
