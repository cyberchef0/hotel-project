"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  user: { name?: string | null; email: string };
  room: { name: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-500 mt-1">{bookings.length} bookings total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Guest</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Room</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Dates</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <p className="font-medium text-gray-900">{booking.user.name}</p>
                  <p className="text-xs text-gray-400">{booking.user.email}</p>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{booking.room.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                </td>
                <td className="py-4 px-6 font-medium">{formatCurrency(booking.totalPrice)}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {booking.status === "PENDING" && (
                      <button onClick={() => updateStatus(booking.id, "CONFIRMED")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                        Confirm
                      </button>
                    )}
                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                      <button onClick={() => updateStatus(booking.id, "CANCELLED")}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                        Cancel
                      </button>
                    )}
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
