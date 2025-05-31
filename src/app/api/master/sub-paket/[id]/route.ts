import { NextResponse } from "next/server";
import {
  getSubPaketByIdController,
  deleteSubPaketController,
} from "@/controllers/SubPaketController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idSubpaket = params.id;

  try {
    const result = await getSubPaketByIdController(idSubpaket);
    if (!result) {
      return NextResponse.json(
        { error: "Sub-paket not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sub-paket" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idSubpaket = params.id;

  try {
    const result = await deleteSubPaketController(idSubpaket);
    if (!result) {
      return NextResponse.json(
        { error: "Sub-paket not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete sub-paket" },
      { status: 500 }
    );
  }
}
