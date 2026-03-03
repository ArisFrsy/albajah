"use client";

import { useEffect, useState } from "react";
import { SubPaket } from "@/models/SubPaket";
import { usePaketPagination } from "../../../hooks/UsePaketPagination";
import withAuth from "@/components/withAuth";
import Loading from "@/components/Spinner";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { formatCurrency, unformatCurrency } from "@/utils/formatCurrency";
import { Minus, Plus, Settings2Icon } from "lucide-react";
import { confirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import { z } from "zod"; // Impor Zod
import { useIndoRegion } from "@/hooks/UseIndoRegion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Skema validasi Zod
const subPaketSchema = z.object({
  idPaket: z.string().min(1, { message: "Paket wajib dipilih" }),
  namaSubPaket: z.string().min(1, { message: "Nama sub paket wajib diisi" }),
  hargaIDR: z.number().gt(0, { message: "Harga IDR harus lebih dari 0" }),
  hargaUSD: z
    .number()
    .gt(0, { message: "Harga USD harus lebih dari 0" })
    .optional()
    .nullable(),
  keberangkatan: z.string().optional(),
  durasiHari: z.number().gt(0, { message: "Durasi hari harus lebih dari 0" }),
  penerbangan: z.string().optional(),
  hotelMekkah: z.string().min(1, { message: "Hotel Mekkah wajib diisi" }),
  hotelMadinah: z.string().min(1, { message: "Hotel Madinah wajib diisi" }),
  fasilitasList: z
    .array(z.string())
    .min(1, { message: "Fasilitas wajib diisi" })
    .refine((data) => data.some((item) => item.trim() !== ""), {
      message: "Minimal satu fasilitas harus diisi",
    }),
  perlengkapanList: z
    .array(z.string())
    .min(1, { message: "Perlengkapan wajib diisi" })
    .refine((data) => data.some((item) => item.trim() !== ""), {
      message: "Minimal satu perlengkapan harus diisi",
    }),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => file === null || (file && file.size > 0), {
      message: "File harus berupa gambar dengan ukuran lebih dari 0",
    }),
});

