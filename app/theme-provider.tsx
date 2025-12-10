"use client";
import { useEffect, useState } from "react";

type Props = { children: React.ReactNode; };

export function ThemeProvider({ children }: Props) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(saved || (prefersDark ? "dark" : "light"));
    }, []);


    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.className = theme;
    }, [theme]);


    return <>{children}</>;
}