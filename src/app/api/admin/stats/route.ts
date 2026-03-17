import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalBookings, totalRooms, totalUsers, totalRevenue, recentBookings, monthlyBookings] =
      await Promise.all([
        prisma.booking.count(),
        prisma.room.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.booking.aggregate({
          _sum: { totalPrice: true },
          where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        }),
        prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            room: { select: { name: true } },
          },
        }),
        prisma.booking.groupBy({
          by: ["createdAt"],
          _sum: { totalPrice: true },
          _count: true,
          where: {
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    // Calculate occupancy rate
    const activeBookings = await prisma.booking.count({
      where: {
        status: "CONFIRMED",
        checkIn: { lte: new Date() },
        checkOut: { gte: new Date() },
      },
    });
    const occupancyRate = totalRooms > 0 ? (activeBookings / totalRooms) * 100 : 0;

    return NextResponse.json({
      totalBookings,
      totalRooms,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      occupancyRate: Math.round(occupancyRate),
      recentBookings,
      monthlyBookings,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
