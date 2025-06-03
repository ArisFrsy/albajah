import { NextResponse } from "next/server";
import {
  getCabangByIdController,
  updateCabangController,
  deleteCabangController,
} from "@/controllers/Cabang";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idCabang = parseInt((await context.params).id, 10);
  if (isNaN(idCabang)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const result = await getCabangByIdController(idCabang);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
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

  const idCabang = parseInt((await context.params).id, 10);
  if (isNaN(idCabang)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const cabangData = await request.json();
    const result = await updateCabangController(idCabang, cabangData);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update data" },
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

  const idCabang = parseInt((await context.params).id, 10);
  if (isNaN(idCabang)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const result = await deleteCabangController(idCabang);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
