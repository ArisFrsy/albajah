import {
  loginService,
  verifyCodeService,
  resendCodeService,
} from "../services/AuthService";
import { LoginRequest } from "@/requests/LoginRequest";

export async function loginController(body: LoginRequest) {
  if (!body.email || !body.password) {
    throw new Error("Email and password are required");
  }

  return await loginService(body);
}

export async function verifyCodeController(email: string, code: string) {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }
  return await verifyCodeService(email, code);
}

export async function resendCodeController(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  return await resendCodeService(email);
}
