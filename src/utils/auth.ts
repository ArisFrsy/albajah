// utils/auth.ts
import { NextResponse } from "next/server";
import { verifyJwt } from "./jtw"; // pastikan ini verify JWT-mu

export function checkAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return null; // artinya valid dan lanjut
}
