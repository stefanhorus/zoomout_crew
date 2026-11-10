"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  provider: "stripe" | "revolut";
  customerEmail: string;
  amount: number; // Amount în RON
  currency: string; // Currency-ul folosit la checkout
  originalCurrency?: string;
  amountInCurrency?: number; // Amount în currency-ul original (dacă există)
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
  const [syncing, setSyncing] = useState(false);

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

  const syncOrders = async () => {
    try {
      setSyncing(true);
      const savedUsername = sessionStorage.getItem("admin_username");
      const savedPassword = sessionStorage.getItem("admin_password");
      
      if (!savedUsername || !savedPassword) {
        alert("Te rugăm să te autentifici din nou");
        return;
      }

      const response = await fetch("/api/admin/sync-orders", {
        method: "POST",
        headers: {
          "x-admin-username": savedUsername,
          "x-admin-password": savedPassword,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to sync orders");
      }

      const data = await response.json();
      alert(`Sincronizare completă!\nVerificate: ${data.checked}\nActualizate: ${data.updated}`);
      
      // Reîncarcă comenzile după sincronizare
      await fetchOrders(savedUsername, savedPassword);
    } catch (err: any) {
      alert(`Eroare la sincronizare: ${err.message}`);
      console.error("Error syncing orders:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
        <style jsx>{`
          @keyframes logoRotateY {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }
          @keyframes logoPulse {
            0%, 100% {
              opacity: 1;
              filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
            }
            50% {
              opacity: 0.9;
              filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .logo-animated {
            animation: logoRotateY 8s linear infinite, logoPulse 2s ease-in-out infinite;
            transform-style: preserve-3d;
            perspective: 1000px;
          }
          .form-animated {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
        <div className="max-w-md mx-auto mt-10">
          {/* Logo animat */}
          <div className="flex justify-center mb-8">
            <div className="logo-animated">
              <Image
                src="/assets/logo.png"
                alt="Zoomout Crew Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 form-animated">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin - Comenzi</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                  placeholder="Introdu username-ul"
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
                  autoComplete="new-password"
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
              onClick={() => fetchOrders()}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20 md:pt-24 p-4 md:p-8">
      <style jsx>{`
        @keyframes logoRotateY {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        @keyframes logoPulse {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
          }
          50% {
            opacity: 0.95;
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
          }
        }
        .logo-animated-header {
          animation: logoRotateY 8s linear infinite, logoPulse 3s ease-in-out infinite;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Logo animat în header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="logo-animated-header">
            <Image
              src="/assets/logo.png"
              alt="Zoomout Crew Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Comenzi</h1>
            <p className="text-gray-400">
              Total: {orders.length} comenzi •{" "}
              {formatPrice(totalAmount, "RON")}
            </p>
          </div>
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
                            : order.status === "pending"
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/50"
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
                      {formatPrice(order.amount, "RON")}
                    </p>
                    {order.currency && order.currency !== "RON" && order.amountInCurrency && (
                      <p className="text-sm text-gray-400 mt-1">
                        ({formatPrice(order.amountInCurrency, order.currency)})
                      </p>
                    )}
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
                          {formatPrice(item.price * item.quantity, "RON")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-4 items-center flex-wrap">
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
            onClick={syncOrders}
            disabled={syncing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? "Sincronizare..." : "Sync Orders"}
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

