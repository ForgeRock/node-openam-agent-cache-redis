var RedisCache = require('../dist/index').RedisCache,
    assert = require('assert');

describe('RedisCache', function () {
    var redisCache;

    beforeEach(function () {
        redisCache = new RedisCache({
            port: process.env.REDIS_PORT || '6379',
            host: process.env.REDIS_HOST || 'localhost',
            expireAfterSeconds: 1
        });
    });

    afterEach(function () {
        redisCache.quit();
    });

    describe('put', function () {
        it('should put an entry in redis', function () {
            return redisCache.put('foo', 'bar')
                .then(function () {
                    return redisCache.get('foo');
                })
                .then(function (res) {
                    assert(res === 'bar');
                });
        });

        it('should make entries expire', function () {
            return redisCache.put('foo', 'bar')
                .then(function () {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, 1100);
                    });
                })
                .then(function () {
                  try {
                      redisCache.get('foo');
                  } catch (err) {
                      assert.equal(err.message, 'RedisCache: entry not found in cache');
                  }
                })
        });


    });

    describe('get', function () {
        it('should get an entry from redis', function () {
            return redisCache.put('foo', {foo: 'bar'})
                .then(function () {
                    return redisCache.get('foo');
                })
                .then(function (res) {
                    assert(res.foo === 'bar');
                });
        });

    });

    describe('remove', function () {
        it('should remove an entry from redis', function () {
            return redisCache.put('foo', 'bar')
                .then(function () {
                    return redisCache.remove('foo');
                })
                .then(function () {
                  try {
                      redisCache.get('foo');
                  } catch (err) {
                      assert.equal(err.message, 'RedisCache: entry not found in cache');
                  }
                })
        });
    });

    describe('quit', function () {
        it('should close the connection to redis and not allow any more operations', function () {
            return redisCache.quit()
                .then(function () {
                    return redisCache.put('foo', 'bar');
                })
                .then(function () {
                    throw 'write allowed after quit() was called'
                })
                .catch(function (err) {
                    assert(!!err);
                });
        });

    });


});
