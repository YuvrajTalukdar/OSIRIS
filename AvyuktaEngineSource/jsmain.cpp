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
    using v8::Array;
}

using namespace std;
using namespace calculate;

database_class db;
operation_class op_class;

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

void get_type_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Object> obj=Object::New(isolate);
    v8::Local<v8::String> v8_type_String; 

    Local<Array> node_type_obj_list=Array::New(isolate);
    for(int a=0;a<db.file_handler.node_types.size();a++)
    {
        Local<Object> node_type_obj=Object::New(isolate);
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.node_types.at(a).type_name.c_str()).ToLocal(&v8_type_String);
        Local<Number> v8_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.node_types.at(a).id);

        node_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"id").ToLocalChecked(),v8_id).FromJust();
        node_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_type").ToLocalChecked(),v8_type_String).FromJust();

        node_type_obj_list->Set(context,a,node_type_obj);
    }
    obj->Set(context,v8::String::NewFromUtf8(isolate,"node_type_list").ToLocalChecked(),node_type_obj_list).FromJust();

    Local<Array> relation_type_obj_list=Array::New(isolate);
    v8::Local<v8::String> v8_color_code_String;
    for(int a=0;a<db.file_handler.relation_types.size();a++)
    {
        Local<Object> relation_type_obj=Object::New(isolate);
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.relation_types.at(a).type_name.c_str()).ToLocal(&v8_type_String);
        Local<Number> v8_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_types.at(a).id);
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.relation_types.at(a).color_code.c_str()).ToLocal(&v8_color_code_String);

        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"id").ToLocalChecked(),v8_id).FromJust();
        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_type").ToLocalChecked(),v8_type_String).FromJust();
        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"color_code").ToLocalChecked(),v8_color_code_String).FromJust();

        relation_type_obj_list->Set(context,a,relation_type_obj);
    }
    obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_type_list").ToLocalChecked(),relation_type_obj_list).FromJust();
    
    args.GetReturnValue().Set(obj);
}

void delete_node_relation_type(const FunctionCallbackInfo<Value>& args)
{
    int id=args[0].As<Number>()->Value();
    int node_or_relation=args[1].As<Number>()->Value();
    db.file_handler.delete_node_relation_type(id,node_or_relation);
}

void add_node_relation_type(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    v8::Local<v8::String> v8_type=args[0].As<v8::String>();
    v8::String::Utf8Value str(isolate, v8_type);
    string type(*str);
    int node_or_relation=args[1].As<Number>()->Value();
    v8::Local<v8::String> v8_color_code=args[2].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_color_code);
    string color_code(*str2);
    db.file_handler.add_node_relation_type(type,node_or_relation,color_code);
}

void Initialize(Local<Object> exports)
{
    NODE_SET_METHOD(exports,"initialize_engine",initialize_engine);
    NODE_SET_METHOD(exports,"load_settings",load_settings);
    NODE_SET_METHOD(exports,"change_settings",change_settings);
    NODE_SET_METHOD(exports,"get_type_data",get_type_data);
    NODE_SET_METHOD(exports,"delete_node_relation_type",delete_node_relation_type);
    NODE_SET_METHOD(exports,"add_node_relation_type",add_node_relation_type);
}

NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
