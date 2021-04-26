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

void get_node_relation_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Object> ret_obj=Object::New(isolate);
    v8::Local<v8::String> v8_name_string; 
    int counter=0;

    Local<Array> node_list=Array::New(isolate);
    for(int a=0;a<db.file_handler.data_node_list.size();a++)
    {
        if(db.file_handler.data_node_list.at(a).node_name.compare("gap_node")!=0)
        {
            Local<Number> v8_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.data_node_list.at(a).node_id);
            Local<Number> v8_node_type_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.data_node_list.at(a).node_type_id);
            v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.data_node_list.at(a).node_name.c_str()).ToLocal(&v8_name_string);
            Local<Array> relation_id_list=Array::New(isolate);
            for(int b=0;b<db.file_handler.data_node_list.at(a).relation_id_list.size();b++)
            {
                Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.data_node_list.at(a).relation_id_list.at(b));
                relation_id_list->Set(context,b,v8_relation_id);
            }

            Local<Object> node_obj=Object::New(isolate);
            node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_id").ToLocalChecked(),v8_node_id).FromJust();
            node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_type_id").ToLocalChecked(),v8_node_type_id).FromJust();
            node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_name").ToLocalChecked(),v8_name_string).FromJust();
            node_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),relation_id_list).FromJust();

            node_list->Set(context,counter,node_obj);
            counter++;
        }
    }
    ret_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_list").ToLocalChecked(),node_list).FromJust();

    Local<Array> relation_list=Array::New(isolate);
    v8::Local<v8::String> v8_temp_string; 
    counter=0;
    for(int a=0;a<db.file_handler.relation_list.size();a++)
    {
        if(!db.file_handler.relation_list.at(a).gap_relation)
        {
            Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).relation_id);
            Local<Number> v8_relation_type_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).relation_type_id);
            Local<Number> v8_source_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).source_node_id);
            Local<Number> v8_destination_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).destination_node_id);
            Local<Number> v8_weight=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).weight);
            
            Local<Array> source_url_list=Array::New(isolate);
            for(int b=0;b<db.file_handler.relation_list.at(a).source_url_list.size();b++)
            {
                v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).source_url_list.at(b).c_str()).ToLocal(&v8_temp_string);
                source_url_list->Set(context,b,v8_temp_string);
            }

            Local<Array> source_local_list=Array::New(isolate);
            for(int b=0;b<db.file_handler.relation_list.at(a).source_local.size();b++)
            {
                v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).source_local.at(b).c_str()).ToLocal(&v8_temp_string);
                source_local_list->Set(context,b,v8_temp_string);
            }

            Local<Array> relation_id_list=Array::New(isolate);
            for(int b=0;b<db.file_handler.relation_list.at(a).relation_id_list.size();b++)
            {
                Local<Number> v8_relation_id_single=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).relation_id_list.at(b));
                relation_id_list->Set(context,b,v8_relation_id_single);   
            }

            Local<Array> grouped_relation_id_list=Array::New(isolate);
            for(int b=0;b<db.file_handler.relation_list.at(a).grouped_relation_id_list.size();b++)
            {
                Local<Number> v8_grouped_relation=Number::New(v8::Isolate::GetCurrent(),db.file_handler.relation_list.at(a).grouped_relation_id_list.at(b));
                grouped_relation_id_list->Set(context,b,v8_grouped_relation);   
            }  

            Local<Object> relation_obj=Object::New(isolate);
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id").ToLocalChecked(),v8_relation_id).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_type_id").ToLocalChecked(),v8_relation_type_id).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_node_id").ToLocalChecked(),v8_source_node_id).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"destination_node_id").ToLocalChecked(),v8_destination_node_id).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"weight").ToLocalChecked(),v8_weight).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_url_list").ToLocalChecked(),source_url_list).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_local").ToLocalChecked(),source_local_list).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),relation_id_list).FromJust();
            relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"grouped_relation_id_list").ToLocalChecked(),grouped_relation_id_list).FromJust();

            relation_list->Set(context,counter,relation_obj);
            counter++;
        }
    }
    ret_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_list").ToLocalChecked(),relation_list).FromJust();

    args.GetReturnValue().Set(ret_obj);
}

void add_new_relation(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();

    int source_node_id=args[0].As<Number>()->Value();
    int destination_node_id=args[1].As<Number>()->Value();
    int relation_type_id=args[2].As<Number>()->Value();

    Local<Array> v8_source_url_list = Local<Array>::Cast(args[3]);
    vector<string> source_url_list;
    for(int a=0;a<v8_source_url_list->Length();a++)
    {
        Local<Value> localKey=v8_source_url_list->Get(context,a).ToLocalChecked();
        v8::String::Utf8Value str(isolate, localKey);
        string url(*str);
        source_url_list.push_back(url);
    }

    Local<Array> v8_source_local_list = Local<Array>::Cast(args[4]);
    vector<string> source_local;
    for(int a=0;a<v8_source_local_list->Length();a++)
    {
        Local<Value> localKey=v8_source_local_list->Get(context,a).ToLocalChecked();
        v8::String::Utf8Value str(isolate, localKey);
        string dir(*str);
        source_local.push_back(dir);
    }

    op_class.add_relation(db,source_node_id,destination_node_id,relation_type_id,source_url_list,source_local);
}

