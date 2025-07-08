"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIndoRegion } from "../../hooks/UseIndoRegion";
import { Combobox } from "@/components/ui/combobox";
import { Cabang } from "@/models/Cabang";

interface InsertCabangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: { cabang: Cabang }) => void;
}

export default function InsertCabangModal({
  isOpen,
  onClose,
  onSubmit,
}: InsertCabangModalProps) {
  const [email, setEmail] = useState<string>("");
  const [noTelepon, setNoTelepon] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [penganggungJawab, setPenganggungJawab] = useState<string>("");
  const [listProvinsi, setListProvinsi] = useState<
    { value: number; label: string }[]
  >([]);
  const [listKabupaten, setListKabupaten] = useState<
    { value: number; label: string }[]
  >([]);
  const {
    provinces,
    regencies,
    selectedProvince,
    setSelectedProvince,
    selectedRegency,
    setSelectedRegency,
  } = useIndoRegion();

  useEffect(() => {
    if (provinces.length > 0) {
      const provinceOptions = provinces.map((province) => ({
        value: parseInt(province.id),
        label: province.name,
      }));
      setListProvinsi(provinceOptions);
    }
  }, [provinces]);

  useEffect(() => {
    if (selectedProvince) {
      const regencyOptions = regencies.map((regency) => ({
        value: parseInt(regency.id),
        label: regency.name,
      }));
      setListKabupaten(regencyOptions);
    } else {
      setListKabupaten([]);
    }
  }, [selectedProvince, regencies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cabang: Cabang = {
      idProvinsi: selectedProvince,
      idKabupaten: selectedRegency,
      penanggungjawab: penganggungJawab,
      alamat: alamat,
      email,
      noTelepon,
    };
    onSubmit({ cabang });
    setSelectedProvince("");
    setSelectedRegency("");
    setPenganggungJawab("");
    setAlamat("");
    setEmail("");
    setNoTelepon("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Cabang</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idProvinsi">Provinsi</Label>
            <Combobox
              items={listProvinsi}
              value={selectedProvince}
              onChange={setSelectedProvince}
              type="single"
              selectPlaceholder="Pilih Provinsi"
              searchPlaceholder="Cari Provinsi..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idKabupaten">Kabupaten/Kota</Label>
            <Combobox
              items={listKabupaten}
              value={selectedRegency}
              onChange={setSelectedRegency}
              type="single"
              selectPlaceholder="Pilih Kabupaten/Kota"
              searchPlaceholder="Cari Kabupaten/Kota..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="penganggungJawab">Penganggung Jawab</Label>
            <Input
              id="penganggungJawab"
              value={penganggungJawab}
              onChange={(e) => setPenganggungJawab(e.target.value)}
              required
              placeholder="Masukkan nama penganggung jawab"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="noTelepon">No Telepon</Label>
            <Input
              id="noTelepon"
              type="tel"
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              required
              placeholder="Masukkan no telepon"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat Cabang</Label>
            <Input
              id="alamat"
              type="tel"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
              placeholder="Masukkan Alamat Cabang"
            />
          </div>
          <Button type="submit" className="w-full">
            Tambah Cabang
          </Button>
        </form>
      </DialogContent>
      {/* {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Loading />
        </div>
      )} */}
    </Dialog>
  );
}
