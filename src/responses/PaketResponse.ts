import { Paket } from "../models/Paket";

export interface PaketResponse {
  success: boolean;
  message: string;
  data?: Paket;
  error?: string;
}
