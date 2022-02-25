const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const maxSize = 2 * 1024 * 1024;

/*Conf Upload Promotion*/
const storage = multer.diskStorage({
destination: function(req, file, cb){
    if (!fs.existsSync(path.join(__dirname,process.env.PATH_PROMOTION))) {
        fs.mkdirSync(path.join(__dirname,process.env.PATH_PROMOTION), {
            recursive: true
        });
    }
    cb(null, path.join(__dirname,process.env.PATH_PROMOTION));
},
filename: function(req, file, cb){
    cb(null, 'promo' + '-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
});

module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpeg' && ext !== '.jpg') {
          return callback(new Error('Only Images allowed'))
      }
      callback(null, true)
  },
//   limits: {
//       fileSize: maxSize, fields: 5, files: 1
//   },
});    
    /*end conf*/
