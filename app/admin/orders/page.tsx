"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  provider: "stripe" | "revolut";
  customerEmail: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Verifică dacă există credențiale salvate în sessionStorage pentru autentificare automată
    const savedUsername = sessionStorage.getItem("admin_username");
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedUsername && savedPassword) {
      // Folosește credențialele salvate pentru autentificare automată, dar nu le afișa în formular
      setIsAuthenticated(true);
      fetchOrders(savedUsername, savedPassword);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError("");
      setLoading(true);
      
      if (!username || !password) {
        setAuthError("Te rugăm să introduci username-ul și parola");
        setLoading(false);
        return;
      }
      
      const response = await fetch("/api/admin/orders", {
        method: "GET",
        headers: {
          "x-admin-username": username,
          "x-admin-password": password,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setAuthError("Username sau parolă incorectă");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to authenticate");
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("admin_username", username);
      sessionStorage.setItem("admin_password", password);
      await fetchOrders(username, password);
    } catch (err: any) {
      setAuthError(err.message || "Eroare la autentificare");
      setLoading(false);
    }
  };

  const fetchOrders = async (adminUsername?: string, adminPassword?: string) => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (adminUsername && adminPassword) {
        headers["x-admin-username"] = adminUsername;
        headers["x-admin-password"] = adminPassword;
      } else if (username && password) {
        headers["x-admin-username"] = username;
        headers["x-admin-password"] = password;
      }
      
      const response = await fetch("/api/admin/orders", { headers });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem("admin_username");
          sessionStorage.removeItem("admin_password");
          setAuthError("Sesiunea a expirat. Te rugăm să te autentifici din nou.");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
            <h1 className="text-2xl font-bold mb-6">Admin - Comenzi</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                  placeholder="stefanhorus@zoomoutcrew.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Parolă
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                  placeholder="Introdu parola"
                />
              </div>
              {authError && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{authError}</p>
                </div>
              )}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Se autentifică..." : "Autentificare"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Comenzi</h1>
          <p className="text-gray-400">
            Total: {orders.length} comenzi •{" "}
            {formatPrice(totalAmount, "RON")}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <p className="text-gray-400">Nu există comenzi încă.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        Comandă #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.provider === "stripe"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                        }`}
                      >
                        {order.provider.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid" ||
                          order.status === "COMPLETED" ||
                          order.status === "AUTHORISED"
                            ? "bg-green-500/20 text-green-300 border border-green-500/50"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {order.customerEmail}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatPrice(order.amount, order.currency)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Produse:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm bg-gray-900/50 rounded p-2"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity, order.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-4 items-center">
          <div className="text-sm text-gray-400">
            Logat ca: <span className="text-white font-semibold">{username}</span>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("admin_username");
              sessionStorage.removeItem("admin_password");
              setUsername("");
              setPassword("");
              setLoading(false);
            }}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

