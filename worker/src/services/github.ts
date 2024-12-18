import { Octokit } from '@octokit/rest';
import { GithubFile, ProcessOptions } from '../types';
import { minimatch } from 'minimatch';
import fetch from 'node-fetch';

export class GithubService {
  private octokit: Octokit;
  
  constructor() {
    this.octokit = new Octokit({ 
      request: {
        fetch: fetch
      }
    });
  }

  async getRepoContents(owner: string, repo: string, options: ProcessOptions): Promise<GithubFile[]> {
    const tree = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: 'HEAD',
      recursive: 'true'
    });

    const files = await Promise.all(
      tree.data.tree
        .filter(item => {
          if (item.type !== 'blob') return false;
          if (item.size > options.maxFileSize) return false;
          
          const shouldIgnore = options.ignorePatterns.some(pattern => 
            minimatch(item.path, pattern)
          );
          if (shouldIgnore) return false;

          if (options.includePatterns) {
            return options.includePatterns.some(pattern => 
              minimatch(item.path, pattern)
            );
          }
          
          return true;
        })
        .map(async file => {
          const content = await this.octokit.git.getBlob({
            owner,
            repo,
            file_sha: file.sha
          });
          
          return {
            path: file.path,
            content: Buffer.from(content.data.content, 'base64').toString(),
            size: file.size
          };
        })
    );

    return files;
  }
} 