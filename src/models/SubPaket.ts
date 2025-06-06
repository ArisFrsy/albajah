import { Paket } from "./Paket";
export interface SubPaket {
  idSubpaket: string;
  idPaket: number; // Foreign key to Paket
  namaSubPaket: string;
  hargaIDR: number;
  hargaUSD: number;
  keberangkatan: string;
  durasiHari: number;
  penerbangan: string;
  hotelMekkah: string;
  hotelMadinah: string;
  fasilitas?: string;
  perlengkapan?: string;
  paket?: Paket;
}
