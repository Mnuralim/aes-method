"use client";

import {
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
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
import { deleteResident } from "@/actions/resident";
import { ResidentForm } from "./form";
import type { Resident } from "@prisma/client";
import { Toast } from "@/app/_components/toast";

interface Props {
  residents: Resident[];
  modal?: "add" | "edit";
  pagination: PaginationProps;
  toastType?: "success" | "error";
  message?: string;
}

export const ResidentList = ({
  residents,
  modal,
  pagination,
  message,
  toastType,
}: Props) => {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );
  const [key, setKey] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleEditResident = (resident: Resident) => {
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
        newParams.delete("key");
      } else {
        newParams.set("isDecrypted", "true");
        newParams.set("key", key);
      }
      router.push(`/residents?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleCloseToast = () => {
    router.replace("/residents", { scroll: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleExportToExcel = async () => {
    if (!isDecrypted) {
      alert("Harap dekripsi data terlebih dahulu untuk export");
      return;
    }

    setIsExporting(true);

    try {
      const ExcelJS = await import("exceljs");

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data Penduduk");

      const headers = [
        "No",
        "NIK",
        "Nama Lengkap",
        "Jenis Kelamin",
        "Tempat Lahir",
        "Tanggal Lahir",
        "Alamat",
        "Agama",
        "Status Perkawinan",
        "Tanggal Daftar",
      ];

      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "366EF7" },
      };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;

      residents.forEach((resident, index) => {
        const row = [
          index + 1,
          resident.nik || "-",
          resident.name || "-",
          resident.gender || "-",
          resident.birthPlace || "-",
          resident.birthDate ? formatDate(resident.birthDate) : "-",
          resident.address || "-",
          resident.religion || "-",
          resident.maritalStatus || "-",
          resident.createdAt ? formatDate(resident.createdAt) : "-",
        ];
        worksheet.addRow(row);
      });

      const columnWidths = [5, 18, 25, 12, 20, 15, 30, 12, 15, 15];
      worksheet.columns = headers.map((header, index) => ({
        header,
        key: header.toLowerCase().replace(/\s+/g, "_"),
        width: columnWidths[index] || 15,
      }));

      worksheet.eachRow({ includeEmpty: false }, (row) => {
        if (row) {
          row.eachCell((cell) => {
            if (cell) {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `data-penduduk-${new Date().toISOString().split("T")[0]}.xlsx`
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

  const columns: TabelColumn<Resident>[] = [
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
      header: "Tempat Lahir",
      accessor: (item) => item.birthPlace || "-",
      className: "w-20 text-center",
    },
    {
      header: "Tanggal Lahir",
      accessor: (item) =>
        item.birthDate
          ? ` ${isDecrypted ? formatDate(item.birthDate) : item.birthDate}`
          : "-",
      className: "max-w-xs truncate",
    },
    {
      header: "Alamat",
      accessor: (item) => item.address || "-",
      className: "max-w-xs truncate",
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
        <div className="flex flex-wrap items-center gap-4">
          {!isDecrypted ? (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="key"
                onChange={(e) => setKey(e.target.value)}
                value={key}
                placeholder="Masukkan Kunci Dekripsi"
                className="px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : null}
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
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors duration-150 shadow-sm border border-blue-600"
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
          currentSearch={(pagination.preserveParams?.search as string) || ""}
          currentSortOrder={
            (pagination.preserveParams?.sortOrder as "asc" | "desc") || "desc"
          }
        />
      ) : null}

      <Tabel columns={columns} data={residents} />

      <div className="mt-8">
        <Pagination
          itemsPerPageOptions={[100, 200, 500, 1000]}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ResidentForm
          modal={modal}
          onClose={handleCloseModal}
          selectedResident={selectedResident}
        />
      </Modal>

      <Toast
        isVisible={message !== undefined}
        message={(message as string) || ""}
        onClose={handleCloseToast}
        type={(toastType as "success" | "error") || "success"}
        autoClose
      />
    </div>
  );
};
