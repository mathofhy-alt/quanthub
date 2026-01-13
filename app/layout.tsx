import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "QuantHub - Intelligent Investment Data & Tools",
  description: "Automated stock analysis, ETF comparisons, and financial calculators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-slate-950 text-slate-200 min-h-screen flex flex-col`}
      >
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">Q</span>
              QuantHub
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
              <a href="/stocks" className="hover:text-white transition">Stocks</a>
              <a href="/etf" className="hover:text-white transition">ETF Intelligence</a>
              <a href="/tools" className="hover:text-white transition">Calculators</a>
              <a href="/news" className="hover:text-white transition">News</a>
            </nav>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition">
              Start Investing
            </button>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2026 QuantHub. High-Frequency Investment Data.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
