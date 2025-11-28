import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { NotesCollection } from "@/lib/models/NoteModel";
import { ObjectId } from "mongodb";

/**
 * GET /api/notes/[id]
 * Returns a single note belonging to the authenticated user.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const decoded = verifyToken(req) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await NotesCollection();
    const note = await notes.findOne({
      _id: new ObjectId(id),
      userId: decoded.id,
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/notes/[id]
 * Updates the title and content of an existing note.
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const decoded = verifyToken(req) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();
    const notes = await NotesCollection();

    const result = await notes.updateOne(
      { _id: new ObjectId(id), userId: decoded.id },
      { $set: { title, content } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/notes/[id]
 * Deletes a note owned by the authenticated user.
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const decoded = verifyToken(req) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await NotesCollection();
    const result = await notes.deleteOne({
      _id: new ObjectId(id),
      userId: decoded.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
