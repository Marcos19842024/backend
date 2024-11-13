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
exports.VenomTransporter = void 0;
const venom_bot_1 = require("venom-bot");
const qr_image_1 = require("qr-image");
class VenomTransporter {
    constructor() {
        this.generateImage = (base64) => {
            const path = `${process.cwd()}/tmp`;
            let qr_svg = (0, qr_image_1.image)(base64, { type: "png", margin: 4 });
            qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.png`));
            console.log(`⚡ Escanea el codigo QR que esta en la carepta tmp⚡`);
            console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
        };
        (0, venom_bot_1.create)('sessionName', (base64Qr) => {
            this.generateImage(base64Qr);
        }).then((client) => (this.instance = client));
    }
    sendStatus() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield ((_a = this.instance) === null || _a === void 0 ? void 0 : _a.getConnectionState());
            if (connection === "CONNECTED") {
                const data = {
                    err: false,
                    status: "400",
                    statusText: "Connected",
                };
                return Promise.resolve(data);
            }
            else {
                const data = {
                    err: true,
                    status: "500",
                    statusText: "Internal Server Error",
                };
                return Promise.resolve(data);
            }
        });
    }
    sendMsg(lead) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield ((_a = this.instance) === null || _a === void 0 ? void 0 : _a.getConnectionState());
            if (connection === "CONNECTED") {
                try {
                    const url = process.env.URL + 'media/';
                    const { message, phone, pathtofiles } = lead;
                    var result;
                    if ((pathtofiles === null || pathtofiles === void 0 ? void 0 : pathtofiles.length) > 0) {
                        let pathtofile = url + pathtofiles[0];
                        let filename = pathtofiles[0];
                        result = yield ((_b = this.instance) === null || _b === void 0 ? void 0 : _b.sendFile(`${phone}@c.us`, pathtofile, filename, message));
                        if (pathtofiles.length > 1) {
                            for (let i = 1; i < pathtofiles.length; i++) {
                                let pathtofile = url + pathtofiles[i];
                                let filename = pathtofiles[i];
                                result = yield ((_c = this.instance) === null || _c === void 0 ? void 0 : _c.sendFile(`${phone}@c.us`, pathtofile, filename, ``));
                            }
                            ;
                        }
                    }
                    else {
                        result = yield ((_d = this.instance) === null || _d === void 0 ? void 0 : _d.sendText(`${phone}@c.us`, message));
                    }
                    const response = result;
                    return Promise.resolve(response);
                }
                catch (error) {
                    return Promise.resolve(error);
                }
            }
            else {
                return Promise.resolve("Disconnected, ¡restarting connection with WhatsApp!");
            }
        });
    }
}
exports.VenomTransporter = VenomTransporter;
