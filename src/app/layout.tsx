import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import {
  Container,
  Theme,
  Text,
  Link,
  Separator,
  Flex,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import NextLink from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Post boxes in Singapore",
  description: "Locations of post boxes in Singapore",
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
            <Link weight="bold" color="gray" underline="none" asChild>
              <NextLink href="/">Post boxes in Singapore</NextLink>
            </Link>
            <Separator mb="2" size="4" />
            {children}
            <Separator mt="2" size="4" />
            <footer>
              <Text size="1">
                Data sourced from{" "}
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
