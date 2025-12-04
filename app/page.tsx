import Container from "./componenets/Container";
import ThemeToggle from "./componenets/ThemeToggle";
import Link from "next/link";

export default function HomePage() {
return (
<Container>
<div className="flex justify-between items-center mb-8">
<h1 className="text-4xl font-black tracking-tight">Vyre</h1>
<ThemeToggle />
</div>

<p className="text-lg opacity-80 mb-8"> I build, I code, I tell stories.</p>

<Link href="/blog" className="underline text-primary hover:opacity-80"> Read the blog → </Link>
</Container>
);
}