import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { Cabang } from "@/models/Cabang";

export async function getAllCabangService({
  page = 1,
  perPage = 10,
  search = "",
  filter = "",
  orderByField = "idCabang",
  orderByDirection = "desc",
  idProvinsi,
  idKabupaten,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  filter?: string;
  orderByField?: string;
  orderByDirection?: "asc" | "desc";
  idProvinsi?: string;
  idKabupaten?: string;
}) {
  try {
    const where: Prisma.CabangWhereInput = {
      OR: [
        {
          provinces: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          regencies: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          penanggungjawab: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          noTelepon: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
      ...(idProvinsi && {
        provinces: {
          id: idProvinsi,
        },
      }),
      ...(idKabupaten && {
        regencies: {
          id: idKabupaten,
        },
      }),
    };

    // Build orderBy object dynamically
    const orderBy: Prisma.CabangOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    };

    const total = await prisma.cabang.count({ where });
    const data = await prisma.cabang.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
      include: {
        provinces: true, // Include related Province data
        regencies: true, // Include related Kabupaten data
      },
    });

    return {
      success: true,
      message: "Cabang list fetched successfully",
      data,
      total,
    };
  } catch (error) {
    console.error("Error fetching cabang list:", error);
    return {
      success: false,
      message: "Failed to fetch cabang list",
      error,
    };
  }
}

export async function getCabangByIdService(idCabang: number) {
  try {
    const cabang = await prisma.cabang.findUnique({
      where: { idCabang },
      include: {
        provinces: true,
        regencies: true,
      },
    });

    if (!cabang) {
      return {
        success: false,
        message: "Cabang not found",
      };
    }

    return {
      success: true,
      message: "Cabang fetched successfully",
      data: cabang,
    };
  } catch (error) {
    console.error("Error fetching cabang by ID:", error);
    return {
      success: false,
      message: "Failed to fetch cabang by ID",
      error,
    };
  }
}

export async function createCabangService(requestData: Cabang) {
  const data: Prisma.CabangCreateInput = {
    provinces: {
      connect: { id: requestData.idProvinsi },
    },
    regencies: {
      connect: { id: requestData.idKabupaten },
    },
    penanggungjawab: requestData.penanggungjawab,
    email: requestData.email,
    noTelepon: requestData.noTelepon,
  };
  try {
    const newCabang = await prisma.cabang.create({
      data: data,
    });

    return {
      success: true,
      message: "Cabang created successfully",
      data: newCabang,
    };
  } catch (error) {
    console.error("Error creating cabang:", error);
    return {
      success: false,
      message: "Failed to create cabang",
      error,
    };
  }
}

export async function updateCabangService(
  idCabang: number,
  requestData: Cabang
) {
  const data: Prisma.CabangUpdateInput = {
    provinces: {
      connect: { id: requestData.idProvinsi },
    },
    regencies: {
      connect: { id: requestData.idKabupaten },
    },
    penanggungjawab: requestData.penanggungjawab,
    email: requestData.email,
    noTelepon: requestData.noTelepon,
  };
  try {
    const updatedCabang = await prisma.cabang.update({
      where: { idCabang },
      data,
    });

    return {
      success: true,
      message: "Cabang updated successfully",
      data: updatedCabang,
    };
  } catch (error) {
    console.error("Error updating cabang:", error);
    return {
      success: false,
      message: "Failed to update cabang",
      error,
    };
  }
}

export async function deleteCabangService(idCabang: number) {
  try {
    const deletedCabang = await prisma.cabang.delete({
      where: { idCabang },
    });

    return {
      success: true,
      message: "Cabang deleted successfully",
      data: deletedCabang,
    };
  } catch (error) {
    console.error("Error deleting cabang:", error);
    return {
      success: false,
      message: "Failed to delete cabang",
      error,
    };
  }
}
