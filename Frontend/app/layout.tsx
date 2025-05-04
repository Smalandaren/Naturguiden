import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitcher from "@/components/theme-switcher";
import TopRightAuthButton from "@/components/TopRightAuthButton";
import { checkAuth } from "@/lib/checkAuth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getAnnouncementBanner } from "@/lib/getAnnouncementBanner";
import Banner from "@/components/Banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naturguiden",
  description: "Naturguiden - Naturplatser i Skåne",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authCheck = await checkAuth();
  const announcementBanner = await getAnnouncementBanner();
  return (
    <html lang="sv" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {announcementBanner ? <Banner data={announcementBanner} /> : null}
          <div
            className={`absolute sm:fixed flex gap-4 ${
              announcementBanner ? "top-20" : "top-5"
            } right-5`}
          >
            <TopRightAuthButton
              authenticated={authCheck.authenticated}
              user={authCheck.user}
              isAdmin={authCheck.isAdmin}
            />
            <ThemeSwitcher />
          </div>
          <Toaster
            position="top-center"
            richColors
            toastOptions={{ duration: 6000 }}
          />
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
