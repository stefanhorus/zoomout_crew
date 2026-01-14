"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "RON" | "EUR" | "USD" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  convertPrice: (priceInRON: number) => number;
  formatPrice: (priceInRON: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Rate-uri de schimb (poți actualiza aceste rate-uri sau să folosești un API pentru rate-uri în timp real)
const exchangeRates: Record<Currency, number> = {
  RON: 1,      // RON este moneda de bază
  EUR: 0.2,    // 1 RON = 0.2 EUR (5 RON = 1 EUR) - 100 RON = 20 EUR
  USD: 0.25,   // 1 RON = 0.25 USD (4 RON = 1 USD) - 100 RON = 25 USD
  GBP: 0.18,   // 1 RON = 0.18 GBP (~5.5 RON = 1 GBP) - 100 RON = 18 GBP
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("RON");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency;
    if (savedCurrency && (savedCurrency === "RON" || savedCurrency === "EUR" || savedCurrency === "USD" || savedCurrency === "GBP")) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  // Convert price from RON to selected currency
  const convertPrice = (priceInRON: number): number => {
    const rate = exchangeRates[currency];
    return priceInRON * rate;
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
