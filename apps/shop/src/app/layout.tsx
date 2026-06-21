import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard"; // Предполагается, что AuthGuard будет в shared

export const metadata: Metadata = {
  title: "Erpio Shop",
  description: "Online Store for Customers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
