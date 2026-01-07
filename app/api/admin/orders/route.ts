import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  try {
    // Verifică parola admin (simplă protecție)
    const adminPassword = request.headers.get("x-admin-password");
    const expectedPassword = process.env.ADMIN_PASSWORD;
    
    // Debug logging (doar în development)
    if (process.env.NODE_ENV === "development") {
      console.log("Admin auth check:", {
        hasHeader: !!adminPassword,
        hasExpected: !!expectedPassword,
        headerValue: adminPassword?.substring(0, 2) + "**",
      });
    }
    
    if (expectedPassword && adminPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Dacă nu există parolă setată, permite accesul (pentru development)
    // În producție, ar trebui să existe întotdeauna ADMIN_PASSWORD

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

        const items = lineItems.map((item) => ({
          name: item.description || item.price?.nickname || "Product",
          quantity: item.quantity || 1,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        }));

        return {
          id: session.id,
          provider: "stripe",
          customerEmail: session.customer_details?.email || "N/A",
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || "RON",
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
            return {
              id: order.id,
              provider: "revolut",
              customerEmail: orderDetail.customer?.email || orderDetail.email || "N/A",
              amount: orderDetail.amount ? orderDetail.amount / 100 : 0,
              currency: orderDetail.currency || "RON",
              status: orderDetail.state,
              createdAt: orderDetail.created_at || new Date().toISOString(),
              items: (orderDetail.items || []).map((item: any) => ({
                name: item.name || "Product",
                quantity: item.quantity || 1,
                price: item.unit_price ? item.unit_price / 100 : 0,
              })),
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

