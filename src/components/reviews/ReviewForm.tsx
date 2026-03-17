"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { HiStar } from "react-icons/hi";

interface ReviewFormProps {
  roomId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ roomId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, rating, comment }),
      });

      if (res.ok) {
        setSuccess(true);
        setRating(0);
        setComment("");
        onReviewSubmitted?.();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-green-700 font-medium">
          Thank you! Your review will be visible after approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-serif font-bold text-gray-900">Leave a Review</h3>

      {/* Star Rating */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <HiStar
              className={`w-8 h-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-amber-400"
                  : "text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
        required
        minLength={10}
      />

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
