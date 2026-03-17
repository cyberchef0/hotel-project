import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // In production, send email via service like SendGrid/Resend
    console.log("Contact form submission:", validatedData);

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error processing contact:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
