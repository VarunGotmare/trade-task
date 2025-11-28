import clientPromise from "./mongodb";

export async function getDB() {
  const client = await clientPromise;
  return client.db("prime-trade-task"); 
}
