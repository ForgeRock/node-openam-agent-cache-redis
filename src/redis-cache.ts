import { Cache } from '@forgerock/openam-agent';
import { createClient, RedisClient } from 'redis';
import * as promisifyAll from 'util-promisifyall';

/**
 * This cache implementation stores entries in a map in memory (not efficient for large caches)
 * @example
 * const cache = new RedisCache<{bar: string}>({expireAfterSeconds: 600}); // cached entries expire after 10 minutes
 * cache.put('foo', { bar: 'baz' });
 */

export class RedisCache<T = any> implements Cache<T> {
  private client: RedisClient;
  private expireAfterSeconds: Number;
  private PREFIX: String = 'node-openam-agent-cache:';

  constructor(options: RedisClient | Object) {
    if (options instanceof RedisClient) {
      this.client = promisifyAll(options);
    } else {
      this.client = promisifyAll(createClient(options));
    }
    this.expireAfterSeconds = parseInt(options.expireAfterSeconds || 300, 10);
  }

  async get(key: string): Promise<T> {
    if (!key) { throw new Error('RedisCache: empty key request'); }
    const res = await this.client.getAsync(this.PREFIX + key);
    if (!res) { throw new Error('RedisCache: entry not found in cache'); }
    return JSON.parse(res);
  }

  async put(key: string, value: T): Promise<void> {
    return this.client.setAsync(this.PREFIX + key, JSON.stringify(value), 'EX', this.expireAfterSeconds);
  }

  async remove(key: string): Promise<void> {
    return this.client.delAsync(this.PREFIX + key);
  }

  async quit(): Promise<void> {
    return this.client.quitAsync();
  }
}
