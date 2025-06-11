import { useEffect, useState, useCallback } from "react";
import { Berita } from "@/models/Berita";
import { toast } from "sonner";

export function useBeritaPagination(initialPage = 1, initialLimit = 10) {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [orderByField, setOrderByField] = useState<string | null>("idBerita");
  const [orderByDirection, setOrderByDirection] = useState<"asc" | "desc">(
    "desc"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Bungkus fetchBerita dengan useCallback agar referensi fungsi stabil
  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/master/berita?page=${page}&perPage=${limit}&orderBy=${orderByField}&orderDir=${orderByDirection}&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setBerita(data.data.data || []);
      setTotalPage(Math.ceil((data.data.total || 0) / limit));
    } catch {
      toast.error("Gagal mengambil data berita. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, orderByField, orderByDirection, search]);

  useEffect(() => {
    fetchBerita();
  }, [fetchBerita]);

  return {
    berita,
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
  };
}
