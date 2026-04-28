import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Santuário de São José de Ribamar",
  description: "Santuário de São José de Ribamar — Um lugar de fé, oração e encontro com Deus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
