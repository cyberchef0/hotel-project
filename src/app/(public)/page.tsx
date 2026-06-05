import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/rooms/SearchBar";
import RoomCard from "@/components/rooms/RoomCard";
import { HiStar, HiOutlineLocationMarker } from "react-icons/hi";
import {
  MdSpa,
  MdPool,
  MdRestaurant,
  MdFitnessCenter,
  MdWifi,
  MdLocalLaundryService,
} from "react-icons/md";

async function getFeaturedRooms() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/rooms?featured=true`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredRooms = await getFeaturedRooms();

  const amenities = [
    { icon: MdSpa, name: "Luxury Spa", description: "World-class treatments" },
    { icon: MdPool, name: "Infinity Pool", description: "Ocean-view pool" },
    { icon: MdRestaurant, name: "Fine Dining", description: "Michelin-star cuisine" },
    { icon: MdFitnessCenter, name: "Fitness Center", description: "State-of-the-art gym" },
    { icon: MdWifi, name: "Free WiFi", description: "High-speed everywhere" },
    { icon: MdLocalLaundryService, name: "Concierge", description: "24/7 personal service" },
  ];

  const testimonials = [
    {
      name: "Sarah & James M.",
      text: "Our honeymoon at LuxeHotel was absolutely magical. The ocean suite was breathtaking and the staff made every moment special.",
      rating: 5,
    },
    {
      name: "Robert K.",
      text: "As a frequent business traveler, LuxeHotel sets the standard. Impeccable rooms, excellent dining, and seamless service.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      text: "Our family vacation here was unforgettable. The kids loved the pool and we loved the spa. Perfect for every generation.",
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920"
          alt="Luxury hotel exterior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-amber-300 text-sm tracking-[0.3em] uppercase font-medium mb-4 animate-fade-in">
            Welcome to luxury
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-slide-up">
            Experience
            <span className="block text-amber-300">Timeless Elegance</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in">
            Discover a sanctuary of sophistication where every detail is crafted
            to perfection. Your extraordinary journey begins here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link
              href="/rooms"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Rooms
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative -mt-10 z-20 px-4">
        <SearchBar />
      </section>

      {/* Featured Rooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Our Collection
          </p>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Featured Rooms & Suites
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Each room is uniquely designed to provide an unmatched experience of
            comfort and luxury.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featuredRooms as Array<{
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
          }>).slice(0, 6).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="inline-block px-8 py-3 border-2 border-amber-500 text-amber-600 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition-all"
          >
            View All Rooms
          </Link>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
              World-Class Amenities
            </p>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {amenities.map((amenity) => (
              <div
                key={amenity.name}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:bg-amber-500 group-hover:shadow-lg transition-all">
                  <amenity.icon className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {amenity.name}
                </h3>
                <p className="text-xs text-gray-400">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Guest Reviews
          </p>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <HiStar key={i} className="w-5 h-5 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm tracking-[0.2em] uppercase font-medium mb-2">
              Gallery
            </p>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Capture the Beauty
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
              "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600",
            ].map((url, i) => (
              <div key={i} className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src={url}
                  alt="Hotel gallery"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 border-2 border-amber-400 text-amber-400 rounded-full font-semibold hover:bg-amber-400 hover:text-gray-900 transition-all"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
              Location
            </p>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
              Find Us in Paradise
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Nestled along the pristine coastline, LuxeHotel offers a perfect
              blend of natural beauty and urban convenience. Just minutes from
              the city center, our resort is your gateway to unforgettable
              experiences.
            </p>
            <div className="flex items-start space-x-3 mb-4">
              <HiOutlineLocationMarker className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">
                123 Sebeta, Ethiopia
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md mt-4"
            >
              Get Directions
            </Link>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s123+Main+St%2C+New+York%2C+NY+10001!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920"
          alt="Hotel poolside"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-800/60" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Your Dream Stay Awaits
          </h2>
          <p className="text-xl text-amber-100 mb-10">
            Book now and receive a complimentary spa treatment with your stay.
            Limited time offer.
          </p>
          <Link
            href="/rooms"
            className="inline-block px-10 py-4 bg-white text-amber-700 rounded-full font-bold text-lg hover:bg-amber-50 transition-all shadow-xl"
          >
            Book Your Stay
          </Link>
        </div>
      </section>
    </div>
  );
}
