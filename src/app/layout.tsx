// src/app/builder/layout.tsx
import { Inter } from "next/font/google";
import "../styles/globals.css"; // Import your global styles

const inter = Inter({ subsets: ["latin"] });

export default function BuilderLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>
    );
}
