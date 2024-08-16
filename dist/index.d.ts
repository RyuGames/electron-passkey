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
declare class Passkey {
    static handlePasskeyCreate(options: PasskeyOptions): Promise<string>;
    static handlePasskeyGet(options: PasskeyOptions): Promise<string>;
}
export default Passkey;
