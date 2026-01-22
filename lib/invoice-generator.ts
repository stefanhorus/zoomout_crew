import PDFDocument = require("pdfkit");
import { IOrderItem } from "./models/Order";

export interface InvoiceData {
  orderId: string;
  customerEmail: string;
  items: IOrderItem[];
  amountRON: number;
  amountCurrency: number;
  currency: string;
  date: Date;
  language?: "en" | "ro";
  discountPercentage?: number;
  discountCode?: string;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on("error", reject);

      const lang = data.language || "en";
      const isRomanian = lang === "ro";

      const translations = {
        en: {
          invoice: "INVOICE",
          orderNumber: "Order Number",
          date: "Date",
          customerEmail: "Customer Email",
          item: "Item",
          quantity: "Qty",
          price: "Price",
          total: "Total",
          subtotal: "Subtotal",
          discount: "Discount",
          grandTotal: "Grand Total",
          thankYou: "Thank you for your purchase!",
          companyName: "Zoomout Crew",
          companyDesc: "Professional Aerial Videography Services",
          website: "www.zoomoutcrew.com",
          email: "contact@zoomoutcrew.com",
        },
        ro: {
          invoice: "FACTURĂ",
          orderNumber: "Număr Comandă",
          date: "Data",
          customerEmail: "Email Client",
          item: "Produs",
          quantity: "Cant.",
          price: "Preț",
          total: "Total",
          subtotal: "Subtotal",
          discount: "Reducere",
          grandTotal: "Total General",
          thankYou: "Mulțumim pentru comandă!",
          companyName: "Zoomout Crew",
          companyDesc: "Servicii Profesionale de Filmare Aeriană",
          website: "www.zoomoutcrew.com",
          email: "contact@zoomoutcrew.com",
        },
      };

      const t = translations[lang];

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(t.invoice, { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(t.companyName, { align: "center" })
        .fontSize(10)
        .text(t.companyDesc, { align: "center" })
        .text(t.website, { align: "center" })
        .text(t.email, { align: "center" })
        .moveDown(1);

      // Order Info
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${t.orderNumber}: ${data.orderId}`, { continued: false })
        .text(`${t.date}: ${data.date.toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`)
        .text(`${t.customerEmail}: ${data.customerEmail}`)
        .moveDown(1);

      // Items Table Header
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(t.item, 50, doc.y, { width: 250 })
        .text(t.quantity, 300, doc.y, { width: 60, align: "center" })
        .text(t.price, 360, doc.y, { width: 80, align: "right" })
        .text(t.total, 440, doc.y, { width: 80, align: "right" })
        .moveDown(0.3);

      // Line separator
      doc
        .moveTo(50, doc.y)
        .lineTo(520, doc.y)
        .stroke()
        .moveDown(0.5);

      // Items
      doc.font("Helvetica").fontSize(9);
      let subtotal = 0;

      data.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const yPos = doc.y;
        doc
          .text(item.name, 50, yPos, { width: 250 })
          .text(item.quantity.toString(), 300, yPos, { width: 60, align: "center" })
          .text(`${item.price.toFixed(2)} RON`, 360, yPos, { width: 80, align: "right" })
          .text(`${itemTotal.toFixed(2)} RON`, 440, yPos, { width: 80, align: "right" })
          .moveDown(0.4);
      });

      // Line separator
      doc
        .moveTo(50, doc.y)
        .lineTo(520, doc.y)
        .stroke()
        .moveDown(0.5);

      // Totals
      const yPos = doc.y;
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(t.subtotal, 360, yPos, { width: 80, align: "right" })
        .text(`${subtotal.toFixed(2)} RON`, 440, yPos, { width: 80, align: "right" })
        .moveDown(0.3);

      if (data.discountPercentage && data.discountPercentage > 0) {
        const discountAmount = subtotal * (data.discountPercentage / 100);
        doc
          .text(
            `${t.discount} (${data.discountPercentage}%)${data.discountCode ? ` - ${data.discountCode}` : ""}`,
            360,
            doc.y,
            { width: 80, align: "right" }
          )
          .text(`-${discountAmount.toFixed(2)} RON`, 440, doc.y, { width: 80, align: "right" })
          .moveDown(0.3);
        subtotal -= discountAmount;
      }

      // Grand Total
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(t.grandTotal, 360, doc.y, { width: 80, align: "right" })
        .text(`${data.amountRON.toFixed(2)} RON`, 440, doc.y, { width: 80, align: "right" })
        .moveDown(1);

      // Payment Info
      if (data.currency !== "RON") {
        doc
          .font("Helvetica")
          .fontSize(9)
          .text(
            `Paid: ${data.amountCurrency.toFixed(2)} ${data.currency}`,
            { align: "right" }
          )
          .moveDown(0.5);
      }

      // Footer
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(t.thankYou, { align: "center" })
        .moveDown(0.5)
        .fontSize(8)
        .text(
          `© ${new Date().getFullYear()} ${t.companyName}. All rights reserved.`,
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
