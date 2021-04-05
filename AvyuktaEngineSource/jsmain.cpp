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
    using v8::Boolean;
}

using namespace std;
using namespace calculate;

database_class db;
operation_class op_class;

void Method1(const FunctionCallbackInfo<Value>& args)
{
    float a=args[0].As<Number>()->Value();
    float b=args[1].As<Number>()->Value();
    float z=a+b;
    
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
}

void initialize_engine(const FunctionCallbackInfo<Value>& args)
{   db.initialize_db();}

void load_settings(const FunctionCallbackInfo<Value>& args)//converts settings data to v8 equivalent and loads them in the return obj.
{
    Isolate* isolate = args.GetIsolate();
    Local<Object> obj=Object::New(isolate);
    Local<Context> context=isolate->GetCurrentContext();
    Local<Number> v8_nodes_in_one_nodefile=Number::New(v8::Isolate::GetCurrent(),db.file_handler.no_of_nodes_in_one_node_file);
    Local<Number> v8_relation_in_one_file=Number::New(v8::Isolate::GetCurrent(),db.file_handler.no_of_relation_in_one_file);
    Local<Number> v8_percent_of_nodes_in_mem=Number::New(v8::Isolate::GetCurrent(),db.file_handler.percent_of_node_in_memory);
    Local<Boolean> v8_encryption_status=Boolean::New(v8::Isolate::GetCurrent(),db.file_handler.encryption);

    obj->Set(context,v8::String::NewFromUtf8(isolate,"nodes_in_one_nodefile").ToLocalChecked(),v8_nodes_in_one_nodefile).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_in_one_file").ToLocalChecked(),v8_relation_in_one_file).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"percent_of_nodes_in_mem").ToLocalChecked(),v8_percent_of_nodes_in_mem).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"encryption_status").ToLocalChecked(),v8_encryption_status).FromJust();
    args.GetReturnValue().Set(obj);
}

void change_settings(const FunctionCallbackInfo<Value>& args)
{
    int no_of_nodes_in_one_file=args[0].As<Number>()->Value();
    int no_of_relation_in_onefile=args[1].As<Number>()->Value();
    float percent_of_nodes_in_mem=args[2].As<Number>()->Value();
    bool encryption_status=args[3].As<Boolean>()->Value();
    op_class.change_settings(db,no_of_nodes_in_one_file,no_of_relation_in_onefile,percent_of_nodes_in_mem,encryption_status);
}

void Initialize(Local<Object> exports)
{
    NODE_SET_METHOD(exports,"initialize_data",Method1);

    NODE_SET_METHOD(exports,"initialize_engine",initialize_engine);
    NODE_SET_METHOD(exports,"load_settings",load_settings);
    NODE_SET_METHOD(exports,"change_settings",change_settings);
}

NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
