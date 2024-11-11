import { Router } from "express";
import { logMiddleware } from "../middleware/log";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: Router = Router();
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, '../../storage/media'),
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const fileUpload = multer({
  storage: diskstorage
}).array('files')
/**
 * http://localhost/upload POST
 */
router.post("/", logMiddleware, fileUpload, (req, res) => {
  const storageCodeDir = fs.readdirSync(path.join(__dirname, '../../storage/media/'))
  const data = {
    err: false,
    status: "400",
    statusText: storageCodeDir,
  }
  res.json(data)
});

export { router };