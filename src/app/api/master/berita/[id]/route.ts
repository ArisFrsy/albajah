import { NextResponse } from "next/server";
import {
  getBeritaByIdController,
  deleteBeritaController,
  updateBeritaController,
} from "@/controllers/BeritaController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const id = parseInt((await context.params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const result = await getBeritaByIdController(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch berita" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;
  const id = parseInt((await context.params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const formData = await request.formData();
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string | undefined;
    const image = formData.get("image") as File | null;

    const result = await updateBeritaController(id, judul, deskripsi, image);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update berita" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const id = parseInt((await context.params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const result = await deleteBeritaController(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete berita" },
      { status: 500 }
    );
  }
}
