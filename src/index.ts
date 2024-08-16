import { join } from 'node:path';

export interface PublicKeyCredentialCreationOptions {
    rp: {
        id: string;
        name: string;
    };
    user: {
        id: Buffer;
        name: string;
        displayName: string;
    };
    challenge: Buffer;
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

export interface CredentialDescriptor {
    id: string;
    transports: ExtendedAuthenticatorTransport[];
}

export interface PublicKeyCredentialRequestOptions {
    rpId?: string;
    challenge: Buffer;
    allowCredentials?: Array<CredentialDescriptor>;
    userVerification?: 'required' | 'preferred' | 'discouraged';
    timeout?: number;
    extensions?: AuthenticationExtensionsClientInputs;
}

export interface PasskeyOptions {
    publicKey: PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions;
    mediation?: 'conditional';
    signal?: AbortSignal;
}

interface PasskeyInterface {
    handlePasskeyCreate: (options: string) => Promise<string>;
    handlePasskeyGet: (options: string) => Promise<string>;
}

const lib: PasskeyInterface = require('node-gyp-build')(join(__dirname, '..'));

class Passkey {
    static async handlePasskeyCreate(options: PasskeyOptions): Promise<string> {
        const result = await lib.handlePasskeyCreate(JSON.stringify(options));
        return result;
    }

    static async handlePasskeyGet(options: PasskeyOptions): Promise<string> {
        const result = await lib.handlePasskeyGet(JSON.stringify(options));
        return result;
    }
}

export default Passkey;