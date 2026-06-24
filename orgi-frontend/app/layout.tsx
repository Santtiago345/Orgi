import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "orgi - Gestión Financiera Personal",
  description: "Controla tus finanzas personales: ingresos, gastos, deudas y más",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-neutral-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
