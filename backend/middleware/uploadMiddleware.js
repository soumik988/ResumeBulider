import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept the file
    } else {
        cb(new Error("Only .jpeg, .jpg, .png formats are allowed"), false); // reject
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
