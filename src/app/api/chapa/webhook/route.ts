import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const chapaSignature = request.headers.get("x-chapa-signature") || request.headers.get("chapa-signature");
    const secretHash = process.env.CHAPA_WEBHOOK_SECRET || "";

    const rawBody = await request.text();
    const hash = crypto.createHmac("sha256", secretHash).update(rawBody).digest("hex");

    if (hash !== chapaSignature) {
      console.error("Invalid Webhook Signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "charge.success" && payload.status === "success") {
      const tx_ref = payload.tx_ref;
      const bookingId = tx_ref.replace("tx-", "");

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          paymentId: tx_ref 
        }
      });
      console.log(`Booking ${bookingId} confirmed successfully via Chapa!`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}
