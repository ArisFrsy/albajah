export interface Paket {
  idPaket: number;
  nama: string;
  deskripsi?: string;
  fileFoto?: string | null; // Optional file upload, can be null
  createdAt?: Date;
  updatedAt?: Date;
  pathFoto?: string; // Path to the uploaded file, if applicable
}
