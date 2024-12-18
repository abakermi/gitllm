'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { Copy, Download } from "lucide-react"
import { formatData } from "@/lib/utils"

const formSchema = z.object({
  url: z.string()
    .url("Please enter a valid URL")
    .regex(
      /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/,
      "Please enter a valid GitHub repository URL"
    )
})

export function MainForm() {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState({
    maxFileSize: 10 * 1024,
    ignorePatterns: ['node_modules/', '.git/', 'dist/', 'build/'],
    includePatterns: ['*'],
    outputFormat: 'txt'
  })
  const [result, setResult] = useState<any>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const handleIngest = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        url: values.url,
        maxFileSize: options.maxFileSize.toString(),
        ignorePatterns: options.ignorePatterns.join(','),
        includePatterns: options.includePatterns.join(','),
        outputFormat: options.outputFormat
      })

      const response = await fetch(`/api/repo?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }
      
      setResult(formatData(data.summary, data.contents))
      toast.success('Repository processed successfully!')
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process repository')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'repository-data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  const handleSliderChange = (value: number[]) => {
    setOptions(prev => ({
      ...prev,
      maxFileSize: value[0] * 1024
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-4xl bg-white/5 backdrop-blur-sm">
        <form onSubmit={form.handleSubmit(handleIngest)} className="p-6">
          <div className="mb-6 flex gap-2">
            <div className="flex-1">
              <Input 
                {...form.register("url")}
                placeholder="https://github.com/username/repository" 
                className="bg-white/10 text-white placeholder:text-gray-400 py-3"
                disabled={loading}
              />
              {form.formState.errors.url && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.url.message}
                </p>
              )}
            </div>
            <Button 
              type="submit"
              disabled={loading || !form.formState.isValid}
              className="bg-green-400 text-[#003344] hover:bg-green-500 py-3 px-5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingesting...
                </>
              ) : (
                'Ingest'
              )}
            </Button>
          </div>

          <Tabs defaultValue="options" className="mb-6">
            <TabsList className="bg-white/10">
              <TabsTrigger value="options" className="text-white data-[state=active]:bg-green-400 data-[state=active]:text-[#003344] ">Options</TabsTrigger>
              <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-green-400 data-[state=active]:text-[#003344] ">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="options">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Include files under:</span>
                  <span className="text-sm font-medium text-white">{options.maxFileSize / 1024}kb</span>
                </div>
                <Slider
                  defaultValue={[10]}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-green-400"
                  onValueChange={handleSliderChange}
                />
              </div>
            </TabsContent>
            <TabsContent value="advanced">
              <div className="space-y-4">
                <Input 
                  value={options.ignorePatterns.join(', ')}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    ignorePatterns: e.target.value.split(',').map(p => p.trim())
                  }))}
                  placeholder="Exclude file patterns (e.g., *.test.js)" 
                  className="bg-white/10 text-white placeholder:text-gray-400"
                />
                <Input 
                  value={options.outputFormat}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    outputFormat: e.target.value
                  }))}
                  placeholder="Custom output format (txt, json, yaml)" 
                  className="bg-white/10 text-white placeholder:text-gray-400"
                />
              </div>
            </TabsContent>
            
          </Tabs>

          {result && (
            <div className="mt-6 space-y-4">
              <textarea
                readOnly
                value={result}
                className="w-full h-[400px] rounded-lg border bg-white/5 p-4 
                  text-sm font-mono text-white resize-none focus:outline-none"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="default"
                  className="flex items-center gap-2 bg-white/5"
                >
                  <Copy className="h-4 w-4 text-green-400" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="default"
                  className="flex items-center gap-2 bg-white/5"
                >
                  <Download className="h-4 w-4 text-green-400" />
                  Download JSON
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}

