#import "passkey.h"
// #import "passkey_objc.h"
#import <Foundation/Foundation.h>
#import <dispatch/dispatch.h>
#import <AuthenticationServices/AuthenticationServices.h>

#if __MAC_OS_X_VERSION_MIN_REQUIRED >= 101500
@interface PasskeyHandlerObjC : NSObject <ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>
#else
@interface PasskeyHandlerObjC : NSObject
#endif

@property (nonatomic, strong) NSString *resultMessage;
@property (nonatomic, assign) dispatch_semaphore_t semaphore;

- (void)PerformCreateRequest:(NSDictionary *)options;
- (void)PerformGetRequest:(NSDictionary *)options;
- (NSString *)GetResultMessage;

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

- (void)PerformCreateRequest:(NSDictionary *)options {
    if (@available(macOS 12.0, *)) {
        NSDictionary *publicKeyOptions = options[@"publicKey"];
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

- (void)PerformGetRequest:(NSDictionary *)options {
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

- (NSString *)GetResultMessage {
    return self.resultMessage;
}

#if __MAC_OS_X_VERSION_MIN_REQUIRED >= 101500
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
#endif

@end

NSDictionary* ConvertStringToNSDictionary(const std::string& str) {
    NSData* jsonData = [NSData dataWithBytes:str.c_str() length:str.size()];
    NSError* error;
    NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    if (error) {
        NSLog(@"Failed to convert string to NSDictionary: %@", error.localizedDescription);
    }
    return dict;
}

class PasskeyHandler::Impl {
public:
    Impl() {
        handlerObjC = [[PasskeyHandlerObjC alloc] init];  // Use Objective-C allocation
    }

    ~Impl() {
        // ARC handles memory management, so no need to manually delete or release
    }

    Napi::Value HandlePasskeyCreate(Napi::Env env, const std::string& options) {
        NSDictionary* optionsDict = ConvertStringToNSDictionary(options);
        [handlerObjC PerformCreateRequest:optionsDict];
        NSString *resultMessage = [handlerObjC GetResultMessage];
        return Napi::String::New(env, std::string([resultMessage UTF8String]));
    }

    Napi::Value HandlePasskeyGet(Napi::Env env, const std::string& options) {
        NSDictionary* optionsDict = ConvertStringToNSDictionary(options);
        [handlerObjC PerformGetRequest:optionsDict];
        NSString *resultMessage = [handlerObjC GetResultMessage];
        return Napi::String::New(env, std::string([resultMessage UTF8String]));
    }

private:
    PasskeyHandlerObjC* handlerObjC;
};

PasskeyHandler::PasskeyHandler(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<PasskeyHandler>(info), impl_(std::make_unique<Impl>()) {
    // Constructor
}

PasskeyHandler::~PasskeyHandler() = default;  // Destructor is defaulted

Napi::Value PasskeyHandler::HandlePasskeyCreate(const Napi::CallbackInfo& info) {
    std::string options = info[0].As<Napi::String>();
    return impl_->HandlePasskeyCreate(info.Env(), options);
}

Napi::Value PasskeyHandler::HandlePasskeyGet(const Napi::CallbackInfo& info) {
    std::string options = info[0].As<Napi::String>();
    return impl_->HandlePasskeyGet(info.Env(), options);
}

Napi::Object PasskeyHandler::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "PasskeyHandler", {
        InstanceMethod("handlePasskeyCreate", &PasskeyHandler::HandlePasskeyCreate),
        InstanceMethod("handlePasskeyGet", &PasskeyHandler::HandlePasskeyGet),
    });

    exports.Set("PasskeyHandler", func);
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return PasskeyHandler::Init(env, exports);
}

NODE_API_MODULE(passkey, InitAll);
