const express = require('express')
const compression = require('compression')

const { PORT } = require('./config')
const api = require('./api/v1')
const { logger } = require('./helper')
const { response } = require('./models')
const port = PORT
const app = express()

app.use(compression({ filter: shouldCompress }))
app.use(express.json())
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        logger.error("Invalid JSON format", "express-json", true)
        res.status(400).send(response.failed("Bad Request"))
    } else {
        next()
    }
})

// authenticate
const sequelize = require('./sequelize')
const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('🚀 yey! your database is connected to me.');
    } catch (err) {
        console.error('sorry, something wrong with your connection: ', err);
    }
}

authenticate();
app.use('/v1', api)
// app.listen(port, () => { logger.info('🚀 ombudsman-api running in port ' + port, 'server', true) })  
app.listen(process.env.PORT || port, function () {
    console.log("🚀 ombudsman-api running in port ' + port, 'server", this.address().port, app.settings.env);
});

// method
function shouldCompress(req, res) {
    if (req.headers['x-no-compression'])
        return false

    // fallback to standard filter function
    return compression.filter(req, res)
}