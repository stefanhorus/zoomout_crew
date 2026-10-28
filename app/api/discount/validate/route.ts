import { NextRequest, NextResponse } from "next/server";
import { validateDiscountCodes } from "@/lib/discount-codes";

// Validează codurile de reducere pe server, ca lista de coduri să nu ajungă în browser.
// Primește toate codurile care ar fi aplicate (cele existente + cel nou) și întoarce procentul fiecăruia.
export async function POST(request: NextRequest) {
  try {
    const { codes } = await request.json();

    if (!Array.isArray(codes) || codes.length === 0 || codes.some((c) => typeof c !== "string")) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const result = validateDiscountCodes(codes);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, codes: result.codes });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
}
