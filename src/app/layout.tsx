import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Container, Theme, Text, Link } from "@radix-ui/themes";
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
          <Container>
            {children}
            <footer>
              <Text size="1">
                Data is sourced from{" "}
                <Link href="https://www.singpost.com/locate-us">
                  Singapore Post
                </Link>
                <br />
                <Link href="https://github.com/chrisirhc/map-of">
                  Source is at Github
                </Link>
              </Text>
            </footer>
          </Container>
        </Theme>
      </body>
    </html>
  );
}
