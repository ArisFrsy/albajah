import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma"; // your prisma client instance, make sure it uses the same generated client
import { SubPaket } from "@/models/SubPaket";

export async function getSubPaketService({
  idPaket,
  page = 1,
  perPage = 10,
  search = "",
  orderByField = "idSubpaket",
  orderByDirection = "asc",
}: {
  idPaket?: number;
  page?: number;
  perPage?: number;
  search?: string;
  orderByField?: string;
  orderByDirection?: "asc" | "desc";
}) {
  try {
    const where: Prisma.SubpaketWhereInput = {
      OR: [
        {
          namaSubPaket: {
            contains: search,
          },
        },
        {
          penerbangan: {
            contains: search,
          },
        },
      ],
      ...(idPaket && { idPaket: idPaket }),
    };

    const orderBy: Prisma.SubpaketOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    };

    const total = await prisma.subpaket.count({ where });
    const data = await prisma.subpaket.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
      include: {
        Paket: true, // Include related Paket data
      },
    });

    return {
      success: true,
      message: "Sub-pakets fetched successfully",
      total,
      data,
      page,
      perPage,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching sub-pakets list`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getSubPaketByIdService(idSubpaket: string) {
  try {
    const subPaket = await prisma.subpaket.findUnique({
      where: { idSubpaket },
      include: { Paket: true }, // Include related Paket data
    });

    if (!subPaket) {
      return {
        success: false,
        message: "Sub-paket not found",
      };
    }

    return {
      success: true,
      message: "Sub-paket fetched successfully",
      data: subPaket,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching sub-paket`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createSubPaketService(requestData: SubPaket) {
  try {
    const data: Prisma.SubpaketCreateInput = {
      Paket: {
        connect: {
          idPaket: requestData.idPaket, // pastikan ID ini ada di tabel Paket
        },
      },
      namaSubPaket: requestData.namaSubPaket,
      hargaIDR: requestData.hargaIDR,
      hargaUSD: requestData.hargaUSD,
      //conver ke keberangkatan to Date if it's a string
      keberangkatan:
        typeof requestData.keberangkatan === "string"
          ? new Date(requestData.keberangkatan)
          : new Date(),
      durasiHari: requestData.durasiHari,
      penerbangan: requestData.penerbangan,
      hotelMekkah: requestData.hotelMekkah,
      hotelMadinah: requestData.hotelMadinah,
      fasilitas: requestData.fasilitas,
      perlengkapan: requestData.perlengkapan,
    };

    const subPaket = await prisma.subpaket.create({
      data,
    });

    return {
      success: true,
      message: "Sub-paket created successfully",
      data: subPaket,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating sub-paket`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateSubPaketService(
  idSubpaket: string,
  requestData: SubPaket
) {
  try {
    const data: Prisma.SubpaketUpdateInput = {
      Paket: {
        connect: {
          idPaket: requestData.idPaket, // pastikan ID ini ada di tabel Paket
        },
      },
      namaSubPaket: requestData.namaSubPaket,
      hargaIDR: requestData.hargaIDR,
      hargaUSD: requestData.hargaUSD,
      // convert keberangkatan to Date if it's a string
      keberangkatan:
        typeof requestData.keberangkatan === "string"
          ? new Date(requestData.keberangkatan)
          : new Date(),
      durasiHari: requestData.durasiHari,
      penerbangan: requestData.penerbangan,
      hotelMekkah: requestData.hotelMekkah,
      hotelMadinah: requestData.hotelMadinah,
      fasilitas: requestData.fasilitas,
      perlengkapan: requestData.perlengkapan,
    };

    const subPaket = await prisma.subpaket.update({
      where: { idSubpaket },
      data,
    });

    return {
      success: true,
      message: "Sub-paket updated successfully",
      data: subPaket,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating sub-paket`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteSubPaketService(idSubpaket: string) {
  try {
    const subPaket = await prisma.subpaket.delete({
      where: { idSubpaket },
    });

    return {
      success: true,
      message: "Sub-paket deleted successfully",
      data: subPaket,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting sub-paket`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
