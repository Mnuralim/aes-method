"use client";

import type { Prisma } from "@prisma/client";
import { Eye } from "lucide-react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { Pagination } from "@/app/_components/pagination";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type LogsInfo = Prisma.AdminActivityLogGetPayload<{
  include: {
    admin: {
      select: {
        username: true;
        name: true;
      };
    };
  };
}>;

interface Props {
  logs: LogsInfo[];
  pagination: PaginationProps;
}

export const ActivityList = ({ logs, pagination }: Props) => {
  const router = useRouter();

  const columns: TabelColumn<LogsInfo>[] = [
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
      header: "Waktu",
      accessor: (item) => formatDate(item.createdAt, true),
      className: "font-mono text-sm",
    },
    {
      header: "Admin",
      accessor: (item) => item.admin.name || "-",
    },
    {
      header: "Aksi",
      accessor: (item) => item.action || "-",
      className: "w-32 text-center",
    },
    {
      header: "Deskripsi",
      accessor: (item) => item.description || "-",
      className: "max-w-xs truncate",
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      className: "w-32",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            disabled={!item.entity || !item.entityId}
            onClick={() => router.push(`/${item.entity}/${item.entityId}`)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-green-200"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <Tabel columns={columns} data={logs} />

      <div className="mt-8">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>
    </div>
  );
};
