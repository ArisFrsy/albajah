import {
  getSubPaketService,
  getSubPaketByIdService,
  createSubPaketService,
  updateSubPaketService,
  deleteSubPaketService,
} from "@/services/SubPaketService";

import { SubPaket } from "@/models/SubPaket";
import { sub } from "date-fns";

export async function getAllSubPaketController(
  idPaket?: number,
  page?: number,
  perPage?: number,
  search?: string,
  orderByField?: string,
  orderByDirection?: "asc" | "desc"
) {
  return await getSubPaketService({
    idPaket,
    page,
    perPage,
    search,
    orderByField,
    orderByDirection,
  });
}

export async function getSubPaketByIdController(idSubPaket: string) {
  return await getSubPaketByIdService(idSubPaket);
}

export async function createSubPaketController(SubPaket: SubPaket) {
  return await createSubPaketService(SubPaket);
}

export async function updateSubPaketController(
  idSubPaket: string,
  SubPaket: SubPaket
) {
  return await updateSubPaketService(idSubPaket, SubPaket);
}

export async function deleteSubPaketController(idSubPaket: string) {
  return await deleteSubPaketService(idSubPaket);
}
