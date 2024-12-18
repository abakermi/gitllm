import { Card } from "@/components/ui/card"
import { Code, Zap, Users, BarChart } from 'lucide-react'

const featureData = [
  { icon: Code, title: "AI-Optimized Format", description: "Convert your codebase into a format that's perfect for AI model training and analysis." },
  { icon: Zap, title: "Lightning Fast", description: "Process large repositories in seconds, saving you valuable development time." },
  { icon: Users, title: "Team Collaboration", description: "Share processed codebases with your team to improve collective understanding and productivity." },
  { icon: BarChart, title: "Insights & Analytics", description: "Gain valuable insights into your codebase structure and complexity." }
]

export function Features() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold text-white">Why Choose Gitingest?</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {featureData.map((feature, index) => (
          <Card key={index} className="bg-white/5 p-6">
            <feature.icon className="mb-4 h-10 w-10 text-green-400" />
            <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

