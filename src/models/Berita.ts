export interface Berita {
  idBerita?: number;
  judul: string;
  deskripsi?: string;
  imagePath?: string;
  image?: File | null;
  urlImage?: string;
}
