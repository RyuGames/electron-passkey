export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function parseBuffer(buffer: ArrayBuffer): string {
  return String.fromCharCode(...new Uint8Array(buffer));
}

function toBase64url(buffer: ArrayBuffer): string {
  const txt = btoa(parseBuffer(buffer));
  return txt.replaceAll('+', '-').replaceAll('/', '_');
}

export function mapPublicKey(
  rawString: string,
  isCreate: boolean,
): PublicKeyCredential {
  const raw = JSON.parse(rawString);
  const mapped = { ...raw };

  mapped.getClientExtensionResults = () => raw.clientExtensionResults;

  const { response } = raw;

  if (isCreate) {
    mapped.response = {
      ...response,
      getAuthenticatorData(): ArrayBuffer {
        // Extract authenticator data from attestationObject
        const cborData = new Uint8Array(this.attestationObject);
        // Example: Assume authenticator data starts at byte 0
        const authenticatorData = cborData.subarray(0, 37); // Adjust length as needed
        return authenticatorData.buffer;
      },
      getPublicKey(): ArrayBuffer | null {
        // Extract public key from attestationObject
        const cborData = new Uint8Array(this.attestationObject);
        // Example: Assume public key starts at byte 37
        const publicKeyData = cborData.subarray(37, 69); // Adjust length as needed
        return publicKeyData.buffer;
      },
      getPublicKeyAlgorithm(): number {
        // Return a dummy COSE algorithm identifier (e.g., -7 for ES256)
        return -7;
      },
      getTransports(): string[] {
        // Return an empty array or fetch actual transports from rawJson if available
        return raw.transports || [];
      },
    };

    mapped.response.toJson = () => {
      return {
        type: raw.type,
        id: raw.id,
        rawId: toBase64url(raw.rawId), // Same as ID, but useful in tests
        authenticatorAttachment:
          raw.authenticatorAttachment as AuthenticatorAttachment,
        clientExtensionResults: raw.getClientExtensionResults(),
        response: {
          attestationObject: toBase64url(response.attestationObject),
          authenticatorData: toBase64url(response.getAuthenticatorData()),
          clientDataJSON: toBase64url(response.clientDataJSON),
          publicKey: toBase64url(response.getPublicKey()),
          publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
          transports: response.getTransports() as AuthenticatorTransport[],
        },
      };
    };
  } else {
    mapped.response.toJson = () => {
      return {
        clientExtensionResults: raw.getClientExtensionResults(),
        id: raw.id,
        rawId: toBase64url(raw.id),
        type: raw.type,
        authenticatorAttachment:
          raw.authenticatorAttachment as AuthenticatorAttachment,
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

export enum PassKeyMethods {
  createPasskey = 'create-passkey',
  getPasskey = 'get-passkey',
}
