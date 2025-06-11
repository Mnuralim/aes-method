"use client";

import { useActionState, useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import type { admin as Admin } from "@prisma/client";
import { updateAdmin } from "@/actions/admin";
import { ErrorMessage } from "@/app/_components/error-message";
import { SubmitButton } from "./submit-button";

interface Props {
  admin: Admin;
}

export const AdminProfileUpdate = ({ admin }: Props) => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [state, action] = useActionState(updateAdmin, {
    error: null,
  });

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Pengaturan Profil
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola informasi akun dan keamanan Anda
            </p>
          </div>
        </div>
      </div>

      <ErrorMessage message={state.error} />

      <form action={action} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-900">
                Informasi Profil
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Data dasar akun administrator
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                disabled
                readOnly
                defaultValue={admin.username}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none transition-colors"
                placeholder="Username tidak dapat diubah"
              />
              <p className="text-xs text-slate-500 mt-1">
                Username tidak dapat diubah setelah akun dibuat
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={admin.name}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-900">
                Keamanan Password
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Masukkan password lama"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.old ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Masukkan password baru (minimal 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end pt-6 border-t border-slate-200">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};
