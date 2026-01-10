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
        const metadata = session.metadata || {};
        const totalAmountRONFromMetadata = metadata.total_amount_ron ? parseFloat(metadata.total_amount_ron) : null;
        const amountInCurrency = metadata.amount_in_currency ? parseFloat(metadata.amount_in_currency) : null;
        const paymentCurrency = metadata.payment_currency || sessionCurrency;
        const exchangeRate = metadata.exchange_rate ? parseFloat(metadata.exchange_rate) : null;
        const originalCurrency = metadata.original_currency || "RON";

        const items = lineItems.map((item) => {
          const itemQuantity = item.quantity || 1; // Handle null quantity
          const itemPriceInSessionCurrency = item.price?.unit_amount ? item.price.unit_amount / 100 : 0;
          
          // Dacă avem metadata cu total_amount_ron, calculăm proporțional
          let itemPriceInRON = itemPriceInSessionCurrency;
          if (totalAmountRONFromMetadata && session.amount_total) {
            const totalInCurrency = session.amount_total / 100;
            if (totalInCurrency > 0 && itemQuantity > 0) {
              const itemTotalInCurrency = itemPriceInSessionCurrency * itemQuantity;
              const itemPercentage = itemTotalInCurrency / totalInCurrency;
              const itemTotalInRON = totalAmountRONFromMetadata * itemPercentage;
              itemPriceInRON = itemTotalInRON / itemQuantity; // Preț per unitate
            }
          } else if (sessionCurrency !== "RON") {
            if (exchangeRate && originalCurrency === "RON") {
              itemPriceInRON = itemPriceInSessionCurrency / exchangeRate;
            } else if (inverseExchangeRates[sessionCurrency]) {
              itemPriceInRON = itemPriceInSessionCurrency * inverseExchangeRates[sessionCurrency];
            }
          }
          
          return {
            name: item.description || item.price?.nickname || "Product",
            quantity: itemQuantity,
            price: itemPriceInRON,
          };
        });

        // Calculează amount în RON - FOLOSIM PREȚUL EXACT DIN METADATA DACĂ EXISTĂ
        let amountInRON = 0;
        
        if (totalAmountRONFromMetadata && totalAmountRONFromMetadata > 0) {
          // PRIORITATE: Folosim prețul exact salvat la momentul checkout-ului
          amountInRON = totalAmountRONFromMetadata;
        } else if (session.amount_total) {
          // Fallback: Calculăm din amount-ul actual
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
          amount: amountInRON, // Prețul exact în RON (din metadata sau calculat)
          currency: paymentCurrency || sessionCurrency, // Currency-ul folosit la checkout
          originalCurrency: originalCurrency,
          amountInCurrency: amountInCurrency, // Prețul în currency-ul selectat (dacă există)
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
            
            // Rate-uri de schimb inverse (pentru conversie înapoi la RON - fallback)
            const inverseExchangeRates: Record<string, number> = {
              RON: 1,
              EUR: 5,
              USD: 4.545,
              GBP: 5.556,
            };
            
            // Obține currency-ul comenzii
            const orderCurrency = (orderDetail.currency || "RON").toUpperCase();
            
            // Verifică metadata pentru prețul exact salvat la checkout
            const metadata = orderDetail.metadata || {};
            const totalAmountRONFromMetadata = metadata.total_amount_ron ? parseFloat(metadata.total_amount_ron) : null;
            const amountInCurrency = metadata.amount_in_currency ? parseFloat(metadata.amount_in_currency) : null;
            const paymentCurrency = metadata.payment_currency || orderCurrency;
            const exchangeRate = metadata.exchange_rate ? parseFloat(metadata.exchange_rate) : null;
            const originalCurrency = metadata.original_currency || "RON";
            
            // Calculează suma din items pentru afișare
            const items = (orderDetail.items || []).map((item: any) => {
              const itemQuantity = item.quantity || 1; // Handle null/undefined quantity
              const itemPriceInOrderCurrency = item.unit_price ? item.unit_price / 100 : 0;
              
              // Dacă avem metadata cu total_amount_ron, calculăm proporțional
              let itemPriceInRON = itemPriceInOrderCurrency;
              if (totalAmountRONFromMetadata && orderDetail.amount) {
                // Calculează procentul din total
                const totalInCurrency = orderDetail.amount / 100;
                if (totalInCurrency > 0 && itemQuantity > 0) {
                  const itemTotalInCurrency = itemPriceInOrderCurrency * itemQuantity;
                  const itemPercentage = itemTotalInCurrency / totalInCurrency;
                  const itemTotalInRON = totalAmountRONFromMetadata * itemPercentage;
                  itemPriceInRON = itemTotalInRON / itemQuantity; // Preț per unitate
                }
              } else if (orderCurrency !== "RON") {
                // Fallback: convertim folosind exchange rate sau inverse rates
                if (exchangeRate && originalCurrency === "RON") {
                  itemPriceInRON = itemPriceInOrderCurrency / exchangeRate;
                } else if (inverseExchangeRates[orderCurrency]) {
                  itemPriceInRON = itemPriceInOrderCurrency * inverseExchangeRates[orderCurrency];
                }
              }
              
              return {
                name: item.name || "Product",
                quantity: itemQuantity,
                price: itemPriceInRON,
              };
            });
            
            // Calculează suma totală în RON - FOLOSIM PREȚUL EXACT DIN METADATA DACĂ EXISTĂ
            let calculatedAmountInRON = 0;
            
            if (totalAmountRONFromMetadata && totalAmountRONFromMetadata > 0) {
              // PRIORITATE: Folosim prețul exact salvat la momentul checkout-ului
              calculatedAmountInRON = totalAmountRONFromMetadata;
            } else if (orderDetail.amount && orderDetail.amount > 0) {
              // Fallback: Calculăm din amount-ul actual
              const amountInOrderCurrency = orderDetail.amount / 100;
              
              if (orderCurrency === "RON") {
                calculatedAmountInRON = amountInOrderCurrency;
              } else {
                if (exchangeRate && originalCurrency === "RON") {
                  calculatedAmountInRON = amountInOrderCurrency / exchangeRate;
                } else if (inverseExchangeRates[orderCurrency]) {
                  calculatedAmountInRON = amountInOrderCurrency * inverseExchangeRates[orderCurrency];
                } else {
                  calculatedAmountInRON = amountInOrderCurrency;
                }
              }
            } else {
              // Fallback: Calculează din items
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
              amount: calculatedAmountInRON, // Prețul exact în RON (din metadata sau calculat)
              currency: paymentCurrency || orderCurrency, // Currency-ul folosit la checkout
              originalCurrency: originalCurrency,
              amountInCurrency: amountInCurrency, // Prețul în currency-ul selectat (dacă există)
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

