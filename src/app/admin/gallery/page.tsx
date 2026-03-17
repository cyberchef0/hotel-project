"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi";

interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  category: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? images : images.filter((i) => i.category === filter);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-500 mt-1">{images.length} images</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["ALL", "ROOM", "LOBBY", "RESTAURANT", "EXTERIOR", "AMENITY"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((image) => (
          <div key={image.id} className="relative group rounded-xl overflow-hidden">
            <div className="relative h-48">
              <Image src={image.url} alt={image.alt || ""} fill className="object-cover" sizes="25vw" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-lg transition-opacity">
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm">
                {image.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
