import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    const bookings = await prisma.booking.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        room: { select: { name: true, slug: true, images: { take: 1 } } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const { 
      roomId, checkIn, checkOut, 
      adults = 1, children = 0,
      guestName, guestEmail, guestPhone,
      paymentMethod = "PAY_AT_HOTEL", specialRequests, arrivalTime, nationality 
    } = body;

    const totalGuests = Number(adults) + Number(children);

    // Get room price
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const conflicting = await prisma.booking.findMany({
      where: {
        roomId,
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [{ checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } }],
      },
    });

    if (conflicting.length > 0) {
      return NextResponse.json({ error: "Room not available for selected dates" }, { status: 409 });
    }

    // Calculate total price
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = room.price * nights;

    const referenceNumber = "BKG-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const booking = await prisma.booking.create({
      data: {
        userId: session?.user?.id || undefined,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: totalGuests,
        adults: Number(adults),
        childrenCount: Number(children),
        totalPrice,
        status: paymentMethod === "PAY_AT_HOTEL" ? "PENDING" : "PENDING", // Webhooks will upgrade this to CONFIRMED
        paymentMethod,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        arrivalTime,
        nationality,
        referenceNumber
      },
      include: {
        room: { select: { name: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

