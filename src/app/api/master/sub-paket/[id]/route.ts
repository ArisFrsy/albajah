import { NextResponse } from "next/server";
import {
  getSubPaketByIdController,
  deleteSubPaketController,
} from "@/controllers/SubPaketController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idSubpaket = (await context.params).id;

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
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idSubpaket = (await context.params).id;

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
