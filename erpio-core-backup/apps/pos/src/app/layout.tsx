import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "../components/AuthGuard";

export const metadata: Metadata = {
  title: "Erpio POS",
  description: "Point of Sale System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
