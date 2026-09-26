import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DpdpConsentModal, StatutoryDisclaimerBar } from "@/components/legal/DpdpConsentModal";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BISYNC — Standards made simpler. Compliance made smarter.",
  description: "AI-powered assistance for Indian Standards, BIS Services, and product compliance.",
  keywords: "BISYNC, BIS, ISI Mark, Indian Standards, QCO, IS 1293, IS 302, IS 17526, DPDP, Conformity Assessment, Smart India Hackathon",
  authors: [{ name: "BISYNC Team" }],
  icons: {
    icon: "/emblem.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between selection:bg-bis-saffron selection:text-white">
        <AppProvider>
          <StatutoryDisclaimerBar />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <DpdpConsentModal />
          <ScrollToTop />
        </AppProvider>
      </body>
    </html>
  );
}
