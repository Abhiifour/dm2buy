'use client'

import Card from "@/components/Cards";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use refs to track current state in event listeners
  const loadingRef = useRef(loading);

  // Keep refs in sync with state
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const getData = async (currentPage: number) => {
    // Don't fetch if already loading or no more data
    if (loadingRef.current || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.dm2buy.com/v3/collection/store/7dH0rzP3NJQeB8nC7zMsq6?limit=5&page=${currentPage}`
      );
      const data = await res.json();

      // Check if we've reached the end of data
      if (data.collections.length === 0) {
        setHasMore(false);
      } else {
        setCategoryData((prev) => [...prev, ...data.collections]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    // Create debounce function to limit scroll event handling
    const debounce = (fn: Function, delay: number) => {
      let timer: NodeJS.Timeout | null = null;
      return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    };

    // The scroll handler uses loadingRef to get latest loading state
    const handleScroll = debounce(() => {
      // Calculate if we're near the bottom of the page
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.offsetHeight;
      const isBottom = scrollPosition >= pageHeight - 200;

      if (isBottom && !loadingRef.current && hasMore) {
        setPage((prev) => prev + 1);
      }
    }, 100);

    // Add scroll listener once
    window.addEventListener("scroll", handleScroll);
    
    // Clean up on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]); // Only re-run if hasMore changes

  return (
    <div className="max-w-[500px] mx-auto">
      <div>
        {categoryData.map((category: any) => (
          <Card key={category._id} name={category.name} id={category._id} />
        ))}
        {loading && <p className="text-center my-4">Loading...</p>}
        {!loading && !hasMore && categoryData.length > 0 && (
          <p className="text-center my-4">No more items to load</p>
        )}
      </div>
    </div>
  );
}