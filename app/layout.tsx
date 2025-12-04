import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Vyre",
description: "Your blog + portfolio hybrid",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" suppressHydrationWarning>
<body className="bg-background text-foreground transition-colors duration-300">
<ThemeProvider>{children}</ThemeProvider>
</body>
</html>
);
}