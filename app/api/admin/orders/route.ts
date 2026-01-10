import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/admin-users";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

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

    // Conectează la MongoDB
    await connectDB();

    // Obține toate comenzile din MongoDB, sortate după dată (cele mai recente primele)
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    // Formatează comenzile pentru API (compatibilitate cu formatul anterior)
    const allOrders = orders.map((order) => ({
      id: order.orderId,
      provider: order.provider,
      customerEmail: order.customerEmail,
      amount: order.amountRON,
      currency: order.currency,
      originalCurrency: order.metadata?.originalCurrency,
      amountInCurrency: order.amountCurrency,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

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

