#include<node.h>
#include<iostream>
#include<string>
#include "operations_class.h"

namespace calculate{
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::Number;
    using v8::Value;
    using v8::Context;
}

using namespace std;
using namespace calculate;

float f=-1.12;

void Method1(const FunctionCallbackInfo<Value>& args)
{
    float a=args[0].As<Number>()->Value();
    float b=args[1].As<Number>()->Value();
    float z=a+b;
    f=z;
    //cout<<"result="<<z<<" a="<<(a)<<" b="<<b<<endl;
    //args.GetReturnValue().Set(z);
    
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Object> obj=Object::New(isolate);
    //std::string to v8:string
    string message="Sum is ";
    message.append(to_string(z));
    v8::Local<v8::String> v8String; 
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),message.c_str()).ToLocal(&v8String);
    //v8:::string to std::string
    v8::String::Utf8Value str(isolate, v8String);
    string cppStr(*str);
    cout<<"msg from cpp= "<<cppStr;

    obj->Set(context,v8::String::NewFromUtf8(isolate,"msg").ToLocalChecked(),v8String->ToString(context).ToLocalChecked()).FromJust();
    args.GetReturnValue().Set(obj);

    Local<Number> v8Result=Number::New(v8::Isolate::GetCurrent(),z);
    //Local<Object> obj2=Object::New(isolate);
    obj->Set(context,v8::String::NewFromUtf8(isolate,"result").ToLocalChecked(),v8Result).FromJust();
    args.GetReturnValue().Set(obj);

    database_class db;
    db.initialize_db();
}

void display_f(const FunctionCallbackInfo<Value>& args)
{
    cout<<"\n\nvalue of f is="<<f;
}

void Initialize(Local<Object> exports)
{
    NODE_SET_METHOD(exports,"initialize_data",Method1);
    NODE_SET_METHOD(exports,"dis_f",display_f);
}/*
void Initialize(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", Method);
}*/
NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
