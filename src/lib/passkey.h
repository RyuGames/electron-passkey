#ifndef PASSKEY_HANDLER_H_
#define PASSKEY_HANDLER_H_

#include <napi.h>
#include <Foundation/Foundation.h>
#include <dispatch/dispatch.h>
#include <AuthenticationServices/AuthenticationServices.h>

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

#endif  // PASSKEY_HANDLER_H_