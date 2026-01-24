import { jsPDF } from "jspdf";
import { IOrderItem } from "./models/Order";

export interface RevolutReceiptData {
  orderId: string;
  revolutPublicId?: string;
  customerEmail: string;
  items: IOrderItem[];
  amountCurrencyMinor: number; // Revolut amount in minor units
  currency: string; // ISO 4217
  state: string;
  createdAt?: string;
  language?: "en" | "ro";
  payment?: {
    id?: string;
    state?: string;
    createdAt?: string;
    paymentMethodType?: string;
    cardBrand?: string;
    cardLastFour?: string;
    cardCountryCode?: string;
    authorisationCode?: string;
    arn?: string;
  };
}

export function generateRevolutReceiptPDF(data: RevolutReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const lang = data.language || "en";
      const t =
        lang === "ro"
          ? {
              title: "BON (Revolut) / DOVADĂ PLATĂ",
              subtitle: "Generat automat pe baza detaliilor tranzacției Revolut.",
              orderNumber: "Comandă (Order ID)",
              revolutId: "Revolut public ID",
              status: "Status",
              date: "Dată",
              customerEmail: "Email client",
              payment: "Plată",
              paymentId: "Payment ID",
              paymentStatus: "Status plată",
              paymentMethod: "Metodă",
              card: "Card",
              authCode: "Cod autorizare",
              arn: "ARN",
              items: "Produse",
              qty: "Cant.",
              price: "Preț (RON)",
              total: "Total",
              note:
                "Notă: Acest document este o dovadă de plată generată din datele Revolut și nu reprezintă bon fiscal emis de un aparat de marcat.",
            }
          : {
              title: "RECEIPT (Revolut) / PAYMENT CONFIRMATION",
              subtitle: "Auto-generated from Revolut transaction details.",
              orderNumber: "Order ID",
              revolutId: "Revolut public ID",
              status: "Status",
              date: "Date",
              customerEmail: "Customer email",
              payment: "Payment",
              paymentId: "Payment ID",
              paymentStatus: "Payment status",
              paymentMethod: "Method",
              card: "Card",
              authCode: "Authorisation code",
              arn: "ARN",
              items: "Items",
              qty: "Qty",
              price: "Price (RON)",
              total: "Total",
              note:
                "Note: This is a payment confirmation generated from Revolut data and is not a fiscal receipt issued by a cash register.",
            };

      const amountMajor = (data.amountCurrencyMinor || 0) / 100;
      const currency = (data.currency || "RON").toUpperCase();

      // Header
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(t.title, 105, 16, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(t.subtitle, 105, 24, { align: "center" });

      doc.setTextColor(20, 20, 20);
      doc.setFontSize(10);

      let y = 44;

      // Order info block
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(15, y - 6, 180, 34, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.text(`${t.orderNumber}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(data.orderId, 80, y);
      y += 7;

      if (data.revolutPublicId) {
        doc.setFont("helvetica", "bold");
        doc.text(`${t.revolutId}:`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(data.revolutPublicId), 80, y);
        y += 7;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${t.status}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(data.state || "UNKNOWN"), 80, y);
      y += 7;

      const displayDate = data.createdAt || data.payment?.createdAt || "";
      if (displayDate) {
        doc.setFont("helvetica", "bold");
        doc.text(`${t.date}:`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(displayDate, 80, y);
        y += 7;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${t.customerEmail}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(data.customerEmail || ""), 80, y);
      y += 12;

      // Payment block
      doc.setFont("helvetica", "bold");
      doc.text(t.payment, 15, y);
      y += 6;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(15, y, 195, y);
      y += 7;

      const paymentLines: Array<[string, string]> = [
        [t.paymentId, data.payment?.id ? String(data.payment.id) : "-"],
        [t.paymentStatus, data.payment?.state ? String(data.payment.state) : "-"],
        [t.paymentMethod, data.payment?.paymentMethodType ? String(data.payment.paymentMethodType) : "-"],
      ];

      const cardBits = [
        data.payment?.cardBrand ? String(data.payment.cardBrand) : null,
        data.payment?.cardLastFour ? `•••• ${data.payment.cardLastFour}` : null,
        data.payment?.cardCountryCode ? String(data.payment.cardCountryCode) : null,
      ].filter(Boolean);
      paymentLines.push([t.card, cardBits.length ? cardBits.join(" ") : "-"]);
      paymentLines.push([t.authCode, data.payment?.authorisationCode ? String(data.payment.authorisationCode) : "-"]);
      paymentLines.push([t.arn, data.payment?.arn ? String(data.payment.arn) : "-"]);

      doc.setFontSize(9);
      paymentLines.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${k}:`, 20, y);
        doc.setFont("helvetica", "normal");
        const wrapped = doc.splitTextToSize(v, 120);
        doc.text(wrapped, 80, y);
        y += Math.max(5, wrapped.length * 4.5);
      });

      y += 6;

      // Items table (simple)
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(t.items, 15, y);
      y += 7;

      doc.setFillColor(20, 20, 20);
      doc.rect(15, y - 5, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(lang === "ro" ? "Produs" : "Item", 20, y);
      doc.text(t.qty, 150, y, { align: "center" });
      doc.text(t.price, 190, y, { align: "right" });
      y += 10;

      doc.setTextColor(20, 20, 20);
      doc.setFont("helvetica", "normal");
      let row = 0;
      data.items.forEach((it) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        if (row % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, y - 5, 180, 8, "F");
        }
        const nameLines = doc.splitTextToSize(String(it.name || "Item"), 115);
        doc.text(nameLines, 20, y);
        doc.text(String(it.quantity || 1), 150, y, { align: "center" });
        doc.text(`${Number(it.price || 0).toFixed(2)} RON`, 190, y, { align: "right" });
        y += Math.max(8, nameLines.length * 4.5) + 2;
        row += 1;
      });

      y += 4;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(15, y, 195, y);
      y += 10;

      // Total
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${t.total}: ${amountMajor.toFixed(2)} ${currency}`, 105, y, { align: "center" });
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      const noteLines = doc.splitTextToSize(t.note, 170);
      doc.text(noteLines, 105, y, { align: "center" });

      const pdfOutput = doc.output("arraybuffer");
      resolve(Buffer.from(pdfOutput));
    } catch (error) {
      reject(error);
    }
  });
}

