import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUPRA Water",
  description: "Sistema de gestion de rutas de agua",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
