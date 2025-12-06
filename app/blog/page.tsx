import Container from "@/componenets/Container";
import Rotate from "@/componenets/Rotate";
import ThemeToggle from "@/componenets/ThemeToggle";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {/* ✅ Background orb */}
      <Rotate />

      {/* ✅ Foreground content */}
      <Container className="relative z-10 p-6 bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">Vyre</h1>
          <ThemeToggle />
        </div>

        <p className="text-lg opacity-80 mb-8">Stop Playing</p>
        <Link href="/blog" className="underline text-primary hover:opacity-80">
          Read the blog →
        </Link>
      </Container>
    </>
  );
}