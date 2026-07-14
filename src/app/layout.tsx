import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { site } from "@/data/site";

/* Manrope — современный гротеск с полной поддержкой кириллицы */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Almaz Tour — туры из Астаны | Влюбляем в путешествия",
    template: "%s | Almaz Tour",
  },
  description: site.description,
  keywords: [
    "туры из Астаны",
    "горящие туры Астана",
    "турагентство Астана",
    "Almaz Tour",
    "Алмаз Тур",
    "путёвки за границу",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.url,
    siteName: "Almaz Tour",
    title: "Almaz Tour — туры из Астаны",
    description: site.description,
    images: [{ url: "/images/destinations/maldives.jpg", width: 1500, height: 1001, alt: "Almaz Tour" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: { canonical: "/" },
};

/* Разметка schema.org: турагентство с адресом, графиком и контактами */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Almaz Tour",
  alternateName: "Алмаз Тур",
  slogan: site.slogan,
  url: site.url,
  logo: `${site.url}/images/logo.png`,
  email: site.email,
  telephone: "+77759089048",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Астана",
    addressCountry: "KZ",
    streetAddress: "ул. Достык 4, ТЦ «Festival Avenue»",
  },
  hasMap: site.address.map2gis,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "12:00",
      closes: "16:00",
    },
  ],
  sameAs: [site.social.facebook, site.social.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Script
          id="schema-travel-agency"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
