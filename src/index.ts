import { join } from 'node:path';
import os from 'node:os';
import type {
  PasskeyInterface,
  PasskeyHandler,
  PasskeyOptions,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredentialRequestOptions,
} from './types';
import { arrayBufferToBase64, mapPublicKey } from './utils';

const lib: PasskeyInterface = require('node-gyp-build')(join(__dirname, '..'));

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

  handlePasskeyCreate(options: PasskeyOptions): Promise<string> {
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

    return this.handler.HandlePasskeyCreate(JSON.stringify(options));
  }

  handlePasskeyGet(options: PasskeyOptions): Promise<string> {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }
    (options.publicKey as PublicKeyCredentialRequestOptions).rpId = this.domain;

    return this.handler.HandlePasskeyGet(JSON.stringify(options));
  }

  mapCredential(rawString: string, isCreate: boolean): PublicKeyCredential {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }

    return mapPublicKey(rawString, isCreate);
  }

  static getPackageName(): string {
    return 'electron-passkey';
  }
}

export = Passkey;
