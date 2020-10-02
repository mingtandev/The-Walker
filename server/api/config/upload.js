const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './../uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().split(/:/).join('-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(new Error('File type do not support (Accept: jpg, jpeg, png)'), false)
    }
}

const upload = multer({
    storage,
    limits: 1024 * 1024 * 5, // 5 MB
    fileFilter
})

module.exports = upload