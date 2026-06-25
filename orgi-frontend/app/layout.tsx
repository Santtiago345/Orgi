import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "orgi — Gestión Financiera Personal",
  description: "Controla tus finanzas personales: ingresos, gastos, deudas y más, todo en un solo lugar.",
  keywords: ["finanzas", "presupuesto", "gastos", "ingresos", "deudas", "colombia"],
  openGraph: {
    title: "orgi — Gestión Financiera Personal",
    description: "Controla tus finanzas personales de forma simple y efectiva.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className="scrollbar-thin">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
