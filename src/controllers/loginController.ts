import { loginService } from "../services/authService";

export async function loginController(body: any) {
  return await loginService(body);
}
