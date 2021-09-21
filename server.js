const express = require('express')
const compression = require('compression')
const path = require('path')
const { PORT, APP_CODE } = require('./config')
const api = require('./api/v1')
const { response } = require('./models')
const port = PORT
const app = express()
const bunyan = require('bunyan')
const log = bunyan.createLogger({
    name: APP_CODE,
    serializers: bunyan.stdSerializers
})

app.use(compression({ filter: shouldCompress }))
app.use(express.json())
app.use((req, res, next) => {
    req.log = log.child({ req_id: new Date() }, true)
    req.log.info({ req })
    res.on('finish', () => req.log.info({ res }))
    next()
})
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) { res.status(400).send(response.failed("Bad Request")) } else { next() }
})
app.get('/', (req,res,next) => {
    res.sendFile(path.join(__dirname+'/__templates/index.html'))
})
app.get('/version', async (req, res, next) => {
    let gc = await helper.getGitCommit()
    delete gc['author']
    delete gc['committer']
    
    res.send({
        version: require('./package.json').version,
        description: require('./package.json').description,
        author: require('./package.json').author,
        git: gc
    })
})

// authenticate
const sequelize = require('./sequelize')
const { helper } = require('./helper')
const authenticate = async () => {
    try {
        await sequelize.authenticate();
        log.info('🚀 yey! your database is connected to me.')
    } catch (err) {
        log.error('sorry, something wrong with your connection: ', err)
    }
}

authenticate();
app.use('/v1', api)
app.listen(process.env.PORT || port, function () {
    log.info("🚀 ombudsman-api running in port ' + port, 'server", this.address().port, app.settings.env);
});

// method
function shouldCompress(req, res) {
    if (req.headers['x-no-compression'])
        return false

    return compression.filter(req, res)
}