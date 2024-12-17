"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qr_image_1 = require("qr-image");
/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends whatsapp_web_js_1.Client {
    constructor() {
        super({
            authStrategy: new whatsapp_web_js_1.LocalAuth(),
            puppeteer: {
                headless: true,
                args: [
                    "--disable-setuid-sandbox",
                    "--unhandled-rejections=strict",
                ],
            },
        });
        this.status = false;
        this.generateImage = (base64) => {
            const path = `${process.cwd()}/tmp`;
            let qr_png = (0, qr_image_1.image)(base64, { type: "png", margin: 4 });
            qr_png.pipe(require("fs").createWriteStream(`${path}/qr.png`));
            console.log(`⚡ Escanea el codigo QR que esta en la carepta tmp⚡`);
            console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
        };
        console.log("Iniciando....");
        this.initialize();
        this.on("ready", () => {
            this.status = true;
            console.log("LOGIN_SUCCESS");
        });
        this.on("auth_failure", () => {
            this.status = false;
            console.log("LOGIN_FAIL");
        });
        this.on("qr", (qr) => {
            this.generateImage(qr);
        });
    }
    /**
     * Enviar mensaje de WS
     * @param lead
     * @returns
     */
    sendMsg(lead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.status)
                    return Promise.resolve({ error: "WAIT_LOGIN" });
                const url = process.env.URL + 'media/';
                const { message, phone, pathtofiles } = lead;
                var result;
                if ((pathtofiles === null || pathtofiles === void 0 ? void 0 : pathtofiles.length) > 0) {
                    let pathtofile = url + pathtofiles[0];
                    let filename = pathtofiles[0];
                    result = yield this.sendMessage(`${phone}@c.us`, yield whatsapp_web_js_1.MessageMedia.fromUrl(pathtofile, { filename }));
                    if (pathtofiles.length > 1) {
                        for (let i = 1; i < pathtofiles.length; i++) {
                            let pathtofile = url + pathtofiles[i];
                            let filename = pathtofiles[i];
                            result = yield this.sendMessage(`${phone}@c.us`, yield whatsapp_web_js_1.MessageMedia.fromUrl(pathtofile, { filename }));
                        }
                        ;
                    }
                }
                result = yield this.sendMessage(`${phone}@c.us`, message);
                const response = { id: result.id.id };
                return Promise.resolve(response);
            }
            catch (e) {
                return Promise.resolve({ error: e.message });
            }
        });
    }
    getSts(client) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            if (client == "Baalak'") {
                let connection = this.status;
                if (connection) {
                    data = {
                        err: false,
                        status: "400",
                        statusTex: "Connected"
                    };
                }
                else {
                    data = {
                        err: true,
                        status: "500",
                        statusText: "Offline"
                    };
                }
            }
            else {
                data = {
                    err: true,
                    status: "500",
                    statusText: `Acces denied, ${client} is not registered`
                };
            }
            return Promise.resolve(data);
        });
    }
}
exports.default = WsTransporter;
