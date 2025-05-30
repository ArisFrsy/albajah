export interface PaketRequest {
  id?: number;
  nama: string;
  deskripsi?: string;
  page?: number;
  perPage?: number;
  search?: string;
  filter?: string;
}
