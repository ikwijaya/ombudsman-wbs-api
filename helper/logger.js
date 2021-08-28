const moment = require('moment')

module.exports = {
    info: (message='-', category='-', isTable=false) => {
        isTable = Number(process.version.match(/^v(\d+\.\d+)/)[1]) >= 10 ? isTable : false;
        isTable = message.length < 2048 ? isTable : false; 
        if(isTable){
            console.table([
                {
                    logType: 'INFO',
                    category: category,
                    msg: message,
                    time: moment().format('DD MMMM YYYY | HH:mm:ss | SSS')
                }
            ])
        } else {
            console.log({
                logType: 'INFO',
                category: category,
                msg: message,
                time: moment().format('DD MMMM YYYY | HH:mm:ss | SSS')
            })
        }
    },

    error: (message='-', category='-', isTable=false) => {
        isTable = Number(process.version.match(/^v(\d+\.\d+)/)[1]) >= 10 ? isTable : false;
        isTable = message.length < 2048 ? isTable : false;
        message = JSON.stringify(message)
        if(isTable){
            console.table([
                {
                    logType: 'ERROR',
                    category: category,
                    msg: message,
                    time: moment().format('DD MMMM YYYY | HH:mm:ss | SSS')
                }
            ])
        } else {
            console.log({
                logType: 'ERROR',
                category: category,
                msg: message,
                time: moment().format('DD MMMM YYYY | HH:mm:ss | SSS')
            })
        }
    }
}