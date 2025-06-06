import { useEffect, useState } from "react";
import { Paket } from "@/models/Paket";
import { set } from "date-fns";

export function usePaketPagination(initialPage = 1, initialLimit = 10) {
  const [paket, setPaket] = useState<Paket[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [orderByField, setOrderByField] = useState<string | null>("idPaket");

  const [orderByDirection, setOrderByDirection] = useState<"asc" | "desc">(
    "desc"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const fetchPaket = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/master/paket?page=${page}&perPage=${limit}&orderBy=${orderByField}&orderDir=${orderByDirection}&search=${encodeURIComponent(
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
      setPaket(data.data || []);
      setTotalPage(Math.ceil((data.total || 0) / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching paket:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaket();
  }, [page, limit, orderByField, orderByDirection, search]);

  return {
    paket,
    totalPage,
    page,
    limit,
    setPage,
    setLimit,
    orderByField,
    setOrderByField,
    orderByDirection,
    setOrderByDirection,
    fetchPaket,
    loading,
    setLoading,
    setSearch,
  };
}
