"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/manlrkjr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-16 relative"
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/background.jpg"
          alt="Contact background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover brightness-75"
        />
      </div>
      <div className="relative z-10 max-w-2xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          <Typewriter
            words={["Contact Us!"]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={90}
            deleteSpeed={0}
            delaySpeed={999999}
          />
        </h1>
        <p className="text-gray-300">
          Let's get in touch! Whether you have a project in mind or just want to say hi.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg liquid-glass-strong p-8 rounded-2xl liquid-glass-hover"
      >
        <div className="mb-6">
          <label htmlFor="name" className="block text-left text-gray-300 mb-2">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl liquid-glass-input text-white placeholder-gray-400"
            placeholder="Your name"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-left text-gray-300 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl liquid-glass-input text-white placeholder-gray-400"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-left text-gray-300 mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white resize-none"
            placeholder="Write your message..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full liquid-glass-button text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="block text-green-400 font-semibold text-center mt-4 animate-fade-in">Thank you for your message! 🚀</p>
        )}
        {status === "error" && (
          <p className="block text-red-400 font-semibold text-center mt-4 animate-fade-in">Oops! Something went wrong. Please try again.</p>
        )}
      </form>

      <footer className="relative z-10 mt-12 text-gray-400 text-sm">
        © {currentYear || "2024"} Zoomout_crew — All rights reserved.
      </footer>
    </section>
  );
}