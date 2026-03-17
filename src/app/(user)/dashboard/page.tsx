import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { HiOutlineCalendar, HiOutlineCash, HiOutlineClock } from "react-icons/hi";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { room: { select: { name: true, slug: true, images: { take: 1 } } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = await prisma.booking.aggregate({
    where: { userId: session.user.id },
    _count: true,
    _sum: { totalPrice: true },
  });

  const upcomingCount = await prisma.booking.count({
    where: {
      userId: session.user.id,
      status: "CONFIRMED",
      checkIn: { gt: new Date() },
    },
  });

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <HiOutlineCalendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats._count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <HiOutlineCash className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats._sum.totalPrice || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <HiOutlineClock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900">Recent Bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-amber-600 font-medium hover:text-amber-700"
          >
            View All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No bookings yet.</p>
            <Link
              href="/rooms"
              className="px-6 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{booking.room.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
