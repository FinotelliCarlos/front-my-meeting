import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "./_components/footer";
import Header from "./_components/header";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Meeting",
  description: "Application created by Finotelli!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!font) {
    return null;
  }
  return (
    <html lang="pt-BR">
      <body className={`${font.className} dark`}>
        <Header />
        <main className="flex-1 container mx-auto px-5 py-4 my-4 antialiased">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
