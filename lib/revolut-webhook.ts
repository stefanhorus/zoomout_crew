import crypto from "crypto";

// Doar comenzile în aceste stări sunt plătite (capture_mode AUTOMATIC: AUTHORISED -> COMPLETED)
export const PAID_ORDER_STATES = ["COMPLETED", "AUTHORISED"];

// Toleranța pentru timestamp-ul webhook-ului (protecție împotriva replay)
const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;

// Verifică semnătura webhook-ului Revolut
// Format Revolut: header "Revolut-Signature: v1=<hex>" (pot fi mai multe, separate prin virgulă),
// semnătura = HMAC-SHA256(secret, "v1.{Revolut-Request-Timestamp}.{raw body}")
export function verifyRevolutSignature(
  payload: string,
  signatureHeader: string,
  timestamp: string,
  secret: string,
  now: number = Date.now()
): boolean {
  try {
    const timestampMs = Number(timestamp);
    if (!Number.isFinite(timestampMs) || Math.abs(now - timestampMs) > SIGNATURE_TOLERANCE_MS) {
      console.error("❌ Revolut webhook timestamp outside tolerance:", timestamp);
      return false;
    }

    const expectedSignature = `v1=${crypto
      .createHmac("sha256", secret)
      .update(`v1.${timestamp}.${payload}`)
      .digest("hex")}`;
    const expected = Buffer.from(expectedSignature);

    return signatureHeader
      .split(",")
      .map((s) => s.trim())
      .some((candidate) => {
        const received = Buffer.from(candidate);
        return received.length === expected.length && crypto.timingSafeEqual(received, expected);
      });
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}
