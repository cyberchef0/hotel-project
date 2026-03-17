"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineUsers } from "react-icons/hi";

export default function SearchBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("capacity", guests);
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 max-w-4xl mx-auto border border-gray-100"
    >
      {/* Check-in */}
      <div className="flex-1 flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <HiOutlineCalendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs text-gray-400 font-medium">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-gray-800 text-sm font-medium focus:outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex-1 flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <HiOutlineCalendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs text-gray-400 font-medium">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-gray-800 text-sm font-medium focus:outline-none"
            min={checkIn || new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <HiOutlineUsers className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs text-gray-400 font-medium">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-gray-800 text-sm font-medium focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
      >
        <HiOutlineSearch className="w-5 h-5" />
        <span>Search</span>
      </button>
    </form>
  );
}
