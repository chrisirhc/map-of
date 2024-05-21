import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme, Text, Link } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Posting boxes in Singapore",
  description: "Locations of posting boxes in Singapore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          {children}
          <footer>
            <Text>
              Data is sourced from{" "}
              <Link href="https://www.singpost.com/locate-us">
                Singapore Post
              </Link>
            </Text>
            <div>
              <Link href="https://github.com/chrisirhc/map-of">
                Source is at Github
              </Link>
            </div>
          </footer>
        </Theme>
      </body>
    </html>
  );
}
