import Image from "next/image";
import { MdSpa, MdPool, MdRestaurant, MdFitnessCenter, MdLocalLaundryService, MdSecurity } from "react-icons/md";

export default function AboutPage() {
  const facilities = [
    { icon: MdSpa, name: "Luxury Spa", desc: "Rejuvenate with our award-winning treatments" },
    { icon: MdPool, name: "Infinity Pool", desc: "Swim with panoramic ocean views" },
    { icon: MdRestaurant, name: "Fine Dining", desc: "Three world-class restaurants" },
    { icon: MdFitnessCenter, name: "Fitness Center", desc: "State-of-the-art equipment" },
    { icon: MdLocalLaundryService, name: "Concierge", desc: "24/7 personalized service" },
    { icon: MdSecurity, name: "Security", desc: "Round-the-clock safety" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920"
          alt="Hotel lobby"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-amber-300 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">About LuxeHotel</h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
              Since 1998
            </p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              A Legacy of Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded with a vision to redefine luxury hospitality, LuxeHotel
              has been welcoming guests for over two decades. Our commitment to
              exceptional service, elegant design, and unforgettable experiences
              has earned us recognition as one of the premier destinations in the
              world.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every corner of LuxeHotel tells a story of meticulous attention to
              detail. From our handpicked furnishings to our curated art
              collection, we believe that luxury lies in the thoughtful details
              that make your stay truly exceptional.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team of dedicated professionals is committed to anticipating
              your every need, ensuring that your experience exceeds all
              expectations.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"
              alt="Hotel lobby"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-amber-50 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Our Mission
          </p>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            Creating Extraordinary Moments
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our mission is to provide an unparalleled hospitality experience that
            blends timeless elegance with modern comfort. We strive to create a
            sanctuary where guests can escape the ordinary and immerse themselves
            in extraordinary luxury, personal service, and lasting memories.
          </p>
        </div>
      </section>

      {/* Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-amber-600 text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Facilities
          </p>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Hotel Facilities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f) => (
            <div
              key={f.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">
                {f.name}
              </h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
