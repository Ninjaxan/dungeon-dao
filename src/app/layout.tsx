import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dungeon DAO",
    template: "%s | Dungeon DAO",
  },
  description: "Create and manage DAOs on Dungeon Chain — powered by DAODAO contracts.",
  keywords: ["dao", "dungeon chain", "cosmos", "cosmwasm", "daodao", "governance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-xs">
            Dungeon DAO &middot; Powered by{' '}
            <a href="https://daodao.zone" className="text-accent-purple hover:underline" target="_blank" rel="noopener noreferrer">
              DAODAO
            </a>
            {' '}&middot;{' '}
            <a href="https://dungeongames.io" className="text-accent-gold hover:underline" target="_blank" rel="noopener noreferrer">
              Dungeon Chain
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
