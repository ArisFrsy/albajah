import { NextResponse } from "next/server";
import {
  getAllBeritaController,
  createBeritaController,
  updateBeritaController,
} from "@/controllers/BeritaController";

import { checkAuth } from "@/utils/auth";
export async function GET(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);
  const search = url.searchParams.get("search") || "";
  const orderByField = url.searchParams.get("orderBy") || "idBerita";
  const rawOrderDir = url.searchParams.get("orderDir") || "desc";
  const orderByDirection =
    rawOrderDir === "asc" || rawOrderDir === "desc" ? rawOrderDir : "desc";

  try {
    const result = await getAllBeritaController(
      page,
      perPage,
      search,
      orderByField,
      orderByDirection
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const formData = await request.formData();
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string | undefined;
    const result = await createBeritaController(judul, deskripsi);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create berita" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string, 10);
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string | undefined;

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await updateBeritaController(id, judul, deskripsi);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update berita" },
      { status: 500 }
    );
  }
}
