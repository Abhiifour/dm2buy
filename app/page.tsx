'use client'

import Card from "@/components/Cards";
import { useEffect, useState } from "react";

export default function Home() {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1); // start from page 1
  const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);

  const getData = async (currentPage: number) => {
    setLoading(true);
    const res = await fetch(
      `https://api.dm2buy.com/v3/collection/store/7dH0rzP3NJQeB8nC7zMsq6?limit=5&page=${currentPage}`
    );
    const data = await res.json();

    setCategoryData((prev) => [...prev, ...data.collections]);

    setLoading(false);
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100;

      if (isBottom && !loading ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="max-w-[500px] mx-auto">
      <div>
        {categoryData.map((category: any) => (
          <Card key={category._id} name={category.name} id={category._id} />
        ))}
        {loading && <p className="text-center my-4">Loading...</p>}
     
      </div>
    </div>
  );
}
