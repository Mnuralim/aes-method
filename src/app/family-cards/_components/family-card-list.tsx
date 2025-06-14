"use client";

import type { Prisma, Resident } from "@prisma/client";
import {
  Edit,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Loader2,
  ShieldOff,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { Modal } from "@/app/_components/modal";
import { Pagination } from "@/app/_components/pagination";
import { deleteFamilyCard } from "@/actions/family-cards";
import { FamilyCardForm } from "./form";
import { FilterControl1 } from "./filter-controll";

export type FamilyCardInfo = Prisma.FamilyCardGetPayload<{
  include: {
    residents: true;
  };
}>;

interface Props {
  familyCards: FamilyCardInfo[];
  residents: Resident[];
  modal?: "add" | "edit";
  pagination: PaginationProps;
}

export const FamilyCardList = ({ familyCards, modal, pagination }: Props) => {
  const [selectedFamilyCard, setSelectedFamilyCard] =
    useState<FamilyCardInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDecrypted = pagination.preserveParams?.isDecrypted === "true";
  const isModalOpen = modal === "add" || modal === "edit";

  const handleAddClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "add");
    router.push(`/family-cards?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleEditFamilyCard = (familyCard: FamilyCardInfo) => {
    const newParams = new URLSearchParams(searchParams);
    setSelectedFamilyCard(familyCard);
    newParams.set("modal", "edit");
    router.push(`/family-cards?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    router.back();
    setSelectedFamilyCard(null);
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
      router.push(`/family-cards?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 500);
  };

  const columns: TabelColumn<FamilyCardInfo>[] = [
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
      header: "Nomor KK",
      accessor: (item) => item.cardNumber || "-",
      className: "font-mono text-sm",
    },
    {
      header: "Kepala Keluarga",
      accessor: (item) => item.headOfFamily || "-",
    },
    {
      header: "Alamat",
      accessor: (item) => item.address || "-",
      className: "max-w-xs truncate",
    },
    {
      header: "Jumlah Anggota",
      accessor: (item) => item.memberCount?.toString() || "-",
      className: "w-20 text-center",
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      className: "w-32",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditFamilyCard(item)}
            disabled={!isDecrypted}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
            title="Edit Data"
          >
            <Edit className="w-4 h-4" />
          </button>
          <form
            action={() => deleteFamilyCard(item.id)}
            className="inline-block"
          >
            <button
              type="submit"
              disabled={!isDecrypted}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
              title="Hapus Data"
              onClick={(e) => {
                if (
                  !confirm(
                    "Apakah Anda yakin ingin menghapus kartu keluarga ini?"
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
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-150 shadow-sm border border-slate-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kartu Keluarga
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

      <Tabel columns={columns} data={familyCards} />

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
        <FamilyCardForm
          modal={modal}
          onClose={handleCloseModal}
          selectedFamilyCard={selectedFamilyCard}
        />
      </Modal>
    </div>
  );
};
