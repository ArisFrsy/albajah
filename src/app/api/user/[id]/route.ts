import { NextResponse } from "next/server";
import {
  getUserByIdController,
  updateUserController,
} from "@/controllers/UserController";
import { checkAuth } from "@/utils/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const userId = parseInt((await context.params).id);

  try {
    const result = await getUserByIdController(userId);
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await checkAuth(request);
  if (unauthorizedResponse) return unauthorizedResponse;

  const userId = parseInt((await context.params).id);
  const { newPassword, currentPassword, name, email } = await request.json();

  try {
    const result = await updateUserController(
      userId,
      newPassword,
      currentPassword,
      name,
      email
    );
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
