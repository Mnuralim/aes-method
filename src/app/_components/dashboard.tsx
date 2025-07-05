"use client";

import React from "react";
import {
  Users,
  Shield,
  Activity,
  Clock,
  FileText,
  ActivityIcon,
  UserPlus,
} from "lucide-react";
import type { AdminActivityLog } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Props {
  totalResidents: number;
  totalAdmin: number;
  recentActivities: (AdminActivityLog & {
    admin: {
      name: string;
      username: string;
    };
  })[];
  totalActivities: number;
}

export const Dashboard = ({
  recentActivities,
  totalActivities,
  totalAdmin,
  totalResidents,
}: Props) => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        </div>
        <p className="text-slate-600">
          Selamat datang di Sistem Informasi Kependudukan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Penduduk
              </p>
              <p className="text-2xl font-semibold text-slate-800">
                {totalResidents}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Admin</p>
              <p className="text-2xl font-semibold text-slate-800">
                {totalAdmin}
              </p>
            </div>
            <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Aktivitas Hari Ini
              </p>
              <p className="text-2xl font-semibold text-slate-800">
                {totalActivities}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-800">
              Aktivitas Terbaru
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-slate-800">
                        {activity.action}
                      </h4>
                      {activity.entity && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {activity.entity}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        oleh {activity.admin.name}
                      </p>
                      <span className="text-xs text-slate-400">•</span>
                      <p className="text-xs text-slate-500">
                        {formatDate(activity.createdAt, true)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Belum ada aktivitas terbaru</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-0">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 text-left group">
              <Link href={"/residents?modal=add"} className="w-full h-full">
                <UserPlus className="w-6 h-6 text-slate-600 group-hover:text-blue-600 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-800">
                  Tambah Penduduk
                </p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 text-left group">
              <Link href={"/logs"} className="w-full h-full">
                <ActivityIcon className="w-6 h-6 text-slate-600 group-hover:text-violet-600 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-800">
                  Riwayat Aktivitas
                </p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 text-left group">
              <Link href={"/reports"} className="w-full h-full">
                <FileText className="w-6 h-6 text-slate-600 group-hover:text-amber-600 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-800">
                  Laporan Data
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
