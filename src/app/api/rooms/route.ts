import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const capacity = searchParams.get("capacity");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = { available: true };

    if (type) where.type = type;
    if (featured === "true") where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }
    if (capacity) where.capacity = { gte: parseInt(capacity) };

    const rooms = await prisma.room.findMany({
      where,
      include: {
        images: true,
        reviews: { where: { approved: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const roomsWithRating = rooms.map((room) => {
      const avgRating =
        room.reviews.length > 0
          ? room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length
          : 0;
      return { ...room, avgRating, reviewCount: room.reviews.length };
    });

    return NextResponse.json(roomsWithRating);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const room = await prisma.room.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        type: body.type,
        price: body.price,
        capacity: body.capacity,
        size: body.size,
        amenities: body.amenities || [],
        featured: body.featured || false,
        images: body.images ? { create: body.images } : undefined,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
