import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
title: "Vyre",
description: "Your blog + portfolio hybrid",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" suppressHydrationWarning>
<body className="bg-background text-foreground transition-colors duration-300">
    <Providers>{children}</Providers>
</body>
</html>
);
}