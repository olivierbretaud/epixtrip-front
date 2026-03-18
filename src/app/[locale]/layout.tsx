import type { Metadata } from "next";
import {
  Lora,
  Plus_Jakarta_Sans,
  Roboto_Mono,
  Yeseva_One,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import "@/styles/globals.css";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontDisplay = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "EpixTrip",
  description: "",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = (await import(`@/i18n/lang/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${fontDisplay.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
