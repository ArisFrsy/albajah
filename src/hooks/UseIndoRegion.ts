import { useEffect, useState } from "react";
import { Province } from "@/models/Provinces";
import { Regencies } from "@/models/Regencies";
import { toast } from "sonner";

function getProvinceList() {
  try {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/indo-region/provinces`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
  } catch {
    // throw error; // Rethrow the error to be handled by the caller
    toast.error("Gagal mengambil daftar provinsi. Silakan coba lagi.");
  }
}

function getRegencyList(provinceId: string) {
  try {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/indo-region/regencies/${provinceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
  } catch {
    toast.error("Gagal mengambil daftar kabupaten. Silakan coba lagi.");
    // throw error; // Rethrow the error to be handled by the caller
  }
}

export function useIndoRegion() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regencies[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        setLoading(true);
        const data = await getProvinceList();
        setProvinces(data.data);
      } catch {
        toast.error("Gagal mengambil daftar provinsi. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    fetchProvinces();
  }, []);

  useEffect(() => {
    async function fetchRegencies() {
      if (selectedProvince) {
        try {
          setLoading(true);
          const data = await getRegencyList(selectedProvince);
          setRegencies(data.data);
        } catch {
          toast.error("Gagal mengambil daftar kabupaten. Silakan coba lagi.");
        } finally {
          setLoading(false);
        }
      } else {
        setRegencies([]);
      }
    }
    fetchRegencies();
  }, [selectedProvince]);

  return {
    provinces,
    regencies,
    selectedProvince,
    setSelectedProvince,
    loading,
    setLoading,
    selectedRegency,
    setSelectedRegency,
  };
}
