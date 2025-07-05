import { getResidentById } from "@/actions/resident";
import { ResidentDetail } from "./_components/detail-resident";

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
  const { isDecrypted, modal, message, error, success, key } =
    await searchParams;
  const [resident] = await Promise.all([
    await getResidentById(id, isDecrypted === "true" ? true : false, key),
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
        resident={resident}
        isDecrypted={isDecrypted === "true"}
        modal={modal as "edit"}
        message={message}
        toastType={success ? "success" : error ? "error" : undefined}
      />
    </div>
  );
}
