const { request, response } = require("express")


const validateFileUpload = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({ ok: false, errorMsg: 'There is no file to upload - validateFileUpload.' })
    }

    next();

}


module.exports = {
    validateFileUpload
}