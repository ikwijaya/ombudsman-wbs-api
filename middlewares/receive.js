
const { header, validationResult } = require('express-validator')
const models = require('../models')

const rules = () => {
    return []
}

const validate = (req, res, next) => {
    const error = validationResult(req)
    if (error.isEmpty())
        return next()

    res.status(401).send(models.response.failed('Unauthorized'))
}

module.exports = {
    rules,
    validate
}

