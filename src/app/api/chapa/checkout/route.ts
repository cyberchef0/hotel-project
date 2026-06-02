import { NextResponse } from "next/server";
import { initializeChapaTransaction } from "@/lib/chapa";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, amount, guestEmail, guestName, guestPhone } = body;

    const [first_name, ...lastNames] = guestName ? guestName.split(" ") : ["Guest", ""];
    const last_name = lastNames.length > 0 ? lastNames.join(" ") : "User";
    
    // Fallback to localhost if deployed environment isn't set yet
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log("CHAPA CHECKOUT INIT:", { bookingId, amount, guestEmail, guestName });

    const chapaRes = await initializeChapaTransaction({
      amount: amount.toString(),
      currency: "ETB",
      email: guestEmail || "hotelguest@example.com",
      first_name: first_name || "Guest",
      last_name: last_name,
      phone_number: guestPhone || "",
      tx_ref: `tx-${bookingId}`,
      callback_url: `${baseUrl}/api/chapa/webhook`, // webhook for backend validation
      return_url: `${baseUrl}/dashboard/bookings?success=true`, // where the user returns
      customization: {
        title: "LuxeHotel Booking",
        description: `Payment for Room Booking`
      }
    });

    console.log("CHAPA RAW SUCCESS RESPONSE:", chapaRes);

    return NextResponse.json({ checkoutUrl: chapaRes.data.checkout_url });
  } catch (error: any) {
    console.error("Chapa Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
