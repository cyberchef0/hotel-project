import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: {
      _count: { select: { bookings: true, reviews: true } },
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500 mt-1">{rooms.length} rooms total</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="flex items-center space-x-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors shadow-md"
        >
          <HiOutlinePlus className="w-5 h-5" />
          <span>Add Room</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Room</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Capacity</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Bookings</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Featured</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <p className="font-medium text-gray-900">{room.name}</p>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{room.shortDescription}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {room.type}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">{formatCurrency(room.price)}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{room.capacity} guests</td>
                <td className="py-4 px-6 text-sm text-gray-600">{room._count.bookings}</td>
                <td className="py-4 px-6">
                  {room.featured ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Yes</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">No</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
