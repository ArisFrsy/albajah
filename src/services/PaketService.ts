import { Prisma } from "@/generated/prisma"; // path to your generated Prisma client folder
import prisma from "@/lib/prisma"; // your prisma client instance, make sure it uses the same generated client
import { saveFileToLocal } from "./UploadService";
import fs from "fs";
import path from "path";
import { get } from "http";
import { Paket } from "@/models/Paket";

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
          },
        },
        {
          deskripsi: {
            contains: search,
          },
        },
      ],
      ...(filter && {
        deskripsi: {
          contains: filter,
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
  fileFoto = null, // Optional file upload, can be null
}: {
  nama: string;
  deskripsi?: string;
  fileFoto?: File | null; // Use File type if you are using a file input, or null if no file is provided
}) {
  try {
    let filePath: string = "";

    // save fileFoto if provided (not implemented here, but you can use a file upload service)
    if (fileFoto !== null) {
      // Implement file upload logic here
      const getPath = await saveFileToLocal(fileFoto);
      getPath ? (filePath = getPath) : (filePath = "");
    }

    const paket = await prisma.paket.create({
      data: { nama, deskripsi, pathFoto: filePath },
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
    fileFoto?: File | null; // Optional file upload, can be null
  }
) {
  try {
    let filePath: string = "";
    // If fileFoto is provided, save it
    if (data.fileFoto !== undefined && data.fileFoto !== null) {
      // Implement file upload logic here
      const getPath = await saveFileToLocal(data.fileFoto);
      getPath ? (filePath = getPath) : (filePath = "");
    }

    const existing = await prisma.paket.findUnique({ where: { idPaket: id } });
    if (!existing) {
      return {
        success: false,
        message: "Paket not found",
      };
    }

    const updateData = {
      nama: data.nama ?? existing.nama,
      deskripsi: data.deskripsi ?? existing.deskripsi,
      pathFoto: filePath !== "" ? filePath : existing.pathFoto, // Use existing path if no new file is provided
    };

    const updated = await prisma.paket.update({
      where: { idPaket: id },
      data: updateData,
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

    // Optionally, you can delete the file associated with the paket if needed
    if (existing.pathFoto) {
      // use fs to remove the file if it exists
      const filePath = path.join(process.cwd(), "public", existing.pathFoto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
