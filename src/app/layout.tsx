import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/globals.css";
import {Toaster} from "react-hot-toast"
import { Footer } from "@/components/ui/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitllm - GitHub Repository Analysis Tool by Abdelhak Akermi",
  description: "A powerful tool to analyze GitHub repositories, extract insights, and process code content. Built by Abdelhak Akermi during holidays 2024.",
  keywords: ["github", "code analysis", "repository analysis", "git tool", "developer tools", "abakermi"],
  authors: [{ name: "Abdelhak Akermi", url: "https://github.com/abakermi" }],
  creator: "Abdelhak Akermi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gitllm.vercel.app",
    title: "Gitllm - GitHub Repository Analysis Tool",
    description: "Analyze GitHub repositories and extract insights with ease",
    siteName: "Gitllm",
    images: [{
      url: "/og-image.png", // Make sure to add this image to your public folder
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitllm - GitHub Repository Analysis Tool",
    description: "Analyze GitHub repositories and extract insights with ease",
    creator: "@abakermi",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://gitllm.vercel.app"), // Update with your actual domain
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}
        <Footer />
      </body>
     
    </html>
  );
}
