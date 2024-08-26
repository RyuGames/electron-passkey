"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_path_1 = require("node:path");
const node_os_1 = __importDefault(require("node:os"));
const utils_1 = require("./utils");
const lib = require('node-gyp-build')((0, node_path_1.join)(__dirname, '..'));
class Passkey {
    constructor() {
        this.platform = node_os_1.default.platform();
        this.domain = '';
        this.handler = new lib.PasskeyHandler(); // Create an instance of PasskeyHandler
    }
    // Singleton pattern: ensures only one instance is created
    static getInstance() {
        if (!Passkey.instance) {
            Passkey.instance = new Passkey();
        }
        return Passkey.instance;
    }
    handlePasskeyCreate(options) {
        if (this.platform !== 'darwin') {
            throw new Error(`electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`);
        }
        options.publicKey.challenge = (0, utils_1.arrayBufferToBase64)(options.publicKey.challenge);
        options.publicKey.rp.id =
            this.domain;
        options.publicKey.user.id =
            (0, utils_1.arrayBufferToBase64)(options.publicKey.user
                .id);
        return this.handler.HandlePasskeyCreate(JSON.stringify(options));
    }
    handlePasskeyGet(options) {
        if (this.platform !== 'darwin') {
            throw new Error(`electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`);
        }
        options.publicKey.rpId = this.domain;
        return this.handler.HandlePasskeyGet(JSON.stringify(options));
    }
    async attachCreateToRenderer(ipcRenderer, options) {
        const rawString = await ipcRenderer.invoke(utils_1.PassKeyMethods.createPasskey, options);
        return (0, utils_1.mapPublicKey)(rawString, true);
    }
    async attachGetToRenderer(ipcRenderer, options) {
        const rawString = await ipcRenderer.invoke(utils_1.PassKeyMethods.getPasskey, options);
        return (0, utils_1.mapPublicKey)(rawString, false);
    }
    attachHandlersToMain(domain, ipcMain) {
        this.domain = domain;
        ipcMain.handle(utils_1.PassKeyMethods.createPasskey, (_event, options) => this.handlePasskeyCreate(options));
        ipcMain.handle(utils_1.PassKeyMethods.getPasskey, (_event, options) => this.handlePasskeyGet(options));
    }
    static getPackageName() {
        return 'electron-passkey';
    }
}
module.exports = Passkey;
//# sourceMappingURL=index.js.map