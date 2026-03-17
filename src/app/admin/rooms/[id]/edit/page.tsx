"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    type: "",
    price: 0,
    capacity: 2,
    size: 40,
    amenities: [] as string[],
    featured: false,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch(`/api/rooms/${params.id}`);
      if (res.ok) {
        const room = await res.json();
        setFormData({
          name: room.name,
          description: room.description,
          shortDescription: room.shortDescription,
          type: room.type,
          price: room.price,
          capacity: room.capacity,
          size: room.size,
          amenities: room.amenities || [],
          featured: room.featured,
        });
      }
      setLoading(false);
    };
    fetchRoom();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/rooms/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push("/admin/rooms");
    } catch (err) {
      console.error("Error updating room:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Edit Room</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
          <input
            type="text" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <input
            type="text" value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" maxLength={255} required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" required
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
            <input type="number" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" min={0} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
            <input type="number" value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" min={1} required />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="featured" checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 text-amber-500 rounded border-gray-300" />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured</label>
        </div>
        <div className="flex space-x-4 pt-4">
          <button type="submit" disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-8 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
