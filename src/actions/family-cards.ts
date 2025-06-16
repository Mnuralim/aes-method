"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { createActivity } from "./activity";
import { decryptAES, encryptAES } from "@/lib/aes";

export const getAllFamilyCards = unstable_cache(
  async function getAllFamilyCards(
    isDecrypted: boolean,
    limit: string,
    skip: string,
    search?: string,
    sortOrder?: string
  ) {
    let familyCards = await prisma.familyCard.findMany({
      take: parseInt(limit),
      skip: parseInt(skip),
      include: {
        residents: true,
      },
      orderBy: {
        createdAt: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalCount = await prisma.familyCard.count();

    if (isDecrypted) {
      familyCards = familyCards.map((familyCard) => ({
        ...familyCard,
        cardNumber: decryptAES(familyCard.cardNumber),
        headOfFamily: decryptAES(familyCard.headOfFamily),
        address: decryptAES(familyCard.address),
        residents: familyCard.residents.map((resident) => ({
          ...resident,
          nik: decryptAES(resident.nik),
          name: decryptAES(resident.name),
          phone: decryptAES(resident.phone),
          address: decryptAES(resident.address),
          birthPlace: decryptAES(resident.birthPlace),
          birthDate: decryptAES(resident.birthDate),
          religion: decryptAES(resident.religion),
          gender: decryptAES(resident.gender),
          occupation: resident.occupation
            ? decryptAES(resident.occupation)
            : null,
          maritalStatus: resident.maritalStatus
            ? decryptAES(resident.maritalStatus)
            : null,
        })),
      }));
    }

    if (search) {
      familyCards = familyCards.filter(
        (card) =>
          card.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
          card.headOfFamily.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      familyCards,
      totalCount,
      currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      itemsPerPage: parseInt(limit),
    };
  }
);

async function checkFamilyCardExists(
  cardNumber: string,
  excludeId?: string
): Promise<boolean> {
  const existingCards = await prisma.familyCard.findMany({
    where: {
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });

  return existingCards.some((card) => {
    try {
      const decryptedCardNumber = decryptAES(card.cardNumber);
      return decryptedCardNumber.toLowerCase() === cardNumber.toLowerCase();
    } catch (error) {
      console.error("Failed to decrypt family card data:", error);
      return false;
    }
  });
}

export async function createFamilyCard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cardNumber = formData.get("cardNumber") as string;
  const headOfFamily = formData.get("headOfFamily") as string;
  const address = formData.get("address") as string;
  const memberCount = formData.get("memberCount") as string;

  if (!cardNumber || !headOfFamily || !address || !memberCount) {
    return {
      error: "Semua field harus diisi",
    };
  }

  const cardNumberPattern = /^\d{16}$/;
  if (!cardNumberPattern.test(cardNumber)) {
    return {
      error: "Nomor KK harus terdiri dari 16 digit angka",
    };
  }

  try {
    const memberCountNum = parseInt(memberCount);
    if (memberCountNum < 1 || memberCountNum > 20) {
      return {
        error: "Jumlah anggota keluarga harus antara 1-20 orang",
      };
    }

    const cardExists = await checkFamilyCardExists(cardNumber);

    if (cardExists) {
      return {
        error: "Nomor Kartu Keluarga sudah terdaftar",
      };
    }

    await prisma.$transaction(async (tx) => {
      const familyCard = await tx.familyCard.create({
        data: {
          cardNumber: encryptAES(cardNumber),
          headOfFamily: encryptAES(headOfFamily),
          address: encryptAES(address),
          memberCount: memberCountNum,
        },
      });

      return familyCard;
    });

    await createActivity(
      "CREATE",
      "family_card",
      `Membuat Kartu Keluarga untuk ${headOfFamily}`
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan saat menyimpan data",
      };
    }
  }

  revalidatePath("/family-cards");
  revalidatePath("/");
  revalidatePath("/logs");
  revalidatePath("/residents");
  redirect("/family-cards");
}

export async function updateFamilyCard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const cardNumber = formData.get("cardNumber") as string;
  const headOfFamily = formData.get("headOfFamily") as string;
  const address = formData.get("address") as string;
  const memberCount = formData.get("memberCount") as string;

  if (!id || !cardNumber || !headOfFamily || !address || !memberCount) {
    return {
      error: "Semua field harus diisi",
    };
  }

  const cardNumberPattern = /^\d{16}$/;
  if (!cardNumberPattern.test(cardNumber)) {
    return {
      error: "Nomor KK harus terdiri dari 16 digit angka",
    };
  }

  try {
    const existingFamilyCard = await prisma.familyCard.findUnique({
      where: { id },
      include: { residents: true },
    });

    if (!existingFamilyCard) {
      return {
        error: "Data Kartu Keluarga tidak ditemukan",
      };
    }

    const memberCountNum = parseInt(memberCount);
    if (memberCountNum < 1 || memberCountNum > 20) {
      return {
        error: "Jumlah anggota keluarga harus antara 1-20 orang",
      };
    }

    const cardExists = await checkFamilyCardExists(cardNumber, id);

    if (cardExists) {
      return {
        error: "Nomor Kartu Keluarga sudah terdaftar",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.resident.updateMany({
        where: { familyCardId: id },
        data: { familyCardId: null },
      });

      await tx.familyCard.update({
        where: { id },
        data: {
          cardNumber: encryptAES(cardNumber),
          headOfFamily: encryptAES(headOfFamily),
          address: encryptAES(address),
          memberCount: memberCountNum,
        },
      });
    });

    await createActivity(
      "UPDATE",
      "family_card",
      `Memperbarui Kartu Keluarga ${headOfFamily}`
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan saat memperbarui data",
      };
    }
  }
  revalidatePath("/residents");
  revalidatePath("/logs");
  revalidatePath("/family-cards");
  revalidatePath("/");
  redirect("/family-cards");
}

export async function deleteFamilyCard(id: string) {
  try {
    const existingFamilyCard = await prisma.familyCard.findUnique({
      where: { id },
      include: { residents: true },
    });

    if (!existingFamilyCard) {
      throw new Error("Data Kartu Keluarga tidak ditemukan");
    }

    const decryptedHeadOfFamily = decryptAES(existingFamilyCard.headOfFamily);

    await prisma.$transaction(async (tx) => {
      await tx.resident.updateMany({
        where: { familyCardId: id },
        data: { familyCardId: null },
      });

      await tx.familyCard.delete({
        where: { id },
      });
    });

    await createActivity(
      "DELETE",
      "family_card",
      `Menghapus Kartu Keluarga ${decryptedHeadOfFamily}`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Terjadi kesalahan saat menghapus data");
    }
  }
  revalidatePath("/family-cards");
  revalidatePath("/residents");
  revalidatePath("/logs");
  revalidatePath("/");
}

export async function getFamilyCardById(id: string, isDecrypted: boolean) {
  const familyCard = await prisma.familyCard.findUnique({
    where: {
      id: id,
    },
    include: {
      residents: true,
    },
  });

  if (!familyCard) {
    return null;
  }

  if (isDecrypted) {
    return {
      ...familyCard,
      cardNumber: decryptAES(familyCard.cardNumber),
      headOfFamily: decryptAES(familyCard.headOfFamily),
      address: decryptAES(familyCard.address),
      residents: familyCard.residents.map((resident) => ({
        ...resident,
        nik: decryptAES(resident.nik),
        name: decryptAES(resident.name),
        phone: decryptAES(resident.phone),
        address: decryptAES(resident.address),
        birthPlace: decryptAES(resident.birthPlace),
        birthDate: decryptAES(resident.birthDate),
        religion: decryptAES(resident.religion),
        gender: decryptAES(resident.gender),
        occupation: resident.occupation
          ? decryptAES(resident.occupation)
          : null,
        maritalStatus: resident.maritalStatus
          ? decryptAES(resident.maritalStatus)
          : null,
      })),
    };
  }

  return familyCard;
}
