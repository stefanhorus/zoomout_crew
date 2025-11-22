"use client";

import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function About() {
  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/background4.jpg"
          alt="About background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Futuristic Animated Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-500 opacity-2 blur-3xl animate-float" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-purple-500 opacity-2 blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-cyan-500 opacity-2 blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse-ring" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative" style={{ fontFamily: "var(--font-playfair)" }}>
              <Typewriter
                words={["About Us"]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={0}
                delaySpeed={999999}
              />
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            Professional aerial footage and cinematography services
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Mission Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4" style={{ fontFamily: "var(--font-roboto)" }}>
                At Zoomout_crew, we specialize in capturing breathtaking aerial footage that tells your story from a unique perspective. 
                Whether it&apos;s real estate showcases, event coverage, commercial projects, or cinematic adventures, we bring professional 
                drone cinematography to every project.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed" style={{ fontFamily: "var(--font-roboto)" }}>
                Our passion for aerial photography and videography drives us to deliver exceptional quality and creative vision 
                that elevates your content above the rest.
              </p>
            </div>
          </section>

          {/* Services Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500 via-transparent to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
                What We Do
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                      Aerial Cinematography
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Stunning aerial footage for films, documentaries, and creative projects.
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                      Real Estate
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Professional property showcases that highlight unique features and locations.
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                      Event Coverage
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Complete event documentation from unique aerial perspectives.
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                      Commercial Projects
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      High-end commercial videography for brands and marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
                Why Choose Us
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                      Professional Equipment
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      State-of-the-art drones and camera systems for the highest quality footage.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                      Creative Vision
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Unique perspectives and creative storytelling that make your content stand out.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                      Experienced Team
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Skilled pilots and cinematographers with years of experience in aerial videography.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                      Reliable Service
                    </h3>
                    <p className="text-gray-300" style={{ fontFamily: "var(--font-roboto)" }}>
                      Professional, punctual, and committed to delivering exceptional results on time.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-text-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
                Ready to Work Together?
              </h2>
              <p className="text-gray-300 text-lg mb-6" style={{ fontFamily: "var(--font-roboto)" }}>
                Let&apos;s bring your vision to life from above.
              </p>
              <a
                href="/contact"
                className="inline-block liquid-glass-button text-white px-8 py-3 rounded-xl font-semibold relative transform hover:scale-105 transition-transform"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                <span className="relative z-10">Get in Touch</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

