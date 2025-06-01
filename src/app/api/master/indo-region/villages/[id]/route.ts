import { NextResponse } from "next/server";
import { getVillagesController } from "@/controllers/IndoRegionController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idDistrict = params.id;

  try {
    const result = await getVillagesController(idDistrict);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch villages" },
      { status: 500 }
    );
  }
}
