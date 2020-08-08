const multer = require('multer');

const fileStorage = multer.diskStorage({
      destination: function (_, _, cb) {
      cb(null, 'Photos')
    },
    filename: function (_, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
});
const fileFilter = (_,file,cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ){
        cb(null,true);
    } else{
        cb(null,false);
    }
}
exports.upload = multer({ storage: fileStorage,
  limits: {fileSize : 2*1024*1024 }, fileFilter : fileFilter }).single('photo');
