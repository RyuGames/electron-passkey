"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const electron_1 = require("electron");
// eslint-disable-next-line
const __1 = __importDefault(require(".."));
// eslint-disable-next-line
require("./ipcHandlers");
// https://github.com/electron/electron/issues/25153
// app.disableHardwareAcceleration();
let window;
function createWindow() {
    window = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: (0, path_1.join)(__dirname, 'preload.js'),
        },
    });
    window.loadURL('https://thirdweb.com/login?next=%2Fdashboard%2Fconnect%2Fin-app-wallets');
    window.webContents.openDevTools();
    console.log(__1.default.getPackageName());
}
electron_1.app.on('ready', () => {
    setTimeout(createWindow, 500);
});
//# sourceMappingURL=electron-demo.js.map