function InsertSubPaketPage() {
  const router = useRouter();
  const [namaSubPaket, setNamaSubPaket] = useState("");
  const [idPaket, setIdPaket] = useState("");
  const [hargaIDR, setHargaIDR] = useState(0);
  const [hargaUSD, setHargaUSD] = useState<number | null>(null);
  const [keberangkatan, setKeberangkatan] = useState("");
  const [durasiHari, setDurasiHari] = useState(0);
  const [penerbangan, setPenerbangan] = useState("");
  const [hotelMekkah, setHotelMekkah] = useState("");
  const [hotelMadinah, setHotelMadinah] = useState("");
  const [hargaIDRDisplay, setHargaIDRDisplay] = useState("");
  const [hargaUSDDisplay, setHargaUSDDisplay] = useState("");
  const [fasilitasList, setFasilitasList] = useState<string[]>([""]);
  const [perlengkapanList, setPerlengkapanList] = useState<string[]>([""]);
  const [file, setFile] = useState<File | null>(null);
  const [listAdvertise, setListAdvertise] = useState<
    { value: number; label: string }[]
  >([]);
  const [asalKeberangkatan, setAsalKeberangkatan] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
  const [errors, setErrors] = useState<any>({}); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { paket, loading } = usePaketPagination(1, 1000);
  const { advertises } = useIndoRegion();

  useEffect(() => {
    if (advertises.length > 0) {
      const advertiseOptions = advertises.map((ad) => ({
        value: ad.id,
        label: ad.name,
      }));
      setListAdvertise(advertiseOptions);
    }
  }, [advertises]);

  useEffect(() => {
    if (paket.length > 0) {
      const paketOptions = paket.map((p) => ({
        value: p.idPaket,
        label: p.nama,
      }));
      setOptions(paketOptions);
    }
  }, [paket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      idPaket,
      namaSubPaket,
      hargaIDR,
      hargaUSD,
      keberangkatan,
      durasiHari,
      penerbangan,
      hotelMekkah,
      hotelMadinah,
      asalKeberangkatan,
      fasilitasList,
      perlengkapanList,
      file,
    };

    const validationResult = subPaketSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      validationResult.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      toast.error("Harap isi semua kolom yang wajib diisi.");
      return;
    }
    setErrors({}); // Hapus error jika validasi berhasil

    const confirmed = await confirmDialog({
      title: "Konfirmasi",
      description: "Apakah Anda yakin ingin menambahkan sub paket ini?",
      confirmText: "Ya, Tambah",
      cancelText: "Batal",
    });
    if (!confirmed.confirmed) return;

    const newSubPaket: SubPaket = {
      idSubpaket: "",
      idPaket: parseInt(idPaket),
      namaSubPaket,
      hargaIDR,
      hargaUSD,
      keberangkatan: keberangkatan ? new Date(keberangkatan).toISOString() : "",
      durasiHari,
      penerbangan,
      hotelMekkah,
      hotelMadinah,
      asalKeberangkatan,
      fasilitas: fasilitasList.filter((f) => f.trim() !== "").join(", "),
      perlengkapan: perlengkapanList.filter((p) => p.trim() !== "").join(", "),
    };

    try {
      // new form data with file if exists
      const formData = new FormData();
      formData.append("idPaket", newSubPaket.idPaket.toString());
      formData.append("namaSubPaket", newSubPaket.namaSubPaket);
      formData.append("hargaIDR", newSubPaket.hargaIDR.toString());
      if (newSubPaket.hargaUSD && newSubPaket.hargaUSD !== null) {
        formData.append("hargaUSD", newSubPaket.hargaUSD.toString());
      }
      formData.append("keberangkatan", newSubPaket.keberangkatan);
      formData.append("durasiHari", newSubPaket.durasiHari.toString());
      formData.append("penerbangan", newSubPaket.penerbangan);
      formData.append("hotelMekkah", newSubPaket.hotelMekkah);
      formData.append("hotelMadinah", newSubPaket.hotelMadinah);
      formData.append("asalKeberangkatan", newSubPaket.asalKeberangkatan);
      formData.append(
        "fasilitas",
        fasilitasList.filter((f) => f.trim() !== "").join(", ")
      );
      formData.append(
        "perlengkapan",
        perlengkapanList.filter((p) => p.trim() !== "").join(", ")
      );
      if (file) {
        formData.append("fileFoto", file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Gagal menambahkan sub paket");
      } else {
        toast.success("Sub paket berhasil ditambahkan");
        router.push("/master-subpaket");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menambahkan sub paket");
    }
  };

  const resetForm = () => {
    setNamaSubPaket("");
    setIdPaket("");
    setHargaIDR(0);
    setHargaUSD(null);
    setHargaIDRDisplay("");
    setHargaUSDDisplay("");
    setKeberangkatan("");
    setDurasiHari(0);
    setPenerbangan("");
    setHotelMekkah("");
    setHotelMadinah("");
    setFasilitasList([""]);
    setPerlengkapanList([""]);
    setErrors({}); // Reset error juga
    setAsalKeberangkatan(""); // <-- RESET JUGA
    setFile(null);
  };

  const setDefaultListPerlengkapan = () => {
    setFasilitasList([
     "Tiket Pesawat PP",
     "Visa Umroh",
     "Asuransi",
     "Hotel Makkah &n Madinah",
     "Handling Bandara",
     "Bus Full AC",
     "Makan 3x Sehari",
     "Perlengkapan Umroh",
     "Bimbingan Manasik",
     "Tour Leader & Muthowif",
     "City Tour Makkah & Madinah",
     "Dokumentasi Selama Umroh",
     "Air Zamzam 5 Liter",
     "Cetak Foto Kenangan",
     "Voucher Umroh",
    ]);

    setPerlengkapanList([
      "🧳 Koper Bagasi 22 inc - Kabin 14 inc",
      "🎒 Tas Pasport - tas sandal",
      "👘 Kain Batik (2m)",
      "👳🏼 Kain Ihram + Sabuk",
      "🧕🏻 Jilbab Syar'i",
      "📗 Buku Panduan Doa",
      "🔖 ID Card",
      "🎀 Syal",
    ]);
  };

  if (!isClient) return <Loading />;

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-100">
      <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Tambah Sub Paket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nama Sub Paket</Label>
                <Input
                  value={namaSubPaket}
                  onChange={(e) => setNamaSubPaket(e.target.value)}
                />
                {errors.namaSubPaket && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.namaSubPaket}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Pilih Paket</Label>
                <Combobox
                  items={options}
                  value={idPaket}
                  onChange={setIdPaket}
                  type="single"
                  selectPlaceholder="Cari paket..."
                  searchPlaceholder="Cari paket..."
                />
                {errors.idPaket && (
                  <p className="text-red-500 text-xs mt-1">{errors.idPaket}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Foto Sub Paket</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    } else {
                      setFile(null);
                    }
                  }}
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    File: {file.name}
                  </p>
                )}
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Harga IDR</Label>
                <Input
                  value={hargaIDRDisplay}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numeric = unformatCurrency(value);
                    setHargaIDR(numeric);
                    setHargaIDRDisplay(formatCurrency(numeric, "id-ID", "IDR"));
                  }}
                />
                {errors.hargaIDR && (
                  <p className="text-red-500 text-xs mt-1">{errors.hargaIDR}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Harga USD</Label>
                <Input
                  value={hargaUSDDisplay}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numeric = unformatCurrency(value);
                    setHargaUSD(numeric ? numeric : null);
                    setHargaUSDDisplay(formatCurrency(numeric, "en-US", "USD"));
                  }}
                />
                {errors.hargaUSD && (
                  <p className="text-red-500 text-xs mt-1">{errors.hargaUSD}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Durasi Hari</Label>
                <Input
                  type="number"
                  value={durasiHari}
                  onChange={(e) => setDurasiHari(Number(e.target.value))}
                />
                {errors.durasiHari && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.durasiHari}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Keberangkatan</Label>
                <Input
                  type="date"
                  value={keberangkatan}
                  onChange={(e) => setKeberangkatan(e.target.value)}
                />
                {errors.keberangkatan && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.keberangkatan}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Penerbangan</Label>
                <Combobox
                  items={listAdvertise}
                  value={penerbangan}
                  onChange={setPenerbangan}
                  type="multiple"
                  selectPlaceholder="Pilih penerbangan..."
                  searchPlaceholder="Cari penerbangan..."
                />
                {errors.penerbangan && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.penerbangan}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Hotel Mekkah</Label>
                <Input
                  value={hotelMekkah}
                  onChange={(e) => setHotelMekkah(e.target.value)}
                />
                {errors.hotelMekkah && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hotelMekkah}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Hotel Madinah</Label>
                <Input
                  value={hotelMadinah}
                  onChange={(e) => setHotelMadinah(e.target.value)}
                />
                {errors.hotelMadinah && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hotelMadinah}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Label>Fasilitas</Label>
                <div className="flex flex justify-end">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      toast.success(
                        "Fasilitas dan Perlengkapan telah direset ke default."
                      );
                      setDefaultListPerlengkapan();
                    }}
                  >
                    <Settings2Icon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {fasilitasList.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...fasilitasList];
                      updated[index] = e.target.value;
                      setFasilitasList(updated);
                    }}
                    placeholder={`Fasilitas ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const updated = fasilitasList.filter(
                        (_, i) => i !== index
                      );
                      setFasilitasList(updated.length ? updated : [""]);
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  {index === fasilitasList.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setFasilitasList([...fasilitasList, ""])}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.fasilitasList && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fasilitasList}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Perlengkapan</Label>
              {perlengkapanList.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...perlengkapanList];
                      updated[index] = e.target.value;
                      setPerlengkapanList(updated);
                    }}
                    placeholder={`Perlengkapan ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const updated = perlengkapanList.filter(
                        (_, i) => i !== index
                      );
                      setPerlengkapanList(updated.length ? updated : [""]);
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  {index === perlengkapanList.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setPerlengkapanList([...perlengkapanList, ""])
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.perlengkapanList && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.perlengkapanList}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading && <Loading />}
    </main>
  );
}

export default withAuth(InsertSubPaketPage);
