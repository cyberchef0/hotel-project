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
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("ROOM");

  const fetchImages = () => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
      
      if (uploadRes.ok) {
        const { url, publicId } = await uploadRes.json();
        const saveRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, publicId, category: uploadCategory }),
        });
        if (saveRes.ok) {
          setFile(null);
          const fileInput = document.getElementById("file-upload") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
          fetchImages();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end mb-6">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
            required
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
          >
            {["ROOM", "LOBBY", "RESTAURANT", "EXTERIOR", "AMENITY"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full md:w-auto px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

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
              <button aria-label={`Delete ${image.category} image`} onClick={() => handleDelete(image.id)} className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-lg transition-opacity">
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
