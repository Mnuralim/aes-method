import { getResidentById } from "@/actions/resident";
import { ResidentDetail } from "./_components/detail-resident";
import { getAllFamilyCards } from "@/actions/family-cards";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function DetailResidentPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { isDecrypted, modal } = await searchParams;
  const [resident, familyCardsResult] = await Promise.all([
    await getResidentById(id, isDecrypted === "true" ? true : false),
    getAllFamilyCards(isDecrypted === "true" ? true : false, "100000", "0"),
  ]);

  if (!resident) {
    return (
      <div className="min-h-screen bg-gray-50 px-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Data Warga Tidak Ditemukan
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3">
      <ResidentDetail
        familyCards={familyCardsResult.familyCards}
        resident={resident}
        isDecrypted={isDecrypted === "true"}
        modal={modal as "edit"}
      />
    </div>
  );
}
