var Promise = require('bluebird'),
    util = require('util'),
    redis = require('redis'),
    Cache = require('openam-agent-cache').Cache;

// de-nodeify
Promise.promisifyAll(redis.RedisClient.prototype);

/**
 * Cache implementation for redis
 *
 * @extends Cache
 *
 * @param {object} [options] Options
 * @param {string} [options.url=http://localhost/11211] redis URL
 * @param {number} [options.expireAfterSeconds=60] Expiration time in seconds
 * @param {*|undefined} [options.redis] Redis options (see  {@link https://www.npmjs.com/package/redis})
 *
 * @example
 * var redisCache = new RedisCache({
 *   url: 'cache.example.com:11211',
 *   expireAfterSeconds: 600,
 *   redis: {
 *      retry_strategy:
 *   }
 * });
 *
 * @constructor
 */
function RedisCache(options) {
    var self = this;

    if (!util.isObject(options)) {
        options = {};
    }

    if (!util.isString(options.url)) {
        options.url = 'redis://localhost:6379';
    }

    if (!util.isNumber(options.expireAfterSeconds)) {
        options.expireAfterSeconds = 60;
    }

    this.client = redis.createClient(util._extend({url: options.url}, options.redis));
    this.expireAfterSeconds = options.expireAfterSeconds;
}

/**
 * Default prefix for storing keys
 * @type {string}
 */
RedisCache.PREFIX = 'node-openam-agent-cache:';

util.inherits(RedisCache, Cache);

/**
 * Get a single cached item
 * If the entry is not found, reject
 *
 * @param {string} key
 *
 * @return {Promise}
 *
 * @example
 * redisCache.get('foo').then(function (cached) {
 *   console.log(cached);
 * }).catch(function (err) {
 *   console.error(err);
 * });
 */
RedisCache.prototype.get = function (key) {
    return this.client.getAsync(RedisCache.PREFIX + key)
        .then(function (res) {
            return JSON.parse(res);
        })
        .catch(function () {
            throw new Error('RedisCache: entry not found in cache')
        });
};

/**
 * Store a single cached item (overwrites existing)
 *
 * @param {string} key
 *
 * @param {*} value
 *
 * @return {Promise}
 *
 * @example
 * redisCache.put('foo', {bar: 'baz'}).then(function () {
 *   console.log('foo saved to cache');
 * }).catch(function (err) {
 *   console.error(err);
 * });
 */
RedisCache.prototype.put = function (key, value) {
    var self = this;

    return this.client.setAsync(RedisCache.PREFIX + key, JSON.stringify(value)).then(function () {
        return self.client.expireAsync(RedisCache.PREFIX + key, self.expireAfterSeconds);
    });
};

/**
 * Remove a single cached item
 *
 * @param {string} key
 *
 * @return {Promise}
 *
 * @example
 * redisCache.remove('foo').then(function () {
 *   console.log('foo removed from cache');
 * }).catch(function (err) {
 *   console.error(err);
 * });
 */
RedisCache.prototype.remove = function (key) {
    return this.client.delAsync(RedisCache.PREFIX + key);
};

/**
 * Closes the client connection
 *
 * @return {Promise}
 */
RedisCache.prototype.quit = function () {
    return this.client.quitAsync();
};

module.exports.RedisCache = RedisCache;
