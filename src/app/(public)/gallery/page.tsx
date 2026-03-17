import GalleryGrid from "@/components/gallery/GalleryGrid";
import prisma from "@/lib/prisma";

async function getGalleryImages() {
  return prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Visual Tour
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Gallery
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Take a visual journey through our luxurious spaces, from elegant
            rooms to stunning amenities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GalleryGrid
          images={images}
          categories={["ALL", "ROOM", "LOBBY", "RESTAURANT", "EXTERIOR", "AMENITY"]}
        />
      </div>
    </div>
  );
}
