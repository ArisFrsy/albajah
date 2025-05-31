import { NextResponse } from "next/server";
import {
  getAllSubPaketController,
  createSubPaketController,
  updateSubPaketController,
  deleteSubPaketController,
} from "../../../../controllers/SubPaketController";

import { checkAuth } from "@/utils/auth";
import { SubPaket } from "@/models/SubPaket";

export async function GET(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const url = new URL(request.url);
  const idPaket = parseInt(url.searchParams.get("idPaket") || "0", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);
  const search = url.searchParams.get("search") || "";
  const orderByField = url.searchParams.get("orderBy") || "idSubpaket";
  const rawOrderDir = url.searchParams.get("orderDir") || "desc";
  const orderByDirection =
    rawOrderDir === "asc" || rawOrderDir === "desc" ? rawOrderDir : "desc";

  try {
    const result = await getAllSubPaketController(
      idPaket,
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
    // get from json body
    const body: SubPaket = await request.json();
    const result = await createSubPaketController(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create sub-paket" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const body: SubPaket = await request.json();
    const idSubPaket: string = body.idSubpaket;

    const result = await updateSubPaketController(idSubPaket, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update sub-paket" },
      { status: 500 }
    );
  }
}
