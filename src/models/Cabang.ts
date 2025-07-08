import { Province } from "./Provinces";
import { Regencies } from "./Regencies";
export interface Cabang {
  idCabang?: number;
  idProvinsi: string;
  idKabupaten: string;
  penanggungjawab: string;
  email: string;
  noTelepon: string;
  alamat?: string;
  provinces?: Province;
  regencies?: Regencies;
  provinsi?: Province;
  kabupaten?: Regencies;
}
