"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { Home, Users, MapPin, CreditCard } from "lucide-react";
import { ErrorMessage } from "@/app/_components/error-message";
import { createFamilyCard, updateFamilyCard } from "@/actions/family-cards";
import type { FamilyCard } from "@prisma/client";

interface Props {
  modal?: "add" | "edit";
  selectedFamilyCard?: FamilyCard | null;
  onClose: () => void;
}

export const FamilyCardForm = ({
  modal,
  selectedFamilyCard,
  onClose,
}: Props) => {
  const [createState, createAction] = useActionState(createFamilyCard, {
    error: null,
  });

  const [updateState, updateAction] = useActionState(updateFamilyCard, {
    error: null,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add"
            ? "Tambah Kartu Keluarga Baru"
            : "Edit Kartu Keluarga"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi kartu keluarga untuk menambahkan data baru"
            : "Perbarui informasi kartu keluarga sesuai kebutuhan"}
        </p>
      </div>

      <form
        action={modal === "add" ? createAction : updateAction}
        className="space-y-6"
      >
        <input type="hidden" name="id" defaultValue={selectedFamilyCard?.id} />
        <ErrorMessage
          message={modal === "add" ? createState.error : updateState.error}
        />

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Nomor Kartu Keluarga
            </h3>
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nomor KK *
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="Masukkan 16 digit nomor KK"
              defaultValue={selectedFamilyCard?.cardNumber}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              pattern="\d{16}"
              maxLength={16}
              title="Nomor KK harus terdiri dari 16 digit angka"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Masukkan 16 digit nomor Kartu Keluarga
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Kepala Keluarga
            </h3>
          </div>

          <div>
            <label
              htmlFor="headOfFamily"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Kepala Keluarga *
            </label>
            <input
              type="text"
              id="headOfFamily"
              name="headOfFamily"
              placeholder="Masukkan nama lengkap kepala keluarga"
              defaultValue={selectedFamilyCard?.headOfFamily}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Alamat</h3>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alamat Lengkap *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Masukkan alamat lengkap keluarga"
              defaultValue={selectedFamilyCard?.address}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150 resize-none"
              required
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Home className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Jumlah Anggota Keluarga
            </h3>
          </div>

          <div>
            <label
              htmlFor="memberCount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Jumlah Anggota (1-20) *
            </label>
            <input
              type="number"
              id="memberCount"
              name="memberCount"
              min="1"
              max="20"
              placeholder="Masukkan jumlah anggota keluarga"
              defaultValue={selectedFamilyCard?.memberCount}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Jumlah total anggota keluarga dalam satu KK (1-20 orang)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Batal
          </button>
          <SubmitButton modalMode={modal as "add" | "edit"} />
        </div>
      </form>
    </div>
  );
};
