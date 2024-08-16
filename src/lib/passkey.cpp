// #include "passkey.h"
// #include "passkey_objc.h"

// PasskeyHandler::PasskeyHandler(const Napi::CallbackInfo& info)
//     : Napi::ObjectWrap<PasskeyHandler>(info) {
//     handlerObjC = new PasskeyHandlerObjC(); // Initialize the Objective-C++ components
// }

// Napi::Object PasskeyHandler::Init(Napi::Env env, Napi::Object exports) {
//     Napi::Function func = DefineClass(env, "PasskeyHandler", {
//         InstanceMethod("handlePasskeyCreate", &PasskeyHandler::HandlePasskeyCreate),
//         InstanceMethod("handlePasskeyGet", &PasskeyHandler::HandlePasskeyGet),
//     });

//     exports.Set("PasskeyHandler", func);
//     return exports;
// }

// Napi::Value PasskeyHandler::HandlePasskeyCreate(const Napi::CallbackInfo& info) {
//     Napi::Env env = info.Env();
//     std::string options = info[0].As<Napi::String>();

//     handlerObjC->PerformCreateRequest(options);

//     return Napi::String::New(env, handlerObjC->GetResultMessage());
// }

// Napi::Value PasskeyHandler::HandlePasskeyGet(const Napi::CallbackInfo& info) {
//     Napi::Env env = info.Env();
//     std::string options = info[0].As<Napi::String>();

//     handlerObjC->PerformGetRequest(options);

//     return Napi::String::New(env, handlerObjC->GetResultMessage());
// }

// NODE_API_MODULE(NODE_GYP_MODULE_NAME, PasskeyHandler::Init)