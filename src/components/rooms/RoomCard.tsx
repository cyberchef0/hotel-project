"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineUsers, HiStar } from "react-icons/hi";
import { formatCurrency } from "@/lib/utils";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    type: string;
    price: number;
    capacity: number;
    images: { url: string; alt?: string | null }[];
    avgRating?: number;
    reviewCount?: number;
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const mainImage = room.images[0]?.url || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={mainImage}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-amber-700 rounded-full">
            {room.type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-sm font-bold text-white rounded-full">
            {formatCurrency(room.price)}<span className="font-normal text-xs">/night</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {room.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {room.shortDescription}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <HiOutlineUsers className="w-4 h-4" />
            <span className="text-sm">{room.capacity} Guests</span>
          </div>
          {room.avgRating && room.avgRating > 0 ? (
            <div className="flex items-center space-x-1">
              <HiStar className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">
                {room.avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({room.reviewCount})
              </span>
            </div>
          ) : null}
        </div>

        <Link
          href={`/rooms/${room.slug}`}
          className="block w-full text-center py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm hover:shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
