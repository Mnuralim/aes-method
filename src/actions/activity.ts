"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./session";

export async function getActivities(skip: string, limit: string) {
  const activities = await prisma.adminActivityLog.findMany({
    include: {
      admin: {
        select: {
          username: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    activities,
    totalCount: activities.length,
    currentPage: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
    totalPages: Math.ceil(activities.length / parseInt(limit)),
    itemsPerPage: parseInt(limit),
  };
}

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
