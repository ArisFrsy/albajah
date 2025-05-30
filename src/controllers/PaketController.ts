import {
  getAllPaketService,
  getPaketByIdService,
  createPaketService,
  updatePaketService,
  deletePaketService,
} from "@/services/PaketService";

import { PaketRequest } from "@/requests/PaketRequest";

export async function getAllPaketController(
  page: number,
  perPage: number,
  search: string,
  filter: string,
  orderByField?: string,
  orderByDirection?: "asc" | "desc"
) {
  return await getAllPaketService({
    page,
    perPage,
    search,
    filter,
    orderByField,
    orderByDirection,
  });
}

export async function getPaketByIdController(id: number) {
  if (!id) {
    throw new Error("ID is required to fetch a paket");
  }

  return await getPaketByIdService(id);
}

export async function createPaketController(
  nama: string,
  deskripsi?: string,
  fileFoto?: File | null
) {
  if (!nama) {
    throw new Error("Nama is required to create a paket");
  }

  console.log("Creating paket with:", { nama, deskripsi, fileFoto });

  return await createPaketService({ nama, deskripsi, fileFoto });
}

export async function updatePaketController(
  id: number,
  nama: string,
  deskripsi?: string,
  fileFoto?: File | null
) {
  if (!id) {
    throw new Error("ID is required to update a paket");
  }

  const paketRequest: PaketRequest = {
    nama,
    deskripsi,
    fileFoto,
  };
  return await updatePaketService(id, paketRequest);
}

export async function deletePaketController(id: number) {
  if (!id) {
    throw new Error("ID is required to delete a paket");
  }

  return await deletePaketService(id);
}
