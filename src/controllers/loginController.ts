import { loginService, verifyCodeService } from "../services/authService";

export async function loginController(body: any) {
  return await loginService(body);
}

export async function verifyCodeController(email: string, code: string) {
  return await verifyCodeService(email, code);
}
