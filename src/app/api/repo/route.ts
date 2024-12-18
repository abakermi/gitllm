import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'Missing repository URL' }, { status: 400 })
    }

    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) {
        return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 })
    }

    const [_, owner, repo] = match
    const maxFileSize = searchParams.get('maxFileSize')
    const ignorePatterns = searchParams.get('ignorePatterns')
    const includePatterns = searchParams.get('includePatterns')
    const outputFormat = searchParams.get('outputFormat') || 'txt'

    try {
        const workerUrl = `${process.env.WORKER_URL}/api/repo/${owner}/${repo}`
        const queryParams = new URLSearchParams({
            ...(maxFileSize && { maxFileSize }),
            ...(ignorePatterns && { ignorePatterns }),
            ...(includePatterns && { includePatterns }),
            outputFormat
        })

        const response = await fetch(`${workerUrl}?${queryParams}`)

        if (!response.ok) {
            return NextResponse.json({ error: 'Worker request failed' }, { status: response.status })
        }

        const responseData = await response.json()
  
        // Return structured response
        return NextResponse.json({
            summary:responseData.summary,
            contents:responseData.contents
        })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Failed to process repository' }, { status: 500 })
    }
} 