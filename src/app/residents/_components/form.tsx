"use client";

import { useActionState } from "react";
import { SubmitButton } from "./submit-button";
import { User, Calendar, MapPin, Phone, Heart } from "lucide-react";
import { ErrorMessage } from "@/app/_components/error-message";
import type { Resident } from "@prisma/client";
import { createResident, updateResident } from "@/actions/resident";

interface Props {
  modal?: "add" | "edit";
  selectedResident?: Resident | null;
  onClose: () => void;
}

export const ResidentForm = ({ modal, selectedResident, onClose }: Props) => {
  const [createState, createAction] = useActionState(createResident, {
    error: null,
  });

  const [updateState, updateAction] = useActionState(updateResident, {
    error: null,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add" ? "Tambah Penduduk Baru" : "Edit Data Penduduk"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi penduduk untuk menambahkan data baru"
            : "Perbarui informasi penduduk sesuai kebutuhan"}
        </p>
      </div>

      <form
        action={modal === "add" ? createAction : updateAction}
        className="space-y-6"
      >
        <input type="hidden" name="id" defaultValue={selectedResident?.id} />
        <ErrorMessage
          message={modal === "add" ? createState.error : updateState.error}
        />

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Identitas
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nik"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NIK *
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                maxLength={16}
                defaultValue={selectedResident?.nik}
                placeholder="Nomor Induk Kependudukan (16 digit)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150 font-mono"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap"
                defaultValue={selectedResident?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Jenis Kelamin *
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={selectedResident?.gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="religion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Agama *
              </label>
              <select
                id="religion"
                name="religion"
                defaultValue={selectedResident?.religion}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih agama</option>
                <option value="islam">Islam</option>
                <option value="kristen protestan">Kristen Protestan</option>
                <option value="kristen katolik">Kristen Katolik</option>
                <option value="hindu">Hindu</option>
                <option value="buddha">Buddha</option>
                <option value="konghucu">Konghucu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Tempat & Tanggal Lahir
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="birthPlace"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tempat Lahir *
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                defaultValue={selectedResident?.birthPlace}
                placeholder="Kota tempat lahir"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Lahir *
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                defaultValue={selectedResident?.birthDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Phone className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Kontak
            </h3>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nomor Telepon *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={selectedResident?.phone}
              placeholder="Masukkan nomor telepon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              required
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Heart className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Status Personal
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="maritalStatus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status Perkawinan
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                defaultValue={selectedResident?.maritalStatus || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              >
                <option value="">Pilih status perkawinan</option>
                <option value="belum kawin">Belum Kawin</option>
                <option value="kawin">Kawin</option>
                <option value="cerai hidup">Cerai Hidup</option>
                <option value="cerai mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pekerjaan
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                defaultValue={selectedResident?.occupation || ""}
                placeholder="Masukkan pekerjaan"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150"
              />
            </div>
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
              defaultValue={selectedResident?.address}
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-150 resize-vertical"
              required
            />
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
