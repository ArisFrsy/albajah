import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jtw";
import { LoginRequest } from "@/requests/LoginRequest";
import { LoginResponse } from "@/responses/LoginResponse";

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

  const token = signJwt({ userId: user.id, email: user.email });

  loginResponse.token = token;
  loginResponse.user = { id: user.id, email: user.email, name: user.name };

  return loginResponse;
}
