'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Orbit, GithubIcon } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <nav className="border-b border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Orbit className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold text-white">Gitllm</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="https://github.com/abakermi/gitllm" className="flex items-center gap-2 text-white text-lg font-semibold hover:text-green-400">
            Api
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
              Soon
            </Badge>
          </Link>
          <Link href="https://github.com/abakermi/gitllm" className="flex items-center gap-2 text-white text-lg font-semibold hover:text-green-400">
            <GithubIcon className="h-4 w-4" /> Github
          </Link>
        </div>
      </div>
    </nav>
  )
}

