"use client";

import { useState } from "react";
import { formatCurrency, calculateNights } from "@/lib/utils";
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineCash } from "react-icons/hi";
import GuestBookingModal from "./GuestBookingModal";

interface BookingFormProps {
  room: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  };
}

export default function BookingForm({ room }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nights =
    checkIn && checkOut
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0;
  const totalPrice = nights * room.price;

  const handleAdultsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setAdults(val);
    if (val + childrenCount > room.capacity) {
      setChildrenCount(room.capacity - val);
    }
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setChildrenCount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out must be after check-in");
      return;
    }

    if (adults + childrenCount > room.capacity) {
      setError(`This room can only accommodate up to ${room.capacity} guests.`);
      return;
    }

    setIsModalOpen(true);
  };

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

        {/* Guests - Adults */}
        <div className="relative mt-4">
          <HiOutlineUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={adults}
            onChange={handleAdultsChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm appearance-none"
          >
            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
            Adults
          </label>
        </div>

        {/* Guests - Children */}
        <div className="relative">
          <HiOutlineUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={childrenCount}
            onChange={handleChildrenChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm appearance-none"
          >
            {Array.from({ length: room.capacity - adults + 1 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
            Children (Cap: {room.capacity - adults})
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
          disabled={!checkIn || !checkOut}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <HiOutlineCash className="w-5 h-5" />
          <span>Book Now</span>
        </button>
      </form>

      <GuestBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults}
        initialChildren={childrenCount}
      />
    </div>
  );
}
