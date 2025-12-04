"use client"
import { useEffect, useState } from "react"; 
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
const [theme, setTheme] = useState("dark");

useEffect(() => {
const saved = localStorage.getItem("theme"); setTheme(saved || "dark"); }, []);


function toggle() {
const next = theme === "dark" ? "light" : "dark"; setTheme(next);
localStorage.setItem("theme", next); document.documentElement.className = next; }


return (
<button onClick={toggle} className="px-4 py-2 rounded-lg border border-foreground/20 hover:bg-foreground/10 transition cursor-pointer hover:scale-110">{theme === "dark" ? <FaMoon /> : <FaSun />} </button>
);}