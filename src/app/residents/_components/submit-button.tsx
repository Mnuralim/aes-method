import React from "react";
import { useFormStatus } from "react-dom";

interface Props {
  modalMode: "add" | "edit";
}

export const SubmitButton = ({ modalMode }: Props) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
      disabled={pending}
    >
      {pending
        ? modalMode === "edit"
          ? "Menyimpan..."
          : "Menambahkan..."
        : modalMode === "edit"
        ? "Simpan Perubahan"
        : "Tambah Penduduk"}
    </button>
  );
};
