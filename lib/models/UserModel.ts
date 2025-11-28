import { getDB } from "@/lib/db";
import { IUser } from "@/types/User";

export async function UsersCollection() {
  const db = await getDB();
  return db.collection<IUser>("users");
}
