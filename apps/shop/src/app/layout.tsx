import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard"; // Предполагается, что AuthGuard будет в shared
import QueryProvider from "@/components/providers/QueryProvider";

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
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}
