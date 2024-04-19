const multer = require("multer");
const path = require("path");

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return  cb("Error: You can Only Upload Images!!"); 
  }
};

const imageStorage = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../mern_frontend/public/" + folder + "/");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.originalname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  return storage;
}


const storeImage = (folder) => {
  const uploadFile = multer({
    storage: imageStorage(folder),
    limits: { fileSize: 10000000 },
    // fileFilter: (req, file, cb) => {
    //  checkFileType(file, cb);
    // },
  });

  return uploadFile;
};

module.exports = { storeImage };
