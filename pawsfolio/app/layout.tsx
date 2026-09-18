import type { Metadata } from "next";
import { Poppins, JetBrains_Mono, Gochi_Hand } from "next/font/google";
import { Nav } from "@/components/nav";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const gochi = Gochi_Hand({
  variable: "--font-gochi",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "builds.log · AWS Builders - UST",
  description: "See what fellow builders are making with AWS.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // data-theme is set by the script below before React hydrates
      className={`${poppins.variable} ${jetbrains.variable} ${gochi.variable} antialiased`}
    >
      <head>
        {/* Runs before paint so purple mode doesn't flash light first: saved choice, else the OS dark setting. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='purple'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='purple'}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Nav user={await getCurrentUser()} />
        {children}
      </body>
    </html>
  );
}
