"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EXCHANGE_RATES, isCurrency, type Currency } from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  convertPrice: (priceInRON: number) => number;
  formatPrice: (priceInRON: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("RON");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (isCurrency(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  // Convert price from RON to selected currency (2-decimal rounding).
  // Important: totals/discounts must remain mathematically correct.
  const convertPrice = (priceInRON: number): number => {
    const rate = EXCHANGE_RATES[currency];
    const converted = priceInRON * rate;

    // Avoid floating point artifacts (e.g. 0.30000000004)
    return Math.round(converted * 100) / 100;
  };

  // Format price with currency symbol
  const formatPrice = (priceInRON: number): string => {
    const convertedPrice = convertPrice(priceInRON);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
