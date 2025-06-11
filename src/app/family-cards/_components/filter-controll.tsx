"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  currentSortOrder?: string;
}

export const FilterControl1 = ({ currentSortOrder }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      if (e.target.value.trim() === "") {
        newParams.delete("search");
      } else {
        newParams.set("search", e.target.value);
      }
      replace(`/family-cards?${newParams.toString()}`, {
        scroll: false,
      });
    },
    500
  );

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/family-cards?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Cari berdasarkan nama kepala keluarga atau nomor KK..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleSortOrder}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-200 flex items-center gap-2 font-medium"
          title={`Urutkan tanggal ${
            currentSortOrder === "asc"
              ? "terbaru ke terlama"
              : "terlama ke terbaru"
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="hidden sm:inline">
            {currentSortOrder === "asc" ? "Terbaru" : "Terlama"}
          </span>
        </button>
      </div>
    </div>
  );
};
