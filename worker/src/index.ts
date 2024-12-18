import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { GithubService } from './services/github'
import { ProcessorService } from './services/processor'
import { ProcessOptions } from './types'

type Bindings = {
	GITHUB_TOKEN: string
	custom: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
const processor = new ProcessorService()

// Middleware
app.use('*', cors())
app.use('/api/*', cache({
	cacheName: 'gitllm-cache',
	cacheControl: 'max-age=3600',
}))

app.use('*', async (c, next) => {
	const ip = c.req.header('cf-connecting-ip')
	const current = await c.env.custom.get(`ratelimit:${ip}`)
	if (current && Number(current) > 100) { // 100 requests per hour
		return c.json({ error: 'Rate limit exceeded' }, 429)
	}
	await c.env.custom.put(`ratelimit:${ip}`, String(Number(current) + 1), { expirationTtl: 3600 })
	await next()
})

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Main API endpoint
app.get('/api/repo/:owner/:repo', async (c) => {
	const { owner, repo } = c.req.param()
	const query = c.req.query()

	try {
		const options = ProcessOptions.parse({
			maxFileSize: Number(query.maxFileSize) || 1024 * 1024,
			ignorePatterns: query.ignorePatterns?.split(',') || ['node_modules/', '.git/', 'dist/', 'build/'],
			includePatterns: query.includePatterns?.split(',') || ["*"],
		})

		const outputFormat = query.outputFormat || 'json'
		const cacheKey = `${owner}/${repo}:${JSON.stringify(options)}:${outputFormat}`

		// Check cache
		const cached = await c.env.custom.get(cacheKey)
		if (cached) {
			return formatResponse(c, cached, outputFormat)
		}

		const github = new GithubService()
		const files = await github.getRepoContents(owner, repo, options)

		const result = {
			summary: processor.createSummary(files),
			tree: processor.createTree(files),
			contents: files,
		}

		const resultStr = JSON.stringify(result)
		await c.env.custom.put(cacheKey, resultStr, { expirationTtl: 3600 })

		return formatResponse(c, resultStr, outputFormat)
	} catch (err) {
		console.error(err)
		return c.json({ error: 'Failed to process repository' }, 500)
	}
})

function formatResponse(c: any, data: string, format: string) {
	const json = JSON.parse(data)
	
	switch (format.toLowerCase()) {
		case 'txt':
			return c.json({
				...json,
				contents: json.contents.map((file: any) => ({
					...file,
					content: file.content.toString()
				}))
			})
			
		case 'yaml':
			return c.json({
				...json,
				contents: json.contents.map((file: any) => ({
					...file,
					content: file.content
						.replace(/{/g, '')
						.replace(/}/g, '')
						.replace(/"/g, '')
						.replace(/,/g, '')
						.split('\n')
						.map((line: string) => line.trim())
						.filter(Boolean)
						.join('\n')
				}))
			})
			
		case 'json':
		default:
			return c.json(json)
	}
}

// Error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.json(
		{
			error: 'Internal Server Error',
			message: err.message
		},
		500
	)
})

// 404 handler
app.notFound((c) => {
	return c.json(
		{
			error: 'Not Found',
			message: 'The requested resource was not found'
		},
		404
	)
})

export default app
