import { Edge } from './edge';
import { WangTile } from './tile';

// Type declaration for performance API
declare const performance: {
  now(): number;
} | undefined;

/**
 * Cache key for constraint lookups
 */
interface ConstraintCacheKey {
  /** Serialized tileset state (hash of tile IDs and their constraints) */
  tilesetHash: string;
  /** The edge constraint being applied */
  edge: string;
  /** The coordinates where the constraint is applied */
  coords: string;
}

/**
 * Cache entry storing the result of a constraint application
 */
interface ConstraintCacheEntry {
  /** The filtered tileset after applying the constraint */
  filteredTiles: string[];
  /** Timestamp when this entry was created */
  timestamp: number;
  /** Number of times this cache entry has been hit */
  hitCount: number;
}

/**
 * Performance metrics for the constraint cache
 */
export interface ConstraintCacheMetrics {
  /** Total number of cache lookups */
  totalLookups: number;
  /** Number of successful cache hits */
  cacheHits: number;
  /** Number of cache misses */
  cacheMisses: number;
  /** Cache hit rate as a percentage */
  hitRate: number;
  /** Total time saved by cache hits (in milliseconds) */
  timeSaved: number;
  /** Current cache size (number of entries) */
  cacheSize: number;
  /** Memory usage estimate (in bytes) */
  memoryUsage: number;
}

/**
 * High-performance constraint cache for Wang Tile constraint processing.
 * 
 * This cache stores the results of constraint applications to avoid
 * redundant filtering operations. It uses a combination of tileset
 * state hashing and constraint parameters as cache keys.
 */
export class ConstraintCache {
  private cache = new Map<string, ConstraintCacheEntry>();
  private metrics: ConstraintCacheMetrics = {
    totalLookups: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    timeSaved: 0,
    cacheSize: 0,
    memoryUsage: 0
  };

  /** Maximum number of cache entries before cleanup */
  private readonly maxCacheSize = 10000;
  
  /** Maximum age of cache entries in milliseconds (1 hour) */
  private readonly maxCacheAge = 60 * 60 * 1000;

