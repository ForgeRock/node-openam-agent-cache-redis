var RedisCache = require('../index').RedisCache,
    assert = require('assert');

describe('RedisCache', function () {
    var redisCache;

    beforeEach(function () {
        redisCache = new RedisCache({
            url: process.env.REDIS_URL || 'redis://localhost:32771',
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
                    return redisCache.get('foo');
                })
                .then(function (res) {
                    assert(res === null);
                });
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
                    return redisCache.get('foo');
                })
                .then(function (res) {
                    assert(res === null);
                });
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
