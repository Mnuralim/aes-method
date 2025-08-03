"use client";

import { Modal } from "@/app/_components/modal";
import { calculateAge, formatDate } from "@/lib/utils";
import type { Resident } from "@prisma/client";
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  Home,
  Loader2,
  Unlock,
  Lock,
  CreditCard,
  Heart,
  Briefcase,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ResidentForm } from "../../_components/form";
import { Toast } from "@/app/_components/toast";

interface Props {
  resident: Resident;
  isDecrypted: boolean;
  modal?: "edit";
  toastType?: "success" | "error";
  message?: string;
}

export const ResidentDetail = ({
  resident,
  isDecrypted,
  modal,
  message,
  toastType,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const isModalOpen = modal === "edit";

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
      router.replace(`/residents/${resident.id}?${newParams.toString()}`, {
        scroll: false,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "edit");
    router.push(`/residents/${resident.id}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleCloseToast = () => {
    router.replace(`/residents/${resident.id}`, { scroll: false });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Detail Warga
                </h1>
                <p className="text-sm text-gray-600">
                  Informasi lengkap data warga
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {!isDecrypted ? (
                <div>
                  <input
                    type="password"
                    name="key"
                    onChange={(e) => setKey(e.target.value)}
                    value={key}
                    placeholder="Masukkan Kunci Dekripsi"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                  />
                </div>
              ) : null}
              <button
                onClick={handleEncryptDecrypt}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm ${
                  !isDecrypted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-orange-600 text-white hover:bg-orange-700"
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
              {isDecrypted ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit Data</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {!isDecrypted && (
        <div className="bg-orange-50 border mt-6 border-orange-200 rounded-lg p-3">
          <div className="flex items-center">
            <Lock className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-800 font-medium">
              Mode Terenkripsi: Data sedang ditampilkan dalam bentuk
              terenkripsi. Dekripsi data untuk mengaktifkan fitur edit.
            </span>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {resident.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  NIK: {resident.nik}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{resident.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateAge(resident.birthDate)} tahun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Profil Warga</h3>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informasi Pribadi
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Nama Lengkap
                        </p>
                        <p className="text-sm text-gray-900">{resident.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">NIK</p>
                        <p className="text-sm text-gray-900">{resident.nik}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tempat Lahir
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.birthPlace}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tanggal Lahir
                        </p>
                        <p className="text-sm text-gray-900">
                          {isDecrypted
                            ? formatDate(resident.birthDate)
                            : resident.birthDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Jenis Kelamin
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Agama
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.religion}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informasi Keluarga & Status
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Status Pernikahan
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.maritalStatus || "Tidak diisi"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Pekerjaan
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.occupation || "Tidak diisi"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Terdaftar Sejak
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(resident.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Alamat
                        </p>
                        <p className="text-sm text-gray-900">
                          {resident.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal onClose={handleClose} isOpen={isModalOpen}>
        <ResidentForm selectedResident={resident} onClose={handleClose} />
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
