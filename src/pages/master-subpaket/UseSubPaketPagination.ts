import { useEffect, useState } from "react";
import { SubPaket } from "@/models/SubPaket";
import { set } from "date-fns";

export function useSubPaketPagination(initialPage = 1, initialLimit = 10) {
  const [subPaket, setSubPaket] = useState<SubPaket[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [orderByField, setOrderByField] = useState<string | null>("idSubpaket");
  const [orderByDirection, setOrderByDirection] = useState<"asc" | "desc">(
    "desc"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [idPaketFilter, setIdPaketFilter] = useState("");

  const fetchSubPaket = async () => {
    try {
      setLoading(true);
      let url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/api/master/sub-paket?page=${page}&perPage=${limit}&orderBy=${orderByField}&orderDir=${orderByDirection}&search=${encodeURIComponent(
        search
      )}`;
      if (idPaketFilter) {
        url += `&idPaket=${idPaketFilter}`;
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
      setSubPaket(data.data || []);
      setTotalPage(Math.ceil((data.total || 0) / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sub-paket:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubPaket();
  }, [page, limit, orderByField, orderByDirection, search, idPaketFilter]);

  return {
    subPaket,
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
    idPaketFilter,
    setIdPaketFilter,
  };
}
