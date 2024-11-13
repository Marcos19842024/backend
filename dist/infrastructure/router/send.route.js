"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const log_1 = require("../middleware/log");
const ioc_1 = __importDefault(require("../ioc"));
const router = (0, express_1.Router)();
exports.router = router;
const leadCtrl = ioc_1.default.get("lead.ctrl");
/**
 * http://localhost/send POST
 */
router.post("/", log_1.logMiddleware, leadCtrl.sendCtrl);
