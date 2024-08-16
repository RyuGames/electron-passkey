// #import <Foundation/Foundation.h>
// #import <dispatch/dispatch.h>
// #import <AuthenticationServices/AuthenticationServices.h>

// #if __MAC_OS_X_VERSION_MIN_REQUIRED >= 101500
// @interface PasskeyHandlerObjC : NSObject <ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>
// #else
// @interface PasskeyHandlerObjC : NSObject
// #endif

// @property (nonatomic, strong) NSString *resultMessage;
// @property (nonatomic, assign) dispatch_semaphore_t semaphore;

// - (void)PerformCreateRequest:(NSDictionary *)options;
// - (void)PerformGetRequest:(NSDictionary *)options;
// - (NSString *)GetResultMessage;

// @end