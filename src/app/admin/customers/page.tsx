import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-500 mt-1">{users.length} customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Phone</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Bookings</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Reviews</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-900">{user.name || "—"}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{user.phone || "—"}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{user._count.bookings}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{user._count.reviews}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
