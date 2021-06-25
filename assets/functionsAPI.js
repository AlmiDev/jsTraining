exports.success = function (result) {
    return {
        status : 'success',
        result : result
    }
}

exports.error = function (message) {
    return {
        status : 'error',
        message : message
    }
}


exports.isErr = (err) => {
    return  err instanceof Error;  // renvoie un booléen qui est vrai si le paramètre est de la classe Error
}

exports.checkAndChange =(obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    } else {
        return this.success(obj)
    }
}