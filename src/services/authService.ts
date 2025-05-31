import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jtw";
import { LoginRequest } from "@/requests/LoginRequest";
import { LoginResponse } from "@/responses/LoginResponse";
import { sendLoginCode } from "@/lib/mailer";

export async function loginService({ email, password }: LoginRequest) {
  const user = await prisma.user.findUnique({ where: { email } });

  let loginResponse: LoginResponse = {
    success: true,
    message: "Login successful",
  };

  if (!user) {
    loginResponse.success = false;
    loginResponse.message = "User not found";
    return loginResponse;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    loginResponse.success = false;
    loginResponse.message = "Invalid password";
    return loginResponse;
  }

  const token = signJwt({
    userId: user.id,
    email: user.email,
    verified: false,
  });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

  await prisma.loginCode.create({ data: { email, code, expiresAt } });

  await sendLoginCode(email, user.name, code); // kirim email

  loginResponse.token = token;
  loginResponse.user = { id: user.id, email: user.email, name: user.name };

  return loginResponse;
}

export async function verifyCodeService(email: string, code: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const loginCode = await prisma.loginCode.findFirst({
    where: {
      email,
      code,
      expiresAt: {
        gte: new Date(), // pastikan kode belum kadaluarsa
      },
    },
  });

  if (!loginCode) {
    localStorage.removeItem("token");
    return { success: false, message: "Invalid or expired code" };
  }

  const token = signJwt({
    userId: user.id,
    email: user.email,
    verified: true,
  });

  // Hapus kode setelah verifikasi
  await prisma.loginCode.delete({ where: { id: loginCode.id } });

  return {
    success: true,
    message: "Code verified successfully",
    token,
  };
}
