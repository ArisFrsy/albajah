export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}
