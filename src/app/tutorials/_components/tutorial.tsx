"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  LogIn,
  Home,
  Users,
  Award,
  History,
  User,
} from "lucide-react";
import Image from "next/image";

export const Tutorial = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const tutorialSections = [
    {
      id: "login",
      title: "Login ke Sistem",
      icon: <LogIn className="w-5 h-5" />,
      steps: [
        {
          title: "Buka Halaman Login",
          description:
            "Akses halaman login sistem dengan memasukkan URL atau klik tombol login",
          image: "/image/login-page.png",
        },
        {
          title: "Masukkan Kredensial",
          description:
            "Masukkan username dan password yang telah diberikan oleh administrator",
          image: "/image/login-credential.png",
        },
        {
          title: "Login Berhasil",
          description:
            "Setelah login berhasil, Anda akan diarahkan ke halaman dashboard utama",
        },
      ],
    },
    {
      id: "dashboard",
      title: "Navigasi Dashboard",
      icon: <Home className="w-5 h-5" />,
      steps: [
        {
          title: "Halaman Dashboard",
          description:
            "Dashboard menampilkan ringkasan informasi dan statistik sistem secara keseluruhan",
          image: "/image/dashboard.png",
        },
        {
          title: "Menu Sidebar",
          description:
            "Gunakan menu sidebar di sisi kiri untuk navigasi ke berbagai fitur sistem",
          image: "/image/dashboard.png",
        },
      ],
    },
    {
      id: "students",
      title: "Manajemen Data Siswa",
      icon: <Users className="w-5 h-5" />,
      steps: [
        {
          title: "Akses Menu Siswa",
          description:
            'Pilih menu "Manajemen Data Siswa" di sidebar pada sisi kiri untuk mengakses data siswa',
        },
        {
          title: "Mode Enkripsi",
          description:
            "Data ditampilkan dalam bentuk enkripsi untuk keamanan. Klik tombol dekripsi untuk melihat data asli",
          image: "/image/student-encrypt.png",
        },
        {
          title: "Dekripsi Data",
          description:
            "Setelah mengklik tombol dekripsi, data siswa akan ditampilkan dalam format yang dapat dibaca",
          image: "/image/decrypt-student.png",
        },
        {
          title: "Tambah Data Siswa",
          description:
            'Klik tombol "Tambah Siswa" untuk menambahkan data siswa baru dengan mengisi form yang tersedia',
          image: "/image/add-student.png",
        },
        {
          title: "Update Data Siswa",
          description:
            "Aktifkan mode dekripsi terlebih dahulu, kemudian form untuk memperbarui data siswa akan muncul",
          image: "/image/update-student.png",
        },
        {
          title: "Export ke Excel",
          description:
            'Gunakan tombol "Export to Excel" untuk mengunduh data siswa. Tombol ini aktif saat mode dekripsi',
        },
        {
          title: "Detail Data Siswa",
          description:
            'Klik tombol "Detail" untuk melihat informasi lengkap dari data siswa yang dipilih',
          image: "/image/detail-student.png",
        },
      ],
    },
    {
      id: "scores",
      title: "Manajemen Nilai Siswa",
      icon: <Award className="w-5 h-5" />,
      steps: [
        {
          title: "Akses Menu Nilai",
          description:
            'Pilih menu "Manajemen Nilai Siswa" di sidebar pada sisi kiri untuk mengakses data nilai',
        },
        {
          title: "Mode Enkripsi Nilai",
          description:
            "Data nilai ditampilkan dalam bentuk enkripsi. Klik tombol dekripsi untuk melihat data asli",
          image: "/image/encrypt-score.png",
        },
        {
          title: "Dekripsi Data Nilai",
          description:
            "Setelah dekripsi, data nilai siswa akan ditampilkan dalam format yang dapat dibaca",
          image: "/image/decrypt-score.png",
        },
        {
          title: "Tambah Data Nilai",
          description:
            'Klik tombol "Tambah Nilai" untuk menambahkan data nilai baru dengan mengisi form yang benar',
          image: "/image/add-score.png",
        },
        {
          title: "Update Data Nilai",
          description:
            "Aktifkan mode dekripsi, kemudian form untuk memperbarui data nilai akan tersedia",
          image: "/image/update-score.png",
        },
        {
          title: "Export Nilai ke Excel",
          description:
            'Gunakan tombol "Export to Excel" untuk mengunduh data nilai. Aktif saat mode dekripsi',
        },
      ],
    },
    {
      id: "history",
      title: "Riwayat Aktivitas",
      icon: <History className="w-5 h-5" />,
      steps: [
        {
          title: "Akses Riwayat Aktivitas",
          description:
            'Pilih menu "Riwayat Aktivitas" di sidebar pada sisi kiri untuk melihat log aktivitas sistem',
        },
        {
          title: "Log Aktivitas",
          description:
            "Sistem akan menampilkan semua aktivitas yang telah dilakukan oleh admin",
          image: "/image/activity.png",
        },
      ],
    },
    {
      id: "profile",
      title: "Pengaturan Akun",
      icon: <User className="w-5 h-5" />,
      steps: [
        {
          title: "Akses Akun Saya",
          description:
            'Pilih menu "Akun Saya" di sidebar pada sisi kiri untuk mengakses pengaturan profil',
        },
        {
          title: "Update Profil dan Password",
          description:
            "Di halaman ini Anda dapat memperbarui informasi profil dan mengubah password akun",
          image: "/image/profile.png",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">SD</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Panduan Aplikasi
              </h1>
              <p className="text-gray-600 text-sm">
                SDN 12 MAWASANGKA - Sistem Manajemen Data
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selamat Datang
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Panduan ini akan membantu Anda memahami cara menggunakan sistem
            manajemen data SDN 12 Mawasangka. Ikuti langkah-langkah berikut
            untuk mengoptimalkan penggunaan aplikasi.
          </p>
        </div>

        <div className="space-y-4">
          {tutorialSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSections[section.id] && (
                <div className="border-t border-gray-100">
                  {section.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="p-6 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {stepIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {step.description}
                          </p>
                          {step.image ? (
                            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                                <Image
                                  src={step.image}
                                  alt={step.title}
                                  className="object-contain w-full h-full"
                                  width={1600}
                                  height={900}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips Penting
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Selalu aktifkan mode dekripsi untuk melihat dan mengedit data
                yang sebenarnya
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Fitur export ke Excel hanya tersedia saat mode dekripsi aktif
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Pastikan data yang diinput sudah benar sebelum menyimpan
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Gunakan menu riwayat aktivitas untuk memantau perubahan data
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
