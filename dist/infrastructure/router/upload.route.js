"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const log_1 = require("../middleware/log");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
exports.router = router;
const path = `${process.cwd()}/tmp/media`;
const diskstorage = multer_1.default.diskStorage({
    destination: path,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileUpload = (0, multer_1.default)({
    storage: diskstorage
}).array('files');
/**
 * http://localhost/upload POST
 */
router.post("/", log_1.logMiddleware, fileUpload, (req, res) => {
    const storageCodeDir = fs_1.default.readdirSync(path);
    const data = {
        err: false,
        status: "400",
        statusText: storageCodeDir,
    };
    res.json(data);
});
