import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { room: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
        All Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check-in</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check-out</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guests</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{booking.room.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(booking.checkIn)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatDate(booking.checkOut)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{booking.guests}</td>
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
      )}
    </div>
  );
}
