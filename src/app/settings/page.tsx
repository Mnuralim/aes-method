import { getAdmin } from "@/actions/admin";
import { AdminProfileUpdate } from "./_components/update-profile";
import { getSession } from "@/actions/session";

export default async function SettingPage() {
  const session = await getSession();
  const admin = await getAdmin(session!.id);
  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 px-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Data Admin Tidak Ditemukan
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <AdminProfileUpdate admin={admin} />
    </div>
  );
}
