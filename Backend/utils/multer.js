import multer, { diskStorage } from "multer";
import path from "path";

const storage = diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname, "uploads"));
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
export default upload;
