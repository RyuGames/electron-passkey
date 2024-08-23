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
    publicKey: PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions;
    mediation?: 'conditional';
    signal?: AbortSignal;
}
declare class Passkey {
    private static instance;
    private handler;
    private platform;
    private constructor();
    static getInstance(): Passkey;
    handlePasskeyCreate(options: PasskeyOptions): Promise<string>;
    handlePasskeyGet(options: PasskeyOptions): Promise<string>;
    static getPackageName(): string;
}
export = Passkey;
