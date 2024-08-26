"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassKeyMethods = void 0;
exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.base64ToArrayBuffer = base64ToArrayBuffer;
exports.mapPublicKey = mapPublicKey;
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
function parseBuffer(buffer) {
    return String.fromCharCode(...new Uint8Array(buffer));
}
function toBase64url(buffer) {
    const txt = btoa(parseBuffer(buffer));
    return txt.replaceAll('+', '-').replaceAll('/', '_');
}
function mapPublicKey(rawString, isCreate) {
    const raw = JSON.parse(rawString);
    const mapped = { ...raw };
    mapped.rawId = base64ToArrayBuffer(raw.id);
    mapped.getClientExtensionResults = () => raw.clientExtensionResults;
    const { response } = raw;
    if (isCreate) {
        mapped.response.clientDataJSON = base64ToArrayBuffer(mapped.response.clientDataJSON);
        mapped.response.attestationObject = base64ToArrayBuffer(mapped.response.attestationObject);
        mapped.response = {
            ...response,
            getAuthenticatorData() {
                // Extract authenticator data from attestationObject
                const cborData = new Uint8Array(this.attestationObject);
                // Example: Assume authenticator data starts at byte 0
                const authenticatorData = cborData.subarray(0, 37); // Adjust length as needed
                return authenticatorData.buffer;
            },
            getPublicKey() {
                // Extract public key from attestationObject
                const cborData = new Uint8Array(this.attestationObject);
                // Example: Assume public key starts at byte 37
                const publicKeyData = cborData.subarray(37, 69); // Adjust length as needed
                return publicKeyData.buffer;
            },
            getPublicKeyAlgorithm() {
                // Return a dummy COSE algorithm identifier (e.g., -7 for ES256)
                return -7;
            },
            getTransports() {
                // Return an empty array or fetch actual transports from rawJson if available
                return raw.transports || [];
            },
        };
        mapped.response.toJson = () => {
            return {
                type: raw.type,
                id: raw.id,
                rawId: mapped.rawId, // Same as ID, but useful in tests
                authenticatorAttachment: raw.authenticatorAttachment,
                clientExtensionResults: raw.getClientExtensionResults(),
                response: {
                    attestationObject: toBase64url(response.attestationObject),
                    authenticatorData: toBase64url(response.getAuthenticatorData()),
                    clientDataJSON: toBase64url(response.clientDataJSON),
                    publicKey: toBase64url(response.getPublicKey()),
                    publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
                    transports: response.getTransports(),
                },
            };
        };
    }
    else {
        mapped.response.clientDataJSON = base64ToArrayBuffer(mapped.response.clientDataJSON);
        mapped.response.authenticatorData = base64ToArrayBuffer(mapped.response.authenticatorData);
        mapped.response.signature = base64ToArrayBuffer(mapped.response.signature);
        if (mapped.response.userHandle) {
            mapped.response.userHandle = base64ToArrayBuffer(mapped.response.userHandle);
        }
        mapped.response.toJson = () => {
            return {
                clientExtensionResults: raw.getClientExtensionResults(),
                id: raw.id,
                rawId: mapped.rawId,
                type: raw.type,
                authenticatorAttachment: raw.authenticatorAttachment,
                response: {
                    authenticatorData: toBase64url(response.authenticatorData),
                    clientDataJSON: toBase64url(response.clientDataJSON),
                    signature: toBase64url(response.signature),
                    userHandle: response.userHandle
                        ? toBase64url(response.userHandle)
                        : undefined,
                },
            };
        };
    }
    return mapped;
}
var PassKeyMethods;
(function (PassKeyMethods) {
    PassKeyMethods["createPasskey"] = "create-passkey";
    PassKeyMethods["getPasskey"] = "get-passkey";
})(PassKeyMethods || (exports.PassKeyMethods = PassKeyMethods = {}));
//# sourceMappingURL=utils.js.map