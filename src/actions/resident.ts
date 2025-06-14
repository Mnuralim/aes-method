"use server";

import { decryptAES, encryptAES } from "@/lib/aes";
import prisma from "@/lib/prisma";
import { createActivity } from "./activity";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "./session";

export const getAllResidents = unstable_cache(async function getAllResidents(
  isDecrypted: boolean,
  limit: string,
  skip: string,
  religion?: string,
  maritalStatus?: string,
  search?: string,
  sortOrder?: string
) {
  let residents = await prisma.resident.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
    include: {
      familyCard: true,
    },
    orderBy: {
      createdAt: sortOrder === "asc" ? "asc" : "desc",
    },
  });

  const totalCount = await prisma.resident.count();

  if (isDecrypted) {
    residents = residents.map((resident) => ({
      ...resident,
      address: decryptAES(resident.address),
      birthDate: decryptAES(resident.birthDate),
      birthPlace: decryptAES(resident.birthPlace),
      gender: decryptAES(resident.gender),
      name: decryptAES(resident.name),
      maritalStatus: resident.maritalStatus
        ? decryptAES(resident.maritalStatus)
        : null,
      nik: decryptAES(resident.nik),
      occupation: resident.occupation ? decryptAES(resident.occupation) : null,
      phone: decryptAES(resident.phone),
      religion: decryptAES(resident.religion),
    }));
  }

  if (search) {
    residents = residents.filter((resident) =>
      resident.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (religion) {
    residents = residents.filter(
      (resident) => resident.religion.toLowerCase() === religion.toLowerCase()
    );
  }

  if (maritalStatus) {
    residents = residents.filter(
      (resident) =>
        resident.maritalStatus?.toLowerCase() === maritalStatus.toLowerCase()
    );
  }

  return {
    residents,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    itemsPerPage: parseInt(limit),
  };
});

