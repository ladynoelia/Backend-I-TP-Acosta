import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/products");
  },
  filename: (req, file, callback) => {
    const newFileName = Date.now() + "-" + file.originalname;
    callback(null, newFileName);
  },
});

//Middleware
const uploader = multer({ storage });

export default uploader;
