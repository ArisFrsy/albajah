import { NextResponse } from "next/server";
import { getRegenciesController } from "@/controllers/IndoRegionController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const idProvince = (await context.params).id;

  try {
    const result = await getRegenciesController(idProvince);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch regencies" },
      { status: 500 }
    );
  }
}
