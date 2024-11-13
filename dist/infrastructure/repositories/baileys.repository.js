"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaileysTransporter = void 0;
const Baileys = __importStar(require("@whiskeysockets/baileys"));
//Silent mode
const pino_1 = __importDefault(require("pino"));
class BaileysTransporter {
    constructor(sessionName = "default", baileys = Baileys) {
        this.baileys = baileys;
        this.sessionName = "tokens/default";
        this.connection = null;
        this.connectionState = null;
        this.isEnd = false;
        this.closedMessage = "Connection closed";
        this.onReady = [];
        this.sessionName = `tokens/${sessionName}`;
        this.start();
    }
    getAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.baileys.useMultiFileAuthState(this.sessionName);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    set onready(cb) {
        var _a;
        if (((_a = this.connectionState) === null || _a === void 0 ? void 0 : _a.connection) == "open")
            cb(this.connection);
        this.onReady.push(cb);
    }
    start(socketConfig = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { saveCreds, state } = yield this.getAuth();
                this.connection = this.baileys.makeWASocket(Object.assign(Object.assign({ printQRInTerminal: true, browser: this.baileys.Browsers.macOS("Desktop"), 
                    //@ts-ignore
                    logger: (0, pino_1.default)({ level: "silent" }) }, socketConfig), { auth: socketConfig.auth || state }));
                this.connection.ev.on("creds.update", saveCreds);
                this.connection.ev.on("connection.update", (state) => {
                    this.connectionState = state;
                    if (state.connection === "open") {
                        this.onReady.forEach((cb) => cb(this.connection));
                    }
                    if (state.connection != "close")
                        return;
                    if (this.isEnd) {
                        console.log(this.closedMessage);
                        return;
                    }
                    !this.isEnd && this.reconnect();
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    end() {
        var _a;
        this.isEnd = true;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.end(undefined);
    }
    reconnect(socketConfig = {}) {
        this.start(socketConfig);
        console.log("Reconnecting...");
    }
    sendMsg({ message, phone, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.sendMessage(phone + "@c.us", {
                    text: message,
                }));
                return Promise.resolve(response);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.BaileysTransporter = BaileysTransporter;
