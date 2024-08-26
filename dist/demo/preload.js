"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const __1 = __importDefault(require(".."));
navigator.credentials.create = (options) => __1.default.getInstance().attachCreateToRenderer(electron_1.ipcRenderer, options);
navigator.credentials.get = (options) => __1.default.getInstance().attachGetToRenderer(electron_1.ipcRenderer, options);
//# sourceMappingURL=preload.js.map