void get_last_entered_relation_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    v8::Local<v8::String> v8_temp_string;

    Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.relation_id);
    Local<Number> v8_relation_type_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.relation_type_id);
    Local<Number> v8_source_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.source_node_id);
    Local<Number> v8_destination_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.destination_node_id);
    Local<Number> v8_weight=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.weight);
    //Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.relation_id);

    Local<Array> v8_source_url_list=Array::New(isolate);
    for(int a=0;a<db.file_handler.last_entered_relation.source_url_list.size();a++)
    {
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.source_url_list.at(a).c_str()).ToLocal(&v8_temp_string);
        v8_source_url_list->Set(context,a,v8_temp_string);
    }
    Local<Array> v8_source_local=Array::New(isolate);
    for(int a=0;a<db.file_handler.last_entered_relation.source_local.size();a++)
    {
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.source_local.at(a).c_str()).ToLocal(&v8_temp_string);
        v8_source_local->Set(context,a,v8_temp_string);
    }
    Local<Array> v8_relation_id_list=Array::New(isolate);
    for(int a=0;a<db.file_handler.last_entered_relation.relation_id_list.size();a++)
    {
        Local<Number> v8_relation_id_single=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.relation_id_list.at(a));
        v8_relation_id_list->Set(context,a,v8_relation_id_single);
    }
    Local<Array> v8_grouped_relation_id_list=Array::New(isolate);
    for(int a=0;a<db.file_handler.last_entered_relation.grouped_relation_id_list.size();a++)
    {
        Local<Number> v8_grouped_relation=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_relation.grouped_relation_id_list.at(a));
        v8_grouped_relation_id_list->Set(context,a,v8_grouped_relation);
    }

    Local<Object> relation_obj=Object::New(isolate);
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id").ToLocalChecked(),v8_relation_id).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_type_id").ToLocalChecked(),v8_relation_type_id).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_node_id").ToLocalChecked(),v8_source_node_id).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"destination_node_id").ToLocalChecked(),v8_destination_node_id).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"weight").ToLocalChecked(),v8_weight).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_url_list").ToLocalChecked(),v8_source_url_list).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"source_local").ToLocalChecked(),v8_source_local).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),v8_relation_id_list).FromJust();
    relation_obj->Set(context,v8::String::NewFromUtf8(isolate,"grouped_relation_id_list").ToLocalChecked(),v8_grouped_relation_id_list).FromJust();

    args.GetReturnValue().Set(relation_obj);
}

void delete_relation(const FunctionCallbackInfo<Value>& args)
{
    int relation_id=args[0].As<Number>()->Value();
    op_class.delete_relation(db,relation_id);
}

void get_last_entered_node_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Object> obj=Object::New(isolate);
    v8::Local<v8::String> v8_node_name;

    Local<Number> v8_node_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_node.node_id);
    Local<Number> v8_node_type_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_node.node_type_id);
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),db.file_handler.last_entered_node.node_name.c_str()).ToLocal(&v8_node_name);

    Local<Array> relation_id_list=Array::New(isolate);
    for(int b=0;b<db.file_handler.last_entered_node.relation_id_list.size();b++)
    {
        Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),db.file_handler.last_entered_node.relation_id_list.at(b));
        relation_id_list->Set(context,b,v8_relation_id);
    }

    Local<Object> node_obj=Object::New(isolate);
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_id").ToLocalChecked(),v8_node_id).FromJust();
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_type_id").ToLocalChecked(),v8_node_type_id).FromJust();
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_name").ToLocalChecked(),v8_node_name).FromJust();
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),relation_id_list).FromJust();

    args.GetReturnValue().Set(node_obj);
}

void add_new_node(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    v8::Local<v8::String> v8_node_name=args[0].As<v8::String>();
    v8::String::Utf8Value str(isolate, v8_node_name);
    string node_name(*str);
    int node_type_id = args[1].As<Number>()->Value();
    op_class.add_new_node(db,node_name,node_type_id);
}

void delete_node(const FunctionCallbackInfo<Value>& args)
{
    int node_id=args[0].As<Number>()->Value();
    op_class.delete_node(db,node_id);
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
    NODE_SET_METHOD(exports,"get_node_relation_data",get_node_relation_data);
    NODE_SET_METHOD(exports,"get_last_entered_node_data",get_last_entered_node_data);
    NODE_SET_METHOD(exports,"add_new_node",add_new_node);
    NODE_SET_METHOD(exports,"delete_node",delete_node);
    NODE_SET_METHOD(exports,"add_new_relation",add_new_relation);
    NODE_SET_METHOD(exports,"get_last_entered_relation_data",get_last_entered_relation_data);
    NODE_SET_METHOD(exports,"delete_relation",delete_relation);
}

NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
