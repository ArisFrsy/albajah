import { useEffect, useState } from "react";
import { Cabang } from "@/models/Cabang";

export function useCabangPagination(initialPage = 1, initialLimit = 10) {
  const [cabang, setCabang] = useState<Cabang[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [orderByField, setOrderByField] = useState<string | null>("idCabang");
  const [orderByDirection, setOrderByDirection] = useState<"asc" | "desc">(
    "desc"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [idProvinsiFilter, setIdProvinsiFilter] = useState<string>("");
  const [idKabupatenFilter, setIdKabupatenFilter] = useState<string>("");

  const fetchCabang = async () => {
    try {
      setLoading(true);
      let url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/api/master/cabang?page=${page}&perPage=${limit}&orderBy=${orderByField}&orderDir=${orderByDirection}&search=${encodeURIComponent(
        search
      )}`;
      if (idProvinsiFilter) {
        url += `&idProvinsi=${idProvinsiFilter}`;
      }
      if (idKabupatenFilter) {
        url += `&idKabupaten=${idKabupatenFilter}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        // if unauthorized, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // redirect to login page
          return;
        }
      }

      const data = await response.json();
      setCabang(data.data || []);
      setTotalPage(Math.ceil((data.total || 0) / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cabang:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabang();
  }, [
    page,
    limit,
    orderByField,
    orderByDirection,
    search,
    idProvinsiFilter,
    idKabupatenFilter,
  ]);

  return {
    cabang,
    totalPage,
    page,
    limit,
    setPage,
    setLimit,
    orderByField,
    setOrderByField,
    orderByDirection,
    setOrderByDirection,
    loading,
    search,
    setSearch,
    fetchCabang,
    setIdProvinsiFilter,
    idProvinsiFilter,
    setIdKabupatenFilter,
    idKabupatenFilter,
  };
}
