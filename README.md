# openam-agent-cache-redis
Cache using Redis for the OpenAM Policy Agent for NodeJS

Installation: `npm install @forgerock/openam-agent-cache-redis`

# API Docs

<a name="RedisCache"></a>

## RedisCache ⇐ <code>Cache</code>
**Kind**: global class  
**Extends:** <code>Cache</code>  

* [RedisCache](#RedisCache) ⇐ <code>Cache</code>
    * [new RedisCache([options])](#new_RedisCache_new)
    * _instance_
        * [.get(key)](#RedisCache+get) ⇒ <code>Promise</code>
        * [.put(key, value)](#RedisCache+put) ⇒ <code>Promise</code>
        * [.remove(key)](#RedisCache+remove) ⇒ <code>Promise</code>
        * [.quit()](#RedisCache+quit) ⇒ <code>Promise</code>
    * _static_
        * [.PREFIX](#RedisCache.PREFIX) : <code>string</code>

<a name="new_RedisCache_new"></a>

### new RedisCache([options])
Cache implementation for redis


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | Options |
| [options.url] | <code>string</code> | <code>&quot;redis://localhost/6379&quot;</code> | redis URL |
| [options.expireAfterSeconds] | <code>number</code> | <code>60</code> | Expiration time in seconds |
| [options.redis] | <code>\*</code> &#124; <code>undefined</code> |  | Redis options (see  [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis)) |

**Example**  
```js
var redisCache = new RedisCache({
  url: 'redis://cache.example.com:6379',
  expireAfterSeconds: 600,
  redis: {
     retry_strategy: function (options) {
         // do stuff
     }
  }
});
```
<a name="RedisCache+get"></a>

### redisCache.get(key) ⇒ <code>Promise</code>
Get a single cached item
If the entry is not found, reject

**Kind**: instance method of <code>[RedisCache](#RedisCache)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

**Example**  
```js
redisCache.get('foo').then(function (cached) {
  console.log(cached);
}).catch(function (err) {
  console.error(err);
});
```
<a name="RedisCache+put"></a>

### redisCache.put(key, value) ⇒ <code>Promise</code>
Store a single cached item (overwrites existing)

**Kind**: instance method of <code>[RedisCache](#RedisCache)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>\*</code> | 

**Example**  
```js
redisCache.put('foo', {bar: 'baz'}).then(function () {
  console.log('foo saved to cache');
}).catch(function (err) {
  console.error(err);
});
```
<a name="RedisCache+remove"></a>

### redisCache.remove(key) ⇒ <code>Promise</code>
Remove a single cached item

**Kind**: instance method of <code>[RedisCache](#RedisCache)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

**Example**  
```js
redisCache.remove('foo').then(function () {
  console.log('foo removed from cache');
}).catch(function (err) {
  console.error(err);
});
```
<a name="RedisCache+quit"></a>

### redisCache.quit() ⇒ <code>Promise</code>
Closes the client connection

**Kind**: instance method of <code>[RedisCache](#RedisCache)</code>  
<a name="RedisCache.PREFIX"></a>

### RedisCache.PREFIX : <code>string</code>
Default prefix for storing keys
Value: "node-openam-agent-cache:"

**Kind**: static property of <code>[RedisCache](#RedisCache)</code>  

## DISCLAIMER

The sample code described herein is provided on an "as is" basis, without warranty of any kind, to the fullest extent permitted by law. ForgeRock does not warrant or guarantee the individual success developers may have in implementing the sample code on their development platforms or in production configurations.

ForgeRock does not warrant, guarantee or make any representations regarding the use, results of use, accuracy, timeliness or completeness of any data or information relating to the sample code. ForgeRock disclaims all warranties, expressed or implied, and in particular, disclaims all warranties of merchantability, and warranties related to the code, or any service or software related thereto.

ForgeRock shall not be liable for any direct, indirect or consequential damages or costs of any type arising out of any action taken by you or others related to the sample code.
