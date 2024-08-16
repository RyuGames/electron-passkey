"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const lib = require('node-gyp-build')((0, node_path_1.join)(__dirname, '..'));
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
class Passkey {
    constructor() {
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
        options.publicKey.challenge = arrayBufferToBase64(options.publicKey.challenge);
        options.publicKey.user.id =
            arrayBufferToBase64(options.publicKey.user
                .id);
        return this.handler.HandlePasskeyCreate(JSON.stringify(options));
    }
    handlePasskeyGet(options) {
        return this.handler.HandlePasskeyGet(JSON.stringify(options));
    }
    static getPackageName() {
        return 'electron-passkey';
    }
}
exports.default = Passkey;
//# sourceMappingURL=index.js.map