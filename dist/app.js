"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./infrastructure/router"));
const port = process.env.PORT || 3001;
const path = `${process.cwd()}/`;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false, limit: '50mb' }));
app.use(express_1.default.static(path + 'dist/frontend/build/'));
app.use(express_1.default.static(path + 'tmp'));
app.use(`/`, router_1.default);
app.listen(port, () => console.log(`Ready...${port}`));
