import {
  getAllBeritaService,
  getBeritaByIdService,
  createBeritaService,
  updateBeritaService,
  deleteBeritaService,
} from "@/services/BeritaService";

export async function getAllBeritaController(
  page?: number,
  perPage?: number,
  search?: string,
  orderByField?: string,
  orderByDirection?: "asc" | "desc"
) {
  return await getAllBeritaService({
    page,
    perPage,
    search,
    orderByField,
    orderByDirection,
  });
}

export async function getBeritaByIdController(id: number) {
  if (!id) {
    throw new Error("ID is required to fetch a berita");
  }

  return await getBeritaByIdService(id);
}

export async function createBeritaController(
  judul: string,
  deskripsi?: string,
  image?: File | null
) {
  if (!judul) {
    throw new Error("Judul is required to create a berita");
  }

  return await createBeritaService({ judul, deskripsi, image });
}

export async function updateBeritaController(
  id: number,
  judul: string,
  deskripsi?: string,
  image?: File | null
) {
  if (!id) {
    throw new Error("ID is required to update a berita");
  }

  return await updateBeritaService(id, { judul, deskripsi, image });
}

export async function deleteBeritaController(id: number) {
  if (!id) {
    throw new Error("ID is required to delete a berita");
  }

  return await deleteBeritaService(id);
}
