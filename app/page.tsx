 import Container from "@/componenets/Container"
import RotatingCube from "@/componenets/RotatingCube"
import ThemeToggle from "@/componenets/ThemeToggle"
import Link from "next/link"
 
export default function HomePage() {
  return (
    <> 

      <Container  >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">Vyre</h1>
          <ThemeToggle />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-left gap-8 mb-8">
          <p className="text-lg opacity-80 text-center sm:text-left">
            I build, I code, I tell stories.
          </p>
          <div className="flex justify-center">
            <RotatingCube />
          </div>
        </div>

        <Link href="/blog" className="underline text-primary hover:opacity-80">Read the blog →</Link>
       </Container>
    </>
  )
}