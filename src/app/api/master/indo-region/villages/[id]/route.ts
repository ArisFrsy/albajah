import { NextResponse } from "next/server";
import { getVillagesController } from "@/controllers/IndoRegionController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idDistrict = (await context.params).id;

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
