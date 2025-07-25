import { getActivities } from "@/actions/activity";
import { ActivityList } from "./_components/list-activity";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function Logs({ searchParams }: Props) {
  const { limit, skip } = await searchParams;
  const logsResult = await getActivities(skip || "0", limit || "10");
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-slate-50">
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Logs Activity
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Lihat log aktivitas di sini.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ActivityList
            logs={logsResult.activities}
            pagination={{
              currentPage: logsResult.currentPage,
              itemsPerPage: logsResult.itemsPerPage,
              totalPages: logsResult.totalPages,
              totalItems: logsResult.totalCount,
              preserveParams: {
                limit,
                skip,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
