const success = (msg = 'OK', data = []) => {
    return {
        "status_code": 'success',
        "status_css": 'success',
        "status_message": msg,
        "data": data
    }
}

const failed = (msg = 'Failed', is_relogin = false) => {
    return {
        "status_code": 'error',
        "status_css": 'error',
        "status_message": msg,
        "is_relogin": is_relogin
    }
}


module.exports = {
    success,
    failed
}