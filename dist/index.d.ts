import type { IpcMain, IpcRenderer } from 'electron';
declare class Passkey {
    private static instance;
    private handler;
    private platform;
    private domain;
    private constructor();
    static getInstance(): Passkey;
    private handlePasskeyCreate;
    private handlePasskeyGet;
    attachCreateToRenderer(ipcRenderer: IpcRenderer, options: any): Promise<PublicKeyCredential>;
    attachGetToRenderer(ipcRenderer: IpcRenderer, options: any): Promise<PublicKeyCredential>;
    attachHandlersToMain(domain: string, ipcMain: IpcMain): void;
    static getPackageName(): string;
}
export = Passkey;
//# sourceMappingURL=index.d.ts.map