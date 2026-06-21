import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "../components/AuthGuard"; // Будем использовать shared guard, если перенесем его в shared или скопируем

export const metadata: Metadata = {
  title: "Erpio Admin",
  description: "Management & Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
