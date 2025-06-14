"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./session";
import { unstable_cache } from "next/cache";

export const getActivities = unstable_cache(async function getActivities(
  skip: string,
  limit: string
) {
  const [activities, totalCount] = await Promise.all([
    prisma.adminActivityLog.findMany({
      include: {
        admin: {
          select: {
            username: true,
            name: true,
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.adminActivityLog.count(),
  ]);

  return {
    activities,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(limit)),
    itemsPerPage: parseInt(limit),
  };
});

export async function createActivity(
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "OTHER",
  entity: string,
  description: string,
  entityId?: string,
  adminId?: string
): Promise<void> {
  const admin = await getSession();

  await prisma.adminActivityLog.create({
    data: {
      action,
      entity,
      description,
      entityId,
      adminId: admin?.id || (adminId as string),
    },
  });
}
