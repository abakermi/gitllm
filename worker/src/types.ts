import { z } from "zod";

export const GithubFile = z.object({
	path: z.string(),
	content: z.string(),
	size: z.number(),
});

export const RepoContent = z.object({
	summary: z.string(),
	tree: z.string(),
	contents: z.array(GithubFile),
});

export const ProcessOptions = z.object({
	maxFileSize: z.number().default(100000),
	ignorePatterns: z.array(z.string()).default([
		'.git',
		'node_modules',
		'*.jpg',
		'*.png',
		'*.svg',
		'*.pyc',
	]),
	includePatterns: z.array(z.string()).optional().default(["*"]),
});

export type GithubFile = z.infer<typeof GithubFile>;
export type RepoContent = z.infer<typeof RepoContent>;
export type ProcessOptions = z.infer<typeof ProcessOptions>;
