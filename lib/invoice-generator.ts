import { jsPDF } from "jspdf";
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
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

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

      // Set font
      doc.setFont("helvetica", "normal");
      
      // Header
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(t.invoice, 105, 30, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(t.companyName, 105, 40, { align: "center" });
      doc.setFontSize(10);
      doc.text(t.companyDesc, 105, 46, { align: "center" });
      doc.text(t.website, 105, 52, { align: "center" });
      doc.text(t.email, 105, 58, { align: "center" });

      // Order Info
      let yPos = 70;
      doc.setFontSize(10);
      doc.text(`${t.orderNumber}: ${data.orderId}`, 20, yPos);
      yPos += 7;
      doc.text(
        `${t.date}: ${data.date.toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`,
        20,
        yPos
      );
      yPos += 7;
      doc.text(`${t.customerEmail}: ${data.customerEmail}`, 20, yPos);
      yPos += 15;

      // Table Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(t.item, 20, yPos);
      doc.text(t.quantity, 150, yPos, { align: "center" });
      doc.text(t.price, 170, yPos, { align: "right" });
      doc.text(t.total, 190, yPos, { align: "right" });
      yPos += 5;

      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
      yPos += 7;

      // Items
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let subtotal = 0;

      data.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Wrap text if too long
        const itemName = doc.splitTextToSize(item.name, 120);
        doc.text(itemName, 20, yPos);
        doc.text(item.quantity.toString(), 150, yPos, { align: "center" });
        doc.text(`${item.price.toFixed(2)} RON`, 170, yPos, { align: "right" });
        doc.text(`${itemTotal.toFixed(2)} RON`, 190, yPos, { align: "right" });
        yPos += itemName.length * 5 + 2;
      });

      yPos += 3;
      // Line separator
      doc.line(20, yPos, 190, yPos);
      yPos += 7;

      // Totals
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(t.subtotal, 170, yPos, { align: "right" });
      doc.text(`${subtotal.toFixed(2)} RON`, 190, yPos, { align: "right" });
      yPos += 7;

      if (data.discountPercentage && data.discountPercentage > 0) {
        const discountAmount = subtotal * (data.discountPercentage / 100);
        doc.text(
          `${t.discount} (${data.discountPercentage}%)${data.discountCode ? ` - ${data.discountCode}` : ""}`,
          170,
          yPos,
          { align: "right" }
        );
        doc.text(`-${discountAmount.toFixed(2)} RON`, 190, yPos, { align: "right" });
        yPos += 7;
        subtotal -= discountAmount;
      }

      // Grand Total
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(t.grandTotal, 170, yPos, { align: "right" });
      doc.text(`${data.amountRON.toFixed(2)} RON`, 190, yPos, { align: "right" });
      yPos += 10;

      // Payment Info
      if (data.currency !== "RON") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
          `Paid: ${data.amountCurrency.toFixed(2)} ${data.currency}`,
          190,
          yPos,
          { align: "right" }
        );
        yPos += 10;
      }

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(t.thankYou, 105, yPos, { align: "center" });
      yPos += 10;
      doc.setFontSize(8);
      doc.text(
        `© ${new Date().getFullYear()} ${t.companyName}. All rights reserved.`,
        105,
        yPos,
        { align: "center" }
      );

      // Convert to Buffer
      const pdfOutput = doc.output("arraybuffer");
      const buffer = Buffer.from(pdfOutput);
      resolve(buffer);
    } catch (error) {
      reject(error);
    }
  });
}
