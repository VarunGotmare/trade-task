import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { NotesCollection } from "@/lib/models/NoteModel";
import { ObjectId } from "mongodb";

//create note
export async function POST(req: Request) {
    try {
        const decoded: any = verifyToken(req);

        if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content } = await req.json();

        if (!title || !content) {
        return NextResponse.json(
            { error: "Title and content are required" },
            { status: 400 }
        );
        }

        const notes = await NotesCollection();

        const newNote = {
        userId: decoded.id,
        title,
        content,
        createdAt: new Date(),
        };

        const result = await notes.insertOne(newNote);
        return NextResponse.json({
        message: "Note created",
        noteId: result.insertedId,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

//get all notes
export async function GET(req: Request) {
    try {
        const decoded: any = verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notes = await NotesCollection();

        const userNotes = await notes
            .find({ userId: decoded.id })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ notes: userNotes });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

//delete note
export async function DELETE(req: Request) {
    try {
        const decoded: any = verifyToken(req);
        if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
        return NextResponse.json(
            { error: "Note ID is required" },
            { status: 400 }
        );
        }

        const notes = await NotesCollection();

        const result = await notes.deleteOne({
        _id: new ObjectId(id),
        userId: decoded.id,
        });

        if (result.deletedCount === 0) {
        return NextResponse.json(
            { error: "Note not found or unauthorized" },
            { status: 404 }
        );
        }

        return NextResponse.json({ message: "Note deleted" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
