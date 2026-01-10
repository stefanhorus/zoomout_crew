import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyAdminCredentials } from "@/lib/admin-users";

export async function GET(request: NextRequest) {
  try {
    // Verifică autentificarea cu username și parolă
    const username = request.headers.get("x-admin-username");
    const password = request.headers.get("x-admin-password");
    
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 401 }
      );
    }

    // Verifică credențialele
    const isValid = await verifyAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verifică dacă avem cheile necesare
    if (!process.env.STRIPE_SECRET_KEY || !process.env.REVOLUT_SECRET_KEY) {
      return NextResponse.json(
        { error: "API keys not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    // Obține comenzile din Stripe
    const stripeSessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.line_items"],
    });

    // Obține comenzile din Revolut
    const baseUrl = process.env.REVOLUT_API_URL || "https://merchant.revolut.com";
    const revolutResponse = await fetch(`${baseUrl}/api/1.0/orders`, {
      headers: {
        Authorization: `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
        "Revolut-Api-Version": "2024-05-01",
      },
    });

    let revolutOrders: any[] = [];
    if (revolutResponse.ok) {
      const revolutData = await revolutResponse.json();
      revolutOrders = Array.isArray(revolutData) ? revolutData : [];
    }

    // Rate-uri de schimb inverse (pentru conversie înapoi la RON)
    const inverseExchangeRates: Record<string, number> = {
      RON: 1,
      EUR: 5,    // 1 EUR = 5 RON
      USD: 4.545, // 1 USD = ~4.545 RON
      GBP: 5.556, // 1 GBP = ~5.556 RON
    };

    // Formatează comenzile Stripe
    // Pentru fiecare sesiune, trebuie să obținem line_items separat
    const stripeOrdersPromises = stripeSessions.data
      .filter((session) => session.payment_status === "paid")
      .map(async (session) => {
        // Obține line_items pentru fiecare sesiune
        let lineItems: Stripe.LineItem[] = [];
        if (session.line_items) {
          // Dacă line_items este deja expandat, folosește-l direct
          if (typeof session.line_items === "object" && "data" in session.line_items) {
            lineItems = session.line_items.data;
          } else {
            // Altfel, obține line_items separat
            const items = await stripe.checkout.sessions.listLineItems(session.id, {
              limit: 100,
            });
            lineItems = items.data;
          }
        } else {
          // Dacă nu există line_items, încearcă să le obținem
          const items = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 100,
          });
          lineItems = items.data;
        }

        const sessionCurrency = (session.currency || "ron").toUpperCase();
        const exchangeRate = session.metadata?.exchange_rate ? parseFloat(session.metadata.exchange_rate) : null;
        const originalCurrency = session.metadata?.original_currency || "RON";

        const items = lineItems.map((item) => {
          // Prețul item-ului este în currency-ul sesiunii
          const itemPriceInSessionCurrency = item.price?.unit_amount ? item.price.unit_amount / 100 : 0;
          
          // Convertim înapoi la RON dacă este necesar
          let itemPriceInRON = itemPriceInSessionCurrency;
          if (sessionCurrency !== "RON") {
            if (exchangeRate && originalCurrency === "RON") {
              itemPriceInRON = itemPriceInSessionCurrency / exchangeRate;
            } else if (inverseExchangeRates[sessionCurrency]) {
              itemPriceInRON = itemPriceInSessionCurrency * inverseExchangeRates[sessionCurrency];
            }
          }
          
          return {
            name: item.description || item.price?.nickname || "Product",
            quantity: item.quantity || 1,
            price: itemPriceInRON, // Returnează prețul în RON
          };
        });

        // Calculează amount în RON
        let amountInRON = 0;
        if (session.amount_total) {
          const amountInSessionCurrency = session.amount_total / 100;
          
          if (sessionCurrency === "RON") {
            amountInRON = amountInSessionCurrency;
          } else {
            if (exchangeRate && originalCurrency === "RON") {
              amountInRON = amountInSessionCurrency / exchangeRate;
            } else if (inverseExchangeRates[sessionCurrency]) {
              amountInRON = amountInSessionCurrency * inverseExchangeRates[sessionCurrency];
            } else {
              amountInRON = amountInSessionCurrency;
            }
          }
        }

        return {
          id: session.id,
          provider: "stripe",
          customerEmail: session.customer_details?.email || "N/A",
          amount: amountInRON, // Totul în RON pentru consistență
          currency: sessionCurrency, // Păstrăm currency-ul original pentru afișare
          originalCurrency: originalCurrency,
          status: session.payment_status,
          createdAt: new Date(session.created * 1000).toISOString(),
          items,
        };
      });

    // Așteaptă toate comenzile Stripe să fie procesate
    const stripeOrders = await Promise.all(stripeOrdersPromises);

    // Formatează comenzile Revolut
    const formattedRevolutOrders = await Promise.all(
      revolutOrders
        .filter((order: any) => order.state === "COMPLETED" || order.state === "AUTHORISED")
        .map(async (order: any) => {
          // Obține detaliile complete ale comenzii
          const orderDetailResponse = await fetch(
            `${baseUrl}/api/1.0/orders/${order.id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
                "Revolut-Api-Version": "2024-05-01",
              },
            }
          );

          if (orderDetailResponse.ok) {
            const orderDetail = await orderDetailResponse.json();
            
            // Rate-uri de schimb inverse (pentru conversie înapoi la RON)
            // Dacă 1 RON = 0.2 EUR, atunci 1 EUR = 5 RON
            const inverseExchangeRates: Record<string, number> = {
              RON: 1,
              EUR: 5,    // 1 EUR = 5 RON (1 / 0.2)
              USD: 4.545, // 1 USD = ~4.545 RON (1 / 0.22)
              GBP: 5.556, // 1 GBP = ~5.556 RON (1 / 0.18)
            };
            
            // Obține currency-ul comenzii
            const orderCurrency = (orderDetail.currency || "RON").toUpperCase();
            
            // Verifică metadata pentru exchange rate (dacă există)
            const metadata = orderDetail.metadata || {};
            const exchangeRate = metadata.exchange_rate ? parseFloat(metadata.exchange_rate) : null;
            const originalCurrency = metadata.original_currency || "RON";
            
            // Calculează suma din items dacă amount nu este disponibil sau este 0
            const items = (orderDetail.items || []).map((item: any) => {
              // Prețul item-ului este în currency-ul comenzii
              const itemPriceInOrderCurrency = item.unit_price ? item.unit_price / 100 : 0;
              
              // Convertim înapoi la RON dacă este necesar
              let itemPriceInRON = itemPriceInOrderCurrency;
              if (orderCurrency !== "RON") {
                if (exchangeRate && originalCurrency === "RON") {
                  // Folosim exchange rate din metadata dacă există
                  itemPriceInRON = itemPriceInOrderCurrency / exchangeRate;
                } else if (inverseExchangeRates[orderCurrency]) {
                  // Folosim rate-urile inverse
                  itemPriceInRON = itemPriceInOrderCurrency * inverseExchangeRates[orderCurrency];
                }
              }
              
              return {
                name: item.name || "Product",
                quantity: item.quantity || 1,
                price: itemPriceInRON, // Returnează prețul în RON
              };
            });
            
            // Calculează suma totală în RON
            let calculatedAmountInRON = 0;
            if (orderDetail.amount && orderDetail.amount > 0) {
              // Amount este în currency-ul comenzii
              const amountInOrderCurrency = orderDetail.amount / 100;
              
              // Convertim înapoi la RON
              if (orderCurrency === "RON") {
                calculatedAmountInRON = amountInOrderCurrency;
              } else {
                if (exchangeRate && originalCurrency === "RON") {
                  // Folosim exchange rate din metadata dacă există
                  calculatedAmountInRON = amountInOrderCurrency / exchangeRate;
                } else if (inverseExchangeRates[orderCurrency]) {
                  // Folosim rate-urile inverse
                  calculatedAmountInRON = amountInOrderCurrency * inverseExchangeRates[orderCurrency];
                } else {
                  calculatedAmountInRON = amountInOrderCurrency;
                }
              }
            } else {
              // Calculează din items dacă amount nu este disponibil
              calculatedAmountInRON = items.reduce((sum: number, item: any) => {
                return sum + (item.price * item.quantity);
              }, 0);
              // Dacă tot nu avem sumă, folosește amount din lista inițială
              if (calculatedAmountInRON === 0 && order.amount) {
                const orderAmountInCurrency = order.amount / 100;
                if (orderCurrency === "RON") {
                  calculatedAmountInRON = orderAmountInCurrency;
                } else if (inverseExchangeRates[orderCurrency]) {
                  calculatedAmountInRON = orderAmountInCurrency * inverseExchangeRates[orderCurrency];
                } else {
                  calculatedAmountInRON = orderAmountInCurrency;
                }
              }
            }
            
            return {
              id: order.id,
              provider: "revolut",
              customerEmail: orderDetail.customer?.email || orderDetail.email || "N/A",
              amount: calculatedAmountInRON, // Totul în RON pentru consistență
              currency: orderCurrency, // Păstrăm currency-ul original pentru afișare
              originalCurrency: originalCurrency,
              status: orderDetail.state,
              createdAt: orderDetail.created_at || new Date().toISOString(),
              items,
            };
          }
          return null;
        })
    );

    // Combină și sortează comenzile după dată (cele mai recente primele)
    const allOrders = [
      ...stripeOrders,
      ...formattedRevolutOrders.filter((order) => order !== null),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      orders: allOrders,
      total: allOrders.length,
      totalAmount: allOrders.reduce((sum, order) => sum + order.amount, 0),
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

