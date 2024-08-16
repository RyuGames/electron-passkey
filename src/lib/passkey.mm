#import "passkey.h"

@interface PasskeyHandlerObjC : NSObject <ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>
@property (nonatomic, strong) NSString *resultMessage;
@property (nonatomic, strong) dispatch_semaphore_t semaphore;

- (void)performCreateRequestWithOptions:(NSDictionary *)options;
- (void)performGetRequestWithOptions:(NSDictionary *)options;
@end

@implementation PasskeyHandlerObjC

- (instancetype)init {
    self = [super init];
    if (self) {
        _semaphore = dispatch_semaphore_create(0);
        _resultMessage = nil;
    }
    return self;
}

- (void)performCreateRequestWithOptions:(NSDictionary *)options {
    NSDictionary *publicKeyOptions = options[@"publicKey"];
    if (@available(macOS 12.0, *)) {
        NSString *rpId = publicKeyOptions[@"rp"][@"id"];
        NSString *userName = publicKeyOptions[@"user"][@"name"];
        NSData *userId = publicKeyOptions[@"user"][@"id"];
        NSData *challenge = publicKeyOptions[@"challenge"];

        ASAuthorizationPlatformPublicKeyCredentialProvider *provider =
            [[ASAuthorizationPlatformPublicKeyCredentialProvider alloc] initWithRelyingPartyIdentifier:rpId];

        ASAuthorizationPlatformPublicKeyCredentialRegistrationRequest *request =
            [provider createCredentialRegistrationRequestWithChallenge:challenge name:userName userID:userId];

        NSDictionary *authenticatorSelection = publicKeyOptions[@"authenticatorSelection"];
        if (authenticatorSelection) {
            // NSString *attachment = authenticatorSelection[@"authenticatorAttachment"];
            // if ([attachment isEqualToString:@"platform"]) {
            //     request.authenticatorAttachment = ASAuthorizationPublicKeyCredentialAttachmentPlatform;
            // } else if ([attachment isEqualToString:@"cross-platform"]) {
            //     request.authenticatorAttachment = ASAuthorizationPublicKeyCredentialAttachmentCrossPlatform;
            // }

            NSString *userVerification = authenticatorSelection[@"userVerification"];
            if ([userVerification isEqualToString:@"required"]) {
                request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferenceRequired;
            } else if ([userVerification isEqualToString:@"preferred"]) {
                request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferencePreferred;
            } else if ([userVerification isEqualToString:@"discouraged"]) {
                request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferenceDiscouraged;
            }
        }

        ASAuthorizationController *controller =
            [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];

        controller.delegate = self;
        controller.presentationContextProvider = self;

        [controller performRequests];
    } else {
        NSLog(@"Your macOS version does not support WebAuthn APIs.");
    }
}

- (void)performGetRequestWithOptions:(NSDictionary *)options {
    if (@available(macOS 12.0, *)) {
        NSDictionary *publicKeyOptions = options[@"publicKey"];
        NSString *rpId = publicKeyOptions[@"rpId"];
        NSData *challenge = publicKeyOptions[@"challenge"];

        ASAuthorizationPlatformPublicKeyCredentialProvider *provider =
            [[ASAuthorizationPlatformPublicKeyCredentialProvider alloc] initWithRelyingPartyIdentifier:rpId];

        ASAuthorizationPlatformPublicKeyCredentialAssertionRequest *request =
            [provider createCredentialAssertionRequestWithChallenge:challenge];

        NSArray *allowCredentials = publicKeyOptions[@"allowCredentials"];
        if (allowCredentials) {
            NSMutableArray<ASAuthorizationPlatformPublicKeyCredentialDescriptor *> *credentials = [NSMutableArray array];
            for (NSDictionary *cred in allowCredentials) {
                NSString *credId = cred[@"id"];
                NSData *credIdData = [[NSData alloc] initWithBase64EncodedString:credId options:0];
                ASAuthorizationPlatformPublicKeyCredentialDescriptor *descriptor = [[ASAuthorizationPlatformPublicKeyCredentialDescriptor alloc] initWithCredentialID:credIdData];
                [credentials addObject:descriptor];
            }
            request.allowedCredentials = credentials;
        }

        NSString *userVerification = publicKeyOptions[@"userVerification"];
        if ([userVerification isEqualToString:@"required"]) {
            request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferenceRequired;
        } else if ([userVerification isEqualToString:@"preferred"]) {
            request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferencePreferred;
        } else if ([userVerification isEqualToString:@"discouraged"]) {
            request.userVerificationPreference = ASAuthorizationPublicKeyCredentialUserVerificationPreferenceDiscouraged;
        }

        ASAuthorizationController *controller =
            [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];

        controller.delegate = self;
        controller.presentationContextProvider = self;

        [controller performRequests];
    } else {
        NSLog(@"Your macOS version does not support WebAuthn APIs.");
    }
}

- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithAuthorization:(ASAuthorization *)authorization {
    self.resultMessage = @"Success";
    dispatch_semaphore_signal(self.semaphore);
}

- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithError:(NSError *)error {
    self.resultMessage = [NSString stringWithFormat:@"Error: %@", error.localizedDescription];
    dispatch_semaphore_signal(self.semaphore);
}

- (ASPresentationAnchor)presentationAnchorForAuthorizationController:(ASAuthorizationController *)controller {
    return [NSApplication sharedApplication].windows.firstObject;
}

@end

PasskeyHandler::PasskeyHandler(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<PasskeyHandler>(info) {
    handlerObjC = [[PasskeyHandlerObjC alloc] init];
}

Napi::Object PasskeyHandler::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "PasskeyHandler", {
        InstanceMethod("handlePasskeyCreate", &PasskeyHandler::HandlePasskeyCreate),
        InstanceMethod("handlePasskeyGet", &PasskeyHandler::HandlePasskeyGet),
    });

    exports.Set("PasskeyHandler", func);
    return exports;
}

Napi::Value PasskeyHandler::HandlePasskeyCreate(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string options = info[0].As<Napi::String>();

    NSData *optionsData = [NSData dataWithBytes:options.c_str() length:options.size()];
    NSError *error = nil;
    NSDictionary *optionsDict = [NSJSONSerialization JSONObjectWithData:optionsData options:0 error:&error];

    if (error) {
        return Napi::String::New(env, "Failed to parse options");
    }

    [handlerObjC performCreateRequestWithOptions:optionsDict];

    dispatch_semaphore_wait(handlerObjC.semaphore, DISPATCH_TIME_FOREVER);

    return Napi::String::New(env, handlerObjC.resultMessage.UTF8String);
}

Napi::Value PasskeyHandler::HandlePasskeyGet(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string options = info[0].As<Napi::String>();

    NSData *optionsData = [NSData dataWithBytes:options.c_str() length:options.size()];
    NSError *error = nil;
    NSDictionary *optionsDict = [NSJSONSerialization JSONObjectWithData:optionsData options:0 error:&error];

    if (error) {
        return Napi::String::New(env, "Failed to parse options");
    }

    [handlerObjC performGetRequestWithOptions:optionsDict];

    dispatch_semaphore_wait(handlerObjC.semaphore, DISPATCH_TIME_FOREVER);

    return Napi::String::New(env, handlerObjC.resultMessage.UTF8String);
}