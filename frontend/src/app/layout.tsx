import type { Metadata } from "next";
import "@/app/globals.css";
import "@/styles/_globals.scss";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/layout/AuthProvider";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AltruGreen | Play with Purpose",
  description: "A premium golf community where every swing counts. Join to win luxury prizes and support global environmental charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col pt-20 bg-soft-bg text-deep-blue" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-[100vw] overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
