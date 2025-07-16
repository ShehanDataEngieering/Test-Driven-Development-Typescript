import * as fs from 'fs';
import * as path from 'path';

export class SQLQueryLoader {
  private cache: Map<string, string> = new Map();
  private readonly queriesDir: string;

  constructor(queriesDir?: string) {
    this.queriesDir = queriesDir || path.join(__dirname, 'queries');
  }

  loadQuery(queryName: string): string {
    // Check cache first
    if (this.cache.has(queryName)) {
      return this.cache.get(queryName)!;
    }

    // Load from file
    const filePath = path.join(this.queriesDir, `${queryName}.sql`);
    
    try {
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      
      // Cache the result
      this.cache.set(queryName, sqlContent);
      
      return sqlContent;
    } catch (error) {
      throw new Error(`Failed to load SQL query '${queryName}': ${error}`);
    }
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }

  // Get all available queries
  getAvailableQueries(): string[] {
    try {
      const files = fs.readdirSync(this.queriesDir);
      return files
        .filter(file => file.endsWith('.sql'))
        .map(file => path.basename(file, '.sql'));
    } catch (error) {
      throw new Error(`Failed to read queries directory: ${error}`);
    }
  }
}
