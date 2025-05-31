// utils/auth.ts
import { NextResponse } from "next/server";
import { verifyJwt } from "./jtw"; // pastikan ini verify JWT-mu
import { jwtDecode } from "jwt-decode";

export function checkAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = jwtDecode(token) as {
    userId: string;
    email: string;
    verified: boolean;
  };

  if (!data.verified) {
    return NextResponse.json(
      { message: "Email not verified" },
      { status: 403 }
    );
  }

  return null; // artinya valid dan lanjut
}
