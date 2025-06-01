import { useEffect, useState } from "react";
import { Province } from "@/models/Provinces";
import { Regencies } from "@/models/Regencies";
import { set } from "date-fns";

function getProvinceList() {
  return fetch("/api/master/indo-region/provinces", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
}

function getRegencyList(provinceId: string) {
  return fetch(`/api/master/indo-region/regencies/${provinceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
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
