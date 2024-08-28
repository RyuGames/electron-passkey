import { join } from 'node:path';
import os from 'node:os';
import type { IpcMain, IpcRenderer } from 'electron';
import type {
  PasskeyInterface,
  PasskeyHandler,
  PasskeyOptions,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredentialRequestOptions,
} from './types';
import { arrayBufferToBase64, mapPublicKey, PassKeyMethods } from './utils';

const lib: PasskeyInterface = require('node-gyp-build')(join(__dirname, '..'));

class Passkey {
  // eslint-disable-next-line
  private static instance: Passkey;

  private handler: PasskeyHandler;

  private platform = os.platform();

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

  private handlePasskeyCreate(options: PasskeyOptions): Promise<string> {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }
    options.publicKey.challenge = arrayBufferToBase64(
      options.publicKey.challenge as ArrayBuffer,
    );
    (options.publicKey as PublicKeyCredentialCreationOptions).user.id =
      arrayBufferToBase64(
        (options.publicKey as PublicKeyCredentialCreationOptions).user
          .id as ArrayBuffer,
      );

    return this.handler.HandlePasskeyCreate(JSON.stringify(options));
  }

  private handlePasskeyGet(options: PasskeyOptions): Promise<string> {
    if (this.platform !== 'darwin') {
      throw new Error(
        `electron-passkey is meant for macOS only and should NOT be run on ${this.platform}`,
      );
    }

    options.publicKey.challenge = arrayBufferToBase64(
      options.publicKey.challenge as ArrayBuffer,
    );

    (options.publicKey as PublicKeyCredentialRequestOptions).allowCredentials =
      (
        options.publicKey as PublicKeyCredentialRequestOptions
      ).allowCredentials?.filter((cred) => {
        return (
          cred && cred.id && typeof cred.id === 'string' && cred.id.length > 0
        );
      });
    return this.handler.HandlePasskeyGet(JSON.stringify(options));
  }

  async attachCreateToRenderer(
    ipcRenderer: IpcRenderer,
    options: any,
  ): Promise<PublicKeyCredential> {
    const rawString: string = await ipcRenderer.invoke(
      PassKeyMethods.createPasskey,
      options,
    );
    return mapPublicKey(rawString, true);
  }

  async attachGetToRenderer(
    ipcRenderer: IpcRenderer,
    options: any,
  ): Promise<PublicKeyCredential> {
    const rawString: string = await ipcRenderer.invoke(
      PassKeyMethods.getPasskey,
      options,
    );
    return mapPublicKey(rawString, false);
  }

  attachHandlersToMain(ipcMain: IpcMain): void {
    ipcMain.handle(PassKeyMethods.createPasskey, (_event, options) =>
      this.handlePasskeyCreate(options),
    );
    ipcMain.handle(PassKeyMethods.getPasskey, (_event, options) =>
      this.handlePasskeyGet(options),
    );
  }

  static getPackageName(): string {
    return 'electron-passkey';
  }
}

export = Passkey;
