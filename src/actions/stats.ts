"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getStats = unstable_cache(async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [residentsCount, adminCount, activitiesCount, recentAcitvity] =
    await Promise.all([
      prisma.resident.count(),
      prisma.admin.count(),

      prisma.adminActivityLog.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      prisma.adminActivityLog.findMany({
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          admin: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      }),
    ]);

  return {
    residentsCount,
    adminCount,
    activitiesCount,
    recentAcitvity,
  };
});
