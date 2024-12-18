


export function Hero() {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1920')] bg-cover bg-center opacity-10" />
        <div className="container relative mx-auto px-4 py-10 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Supercharge Your{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              AI Development
            </span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-gray-300">
            Transform any GitHub repository into an AI-friendly format. Optimize your codebase for LLMs, 
            enhance your development workflow, and unlock new possibilities in AI-assisted coding.
          </p>
     
        </div>
      </div>
    )
  }
  
  