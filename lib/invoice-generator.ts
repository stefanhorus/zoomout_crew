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
          companyDescLine2: "and Ground-Level Video",
          website: "www.zoomoutcrew.com",
          email: "contact@zoomoutcrew.com",
        },
        ro: {
          invoice: "FACTURA",
          orderNumber: "Numar Comanda",
          date: "Data",
          customerEmail: "Email Client",
          item: "Produs",
          quantity: "Cant.",
          price: "Pret",
          total: "Total",
          subtotal: "Subtotal",
          discount: "Reducere",
          grandTotal: "Total General",
          thankYou: "Multumim pentru comanda!",
          companyName: "Zoomout Crew",
          companyDesc: "Servicii Profesionale de Filmare Aeriana si mai multe",
          companyDescLine2: undefined,
          website: "www.zoomoutcrew.com",
          email: "contact@zoomoutcrew.com",
        },
      };

      const t = translations[lang];

      // Color scheme
      const primaryColor = [30, 30, 30]; // Dark gray/black
      const accentColor = [100, 100, 100]; // Medium gray
      const lightGray = [245, 245, 245]; // Light gray for backgrounds
      const borderColor = [220, 220, 220]; // Light border

      // Header with colored background
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 55, "F");
      
      // Invoice title (white text on dark background) - centered
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.text(t.invoice, 105, 22, { align: "center" });
      
      // Company info (white text) - all centered
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(t.companyName, 105, 30, { align: "center" });
      doc.setFontSize(9);
      // Split long description if needed
      const descLines = doc.splitTextToSize(t.companyDesc, 180);
      let descY = 36;
      descLines.forEach((line: string) => {
        doc.text(line, 105, descY, { align: "center" });
        descY += 5;
      });
      doc.text(t.website, 105, descY, { align: "center" });
      doc.text(t.email, 105, descY + 5, { align: "center" });
      
      // Reset text color
      doc.setTextColor(...primaryColor);
      
      // Order Info section with background - centered
      let yPos = 65;
      doc.setFillColor(...lightGray);
      doc.roundedRect(15, yPos - 5, 180, 28, 3, 3, "F");
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...primaryColor);
      doc.text(`${t.orderNumber}:`, 105, yPos, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(data.orderId, 105, yPos + 6, { align: "center" });
      
      yPos += 12;
      doc.setFont("helvetica", "normal");
      doc.text(`${t.date}:`, 105, yPos, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(
        data.date.toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        105,
        yPos + 6,
        { align: "center" }
      );
      
      yPos += 12;
      doc.setFont("helvetica", "normal");
      doc.text(`${t.customerEmail}:`, 105, yPos, { align: "center" });
      doc.setFont("helvetica", "bold");
      const emailText = doc.splitTextToSize(data.customerEmail, 150);
      doc.text(emailText, 105, yPos + 6, { align: "center" });
      yPos += emailText.length * 5 + 12;

      // Table Header with colored background
      doc.setFillColor(...primaryColor);
      doc.roundedRect(15, yPos - 6, 180, 8, 2, 2, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(t.item, 20, yPos);
      doc.text(t.quantity, 150, yPos, { align: "center" });
      doc.text(t.price, 170, yPos, { align: "right" });
      doc.text(t.total, 190, yPos, { align: "right" });
      yPos += 10;

      // Items with alternating row colors
      doc.setTextColor(...primaryColor);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let subtotal = 0;
      let rowIndex = 0;

      data.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Alternating row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, yPos - 5, 180, 8, "F");
        }

        // Wrap text if too long
        const itemName = doc.splitTextToSize(item.name, 120);
        doc.setTextColor(...primaryColor);
        doc.text(itemName, 20, yPos);
        doc.text(item.quantity.toString(), 150, yPos, { align: "center" });
        doc.text(`${item.price.toFixed(2)} RON`, 170, yPos, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(`${itemTotal.toFixed(2)} RON`, 190, yPos, { align: "right" });
        doc.setFont("helvetica", "normal");
        yPos += Math.max(itemName.length * 5, 8) + 2;
        rowIndex++;
      });

      yPos += 5;
      // Thick separator line
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.line(15, yPos, 195, yPos);
      yPos += 10;

      // Totals section
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...accentColor);
      doc.text(t.subtotal, 170, yPos, { align: "right" });
      doc.setTextColor(...primaryColor);
      doc.setFont("helvetica", "bold");
      doc.text(`${subtotal.toFixed(2)} RON`, 190, yPos, { align: "right" });
      yPos += 8;

      if (data.discountPercentage && data.discountPercentage > 0) {
        const discountAmount = subtotal * (data.discountPercentage / 100);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...accentColor);
        doc.text(
          `${t.discount} (${data.discountPercentage}%)${data.discountCode ? ` - ${data.discountCode}` : ""}`,
          170,
          yPos,
          { align: "right" }
        );
        doc.setTextColor(200, 50, 50); // Red for discount
        doc.setFont("helvetica", "bold");
        doc.text(`-${discountAmount.toFixed(2)} RON`, 190, yPos, { align: "right" });
        yPos += 8;
        subtotal -= discountAmount;
      }

      // Grand Total with highlighted background - fixed positioning
      yPos += 5; // Add space before total
      
      // Draw background first
      doc.setFillColor(...primaryColor);
      const totalBoxY = yPos - 4;
      const totalBoxHeight = 16;
      doc.roundedRect(80, totalBoxY, 110, totalBoxHeight, 4, 4, "F");
      
      // Then write text on top
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(t.grandTotal, 105, totalBoxY + 6, { align: "center" });
      
      doc.setFontSize(16);
      doc.text(`${data.amountRON.toFixed(2)} RON`, 105, totalBoxY + 12, { align: "center" });
      
      yPos = totalBoxY + totalBoxHeight + 5;

      // Payment Info - centered
      if (data.currency !== "RON") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...accentColor);
        doc.text(
          `Paid: ${data.amountCurrency.toFixed(2)} ${data.currency}`,
          105,
          yPos,
          { align: "center" }
        );
        yPos += 10;
      }

      // Footer with decorative line
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.3);
      doc.line(15, yPos, 195, yPos);
      yPos += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont("helvetica", "bold");
      doc.text(t.thankYou, 105, yPos, { align: "center" });
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...accentColor);
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
