import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DpdpConsentModal, StatutoryDisclaimerBar } from "@/components/legal/DpdpConsentModal";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BIS Smart Digital Expert — Technical Regulatory & Conformity Assistant",
  description: "AI-powered digital expert for Bureau of Indian Standards (BIS), ISI Mark specifications, Quality Control Orders (QCOs), and product compliance.",
  keywords: "BIS, ISI Mark, Indian Standards, QCO, IS 1293, IS 302, IS 694, DPDP, Conformity Assessment, Smart India Hackathon",
  authors: [{ name: "BIS Digital Team" }],
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
        </AppProvider>
      </body>
    </html>
  );
}
