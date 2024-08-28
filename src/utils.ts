export function parseBuffer(buffer: ArrayBuffer): string {
  return String.fromCharCode(...new Uint8Array(buffer));
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(parseBuffer(buffer));
}

export function toBuffer(txt: string): ArrayBuffer {
  return Uint8Array.from(txt, (c) => c.charCodeAt(0)).buffer;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  return toBuffer(binaryString);
}

function base64ToBase64Url(base64: string): string {
  return base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function toBase64url(buffer: ArrayBuffer): string {
  const base64 = arrayBufferToBase64(buffer);
  return base64ToBase64Url(base64);
}

export function sha256(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', buffer);
}

export function mapPublicKey(
  rawString: string,
  isCreate: boolean,
): PublicKeyCredential {
  const raw = JSON.parse(rawString);
  const mapped = { ...raw };

  mapped.id = base64ToBase64Url(raw.id);
  mapped.rawId = base64ToArrayBuffer(raw.rawId);

  mapped.getClientExtensionResults = () => raw.clientExtensionResults;

  const { response } = raw;

  if (isCreate) {
    mapped.response.clientDataJSON = base64ToArrayBuffer(
      response.clientDataJSON,
    );
    mapped.response.attestationObject = base64ToArrayBuffer(
      response.attestationObject,
    );

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
        return mapped.transports || [];
      },
    };

    mapped.response.toJson = () => {
      return {
        type: mapped.type,
        id: mapped.id,
        rawId: mapped.rawId, // Same as ID, but useful in tests
        authenticatorAttachment:
          mapped.authenticatorAttachment as AuthenticatorAttachment,
        clientExtensionResults: mapped.getClientExtensionResults(),
        response: {
          attestationObject: toBase64url(mapped.response.attestationObject),
          authenticatorData: toBase64url(
            mapped.response.getAuthenticatorData(),
          ),
          clientDataJSON: toBase64url(mapped.response.clientDataJSON),
          publicKey: toBase64url(mapped.response.getPublicKey()),
          publicKeyAlgorithm: mapped.response.getPublicKeyAlgorithm(),
          transports:
            mapped.response.getTransports() as AuthenticatorTransport[],
        },
      };
    };
  } else {
    mapped.response.clientDataJSON = base64ToArrayBuffer(
      response.clientDataJSON,
    );
    mapped.response.authenticatorData = base64ToArrayBuffer(
      response.authenticatorData,
    );
    mapped.response.signature = base64ToArrayBuffer(response.signature);
    if (response.userHandle) {
      mapped.response.userHandle = base64ToArrayBuffer(response.userHandle);
    }

    mapped.response.toJson = () => {
      return {
        clientExtensionResults: mapped.getClientExtensionResults(),
        id: mapped.id,
        rawId: mapped.rawId,
        type: mapped.type,
        authenticatorAttachment:
          mapped.authenticatorAttachment as AuthenticatorAttachment,
        response: {
          authenticatorData: toBase64url(mapped.response.authenticatorData),
          clientDataJSON: toBase64url(mapped.response.clientDataJSON),
          signature: toBase64url(mapped.response.signature),
          userHandle: mapped.response.userHandle
            ? toBase64url(mapped.response.userHandle)
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
