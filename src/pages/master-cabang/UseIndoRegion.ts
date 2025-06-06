import { useEffect, useState } from "react";
import { Province } from "@/models/Provinces";
import { Regencies } from "@/models/Regencies";
import { set } from "date-fns";

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
  } catch (error) {
    console.error("Error fetching provinces:", error);
    // throw error; // Rethrow the error to be handled by the caller
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
  } catch (error) {
    console.error("Error fetching regencies:", error);
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
      } catch (error) {
        console.error("Error fetching provinces:", error);
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
        } catch (error) {
          console.error("Error fetching regencies:", error);
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
