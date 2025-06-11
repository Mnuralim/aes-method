"use client";

import {
  Edit,
  Plus,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Loader2,
  Download,
  ShieldOff,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Modal } from "@/app/_components/modal";
import { FilterControl1 } from "./filter-controll";
import { Pagination } from "@/app/_components/pagination";
import type { FamilyCard, Prisma } from "@prisma/client";
import { deleteResident } from "@/actions/resident";
import { ResidentForm } from "./form";

type ResidentInfo = Prisma.ResidentGetPayload<{
  include: {
    familyCard: true;
  };
}>;

interface Props {
  residents: ResidentInfo[];
  modal?: "add" | "edit";
  pagination: PaginationProps;
  familyCards: FamilyCard[];
}

export const ResidentList = ({
  residents,
  modal,
  pagination,
  familyCards,
}: Props) => {
  const [selectedResident, setSelectedResident] = useState<ResidentInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDecrypted = pagination.preserveParams?.isDecrypted === "true";
  const isModalOpen = modal === "add" || modal === "edit";

  const handleAddClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "add");
    router.push(`/residents?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleEditResident = (resident: ResidentInfo) => {
    const newParams = new URLSearchParams(searchParams);
    setSelectedResident(resident);
    newParams.set("modal", "edit");
    router.push(`/residents?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.back();
    setSelectedResident(null);
  };

  const handleEncryptDecrypt = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (isDecrypted) {
        newParams.delete("isDecrypted");
      } else {
        newParams.set("isDecrypted", "true");
      }
      router.push(`/residents?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportToExcel = async () => {
    if (!isDecrypted) {
      alert("Harap dekripsi data terlebih dahulu untuk export");
      return;
    }

    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const exportData = residents.map((resident, index) => ({
        No: index + 1,
        NIK: resident.nik || "-",
        "Nama Lengkap": resident.name || "-",
        "Jenis Kelamin": resident.gender || "-",
        "Tempat Lahir": resident.birthPlace || "-",
        "Tanggal Lahir": resident.birthDate
          ? formatDate(resident.birthDate)
          : "-",
        Alamat: resident.address || "-",
        Telepon: resident.phone || "-",
        Agama: resident.religion || "-",
        "Status Perkawinan": resident.maritalStatus || "-",
        "Tanggal Daftar": resident.createdAt
          ? formatDate(resident.createdAt)
          : "-",
      }));

      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => `"${row[header as keyof typeof row] || ""}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `data-penduduk-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Data penduduk berhasil diekspor ke Excel!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Terjadi kesalahan saat mengekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  const columns: TabelColumn<ResidentInfo>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (
        <span className="text-slate-500 font-medium">
          {(index as number) + 1}
        </span>
      ),
    },
    {
      header: "NIK",
      accessor: (item) => item.nik || "-",
      className: "font-mono text-sm",
    },
    {
      header: "Nama Lengkap",
      accessor: (item) => item.name || "-",
    },
    {
      header: "Gender",
      accessor: (item) => item.gender || "-",
      className: "w-20 text-center",
    },
    {
      header: "Tempat, Tanggal Lahir",
      accessor: (item) =>
        item.birthPlace && item.birthDate
          ? `${item.birthPlace}, ${
              isDecrypted ? formatDate(item.birthDate) : item.birthDate
            }`
          : "-",
      className: "max-w-xs truncate",
    },
    {
      header: "Alamat",
      accessor: (item) => item.address || "-",
      className: "max-w-xs truncate",
    },
    {
      header: "Telepon",
      accessor: (item) => item.phone || "-",
      className: "font-mono text-sm",
    },
    {
      header: "Agama",
      accessor: (item) => item.religion || "-",
      className: "w-20",
    },
    {
      header: "Status",
      accessor: (item) => item.maritalStatus || "-",
      className: "w-20",
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      className: "w-32",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/residents/${item.id}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-150 border border-green-200"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleEditResident(item)}
            disabled={!isDecrypted}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
            title="Edit Data"
          >
            <Edit className="w-4 h-4" />
          </button>
          <form action={() => deleteResident(item.id)} className="inline-block">
            <button
              type="submit"
              disabled={!isDecrypted}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
              title="Hapus Data"
              onClick={(e) => {
                if (
                  !confirm(
                    "Apakah Anda yakin ingin menghapus data penduduk ini?"
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleEncryptDecrypt}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm border ${
              !isDecrypted
                ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                : "bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={!isDecrypted ? "Decrypt Data" : "Encrypt Data"}
          >
            {!isDecrypted ? (
              <>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Unlock className="w-4 h-4 mr-2" />
                )}
                Dekripsi
              </>
            ) : (
              <>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Enkripsi
              </>
            )}
          </button>

          <button
            onClick={handleExportToExcel}
            disabled={isExporting || !isDecrypted}
            className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm border ${
              !isDecrypted
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                : "bg-green-600 text-white hover:bg-green-700 border-green-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              !isDecrypted ? "Dekripsi data terlebih dahulu" : "Export ke Excel"
            }
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Excel
          </button>
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-150 shadow-sm border border-slate-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Penduduk
        </button>
      </div>

      {!isDecrypted && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <ShieldOff className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">
                Mode Terenkripsi
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Data sedang ditampilkan dalam bentuk terenkripsi. Dekripsi data
                untuk mengaktifkan fitur lengkap.
              </p>
            </div>
          </div>
        </div>
      )}

      {isDecrypted ? (
        <FilterControl1
          currentSortOrder={
            (pagination.preserveParams?.sortOrder as "asc" | "desc") || "desc"
          }
        />
      ) : null}

      <Tabel columns={columns} data={residents} />

      <div className="mt-8">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ResidentForm
          familyCards={familyCards}
          modal={modal}
          onClose={handleCloseModal}
          selectedResident={selectedResident}
        />
      </Modal>
    </div>
  );
};
