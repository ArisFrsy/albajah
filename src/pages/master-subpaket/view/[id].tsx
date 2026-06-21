"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { SubPaket } from "@/models/SubPaket";
import withAuth from "@/components/withAuth";
import Loading from "@/components/Spinner";

import {
  Package,
  Tag,
  Calendar,
  Clock,
  Send,
  LocationEdit,
  CheckSquare,
  List,
  ArrowLeft,
  DollarSign,
  Home,
} from "lucide-react";

// Impor komponen shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { decrypt } from "@/lib/Encrypt";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "sonner";
import Image from "next/image";

function ViewSubPaketPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const router = useRouter();
  const params = useParams();
  const decryptId = params?.id as string;
  const id = decryptId ? decrypt(decryptId) : "";
  const [subPaket, setSubPaket] = useState<SubPaket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        setLoading(true);
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
          .then((res) => {
            if (!res.ok) throw new Error("Gagal mengambil data");
            return res.json();
          })
          .then((data) => {
            setSubPaket(data.data || null);
          })
          .catch(() => {
            toast.error("Gagal mengambil data sub paket. Silakan coba lagi.");
            setSubPaket(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch {
        toast.error(
          "Terjadi kesalahan saat memproses data. Silakan coba lagi.",
        );
        setSubPaket(null);
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 p-6 bg-muted/40 flex items-center justify-center min-h-screen">
        <Loading />
      </main>
    );
  }

  if (!subPaket) {
    return (
      <main className="flex-1 p-6 bg-muted/40 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Data Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-6">
            Sub Paket yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Button onClick={() => router.push("/master-subpaket")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
        {/* Tombol kembali yang lebih baik */}
        {/* <div>
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div> */}

        {/* Menggunakan komponen Card dari shadcn/ui */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{subPaket.namaSubPaket}</CardTitle>
            <CardDescription>Detail lengkap untuk sub paket.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Section: Detail Utama & Harga */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Informasi Paket & Harga
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  icon={<Package />}
                  label="Nama Paket Utama"
                  value={subPaket.paket?.nama || "-"}
                />
                <DetailItem
                  icon={<Clock />}
                  label="Durasi"
                  value={`${subPaket.durasiHari} hari`}
                />
                <DetailItem
                  icon={<Tag />}
                  label="Harga IDR"
                  value={formatCurrency(subPaket.hargaIDR, "id-ID", "IDR")}
                />
                <DetailItem
                  icon={<DollarSign />}
                  label="Harga USD"
                  value={
                    subPaket.hargaUSD
                      ? formatCurrency(subPaket.hargaUSD, "en-US", "USD")
                      : "-"
                  }
                />

                {/* Menampilkan gambar jika ada, tambah icon untuk buka di tab baru */}
                {subPaket.urlFoto ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-muted-foreground mt-1">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Image
                      </p>
                      <a
                        href={baseUrl + subPaket.urlFoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative aspect-video w-50 rounded-lg overflow-hidden border group my-2"
                        title="Klik untuk melihat gambar penuh"
                      >
                        <Image
                          src={baseUrl + subPaket.urlFoto}
                          alt={`Foto untuk ${subPaket.namaSubPaket}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-video w-full rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      Tidak ada gambar
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Section: Jadwal & Akomodasi */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Jadwal & Akomodasi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  icon={<Calendar />}
                  label="Tanggal Keberangkatan"
                  value={new Date(
                    String(subPaket.keberangkatan),
                  ).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <DetailItem
                  icon={<Send />}
                  label="Maskapai Penerbangan"
                  value={subPaket.advertiseName || "-"}
                />
                <DetailItem
                  icon={<Home />}
                  label="Hotel Mekkah"
                  value={subPaket.hotelMekkah || "-"}
                />
                <DetailItem
                  icon={<Home />}
                  label="Hotel Madinah"
                  value={subPaket.hotelMadinah || "-"}
                />
              </div>
            </section>

            {/* Section: Inklusi Paket */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Fasilitas & Perlengkapan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  icon={<CheckSquare />}
                  label="Fasilitas"
                  value={
                    subPaket.fasilitas
                      ? subPaket.fasilitas.split(",").map((item, index) => (
                          <li key={index} className="ml-4 list-disc">
                            {item.trim()}
                          </li>
                        ))
                      : "-"
                  }
                />
                <DetailItem
                  icon={<List />}
                  label="Perlengkapan"
                  value={
                    subPaket.perlengkapan
                      ? subPaket.perlengkapan.split(",").map((item, index) => (
                          <li key={index} className="ml-4 list-disc">
                            {item.trim()}
                          </li>
                        ))
                      : "-"
                  }
                />
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/50 p-6">
            <Button onClick={() => router.push("/master-subpaket")}>
              Kembali ke Daftar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

// Komponen DetailItem disempurnakan dengan styling shadcn
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-muted-foreground mt-1">
      {icon &&
        // @ts-expect-error - Memberitahu TypeScript untuk mengabaikan error di baris berikutnya
        React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-base text-foreground font-semibold">{value}</p>
    </div>
  </div>
);

export default withAuth(ViewSubPaketPage);
