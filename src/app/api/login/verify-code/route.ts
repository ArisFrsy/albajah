import { NextResponse } from "next/server";
import { verifyCodeController } from "../../../../controllers/loginController";

export async function POST(request: Request) {
  const { email, code } = await request.json();
  const result = await verifyCodeController(email, code);

  if (result.success) {
    return NextResponse.json(result, { status: 200 });
  }
  return NextResponse.json(result, { status: 401 });
}
