#import <napi.h>
#import <Foundation/Foundation.h>
#import <dispatch/dispatch.h>
#import <AuthenticationServices/AuthenticationServices.h>

@class PasskeyHandlerObjC;

class PasskeyHandler : public Napi::ObjectWrap<PasskeyHandler> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    PasskeyHandler(const Napi::CallbackInfo& info);

    Napi::Value HandlePasskeyCreate(const Napi::CallbackInfo& info);
    Napi::Value HandlePasskeyGet(const Napi::CallbackInfo& info);

private:
    void PerformCreateRequest(const std::string& options);
    void PerformGetRequest(const std::string& options);

    PasskeyHandlerObjC* handlerObjC; 
};