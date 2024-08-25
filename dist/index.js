"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_path_1 = require("node:path");
const node_os_1 = __importDefault(require("node:os"));
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
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
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
    init(domain) {
        this.domain = domain;
    }
    async handlePasskeyCreate(options) {
        if (this.platform !== 'darwin') {
            throw new Error(`electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`);
        }
        options.publicKey.challenge = arrayBufferToBase64(options.publicKey.challenge);
        options.publicKey.rp.id =
            this.domain;
        options.publicKey.user.id =
            arrayBufferToBase64(options.publicKey.user
                .id);
        const rawString = await this.handler.HandlePasskeyCreate(JSON.stringify(options));
        let raw;
        try {
            raw = JSON.parse(rawString);
        }
        catch (e) {
            throw new Error(`Failed to parse JSON response: ${e.message}`);
        }
        try {
            raw.rawId = base64ToArrayBuffer(raw.rawId);
        }
        catch (e) {
            throw new Error(`Failed to convert rawId from base64: ${e.message}`);
        }
        return raw;
    }
    async handlePasskeyGet(options) {
        if (this.platform !== 'darwin') {
            throw new Error(`electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`);
        }
        options.publicKey.rpId = this.domain;
        const rawString = await this.handler.HandlePasskeyGet(JSON.stringify(options));
        let raw;
        try {
            raw = JSON.parse(rawString);
        }
        catch (e) {
            throw new Error(`Failed to parse JSON response: ${e.message}`);
        }
        try {
            raw.rawId = base64ToArrayBuffer(raw.rawId);
        }
        catch (e) {
            throw new Error(`Failed to convert rawId from base64: ${e.message}`);
        }
        return raw;
    }
    static getPackageName() {
        return 'electron-passkey';
    }
}
module.exports = Passkey;
//# sourceMappingURL=index.js.map