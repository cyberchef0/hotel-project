import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.image.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Hotel Admin",
      email: "admin@hotel.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      hashedPassword: userPassword,
      role: "USER",
      phone: "+1-555-0123",
    },
  });

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: "Deluxe Ocean Suite",
        slug: "deluxe-ocean-suite",
        description:
          "Experience unparalleled luxury in our Deluxe Ocean Suite, featuring panoramic views of the turquoise waters. This spacious suite includes a king-size bed with premium linens, a private balcony, marble bathroom with rain shower and soaking tub, and a cozy living area. Perfect for couples seeking a romantic retreat or travelers who appreciate the finer things in life.",
        shortDescription:
          "Panoramic ocean views, king bed, private balcony, and marble bathroom.",
        type: "Suite",
        price: 450,
        capacity: 2,
        size: 65,
        amenities: JSON.parse(
          '["Ocean View","King Bed","Private Balcony","Rain Shower","Soaking Tub","Mini Bar","Smart TV","WiFi","Room Service","Safe"]'
        ),
        featured: true,
      },
    }),
    prisma.room.create({
      data: {
        name: "Premium King Room",
        slug: "premium-king-room",
        description:
          "Our Premium King Room offers a perfect blend of comfort and elegance. Featuring a plush king-size bed, modern furnishings, and a spacious work area. The room includes a luxurious bathroom with walk-in shower, premium amenities, and city views from large windows.",
        shortDescription:
          "Elegant king room with city views and modern amenities.",
        type: "King",
        price: 280,
        capacity: 2,
        size: 42,
        amenities: JSON.parse(
          '["City View","King Bed","Work Desk","Walk-in Shower","Smart TV","WiFi","Mini Bar","Coffee Maker","Safe"]'
        ),
        featured: true,
      },
    }),
    prisma.room.create({
      data: {
        name: "Family Grand Suite",
        slug: "family-grand-suite",
        description:
          "Designed for families seeking space and comfort, our Family Grand Suite features two bedrooms, a spacious living area, and a kitchenette. The master bedroom has a king bed while the second bedroom offers twin beds. Includes a private terrace with garden views and kid-friendly amenities.",
        shortDescription:
          "Two-bedroom suite with kitchenette and private terrace for families.",
        type: "Family",
        price: 520,
        capacity: 4,
        size: 85,
        amenities: JSON.parse(
          '["Garden View","King Bed","Twin Beds","Kitchenette","Private Terrace","Smart TV","WiFi","Mini Bar","Washer","Safe","Kids Amenities"]'
        ),
        featured: true,
      },
    }),
    prisma.room.create({
      data: {
        name: "Executive Business Room",
        slug: "executive-business-room",
        description:
          "Tailored for the modern business traveler, our Executive Room features a dedicated workspace, high-speed internet, and ergonomic furniture. Enjoy complimentary access to the executive lounge, meeting rooms, and business center. The room includes a comfortable queen bed and a sleek modern bathroom.",
        shortDescription:
          "Modern business room with dedicated workspace and lounge access.",
        type: "Executive",
        price: 320,
        capacity: 2,
        size: 38,
        amenities: JSON.parse(
          '["Workspace","Queen Bed","Ergonomic Chair","High-Speed WiFi","Smart TV","Lounge Access","Coffee Maker","Iron","Safe"]'
        ),
        featured: false,
      },
    }),
    prisma.room.create({
      data: {
        name: "Honeymoon Paradise Suite",
        slug: "honeymoon-paradise-suite",
        description:
          "Celebrate your love in our enchanting Honeymoon Paradise Suite. This romantic retreat features a four-poster king bed draped with sheer curtains, a private jacuzzi on the balcony overlooking the ocean, rose petal turndown service, and champagne on arrival. Every detail is designed to create unforgettable moments.",
        shortDescription:
          "Romantic suite with private jacuzzi, ocean views, and champagne.",
        type: "Suite",
        price: 680,
        capacity: 2,
        size: 72,
        amenities: JSON.parse(
          '["Ocean View","Four-Poster King Bed","Private Jacuzzi","Balcony","Champagne","Rose Petals","Rain Shower","Smart TV","WiFi","Room Service","Safe"]'
        ),
        featured: true,
      },
    }),
    prisma.room.create({
      data: {
        name: "Standard Twin Room",
        slug: "standard-twin-room",
        description:
          "Our Standard Twin Room offers comfortable accommodation with two single beds, ideal for friends traveling together or solo travelers seeking extra space. The room features a clean modern design with all essential amenities for a pleasant stay.",
        shortDescription:
          "Comfortable twin room with modern design and essential amenities.",
        type: "Standard",
        price: 150,
        capacity: 2,
        size: 30,
        amenities: JSON.parse(
          '["Twin Beds","Shower","Smart TV","WiFi","Coffee Maker","Safe"]'
        ),
        featured: false,
      },
    }),
    prisma.room.create({
      data: {
        name: "Presidential Penthouse",
        slug: "presidential-penthouse",
        description:
          "The crown jewel of our hotel, the Presidential Penthouse spans the entire top floor. This extraordinary suite features a master bedroom with panoramic views, a grand living room, private dining area, full kitchen, personal butler service, and a wraparound terrace. An experience reserved for the most discerning guests.",
        shortDescription:
          "Top-floor penthouse with panoramic views and butler service.",
        type: "Penthouse",
        price: 1200,
        capacity: 4,
        size: 150,
        amenities: JSON.parse(
          '["Panoramic View","King Bed","Living Room","Dining Area","Full Kitchen","Butler Service","Wraparound Terrace","Jacuzzi","Smart Home","WiFi","Room Service","Private Elevator","Safe"]'
        ),
        featured: true,
      },
    }),
    prisma.room.create({
      data: {
        name: "Garden View Double",
        slug: "garden-view-double",
        description:
          "Wake up to serene garden views in our beautifully appointed Garden View Double Room. Featuring a comfortable double bed, elegant décor, and a reading nook by the window. The room offers a tranquil escape with easy access to the hotel gardens and pool area.",
        shortDescription:
          "Tranquil garden-view room with double bed and reading nook.",
        type: "Double",
        price: 200,
        capacity: 2,
        size: 35,
        amenities: JSON.parse(
          '["Garden View","Double Bed","Reading Nook","Shower","Smart TV","WiFi","Mini Bar","Safe"]'
        ),
        featured: false,
      },
    }),
  ]);

  // Create images for rooms
  const roomImages = [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    "https://images.unsplash.com/photo-1590490360182-c33d955c4644?w=800",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
  ];

  for (let i = 0; i < rooms.length; i++) {
    await prisma.image.create({
      data: {
        url: roomImages[i],
        alt: rooms[i].name,
        category: "ROOM",
        roomId: rooms[i].id,
      },
    });
    // Add a second image for each room
    await prisma.image.create({
      data: {
        url: roomImages[(i + 1) % roomImages.length],
        alt: `${rooms[i].name} - view 2`,
        category: "ROOM",
        roomId: rooms[i].id,
      },
    });
  }

  // Create gallery images
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", category: "LOBBY" as const, alt: "Hotel Grand Lobby" },
    { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", category: "LOBBY" as const, alt: "Lobby Seating Area" },
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", category: "RESTAURANT" as const, alt: "Fine Dining Restaurant" },
    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", category: "RESTAURANT" as const, alt: "Gourmet Cuisine" },
    { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", category: "EXTERIOR" as const, alt: "Hotel Exterior at Sunset" },
    { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", category: "EXTERIOR" as const, alt: "Hotel Pool Area" },
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800", category: "AMENITY" as const, alt: "Spa Treatment Room" },
    { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", category: "AMENITY" as const, alt: "Hotel Infinity Pool" },
  ];

  for (const img of galleryImages) {
    await prisma.image.create({
      data: img,
    });
  }

  // Create reviews
  const reviewData = [
    { roomId: rooms[0].id, rating: 5, comment: "Absolutely breathtaking views and the room was immaculate. The staff went above and beyond to make our stay special. Will definitely return!" },
    { roomId: rooms[0].id, rating: 4, comment: "Beautiful suite with amazing ocean views. The bathroom was luxurious. Only minor issue was the AC was a bit noisy at night." },
    { roomId: rooms[1].id, rating: 5, comment: "Perfect room for a business trip. Very comfortable bed and the workspace was excellent. The city views were a bonus!" },
    { roomId: rooms[2].id, rating: 5, comment: "Our family loved the spacious suite. The kids had their own room and the kitchenette was very convenient. Great family hotel!" },
    { roomId: rooms[4].id, rating: 5, comment: "We chose this for our honeymoon and it exceeded all expectations. The private jacuzzi with ocean views was magical. Truly romantic!" },
    { roomId: rooms[6].id, rating: 5, comment: "The Presidential Penthouse is in a league of its own. The butler service, the views, the space - everything was absolutely perfect." },
  ];

  for (const review of reviewData) {
    await prisma.review.create({
      data: {
        userId: user.id,
        roomId: review.roomId,
        rating: review.rating,
        comment: review.comment,
        approved: true,
      },
    });
  }

  // Create sample bookings
  const now = new Date();
  await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: rooms[0].id,
      checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
      guests: 2,
      totalPrice: 1350,
      status: "CONFIRMED",
    },
  });

  await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: rooms[2].id,
      checkIn: new Date(now.getFullYear(), now.getMonth() - 1, 10),
      checkOut: new Date(now.getFullYear(), now.getMonth() - 1, 14),
      guests: 4,
      totalPrice: 2080,
      status: "COMPLETED",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   Admin: admin@hotel.com / admin123`);
  console.log(`   User:  john@example.com / user123`);
  console.log(`   Rooms: ${rooms.length} rooms created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
