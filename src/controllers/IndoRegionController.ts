import {
  getProvincesService,
  getDistrictsService,
  getRegenciesService,
  getVillagesService,
} from "@/services/IndoRegionService";

export async function getProvincesController() {
  const result = await getProvincesService();
  return result;
}

export async function getRegenciesController(provinceId: string) {
  const result = await getRegenciesService(provinceId);
  return result;
}

export async function getDistrictsController(regencyId: string) {
  const result = await getDistrictsService(regencyId);
  return result;
}

export async function getVillagesController(districtId: string) {
  const result = await getVillagesService(districtId);
  return result;
}
