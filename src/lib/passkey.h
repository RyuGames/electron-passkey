#ifndef PASSKEY_HANDLER_H_
#define PASSKEY_HANDLER_H_

#include <napi.h>
#include <memory>  // Include for std::unique_ptr

class PasskeyHandler : public Napi::ObjectWrap<PasskeyHandler> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    PasskeyHandler(const Napi::CallbackInfo& info);
    ~PasskeyHandler();  // Destructor to handle cleanup

    Napi::Value HandlePasskeyCreate(const Napi::CallbackInfo& info);
    Napi::Value HandlePasskeyGet(const Napi::CallbackInfo& info);

private:
    class Impl;  // Forward declaration of the implementation class
    std::unique_ptr<Impl> impl_;  // Pointer to the implementation
};

#endif  // PASSKEY_HANDLER_H_