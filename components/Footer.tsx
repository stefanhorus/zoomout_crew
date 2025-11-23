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
      name: "Instagram",
      href: "https://instagram.com/zoomout_crew",
      icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
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

