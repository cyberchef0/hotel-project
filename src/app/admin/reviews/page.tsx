"use client";

import { useState, useEffect } from "react";
import { HiStar } from "react-icons/hi";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  user: { name?: string | null };
  room: { name: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateReview = async (id: string, approved: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-500 mt-1">{reviews.length} reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-medium text-gray-900">{review.user.name || "Guest"}</span>
                  <span className="text-sm text-gray-400">on {review.room.name}</span>
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!review.approved ? (
                  <button onClick={() => updateReview(review.id, true)}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                    Approve
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                    Approved
                  </span>
                )}
                <button onClick={() => deleteReview(review.id)}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
