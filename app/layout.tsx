import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = { title: "Pulsari Desk", description: "Central inteligente de chamados e suporte técnico da Agência Pulsari" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" suppressHydrationWarning><body className="font-sans"><ThemeProvider>{children}</ThemeProvider></body></html>;
}
