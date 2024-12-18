import { GithubFile, RepoContent } from '../types';

export class ProcessorService {
  createSummary(files: GithubFile[]): string {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalFiles = files.length;
    
    return [
      `Total Files: ${totalFiles}`,
      `Total Size: ${this.formatSize(totalSize)}`,
      `File Types: ${this.getFileTypes(files).join(', ')}`,
    ].join('\n');
  }

  createTree(files: GithubFile[]): string {
    const tree = new Map<string, Set<string>>();
    
    for (const file of files) {
      const parts = file.path.split('/');
      let currentPath = '';
      
      for (let i = 0; i < parts.length - 1; i++) {
        const parent = currentPath;
        currentPath += (currentPath ? '/' : '') + parts[i];
        
        if (!tree.has(currentPath)) {
          tree.set(currentPath, new Set());
        }
        if (parent) {
          tree.get(parent).add(parts[i]);
        }
      }
      
      const dir = parts.slice(0, -1).join('/');
      if (dir && !tree.has(dir)) {
        tree.set(dir, new Set());
      }
      if (dir) {
        tree.get(dir).add(parts[parts.length - 1]);
      }
    }

    return this.renderTree(tree);
  }

  private renderTree(tree: Map<string, Set<string>>, path: string = '', prefix: string = ''): string {
    const output: string[] = [];
    const items = Array.from(tree.get(path) || []).sort();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isLast = i === items.length - 1;
      const newPath = path ? `${path}/${item}` : item;
      
      output.push(`${prefix}${isLast ? '└── ' : '├── '}${item}`);
      
      if (tree.has(newPath)) {
        output.push(this.renderTree(
          tree,
          newPath,
          `${prefix}${isLast ? '    ' : '│   '}`
        ));
      }
    }
    
    return output.join('\n');
  }

  private getFileTypes(files: GithubFile[]): string[] {
    const types = new Set(
      files.map(file => file.path.split('.').pop()).filter(Boolean)
    );
    return Array.from(types);
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    
    while (size > 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }
    
    return `${Math.round(size * 100) / 100}${units[unit]}`;
  }
} 