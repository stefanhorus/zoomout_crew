"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import Cart from "./Cart";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  const headerRef = useRef<HTMLElement>(null);
  const { getTotalItems } = useCart();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Calculează înălțimea header-ului
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Închide meniul când se face resize la desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Previne scroll când meniul mobil este deschis
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/portfolio", label: "Portfolio", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { href: "/services", label: "Services", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { href: "/adventures", label: "Adventures", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { href: "/shop", label: "Shop", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { href: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header ref={headerRef} className={`fixed top-0 left-0 w-full z-50 liquid-glass-header ${isMobileMenuOpen ? 'header-menu-open' : ''}`}>
        <nav className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 cursor-pointer z-50 group"
            onClick={handleLinkClick}
          >
            <div className="relative">
            <img 
              src="/logo.png" 
              alt="Logo" 
                className="h-7 w-7 md:h-8 md:w-8 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
            />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-semibold text-white text-base md:text-lg transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-white/95">
              Zoomout_crew
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6 text-white">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="hover:opacity-90 transition-all duration-300 text-sm md:text-base relative group font-medium"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white/50 blur-sm transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            {/* Cart Icon - când există produse sau când cart-ul este deschis */}
            {(getTotalItems() > 0 || isCartOpen) && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:opacity-90 transition-all duration-300 group"
                aria-label="Open shopping cart"
              >
                <svg className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            {/* Cart Icon Mobile - când există produse sau când cart-ul este deschis */}
            {(getTotalItems() > 0 || isCartOpen) && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:opacity-90 transition-all duration-300 group"
                aria-label="Open shopping cart"
              >
                <svg className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:opacity-90 transition-all duration-300 relative z-[100] group"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 shadow-[0_0_4px_rgba(255,255,255,0.3)] ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : "group-hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 shadow-[0_0_4px_rgba(255,255,255,0.3)] ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 shadow-[0_0_4px_rgba(255,255,255,0.3)] ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "group-hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] transition-all duration-300 ease-out md:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 visible" 
            : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu - Se deschide sub header */}
      <div
        className={`fixed left-0 right-0 z-[45] md:hidden transform transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0"
        }`}
        style={{ top: `${headerHeight}px` }}
      >
        {/* Menu Container */}
        <div className={`mobile-menu-glass ${isMobileMenuOpen ? 'menu-open' : ''}`}>
          {/* Navigation Links */}
          <nav className="px-3 py-4">
            <ul className="space-y-1">
              {navLinks.map((link, index) => (
                <li 
                  key={link.href}
                  className={`transform transition-all duration-300 ease-out ${
                    isMobileMenuOpen 
                      ? "translate-y-0 opacity-100" 
                      : "-translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 text-white text-base py-3 px-4 rounded-lg hover:bg-white/10 active:bg-white/15 transition-all duration-200 font-medium group relative overflow-hidden"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors flex-shrink-0">
                      <svg 
                        className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                    </div>
                    
                    {/* Label */}
                    <span className="relative z-10 flex-1 truncate">{link.label}</span>
                    
                    {/* Arrow */}
                    <svg 
                      className="relative z-10 w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-white/10">
            <p className="text-gray-300 text-xs text-center">
              © {currentYear || "2024"} Zoomout_crew
            </p>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}