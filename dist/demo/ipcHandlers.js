"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// eslint-disable-next-line
const __1 = require("..");
// eslint-disable-next-line
const ipcKeys_1 = require("./ipcKeys");
electron_1.ipcMain.handle(ipcKeys_1.CREATE_CREDS, (event, options) => {
    console.log('Received webauth-create', event, options);
    return __1.default.getInstance().handlePasskeyCreate(options);
});
electron_1.ipcMain.handle(ipcKeys_1.GET_CREDS, (event, options) => {
    console.log('Received webauth-get', event, options);
    return __1.default.getInstance().handlePasskeyGet(options);
});
//# sourceMappingURL=ipcHandlers.js.map