"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ComboGrid from "@/components/ComboGrid";
import { getItems } from "@/services/items.api";
import { useRouter } from "next/navigation";

export default function FilterPage() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<any[]>([])
  const [sort, setSort] = useState("default")
  const [minPrice, setMinPrice] = useState<number | "">("")
  const [maxPrice, setMaxPrice] = useState<number | "">("")
  const [selectedCid, setSelectedCid] = useState<string[]>([])

  /* ---------------- INITIALIZE FROM URL ---------------- */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const cid = searchParams.get("cid")
    const min = searchParams.get("min")
    const max = searchParams.get("max")

    if (cid) setSelectedCid(cid.split(","))
    if (min) setMinPrice(Number(min))
    if (max) setMaxPrice(Number(max))
  }, [])

  /* ---------------- FETCH ITEMS ---------------- */
  const fetchComboItems = async () => {
    try {
      const params: any = { sort }
      if (minPrice !== "") params.minPrice = minPrice
      if (maxPrice !== "") params.maxPrice = maxPrice
      if (selectedCid.length > 0) params.cid = selectedCid.join(",")

      const data = await getItems(params)
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch combo items", error)
    }
  }

  /* ---------------- UPDATE URL IMMEDIATELY ---------------- */
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCid.length > 0) params.set("cid", selectedCid.join(","))
    if (minPrice !== "") params.set("min", String(minPrice))
    if (maxPrice !== "") params.set("max", String(maxPrice))

    router.push(`?${params.toString()}`, { scroll: false })
  }, [selectedCid, minPrice, maxPrice, router])

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchComboItems()
  }, [sort, minPrice, maxPrice, selectedCid])

  return (
    <div className="flex h-full gap-4">
      <aside className="hidden md:flex border p-4 rounded-md flex-col gap-4">
        <FilterSidebar
          open={drawerOpen}
          setOpen={setDrawerOpen}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          selectedCid={selectedCid}
          setSelectedCid={setSelectedCid}
        />
      </aside>

      <ComboGrid items={items} sort={sort} setSort={setSort} />
    </div>
  )
}