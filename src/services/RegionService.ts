import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAllRegionsService({
  page = 1,
  perPage = 10,
  search = "",
  filter = "",
  orderByField = "idProvinsi",
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
    const where: Prisma.RegionWhereInput = {
      OR: [
        {
          namaProvinsi: {
            contains: search,
          },
        },
        {
          namaKabupaten: {
            contains: search,
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
    const orderBy: Prisma.RegionOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    };

    const total = await prisma.region.count({ where });
    const data = await prisma.region.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
    });

    return {
      success: true,
      message: "Regions list fetched successfully",
      data,
      total,
      page,
      perPage,
    };
  } catch (error) {
    console.error("Error fetching regions:", error);
    return {
      success: false,
      message: "Failed to fetch regions",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
