export interface DigitalDownload {
  productName: string;
  downloadUrl: string;
}

export interface EmailData {
  productsList: string;
  amountTotal: number;
  currency: string;
  websiteUrl: string;
  logoUrl: string;
  language?: "en" | "ro";
  digitalDownloads?: DigitalDownload[]; // Lista de produse digitale cu link-uri de download
}

export function generateOrderConfirmationEmail(data: EmailData) {
  const lang = data.language || "en";
  const isRomanian = lang === "ro";

  const translations = {
    en: {
      subject: "Thank you for your purchase! 🎉",
      thankYou: "Thank You!",
      orderConfirmed: "Your order has been confirmed",
      orderConfirmation: "Order Confirmation 🎉",
      thankYouMessage: "Thank you for your purchase! We're excited to share our digital products with you.",
      orderDetails: "Order Details:",
      total: "Total:",
      whatsNext: "What's Next?",
      nextMessage: "You will receive your digital products via email shortly. If you have any questions or need assistance, please don't hesitate to contact us.",
      digitalDownloads: "Download Your Digital Products:",
      downloadButton: "Download Now",
      continueShopping: "Continue Shopping",
      appreciate: "We appreciate your business and look forward to serving you again!",
      bestRegards: "Best regards,",
      team: "The Zoomout Crew Team",
      companyDesc: "Professional Aerial Footage & Cinematography Services",
      website: "Website",
      contact: "Contact",
      rightsReserved: "All rights reserved.",
      textHeader: "Thank You for Your Purchase!",
      textOrderConfirmed: "Your order has been confirmed.",
      textOrderDetails: "Order Details:",
      textTotal: "Total:",
      textMessage: "You will receive your digital products via email shortly. If you have any questions or need assistance, please don't hesitate to contact us.",
      textVisit: "Visit our website:",
    },
    ro: {
      subject: "Mulțumim pentru comandă! 🎉",
      thankYou: "Mulțumim!",
      orderConfirmed: "Comanda ta a fost confirmată",
      orderConfirmation: "Confirmare Comandă 🎉",
      thankYouMessage: "Mulțumim pentru comandă! Suntem încântați să îți împărtășim produsele noastre digitale.",
      orderDetails: "Detalii Comandă:",
      total: "Total:",
      whatsNext: "Ce urmează?",
      nextMessage: "Vei primi produsele digitale prin email în scurt timp. Dacă ai întrebări sau ai nevoie de asistență, nu ezita să ne contactezi.",
      digitalDownloads: "Descarcă Produsele Tale Digitale:",
      downloadButton: "Descarcă Acum",
      continueShopping: "Continuă Cumpărăturile",
      appreciate: "Apreciem afacerea ta și așteptăm cu nerăbdare să te servim din nou!",
      bestRegards: "Cu respect,",
      team: "Echipa Zoomout Crew",
      companyDesc: "Servicii Profesionale de Filmare Aeriană și Cinematografie",
      website: "Website",
      contact: "Contact",
      rightsReserved: "Toate drepturile rezervate.",
      textHeader: "Mulțumim pentru Comandă!",
      textOrderConfirmed: "Comanda ta a fost confirmată.",
      textOrderDetails: "Detalii Comandă:",
      textTotal: "Total:",
      textMessage: "Vei primi produsele digitale prin email în scurt timp. Dacă ai întrebări sau ai nevoie de asistență, nu ezita să ne contactezi.",
      textVisit: "Vizitează site-ul nostru:",
    },
  };

  const t = translations[lang];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center;">
                  <img src="${data.logoUrl}" alt="Zoomout Crew" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${t.thankYou}</h1>
                  <p style="color: #b0b0b0; margin: 10px 0 0 0; font-size: 16px;">${t.orderConfirmed}</p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3;">
                    ${t.orderConfirmation}
                  </h2>
                  
                  <p style="color: #d0d0d0; line-height: 1.8; margin: 0 0 25px 0; font-size: 16px;">
                    ${t.thankYouMessage}
                  </p>
                  
                  <div style="background-color: #252525; border-left: 4px solid #ffffff; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">${t.orderDetails}</p>
                    <div style="color: #d0d0d0; line-height: 2; margin: 0; font-size: 15px;">
                      ${data.productsList}
                    </div>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
                      <p style="color: #ffffff; font-weight: 600; margin: 0; font-size: 18px;">
                        ${t.total} ${(data.amountTotal / 100).toFixed(2)} ${data.currency}
                      </p>
                    </div>
                  </div>
                  
                  ${data.digitalDownloads && data.digitalDownloads.length > 0 ? `
                  <div style="background-color: #252525; border-left: 4px solid #4CAF50; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">${t.digitalDownloads}</p>
                    ${data.digitalDownloads.map(download => `
                      <div style="margin-bottom: 15px; padding: 15px; background-color: #1a1a1a; border-radius: 8px;">
                        <p style="color: #ffffff; font-weight: 500; margin: 0 0 10px 0; font-size: 16px;">${download.productName}</p>
                        <a href="${download.downloadUrl}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; transition: all 0.3s ease;">${t.downloadButton}</a>
                      </div>
                    `).join('')}
                  </div>
                  ` : `
                  <div style="background-color: #252525; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">${t.whatsNext}</p>
                    <p style="color: #d0d0d0; line-height: 1.8; margin: 0; font-size: 15px;">
                      ${t.nextMessage}
                    </p>
                  </div>
                  `}
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${data.websiteUrl}/shop" style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s ease;">${t.continueShopping}</a>
                  </div>
                  
                  <p style="color: #d0d0d0; line-height: 1.8; margin: 30px 0 0 0; font-size: 16px;">
                    ${t.appreciate}
                  </p>
                  
                  <p style="color: #ffffff; line-height: 1.8; margin: 25px 0 0 0; font-size: 16px;">
                    ${t.bestRegards}<br>
                    <strong style="color: #ffffff; font-size: 18px;">${t.team}</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #151515; padding: 30px; border-top: 1px solid #2a2a2a;">
                  <div style="text-align: center; color: #808080; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 0 0 15px 0;">
                      <strong style="color: #ffffff; font-size: 16px;">Zoomout Crew</strong><br>
                      <span style="color: #b0b0b0;">${t.companyDesc}</span>
                    </p>
                    <p style="margin: 15px 0;">
                      <a href="${data.websiteUrl}" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 500;">${t.website}</a> | 
                      <a href="mailto:contact@zoomoutcrew.com" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 500;">${t.contact}</a>
                    </p>
                    <p style="margin: 20px 0 0 0; font-size: 12px; color: #606060;">
                      © ${new Date().getFullYear()} Zoomout Crew. ${t.rightsReserved}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
${t.textHeader}

${t.textOrderConfirmed}

${t.textOrderDetails}
${data.productsList.replace(/<br>/g, "\n").replace(/•/g, "•")}

${t.textTotal} ${(data.amountTotal / 100).toFixed(2)} ${data.currency}

${data.digitalDownloads && data.digitalDownloads.length > 0 ? `
${t.digitalDownloads}

${data.digitalDownloads.map(download => `${download.productName}: ${download.downloadUrl}`).join('\n')}
` : t.textMessage}

${t.textVisit} ${data.websiteUrl}

${t.bestRegards}
${t.team}
  `;

  return {
    subject: t.subject,
    html,
    text: text.trim(),
  };
}
