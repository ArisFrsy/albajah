import {
  getAllCabangService,
  getCabangByIdService,
  createCabangService,
  updateCabangService,
  deleteCabangService,
} from "@/services/CabangService";
import { Cabang } from "@/models/Cabang";

export async function getAllCabangController(
  page?: number,
  perPage?: number,
  search?: string,
  filter?: string,
  orderByField?: string,
  orderByDirection?: "asc" | "desc",
  idProvinsi?: string,
  idKabupaten?: string
) {
  return await getAllCabangService({
    page,
    perPage,
    search,
    filter,
    orderByField,
    orderByDirection,
    idProvinsi,
    idKabupaten,
  });
}

export async function getCabangByIdController(idCabang: number) {
  return await getCabangByIdService(idCabang);
}

export async function createCabangController(cabang: Cabang) {
  return await createCabangService(cabang);
}

export async function updateCabangController(idCabang: number, cabang: Cabang) {
  return await updateCabangService(idCabang, cabang);
}
export async function deleteCabangController(idCabang: number) {
  return await deleteCabangService(idCabang);
}
