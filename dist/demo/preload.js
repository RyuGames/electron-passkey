"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// eslint-disable-next-line
const ipcKeys_1 = require("./ipcKeys");
navigator.credentials.create = (options) => {
    console.log('Received navigator.credentials.create', options);
    return electron_1.ipcRenderer.invoke(ipcKeys_1.CREATE_CREDS, options);
};
navigator.credentials.get = (options) => {
    console.log('Received navigator.credentials.get', options);
    return electron_1.ipcRenderer.invoke(ipcKeys_1.GET_CREDS, options);
};
//# sourceMappingURL=preload.js.map