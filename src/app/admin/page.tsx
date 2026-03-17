import prisma from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineUsers,
  HiOutlineTrendingUp,
} from "react-icons/hi";

export default async function AdminDashboard() {
  const [totalBookings, totalRooms, totalUsers, revenueData, recentBookings, activeBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.room.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      }),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          room: { select: { name: true } },
        },
      }),
      prisma.booking.count({
        where: {
          status: "CONFIRMED",
          checkIn: { lte: new Date() },
          checkOut: { gte: new Date() },
        },
      }),
    ]);

  const occupancyRate = totalRooms > 0 ? Math.round((activeBookings / totalRooms) * 100) : 0;

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: HiOutlineCalendar,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenueData._sum.totalPrice || 0),
      icon: HiOutlineCash,
      color: "bg-green-50 text-green-500",
    },
    {
      label: "Guests",
      value: totalUsers,
      icon: HiOutlineUsers,
      color: "bg-purple-50 text-purple-500",
    },
    {
      label: "Occupancy",
      value: `${occupancyRate}%`,
      icon: HiOutlineTrendingUp,
      color: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
          Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check-in</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check-out</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{booking.user.name}</p>
                    <p className="text-xs text-gray-400">{booking.user.email}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{booking.room.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(booking.checkIn)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(booking.checkOut)}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
