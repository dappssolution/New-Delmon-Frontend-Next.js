import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/providers/ReduxProvider";
import { Toaster } from "sonner";

const nunitoSans = Nunito_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "New Delmon Wholesale Goods LLC | Quality Products and Service",
  description: "New Delmon Wholesale Goods LLC | Quality Products and Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.className} antialiased`}
      >
        <ReduxProvider>
          <Toaster position="top-right" richColors />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
