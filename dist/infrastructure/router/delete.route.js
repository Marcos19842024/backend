"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const log_1 = require("../middleware/log");
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
exports.router = router;
/**
 * http://localhost/delete DELETE
 */
router.delete("/:name", log_1.logMiddleware, (req, res, _next) => {
    const path = `${process.cwd()}/tmp/media/`;
    const file = path + req.params.name;
    fs_1.default.exists(file, function (exists) {
        if (!exists) {
            const data = {
                err: true,
                status: "400",
                statusText: "ERROR File does NOT Exists"
            };
            res.json(data);
        }
        else {
            fs_1.default.unlinkSync(file);
            const storageCodeDir = fs_1.default.readdirSync(path);
            const data = {
                err: false,
                status: "200",
                statusText: storageCodeDir
            };
            res.json(data);
        }
    });
});
