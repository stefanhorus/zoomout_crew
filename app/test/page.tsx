"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Test() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Test Email from Zoomout_crew",
          message: "This is a test email sent from the test page.",
        }),
      });

      // Verifică dacă răspunsul este JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setStatus("error");
        setMessage("Server returned an error. Check console for details.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(`Email sent successfully to ${email}! ✅`);
        setEmail(""); // Reset email field
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send email");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "An error occurred while sending the email");
      console.error("Error:", error);
    }
  };

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/background2tiny.png"
          alt="Test background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            <Typewriter
              words={["Test Page"]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300">
            This is a test page for development and testing purposes
          </p>
        </div>

        {/* Test Content */}
        <div className="liquid-glass-strong rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Test Email
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Enter your email address to receive a test email.
          </p>
          
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
                className="w-full px-4 py-3 rounded-xl liquid-glass-input text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                disabled={status === "sending"}
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "sending" || !email}
              className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {status === "sending" ? "Sending..." : "Send Test Email"}
            </button>
            
            {status === "success" && (
              <p className="mt-4 text-green-400 font-semibold animate-fade-in text-center">
                {message}
              </p>
            )}
            
            {status === "error" && (
              <p className="mt-4 text-red-400 font-semibold animate-fade-in text-center">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

