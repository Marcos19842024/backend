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
exports.StatusCreate = void 0;
class StatusCreate {
    constructor(repositories) {
        this.leadStatus = repositories;
    }
    sendStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const responseStatus = yield this.leadStatus.sendStatus(); //checar status de la sesion de ws
            return responseStatus;
        });
    }
}
exports.StatusCreate = StatusCreate;
