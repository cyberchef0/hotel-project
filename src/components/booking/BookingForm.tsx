"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatCurrency, calculateNights } from "@/lib/utils";
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineCash } from "react-icons/hi";

interface BookingFormProps {
  room: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  };
}

export default function BookingForm({ room }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const nights =
    checkIn && checkOut
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0;
  const totalPrice = nights * room.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      router.push("/login");
      return;
    }

    if (nights <= 0) {
      setError("Check-out must be after check-in");
      return;
    }

    setLoading(true);

    try {
      // Check availability
      const availRes = await fetch(
        `/api/rooms/${room.id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
      );
      const availData = await availRes.json();

      if (!availData.available) {
        setError("Room is not available for selected dates");
        setLoading(false);
        return;
      }

      // Create booking
      const bookRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id, checkIn, checkOut, guests }),
      });

      if (!bookRes.ok) {
        const data = await bookRes.json();
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/bookings"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
        <p className="text-green-600">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(room.price)}
          <span className="text-base font-normal text-gray-400"> / night</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Check-in */}
        <div className="relative">
          <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
            Check-in
          </label>
        </div>

        {/* Check-out */}
        <div className="relative">
          <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split("T")[0]}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
            Check-out
          </label>
        </div>

        {/* Guests */}
        <div className="relative">
          <HiOutlineUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm appearance-none"
          >
            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
            Guests
          </label>
        </div>

        {/* Price Summary */}
        {nights > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {formatCurrency(room.price)} × {nights} night{nights > 1 ? "s" : ""}
              </span>
              <span className="text-gray-800 font-medium">{formatCurrency(totalPrice)}</span>
            </div>
            <hr className="border-amber-200" />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-amber-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !checkIn || !checkOut}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <HiOutlineCash className="w-5 h-5" />
          <span>{loading ? "Booking..." : session ? "Book Now" : "Sign in to Book"}</span>
        </button>
      </form>
    </div>
  );
}
