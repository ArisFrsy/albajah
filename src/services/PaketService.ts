import { Prisma } from "@/generated/prisma"; // path to your generated Prisma client folder
import prisma from "@/lib/prisma"; // your prisma client instance, make sure it uses the same generated client

export async function getAllPaketService({
  page = 1,
  perPage = 10,
  search = "",
  filter = "",
  orderByField = "idPaket",
  orderByDirection = "desc",
}: {
  page?: number;
  perPage?: number;
  search?: string;
  filter?: string;
  orderByField?: string;
  orderByDirection?: "asc" | "desc";
}) {
  try {
    const where: Prisma.PaketWhereInput = {
      OR: [
        {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          deskripsi: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
      ...(filter && {
        deskripsi: {
          contains: filter,
          mode: "insensitive",
        },
      }),
    };

    // Build orderBy object dynamically
    const orderBy: Prisma.PaketOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    };

    const total = await prisma.paket.count({ where });
    const data = await prisma.paket.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
    });

    return {
      success: true,
      message: "Paket list fetched successfully",
      data,
      total,
      page,
      perPage,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch paket list",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getPaketByIdService(id: number) {
  try {
    const paket = await prisma.paket.findUnique({
      where: { idPaket: id },
    });

    if (!paket) {
      return {
        success: false,
        message: "Paket not found",
      };
    }

    return {
      success: true,
      message: "Paket fetched successfully",
      data: paket,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch paket",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createPaketService({
  nama,
  deskripsi,
}: {
  nama: string;
  deskripsi?: string;
}) {
  try {
    const paket = await prisma.paket.create({
      data: { nama, deskripsi },
    });

    return {
      success: true,
      message: "Paket created successfully",
      data: paket,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create paket",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updatePaketService(
  id: number,
  data: {
    nama?: string;
    deskripsi?: string;
  }
) {
  try {
    const existing = await prisma.paket.findUnique({ where: { idPaket: id } });
    if (!existing) {
      return {
        success: false,
        message: "Paket not found",
      };
    }

    const updated = await prisma.paket.update({
      where: { idPaket: id },
      data,
    });

    return {
      success: true,
      message: "Paket updated successfully",
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update paket",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deletePaketService(id: number) {
  try {
    const existing = await prisma.paket.findUnique({ where: { idPaket: id } });
    if (!existing) {
      return {
        success: false,
        message: "Paket not found",
      };
    }

    await prisma.paket.delete({ where: { idPaket: id } });

    return {
      success: true,
      message: "Paket deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete paket",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
