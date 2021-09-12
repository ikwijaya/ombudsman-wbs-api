/**
 * Memory Caching
 */

const mcache = require('memory-cache')
const duration = 1000;

/**
 * 
 * @param {*} d default 30
 * @description Search by key
 */
const MCache = (d = 30) => {
  return (req, res, next) => {
    var key = JSON.stringify(Object.assign(req.body, req.originalUrl || req.url));
    var cacheContent = mcache.get(key);

    if (cacheContent) {
      res.status(200).send(JSON.parse(cacheContent))
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * d)
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports = {
  MCache
}

