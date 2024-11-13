"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const log_1 = require("../middleware/log");
const router = (0, express_1.Router)();
exports.router = router;
const path = `${process.cwd()}/dist/frontend/build/index.html`;
/**
 * http://localhost/home GET
 */
router.get("/", log_1.logMiddleware, (_req, res) => {
    res.sendFile(path);
});
