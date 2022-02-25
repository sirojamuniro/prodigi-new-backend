const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const maxSize = 2 * 1024 * 1024;

/*Conf Upload User Profile*/
const storage = multer.diskStorage({
destination: function(req, file, cb){
    if (!fs.existsSync(path.join(__dirname,process.env.PATH_PROFILE_USER))) {
        fs.mkdirSync(path.join(__dirname,process.env.PATH_PROFILE_USER), {
            recursive: true
        });
    }
    cb(null, path.join(__dirname,process.env.PATH_PROFILE_USER));
},
filename: function(req, file, cb){
    // let name = req.user.name.replace(/\s/g, '_')
        if (req) {
            let extArray = file.mimetype.split('/');
            let extension = extArray[extArray.length - 1]
            if (extension == 'octet-stream') {
                cb(null, 'user-profile' + '-' + file.fieldname + '-' + Date.now() + '.png')
            } else {
                cb(null, 'user-profile' + '-' + file.fieldname + '-' + Date.now() + '.' + extension) 
            }
        } else {
            cb(null, null)
        }
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
