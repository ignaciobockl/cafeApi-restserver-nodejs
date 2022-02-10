const path = require('path');
const { v4: uuidav4 } = require('uuid');


const fileUpload = (files, allowedExtensions = ['jpg', 'png', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const cutName = file.name.split('.');
        const extension = cutName[cutName.length - 1];

        // validate the extension
        if (!allowedExtensions.includes(extension)) { return reject(`You uploaded a file with an illegal extension. Allowed extensions: ${ allowedExtensions }.`) }

        // generate a temporary name for the file - with uuid
        const temporaryName = uuidav4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../../uploads/', folder, temporaryName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(uploadPath);
        });

    });

}


module.exports = {
    fileUpload
}