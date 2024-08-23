import multer, { diskStorage } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolve __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = diskStorage({
  destination: function (req, file, cb) {
    // Determine directory based on file type
    const uploadDir = file.mimetype.startsWith("image/")
      ? "images"
      : file.mimetype.startsWith("video/")
      ? "videos"
      : null;

    if (!uploadDir) {
      return cb(new Error("Invalid file type"), null);
    }

    // Construct the path to the upload directory
    const dir = path.join(__dirname, "../uploads", uploadDir);

    // Ensure the directory exists
    ensureDirExists(dir);

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Format filename to avoid collisions
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${Date.now()}${ext}`);
  },
});

// File filter to allow only specific types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
  },
});

export default upload;
