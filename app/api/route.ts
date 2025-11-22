import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  console.log("📩 New message:", { name, email, message });

  // aici poți conecta un serviciu real: email (Resend, Nodemailer, SendGrid etc.)
  return NextResponse.json({ success: true });
}