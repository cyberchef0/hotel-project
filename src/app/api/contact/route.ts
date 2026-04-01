import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: validatedData
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error processing contact:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
