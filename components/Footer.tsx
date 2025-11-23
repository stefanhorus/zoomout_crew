"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/adventures", label: "Adventures" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com/@zoomout_crew",
      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
  ];

  return (
    <footer className="relative z-10 border-t border-white/20 bg-black/80 backdrop-blur-sm mt-auto footer-glass">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Zoomout_crew
            </h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Professional aerial footage and cinematography services. Capturing your vision from above.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 group relative"
                  aria-label={social.name}
                >
                  <div className="relative p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                    <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links - 2 coloane */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 text-sm relative group inline-block"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:contact@zoomoutcrew.com"
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group inline-block"
                >
                  <span className="relative z-10">contact@zoomoutcrew.com</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-300 relative group inline-block">
                  <span className="relative z-10">Get in Touch</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-all duration-300 relative group inline-block">
                  <span className="relative z-10">View Services</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm">
            © {currentYear} Zoomout_crew. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

