import { Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#003344] border-t border-white/10 py-6 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-center ">
        <p className="text-sm text-white/60">
          Made with 🎄 during holidays by{' '}
          <Link 
            href="https://github.com/abakermi" 
            className="text-green-400 hover:text-green-500"
            target="_blank"
          >
            abakermi
          </Link>
        </p>
        <Link
          href="https://x.com/abakermi"
          className="text-white/60 hover:text-green-400 transition-colors"
          target="_blank"
        >
          <Twitter className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  )
}
