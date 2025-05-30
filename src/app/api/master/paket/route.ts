import { NextResponse } from "next/server";
import {
  getAllPaketController,
  createPaketController,
  updatePaketController,
  deletePaketController,
} from "../../../../controllers/PaketController";
import { checkAuth } from "@/utils/auth";

export async function GET(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "";
  const orderByField = url.searchParams.get("orderBy") || "idPaket";
  const rawOrderDir = url.searchParams.get("orderDir") || "desc";
  const orderByDirection =
    rawOrderDir === "asc" || rawOrderDir === "desc" ? rawOrderDir : "desc";

  try {
    const result = await getAllPaketController(
      page,
      perPage,
      search,
      filter,
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
    const { nama, deskripsi } = await request.json();
    const result = await createPaketController(nama, deskripsi);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create paket" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const { idPaket, nama, deskripsi } = await request.json();
    const result = await updatePaketController(idPaket, nama, deskripsi);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update paket" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const { id } = await request.json();
    const result = await deletePaketController(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete paket" },
      { status: 500 }
    );
  }
}
