import { useEffect, useState } from "react";
import { Berita } from "@/models/Berita";
import { set } from "date-fns";
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

  const fetchBerita = async () => {
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
        // if unauthorized, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // redirect to login page
          return;
        }
      }

      const data = await response.json();
      setBerita(data.data || []);
      setTotalPage(Math.ceil((data.total || 0) / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching berita:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, [page, limit, orderByField, orderByDirection, search]);

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
