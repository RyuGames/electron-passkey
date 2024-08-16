"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const lib = require('node-gyp-build')((0, node_path_1.join)(__dirname, '..'));
class Passkey {
    static async handlePasskeyCreate(options) {
        const result = await lib.handlePasskeyCreate(JSON.stringify(options));
        return result;
    }
    static async handlePasskeyGet(options) {
        const result = await lib.handlePasskeyGet(JSON.stringify(options));
        return result;
    }
}
exports.default = Passkey;
//# sourceMappingURL=index.js.map