  /**
   * Generate a hash for a tileset based on its tiles and their constraints
   * @param tiles - The tiles to generate a hash for
   * @returns A hash string representing the tileset
   */
  private generateTilesetHash<D extends number[], DataType>(tiles: WangTile<D, DataType>[]): string {
    // Create a deterministic hash based on tile data and constraints
    const tileData = tiles.map(tile => {
      const constraints = Array.from(tile.edges.entries())
        .map(([coords, edge]) => `${coords.join(',')}:${String(edge)}`)
        .sort()
        .join('|');
      return `${tile.toString()}:${constraints}`;
    }).sort().join(';');
    
    // Simple hash function (could be improved with a proper hash library)
    let hash = 0;
    for (let i = 0; i < tileData.length; i++) {
      const char = tileData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Create a cache key for a constraint lookup
   * @param tiles - The tiles involved in the constraint
   * @param edge - The edge constraint being applied
   * @param coords - The coordinates where the constraint applies
   * @returns A JSON string representing the cache key
   */
  private createCacheKey<D extends number[], DataType>(
    tiles: WangTile<D, DataType>[],
    edge: Edge,
    coords: number[]
  ): string {
    const tilesetHash = this.generateTilesetHash(tiles);
    const key: ConstraintCacheKey = {
      tilesetHash,
      edge: String(edge),
      coords: coords.join(',')
    };
    
    return JSON.stringify(key);
  }

  /**
   * Get cached constraint result
   * @param tiles - The tiles to lookup
   * @param edge - The edge constraint
   * @param coords - The coordinates
   * @returns Cached filtered tiles or null if not cached
   */
  getCachedResult<D extends number[], DataType>(
    tiles: WangTile<D, DataType>[],
    edge: Edge,
    coords: number[]
  ): WangTile<D, DataType>[] | null {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.metrics.totalLookups++;
    
    const cacheKey = this.createCacheKey(tiles, edge, coords);
    const entry = this.cache.get(cacheKey);
    
    if (entry) {
      // Check if entry is still valid (not expired)
      const now = Date.now();
      if (now - entry.timestamp < this.maxCacheAge) {
        entry.hitCount++;
        this.metrics.cacheHits++;
        this.metrics.hitRate = (this.metrics.cacheHits / this.metrics.totalLookups) * 100;
        
        const lookupTime = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime;
        this.metrics.timeSaved += lookupTime;
        
        // Convert tile strings back to actual tiles
        return tiles.filter(tile => entry.filteredTiles.includes(tile.toString()));
      } else {
        // Remove expired entry
        this.cache.delete(cacheKey);
      }
    }
    
    this.metrics.cacheMisses++;
    this.metrics.hitRate = (this.metrics.cacheHits / this.metrics.totalLookups) * 100;
    return null;
  }

  /**
   * Store a constraint result in the cache
   * @param originalTiles - The original tileset before filtering
   * @param filteredTiles - The filtered tileset after applying constraint
   * @param edge - The edge constraint applied
   * @param coords - The coordinates where constraint was applied
   */
  setCachedResult<D extends number[], DataType>(
    originalTiles: WangTile<D, DataType>[],
    filteredTiles: WangTile<D, DataType>[],
    edge: Edge,
    coords: number[]
  ): void {
    const cacheKey = this.createCacheKey(originalTiles, edge, coords);
    
    const entry: ConstraintCacheEntry = {
      filteredTiles: filteredTiles.map(tile => tile.toString()),
      timestamp: Date.now(),
      hitCount: 0
    };
    
    this.cache.set(cacheKey, entry);
    this.metrics.cacheSize = this.cache.size;
    
    // Cleanup if cache is too large
    if (this.cache.size > this.maxCacheSize) {
      this.cleanupCache();
    }
  }

  /**
   * Get cached result for multiple constraints (OR logic)
   * @param tiles - The tiles to lookup
   * @param edges - The edge constraints array
   * @param coords - The coordinates
   * @returns Cached filtered tiles or null if not cached
   */
  getCachedConstraintsResult<D extends number[], DataType>(
    tiles: WangTile<D, DataType>[],
    edges: Edge[],
    coords: number[]
  ): WangTile<D, DataType>[] | null {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.metrics.totalLookups++;
    
    // For multiple constraints, we need to check if we have a cached result
    // for the exact same combination of edges
    const edgesKey = edges.map(e => String(e)).sort().join(',');
    const cacheKey = this.createCacheKey(tiles, edgesKey as Edge, coords);
    const entry = this.cache.get(cacheKey);
    
    if (entry) {
      const now = Date.now();
      if (now - entry.timestamp < this.maxCacheAge) {
        entry.hitCount++;
        this.metrics.cacheHits++;
        this.metrics.hitRate = (this.metrics.cacheHits / this.metrics.totalLookups) * 100;
        
        const lookupTime = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime;
        this.metrics.timeSaved += lookupTime;
        
        return tiles.filter(tile => entry.filteredTiles.includes(tile.toString()));
      } else {
        this.cache.delete(cacheKey);
      }
    }
    
    this.metrics.cacheMisses++;
    this.metrics.hitRate = (this.metrics.cacheHits / this.metrics.totalLookups) * 100;
    return null;
  }

  /**
   * Store a constraint result for multiple constraints
   * @param originalTiles - The original tileset before filtering
   * @param filteredTiles - The filtered tileset after applying constraints
   * @param edges - The edge constraints applied
   * @param coords - The coordinates where constraints were applied
   */
  setCachedConstraintsResult<D extends number[], DataType>(
    originalTiles: WangTile<D, DataType>[],
    filteredTiles: WangTile<D, DataType>[],
    edges: Edge[],
    coords: number[]
  ): void {
    const edgesKey = edges.map(e => String(e)).sort().join(',');
    const cacheKey = this.createCacheKey(originalTiles, edgesKey as Edge, coords);
    
    const entry: ConstraintCacheEntry = {
      filteredTiles: filteredTiles.map(tile => tile.toString()),
      timestamp: Date.now(),
      hitCount: 0
    };
    
    this.cache.set(cacheKey, entry);
    this.metrics.cacheSize = this.cache.size;
    
    if (this.cache.size > this.maxCacheSize) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up old or least-used cache entries
   */
  private cleanupCache(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by hit count (ascending) and timestamp (ascending)
    entries.sort((a, b) => {
      const hitDiff = a[1].hitCount - b[1].hitCount;
      if (hitDiff !== 0) return hitDiff;
      return a[1].timestamp - b[1].timestamp;
    });
    
    // Remove the least useful entries (bottom 20%)
    const removeCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0]);
    }
    
    this.metrics.cacheSize = this.cache.size;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.metrics.cacheSize = 0;
  }

  /**
   * Get current cache performance metrics
   * @returns The cache performance metrics
   */
  getMetrics(): ConstraintCacheMetrics {
    // Estimate memory usage (rough calculation)
    let memoryEstimate = 0;
    for (const [key, entry] of this.cache.entries()) {
      memoryEstimate += key.length * 2; // UTF-16 characters
      memoryEstimate += entry.filteredTiles.join(',').length * 2;
      memoryEstimate += 24; // timestamp + hitCount + overhead
    }
    this.metrics.memoryUsage = memoryEstimate;
    
    return { ...this.metrics };
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalLookups: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      timeSaved: 0,
      cacheSize: this.cache.size,
      memoryUsage: 0
    };
  }
}