export async function deleteResident(id: string) {
  try {
    const existingResident = await prisma.resident.findUnique({
      where: {
        id,
      },
    });

    if (!existingResident) {
      throw new Error("Data siswa tidak ditemukan");
    }
    await Promise.all([
      prisma.resident.delete({
        where: {
          id,
        },
      }),
      createActivity(
        "DELETE",
        "residents",
        `Menghapus data penduduk ${decryptAES(existingResident.name)}`,
        id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
  revalidatePath("/residents");
  revalidatePath("/");
  revalidatePath("/logs");
  revalidatePath("/");
}

export async function createResident(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  const nik = formData.get("nik") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const religion = formData.get("religion") as string;
  const gender = formData.get("gender") as string;
  const occupation = formData.get("occupation") as string;
  const maritalStatus = formData.get("maritalStatus") as string;
  const familyCardId = formData.get("familyCardId") as string;

  if (
    !nik ||
    !name ||
    !phone ||
    !address ||
    !birthDate ||
    !birthPlace ||
    !religion ||
    !gender ||
    !familyCardId
  ) {
    return {
      error:
        "Field wajib harus diisi: NIK,No KK, Nama, Telepon, Alamat, Tanggal Lahir, Tempat Lahir, Agama, dan Jenis Kelamin",
    };
  }

  if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
    return {
      error: "NIK harus terdiri dari 16 digit angka",
    };
  }

  try {
    const allResidents = await prisma.resident.findMany();
    const nikExists = allResidents.some((resident) => {
      return decryptAES(resident.nik) === nik;
    });

    if (nikExists) {
      return {
        error: "NIK sudah terdaftar",
      };
    }

    const createdResident = await prisma.resident.create({
      data: {
        nik: encryptAES(nik),
        name: encryptAES(name),
        phone: encryptAES(phone),
        address: encryptAES(address),
        birthDate: encryptAES(birthDate),
        birthPlace: encryptAES(birthPlace),
        religion: encryptAES(religion),
        gender: encryptAES(gender),
        occupation: occupation ? encryptAES(occupation) : null,
        maritalStatus: maritalStatus ? encryptAES(maritalStatus) : null,
        familyCardId: familyCardId,
        adminId: session!.id,
      },
    });

    await createActivity(
      "CREATE",
      "residents",
      `Menambahkan penduduk ${decryptAES(createdResident.name)}`,
      createdResident.id
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan pada sistem",
      };
    }
  }

  revalidatePath("/residents");
  revalidatePath("/");
  revalidatePath("/logs");
  redirect("/residents");
}

export async function updateResident(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const nik = formData.get("nik") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const religion = formData.get("religion") as string;
  const gender = formData.get("gender") as string;
  const occupation = formData.get("occupation") as string;
  const maritalStatus = formData.get("maritalStatus") as string;
  const familyCardId = formData.get("familyCardId") as string;

  if (
    !nik ||
    !name ||
    !phone ||
    !address ||
    !birthDate ||
    !birthPlace ||
    !religion ||
    !gender ||
    !familyCardId
  ) {
    return {
      error:
        "Field wajib harus diisi: NIK, No KK, Nama, Telepon, Alamat, Tanggal Lahir, Tempat Lahir, Agama, dan Jenis Kelamin",
    };
  }

  if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
    return {
      error: "NIK harus terdiri dari 16 digit angka",
    };
  }

  try {
    const existingResident = await prisma.resident.findUnique({
      where: {
        id,
      },
    });

    if (!existingResident) {
      return {
        error: "Data penduduk tidak ditemukan",
      };
    }

    const allResidents = await prisma.resident.findMany({
      where: {
        NOT: {
          id,
        },
      },
      select: {
        id: true,
        nik: true,
      },
    });

    const isDuplicateNik = allResidents.some((resident) => {
      const decryptedNik = decryptAES(resident.nik);
      return decryptedNik === nik;
    });

    if (isDuplicateNik) {
      return {
        error: "NIK sudah terdaftar oleh penduduk lain",
      };
    }

    await Promise.all([
      prisma.resident.update({
        where: {
          id,
        },
        data: {
          nik: encryptAES(nik),
          name: encryptAES(name),
          phone: encryptAES(phone),
          address: encryptAES(address),
          birthDate: encryptAES(birthDate),
          birthPlace: encryptAES(birthPlace),
          religion: encryptAES(religion),
          gender: encryptAES(gender),
          occupation: occupation ? encryptAES(occupation) : null,
          maritalStatus: maritalStatus ? encryptAES(maritalStatus) : null,
          familyCardId,
        },
      }),
      createActivity(
        "UPDATE",
        "residents",
        `Mengubah data penduduk ${decryptAES(existingResident.name)}`,
        existingResident.id
      ),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan pada sistem",
      };
    }
  }

  revalidatePath("/residents", "layout");
  revalidatePath("/");
  revalidatePath("/logs");
  redirect("/residents");
}

export async function getResidentById(id: string, isDecrypted: boolean) {
  const resident = await prisma.resident.findUnique({
    where: {
      id: id,
    },
    include: {
      familyCard: true,
    },
  });

  if (!resident) {
    return null;
  }

  if (isDecrypted) {
    return {
      ...resident,
      nik: decryptAES(resident.nik),
      name: decryptAES(resident.name),
      birthPlace: decryptAES(resident.birthPlace),
      birthDate: decryptAES(resident.birthDate),
      address: decryptAES(resident.address),
      phone: decryptAES(resident.phone),
      religion: decryptAES(resident.religion),
      gender: decryptAES(resident.gender),
      maritalStatus: resident.maritalStatus
        ? decryptAES(resident.maritalStatus)
        : null,
      occupation: resident.occupation ? decryptAES(resident.occupation) : null,
      familyCard: resident.familyCard
        ? {
            ...resident.familyCard,
            cardNumber: decryptAES(resident.familyCard.cardNumber),
          }
        : null,
    };
  }

  return resident;
}
