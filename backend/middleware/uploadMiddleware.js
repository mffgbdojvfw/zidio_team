
// const multer = require('multer');
// const path = require('path');

// // Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // File Filter: only Excel
// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname);
//   if (ext === '.xlsx' || ext === '.xls') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only Excel files are allowed'));
//   }
// };

// module.exports = multer({ storage, fileFilter });



// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
