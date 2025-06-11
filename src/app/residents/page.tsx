import { getAllResidents } from "@/actions/resident";
import { ResidentList } from "./_components/resident-list";
import { getAllFamilyCards } from "@/actions/family-cards";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ResidentsPage({ searchParams }: Props) {
  const {
    modal,
    search,
    limit,
    religion,
    skip,
    maritalStatus,
    sortOrder,
    isDecrypted,
  } = await searchParams;

  const [residentsResult, familyCardResult] = await Promise.all([
    getAllResidents(
      isDecrypted === "true" ? true : false,
      limit || "10",
      skip || "0",
      religion,
      maritalStatus,
      search,
      sortOrder
    ),
    getAllFamilyCards(true, "100000", "0"),
  ]);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-slate-50">
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Residents Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Kelola data Penduduk disini
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResidentList
            familyCards={familyCardResult.familyCards}
            residents={residentsResult.residents}
            modal={modal as "add" | "edit"}
            pagination={{
              currentPage: residentsResult.currentPage,
              totalPages: residentsResult.totalPages,
              totalItems: residentsResult.totalCount,
              itemsPerPage: residentsResult.itemsPerPage,
              preserveParams: {
                search,
                limit,
                religion,
                skip,
                maritalStatus,
                sortOrder,
                isDecrypted,
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
