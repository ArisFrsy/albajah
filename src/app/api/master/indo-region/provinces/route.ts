import { NextResponse } from "next/server";
import { getProvincesController } from "@/controllers/IndoRegionController";
import { checkAuth } from "@/utils/auth";

export async function GET(request: Request) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const result = await getProvincesController();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: 500 }
    );
  }
}
