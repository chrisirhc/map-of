import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        {children}
        <footer>
          <div>
            Data is sourced from{" "}
            <a href="https://www.singpost.com/locate-us">Singapore Post</a>
          </div>
          <div>
            <a href="https://github.com/chrisirhc/map-of">
              Source is at Github
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
