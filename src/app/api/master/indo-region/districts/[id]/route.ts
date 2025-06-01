import { NextResponse } from "next/server";
import { getDistrictsController } from "@/controllers/IndoRegionController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idRegency = params.id;

  try {
    const result = await getDistrictsController(idRegency);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}
