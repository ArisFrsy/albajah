import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function getProvincesService() {
  try {
    const provinces = await prisma.provinces.findMany({
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Provinces fetched successfully",
      data: provinces,
    };
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return {
      success: false,
      message: "Failed to fetch provinces",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRegenciesService(provinceId: string) {
  try {
    const regencies = await prisma.regencies.findMany({
      where: { province_id: provinceId },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Regencies fetched successfully",
      data: regencies,
    };
  } catch (error) {
    console.error("Error fetching regencies:", error);
    return {
      success: false,
      message: "Failed to fetch regencies",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDistrictsService(regencyId: string) {
  try {
    const districts = await prisma.districts.findMany({
      where: { regency_id: regencyId },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Districts fetched successfully",
      data: districts,
    };
  } catch (error) {
    console.error("Error fetching districts:", error);
    return {
      success: false,
      message: "Failed to fetch districts",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getVillagesService(districtId: string) {
  try {
    const villages = await prisma.villages.findMany({
      where: { district_id: districtId },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Villages fetched successfully",
      data: villages,
    };
  } catch (error) {
    console.error("Error fetching villages:", error);
    return {
      success: false,
      message: "Failed to fetch villages",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
