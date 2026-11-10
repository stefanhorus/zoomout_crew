"use client";

import { useState } from "react";

export default function RevolutWebhookSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSetup = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/revolut/webhook-setup", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create webhook");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Revolut Webhook Setup</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configurare Webhook</h2>
          <p className="text-gray-300 mb-4">
            Acest tool creează automat webhook-ul în Revolut pentru a primi notificări despre plăți.
          </p>

          <button
            onClick={handleSetup}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Se configurează..." : "Creează Webhook"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-semibold">Eroare:</p>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold text-lg mb-4">
              ✅ Webhook creat cu succes!
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-300 text-sm mb-2">Webhook ID:</p>
                <code className="bg-gray-900 px-3 py-2 rounded block text-green-400">
                  {result.webhook?.id}
                </code>
              </div>

              <div>
                <p className="text-gray-300 text-sm mb-2">Webhook URL:</p>
                <code className="bg-gray-900 px-3 py-2 rounded block text-green-400 break-all">
                  {result.webhook?.url}
                </code>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold mb-2">⚠️ IMPORTANT:</p>
                <p className="text-yellow-300 text-sm mb-3">
                  Adaugă următoarea variabilă de mediu în Vercel și .env.local:
                </p>
                <code className="bg-gray-900 px-3 py-2 rounded block text-yellow-400 break-all">
                  REVOLUT_WEBHOOK_SECRET={result.webhook?.signing_secret}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `REVOLUT_WEBHOOK_SECRET=${result.webhook?.signing_secret}`
                    );
                    alert("Copied to clipboard!");
                  }}
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm"
                >
                  Copiază în clipboard
                </button>
              </div>

              <div>
                <p className="text-gray-300 text-sm mb-2">Evenimente configurate:</p>
                <ul className="list-disc list-inside text-gray-300">
                  {result.webhook?.events?.map((event: string) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Instrucțiuni Manuale</h3>
          <p className="text-gray-300 text-sm mb-4">
            Dacă setup-ul automat nu funcționează, poți crea webhook-ul manual folosind curl:
          </p>
          <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
            {`curl -X POST https://merchant.revolut.com/api/1.0/webhooks \\
  -H "Authorization: Bearer YOUR_REVOLUT_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Revolut-Api-Version: 2024-05-01" \\
  -d '{
    "url": "https://zoomoutcrew.com/api/webhooks/revolut",
    "events": ["ORDER_COMPLETED", "ORDER_AUTHORISED"]
  }'`}
          </pre>
        </div>
      </div>
    </main>
  );
}

