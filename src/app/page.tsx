import { Header } from "@/components/ui/header"
import { Hero } from "@/components/ui/hero"
import { MainForm } from "@/components/ui/main-form"
import { Features } from "@/components/ui/features"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#003344]">
      <Header />
      <Hero />
      <MainForm />
      <Features />
    </div>
  )
}

