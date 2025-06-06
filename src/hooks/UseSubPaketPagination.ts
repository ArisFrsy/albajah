import { useEffect, useState, useCallback } from "react";
import { SubPaket } from "@/models/SubPaket";
import { toast } from "sonner";

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
  const [idPaketFilter, setIdPaketFilter] = useState<string>("");

  const fetchSubPaket = useCallback(async () => {
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
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSubPaket(data.data || []);
      setTotalPage(Math.ceil((data.total || 0) / limit));
    } catch {
      toast.error("Gagal mengambil data sub-paket. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, orderByField, orderByDirection, search, idPaketFilter]);

  useEffect(() => {
    fetchSubPaket();
  }, [fetchSubPaket]);

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
