import { loginService, verifyCodeService } from "../services/AuthService";
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
