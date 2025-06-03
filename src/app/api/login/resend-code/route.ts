import { NextResponse } from "next/server";
import { resendCodeController } from "@/controllers/LoginController";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const response = await resendCodeController(email);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in resend code:", error);
    return NextResponse.json(
      { error: "Failed to resend code" },
      { status: 500 }
    );
  }
}
