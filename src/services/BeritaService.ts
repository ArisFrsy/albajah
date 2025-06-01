import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma"; // your prisma client instance, make sure it uses the same generated client
import { Berita } from "@/models/Berita";

export async function getAllBeritaService({
  page = 1,
  perPage = 10,
  search = "",
  orderByField = "idBerita",
  orderByDirection = "desc",
}: {
  page?: number;
  perPage?: number;
  search?: string;
  orderByField?: string;
  orderByDirection?: "asc" | "desc";
}) {
  try {
    const where: Prisma.BeritaWhereInput = {
      OR: [
        {
          judul: {
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
    };

    // Build orderBy object dynamically
    const orderBy: Prisma.BeritaOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    };

    const total = await prisma.berita.count({ where });
    const data = await prisma.berita.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
    });

    return {
      success: true,
      message: "Berita fetched successfully",
      total,
      data,
      page,
      perPage,
    };
  } catch (error) {
    console.error("Error fetching berita:", error);
    return {
      success: false,
      message: "Failed to fetch berita",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getBeritaByIdService(id: number) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { idBerita: id },
    });

    if (!berita) {
      return {
        success: false,
        message: "Berita not found",
      };
    }

    return {
      success: true,
      message: "Berita fetched successfully",
      data: berita,
    };
  } catch (error) {
    console.error("Error fetching berita by ID:", error);
    return {
      success: false,
      message: "Failed to fetch berita by ID",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createBeritaService(requestData: Berita) {
  try {
    const data: Prisma.BeritaCreateInput = {
      judul: requestData.judul,
      deskripsi: requestData.deskripsi,
    };

    const newBerita = await prisma.berita.create({
      data,
    });

    return {
      success: true,
      message: "Berita created successfully",
      data: newBerita,
    };
  } catch (error) {
    console.error("Error creating berita:", error);
    return {
      success: false,
      message: "Failed to create berita",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateBeritaService(id: number, requestData: Berita) {
  try {
    const data: Prisma.BeritaUpdateInput = {
      judul: requestData.judul,
      deskripsi: requestData.deskripsi,
    };

    const updatedBerita = await prisma.berita.update({
      where: { idBerita: id },
      data,
    });

    return {
      success: true,
      message: "Berita updated successfully",
      data: updatedBerita,
    };
  } catch (error) {
    console.error("Error updating berita:", error);
    return {
      success: false,
      message: "Failed to update berita",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteBeritaService(id: number) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { idBerita: id },
    });

    if (!berita) {
      return {
        success: false,
        message: "Berita not found",
      };
    }

    await prisma.berita.delete({
      where: { idBerita: id },
    });

    return {
      success: true,
      message: "Berita deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting berita:", error);
    return {
      success: false,
      message: "Failed to delete berita",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
