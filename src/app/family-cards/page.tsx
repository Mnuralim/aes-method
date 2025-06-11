import { getAllFamilyCards } from "@/actions/family-cards";
import { getAllResidents } from "@/actions/resident";
import { FamilyCardList } from "./_components/family-card-list";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function FamilyCardsPage({ searchParams }: Props) {
  const { modal, limit, skip, search, sortOrder, isDecrypted } =
    await searchParams;

  const [familyCardResult, residentsResult] = await Promise.all([
    getAllFamilyCards(
      isDecrypted === "true" ? true : false,
      limit || "10",
      skip || "0",
      search,
      sortOrder
    ),
    getAllResidents(true, "100000", "0"),
  ]);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-slate-50">
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Manajemen Kartu Keluarga
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Kelola data Kartu Keluarga dan informasi keluarga
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <FamilyCardList
            familyCards={familyCardResult.familyCards}
            residents={residentsResult.residents}
            modal={modal as "add" | "edit"}
            pagination={{
              currentPage: familyCardResult.currentPage,
              totalPages: familyCardResult.totalPages,
              totalItems: familyCardResult.totalCount,
              itemsPerPage: familyCardResult.itemsPerPage,
              preserveParams: {
                limit,
                skip,
                search,
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
