/**
 * CASSANDRA
 */

const { logger } = require('../helper')
const cassandra = require('cassandra-driver');
const env = process.env;
const authProvider = new cassandra.auth.PlainTextAuthProvider(env.CASSANDRA_USERNAME, env.CASSANDRA_PASSWORD)
const contactPoint = [env.CASSANDRA_CONTACT_POINTS]
const keySpace = env.CASSANDRA_KEYSPACE

module.exports = {
  exec: (query = '', params = []) => {
    console.log({
      contactPoint: contactPoint,
      keySpace: keySpace
    })

    let client = new cassandra.Client({ contactPoint, authProvider, keySpace })
    return new Promise((o, x) => {
      client.execute(query, params, (err, res) => {
        if (err) {
          x(err)
        } else {
          o(res)
        }
      })
    })
  }
}