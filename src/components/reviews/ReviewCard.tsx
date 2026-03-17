import { HiStar } from "react-icons/hi";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name?: string | null; image?: string | null };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {review.user.name?.charAt(0)?.toUpperCase() || "G"}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {review.user.name || "Guest"}
            </p>
            <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <HiStar
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? "text-amber-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}
