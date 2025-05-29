import { NextResponse } from "next/server";
import { loginController } from "../../../controllers/loginController";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await loginController(body);

  if (result.success) {
    return NextResponse.json(result, { status: 200 });
  }
  return NextResponse.json(result, { status: 401 });
}
