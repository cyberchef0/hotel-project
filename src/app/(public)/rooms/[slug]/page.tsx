import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageSlider from "@/components/rooms/ImageSlider";
import BookingForm from "@/components/booking/BookingForm";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewCard from "@/components/reviews/ReviewCard";
import { HiStar, HiOutlineUsers, HiOutlineViewGrid } from "react-icons/hi";
import { MdCheckCircle } from "react-icons/md";

async function getRoom(slug: string) {
  const room = await prisma.room.findUnique({
    where: { slug },
    include: {
      images: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return room;
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await getRoom(slug);

  if (!room) notFound();

  const avgRating =
    room.reviews.length > 0
      ? room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length
      : 0;

  const amenities = room.amenities as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image Slider */}
        <ImageSlider images={room.images} />

        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Details */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                  {room.type}
                </span>
                {avgRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <HiStar className="w-5 h-5 text-amber-400" />
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">
                      ({room.reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                {room.name}
              </h1>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100">
                <HiOutlineUsers className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Capacity</p>
                  <p className="font-semibold">{room.capacity} Guests</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100">
                <HiOutlineViewGrid className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Room Size</p>
                  <p className="font-semibold">{room.size} m²</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-100"
                  >
                    <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Guest Reviews
              </h2>
              {room.reviews.length > 0 ? (
                <div className="space-y-4">
                  {room.reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={{
                        ...review,
                        createdAt: review.createdAt.toISOString(),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              )}

              <div className="mt-8">
                <ReviewForm roomId={room.id} />
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-28">
              <BookingForm room={room} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
