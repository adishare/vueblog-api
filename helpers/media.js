const { Storage } = require('@google-cloud/storage');
const Multer = require('multer')
const CLOUD_BUCKET = process.env.CLOUD_BUCKET
const storage = new Storage({ projectId: process.env.PROJECT_ID, keyFilename: process.env.KEYFILE_PATH });

const bucket = storage.bucket(CLOUD_BUCKET)

const getPublicUrl = (filename) => {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
    // dest: '../images'
})

const sendUploadToGCS = (req, res, next) => {

    if (!req.file) return next()

    const gcsname = Date.now() + req.file.originalname
    const file = bucket.file(gcsname)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', (err) => {
        req.file.cloudStorageObject = gcsname
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
            
            next()
        })
    })

    stream.end(req.file.buffer)
}

module.exports = {
    sendUploadToGCS,
    multer,
    
    callback(req, res) {

        if (!req.file) {
            return res.status(200).json({
                link: ''
            })
        }
        res.status(201).json({
            link: req.file.cloudStoragePublicUrl
        })

    }

}