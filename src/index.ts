import { join } from 'node:path';
import os from 'node:os';

interface PublicKeyCredentialCreationOptions {
  rp: {
    id: string;
    name: string;
  };
  user: {
    id: ArrayBuffer | string;
    name: string;
    displayName: string;
  };
  challenge: ArrayBuffer | string;
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
  extensions?: AuthenticationExtensionsClientInputs;
}

type ExtendedAuthenticatorTransport = AuthenticatorTransport | 'smart-card';

interface CredentialDescriptor {
  id: string;
  transports: ExtendedAuthenticatorTransport[];
}

interface PublicKeyCredentialRequestOptions {
  rpId?: string;
  challenge: Buffer;
  allowCredentials?: Array<CredentialDescriptor>;
  userVerification?: 'required' | 'preferred' | 'discouraged';
  timeout?: number;
  extensions?: AuthenticationExtensionsClientInputs;
}

interface PasskeyOptions {
  publicKey:
    | PublicKeyCredentialCreationOptions
    | PublicKeyCredentialRequestOptions;
  mediation?: 'conditional';
  signal?: AbortSignal;
}

interface PasskeyHandler {
  HandlePasskeyCreate(options: string): Promise<string>;
  HandlePasskeyGet(options: string): Promise<string>;
}

interface PasskeyInterface {
  PasskeyHandler: new () => PasskeyHandler;
}

const lib: PasskeyInterface = require('node-gyp-build')(join(__dirname, '..'));

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

class Passkey {
  // eslint-disable-next-line
  private static instance: Passkey;

  private handler: PasskeyHandler;

  private platform = os.platform();

  private domain: string = '';

  private constructor() {
    this.handler = new lib.PasskeyHandler(); // Create an instance of PasskeyHandler
  }

  // Singleton pattern: ensures only one instance is created
  static getInstance(): Passkey {
    if (!Passkey.instance) {
      Passkey.instance = new Passkey();
    }
    return Passkey.instance;
  }

  init(domain: string): void {
    this.domain = domain;
  }

  async handlePasskeyCreate(
    options: PasskeyOptions,
  ): Promise<PublicKeyCredential> {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }
    options.publicKey.challenge = arrayBufferToBase64(
      options.publicKey.challenge as ArrayBuffer,
    );
    (options.publicKey as PublicKeyCredentialCreationOptions).rp.id =
      this.domain;
    (options.publicKey as PublicKeyCredentialCreationOptions).user.id =
      arrayBufferToBase64(
        (options.publicKey as PublicKeyCredentialCreationOptions).user
          .id as ArrayBuffer,
      );

    const rawString = await this.handler.HandlePasskeyCreate(
      JSON.stringify(options),
    );
    let raw;
    try {
      raw = JSON.parse(rawString);
    } catch (e: any) {
      throw new Error(`Failed to parse JSON response: ${e.message}`);
    }

    try {
      raw.rawId = base64ToArrayBuffer(raw.rawId);
    } catch (e: any) {
      throw new Error(`Failed to convert rawId from base64: ${e.message}`);
    }
    return raw;
  }

  async handlePasskeyGet(
    options: PasskeyOptions,
  ): Promise<PublicKeyCredential> {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }
    (options.publicKey as PublicKeyCredentialRequestOptions).rpId = this.domain;

    const rawString = await this.handler.HandlePasskeyGet(
      JSON.stringify(options),
    );
    let raw;
    try {
      raw = JSON.parse(rawString);
    } catch (e: any) {
      throw new Error(`Failed to parse JSON response: ${e.message}`);
    }

    try {
      raw.rawId = base64ToArrayBuffer(raw.rawId);
    } catch (e: any) {
      throw new Error(`Failed to convert rawId from base64: ${e.message}`);
    }
    return raw;
  }

  static getPackageName(): string {
    return 'electron-passkey';
  }
}

export = Passkey;
