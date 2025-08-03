"use server";

const { default: CryptoJS } = await import("crypto-js");
import { decryptAES, encryptAES } from "@/lib/aes";
import prisma from "@/lib/prisma";
import { createActivity } from "./activity";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "./session";
const currentKey = process.env.AES_KEY;

export const getAllResidents = unstable_cache(async function getAllResidents(
  isDecrypted: boolean,
  limit: string,
  skip: string,
  religion?: string,
  maritalStatus?: string,
  search?: string,
  sortOrder?: string,
  key?: string
) {
  try {
    let residents = await prisma.resident.findMany({
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        createdAt: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalCount = await prisma.resident.count();

    if (isDecrypted || key) {
      if (!key) {
        throw new Error("Kunci AES tidak ditemukan");
      }

      if (currentKey !== key) {
        throw new Error("Kunci AES tidak sesuai");
      }

      const AES_KEY = CryptoJS.enc.Utf8.parse(key);

      residents = residents.map((resident) => ({
        ...resident,
        address: decryptAES(resident.address, AES_KEY),
        birthDate: decryptAES(resident.birthDate, AES_KEY),
        birthPlace: decryptAES(resident.birthPlace, AES_KEY),
        gender: decryptAES(resident.gender, AES_KEY),
        name: decryptAES(resident.name, AES_KEY),
        maritalStatus: resident.maritalStatus
          ? decryptAES(resident.maritalStatus, AES_KEY)
          : null,
        nik: decryptAES(resident.nik, AES_KEY),
        occupation: resident.occupation
          ? decryptAES(resident.occupation, AES_KEY)
          : null,
        religion: decryptAES(resident.religion, AES_KEY),
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
  } catch (error) {
    if (error instanceof Error) {
      redirect(
        `/residents?error=1&message=${encodeURIComponent(error.message)}`
      );
    } else {
      redirect(
        `/residents?error=1&message=${encodeURIComponent(
          "Something went wrong"
        )}`
      );
    }
  }
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
    const AES_KEY = CryptoJS.enc.Utf8.parse(currentKey!);

    await Promise.all([
      prisma.resident.delete({
        where: {
          id,
        },
      }),
      createActivity(
        "DELETE",
        "residents",
        `Menghapus data penduduk ${decryptAES(existingResident.name, AES_KEY)}`,
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
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const religion = formData.get("religion") as string;
  const gender = formData.get("gender") as string;
  const occupation = formData.get("occupation") as string;
  const maritalStatus = formData.get("maritalStatus") as string;

  if (
    !nik ||
    !name ||
    !address ||
    !birthDate ||
    !birthPlace ||
    !religion ||
    !gender
  ) {
    return {
      error:
        "Field wajib harus diisi: NIK, Nama, Alamat, Tanggal Lahir, Tempat Lahir, Agama, dan Jenis Kelamin",
    };
  }

  if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
    return {
      error: "NIK harus terdiri dari 16 digit angka",
    };
  }

  try {
    const AES_KEY = CryptoJS.enc.Utf8.parse(currentKey!);

    const allResidents = await prisma.resident.findMany();
    const nikExists = allResidents.some((resident) => {
      return decryptAES(resident.nik, AES_KEY) === nik;
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
        address: encryptAES(address),
        birthDate: encryptAES(birthDate),
        birthPlace: encryptAES(birthPlace),
        religion: encryptAES(religion),
        gender: encryptAES(gender),
        occupation: occupation ? encryptAES(occupation) : null,
        maritalStatus: maritalStatus ? encryptAES(maritalStatus) : null,
        adminId: session!.id,
      },
    });

    await createActivity(
      "CREATE",
      "residents",
      `Menambahkan penduduk ${decryptAES(createdResident.name, AES_KEY)}`,
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
  const address = formData.get("address") as string;
  const birthDate = formData.get("birthDate") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const religion = formData.get("religion") as string;
  const gender = formData.get("gender") as string;
  const occupation = formData.get("occupation") as string;
  const maritalStatus = formData.get("maritalStatus") as string;

  if (
    !nik ||
    !name ||
    !address ||
    !birthDate ||
    !birthPlace ||
    !religion ||
    !gender
  ) {
    return {
      error:
        "Field wajib harus diisi: NIK, Nama, Alamat, Tanggal Lahir, Tempat Lahir, Agama, dan Jenis Kelamin",
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
    const AES_KEY = CryptoJS.enc.Utf8.parse(currentKey!);
    const isDuplicateNik = allResidents.some((resident) => {
      const decryptedNik = decryptAES(resident.nik, AES_KEY);
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
          address: encryptAES(address),
          birthDate: encryptAES(birthDate),
          birthPlace: encryptAES(birthPlace),
          religion: encryptAES(religion),
          gender: encryptAES(gender),
          occupation: occupation ? encryptAES(occupation) : null,
          maritalStatus: maritalStatus ? encryptAES(maritalStatus) : null,
        },
      }),
      createActivity(
        "UPDATE",
        "residents",
        `Mengubah data penduduk ${decryptAES(existingResident.name, AES_KEY)}`,
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

export async function getResidentById(
  id: string,
  isDecrypted: boolean,
  key?: string
) {
  try {
    const resident = await prisma.resident.findUnique({
      where: {
        id: id,
      },
    });

    if (!resident) {
      return null;
    }

    if (isDecrypted || key) {
      if (!key) {
        throw new Error("Kunci AES tidak ditemukan");
      }

      if (currentKey !== key) {
        throw new Error("Kunci AES tidak sesuai");
      }

      const AES_KEY = CryptoJS.enc.Utf8.parse(key);

      return {
        ...resident,
        nik: decryptAES(resident.nik, AES_KEY),
        name: decryptAES(resident.name, AES_KEY),
        birthPlace: decryptAES(resident.birthPlace, AES_KEY),
        birthDate: decryptAES(resident.birthDate, AES_KEY),
        address: decryptAES(resident.address, AES_KEY),
        religion: decryptAES(resident.religion, AES_KEY),
        gender: decryptAES(resident.gender, AES_KEY),
        maritalStatus: resident.maritalStatus
          ? decryptAES(resident.maritalStatus, AES_KEY)
          : null,
        occupation: resident.occupation
          ? decryptAES(resident.occupation, AES_KEY)
          : null,
      };
    }

    return resident;
  } catch (error) {
    if (error instanceof Error) {
      redirect(
        `/residents/${id}?error=1&message=${encodeURIComponent(error.message)}`
      );
    } else {
      redirect(
        `/residents/${id}?error=1&message=${encodeURIComponent(
          "Something went wrong"
        )}`
      );
    }
  }
}
