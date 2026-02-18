import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Where tasks find clarity.",
  description:
    "TaskFlow is a modern task management tool for organizing projects, planning work, tracking progress, and staying productive with interactive visual workflows.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.className} antialiased`}>
          <SupabaseProvider>{children}</SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
