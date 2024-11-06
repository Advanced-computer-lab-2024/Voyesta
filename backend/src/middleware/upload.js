const multer = require('multer');

// Set memory storage
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'picture', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'additionalDocument', maxCount: 1 }
]);

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    console.log(file.originalname.toLowerCase());
    console.log(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and PDFs Only!');
    }
}

module.exports = upload;
