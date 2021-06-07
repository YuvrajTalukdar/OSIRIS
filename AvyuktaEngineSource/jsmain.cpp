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

using namespace calculate;

database_class db;
operation_class op_class;

Local<Object> relation_to_v8_relation(Isolate* isolate,relation relation_data);
Local<Object> node_to_v8_node(Isolate* isolate,data_node node);
relation v8_to_relation(const FunctionCallbackInfo<Value>& args);

void change_password(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();

    v8::Local<v8::String> v8_current_password=args[0].As<v8::String>();
    v8::String::Utf8Value str1(isolate, v8_current_password);
    string current_password(*str1);

    v8::Local<v8::String> v8_new_password=args[1].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_new_password);
    string new_password(*str2);

    error err=db.change_password(current_password,new_password);
    Local<Object> obj=Object::New(isolate);
    Local<Context> context=isolate->GetCurrentContext();
    Local<Number> v8_error_code=Number::New(v8::Isolate::GetCurrent(),err.error_code);

    v8::Local<v8::String> v8_error_statement;
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),err.error_statement.c_str()).ToLocal(&v8_error_statement);
    
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_code").ToLocalChecked(),v8_error_code).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_statement").ToLocalChecked(),v8_error_statement).FromJust();

    args.GetReturnValue().Set(obj);
}

void shutdown_engine(const FunctionCallbackInfo<Value>& args)
{   db.close_db();}

void create_new_odb(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    v8::Local<v8::String> v8_dir=args[0].As<v8::String>();
    v8::String::Utf8Value str(isolate,v8_dir);
    string odb_dir(*str);

    v8::Local<v8::String> v8_file_name=args[1].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_file_name);
    string file_name(*str2);

    v8::Local<v8::String> v8_password=args[2].As<v8::String>();
    v8::String::Utf8Value str3(isolate, v8_password);
    string password(*str3);

    error err=db.create_odb(odb_dir,file_name,password);
    Local<Object> obj=Object::New(isolate);
    Local<Context> context=isolate->GetCurrentContext();
    Local<Number> v8_error_code=Number::New(v8::Isolate::GetCurrent(),err.error_code);

    v8::Local<v8::String> v8_error_statement;
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),err.error_statement.c_str()).ToLocal(&v8_error_statement);
    
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_code").ToLocalChecked(),v8_error_code).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_statement").ToLocalChecked(),v8_error_statement).FromJust();

    args.GetReturnValue().Set(obj);   
}

void initialize_engine(const FunctionCallbackInfo<Value>& args)
{   
    Isolate* isolate = args.GetIsolate();
    v8::Local<v8::String> v8_dir=args[0].As<v8::String>();
    v8::String::Utf8Value str(isolate,v8_dir);
    string odb_dir(*str);

    v8::Local<v8::String> v8_password=args[1].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_password);
    string password(*str2);
    
    error err=db.open_odb(odb_dir,password);
    Local<Object> obj=Object::New(isolate);
    Local<Context> context=isolate->GetCurrentContext();
    Local<Number> v8_error_code=Number::New(v8::Isolate::GetCurrent(),err.error_code);

    v8::Local<v8::String> v8_error_statement;
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),err.error_statement.c_str()).ToLocal(&v8_error_statement);
    
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_code").ToLocalChecked(),v8_error_code).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"error_statement").ToLocalChecked(),v8_error_statement).FromJust();

    args.GetReturnValue().Set(obj);   
}

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
            Local<Object> node_obj=node_to_v8_node(isolate,db.file_handler.data_node_list.at(a));
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
            Local<Object> relation_obj=relation_to_v8_relation(isolate,db.file_handler.relation_list.at(a));
            relation_list->Set(context,counter,relation_obj);
            counter++;
        }
    }
    ret_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_list").ToLocalChecked(),relation_list).FromJust();

    args.GetReturnValue().Set(ret_obj);
}

void add_new_relation(const FunctionCallbackInfo<Value>& args)
{
    relation relation_obj=v8_to_relation(args);
    op_class.add_relation(db,relation_obj);
}

relation v8_to_relation(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    relation relation_obj;
    relation_obj.weight=1;
    relation_obj.source_node_id=args[0].As<Number>()->Value();
    relation_obj.destination_node_id=args[1].As<Number>()->Value();
    relation_obj.relation_type_id=args[2].As<Number>()->Value();

    Local<Array> v8_source_url_list = Local<Array>::Cast(args[3]);
    for(int a=0;a<v8_source_url_list->Length();a++)
    {
        Local<Value> localKey=v8_source_url_list->Get(context,a).ToLocalChecked();
        v8::String::Utf8Value str(isolate, localKey);
        string url(*str);
        relation_obj.source_url_list.push_back(url);
    }

    Local<Array> v8_source_local_list = Local<Array>::Cast(args[4]);
    for(int a=0;a<v8_source_local_list->Length();a++)
    {
        Local<Value> localKey=v8_source_local_list->Get(context,a).ToLocalChecked();
        v8::String::Utf8Value str(isolate, localKey);
        string dir(*str);
        relation_obj.source_local.push_back(dir);
    }
    return relation_obj;
}

Local<Object> relation_to_v8_relation(Isolate* isolate,relation relation_data)
{
    Local<Context> context=isolate->GetCurrentContext();
    v8::Local<v8::String> v8_temp_string;

    Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),relation_data.relation_id);
    Local<Number> v8_relation_type_id=Number::New(v8::Isolate::GetCurrent(),relation_data.relation_type_id);
    Local<Number> v8_source_node_id=Number::New(v8::Isolate::GetCurrent(),relation_data.source_node_id);
    Local<Number> v8_destination_node_id=Number::New(v8::Isolate::GetCurrent(),relation_data.destination_node_id);
    Local<Number> v8_weight=Number::New(v8::Isolate::GetCurrent(),relation_data.weight);

    Local<Array> v8_source_url_list=Array::New(isolate);
    for(int a=0;a<relation_data.source_url_list.size();a++)
    {
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),relation_data.source_url_list.at(a).c_str()).ToLocal(&v8_temp_string);
        v8_source_url_list->Set(context,a,v8_temp_string);
    }
    Local<Array> v8_source_local=Array::New(isolate);
    for(int a=0;a<relation_data.source_local.size();a++)
    {
        v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),relation_data.source_local.at(a).c_str()).ToLocal(&v8_temp_string);
        v8_source_local->Set(context,a,v8_temp_string);
    }
    Local<Array> v8_relation_id_list=Array::New(isolate);
    for(int a=0;a<relation_data.relation_id_list.size();a++)
    {
        Local<Number> v8_relation_id_single=Number::New(v8::Isolate::GetCurrent(),relation_data.relation_id_list.at(a));
        v8_relation_id_list->Set(context,a,v8_relation_id_single);
    }
    Local<Array> v8_grouped_relation_id_list=Array::New(isolate);
    for(int a=0;a<relation_data.grouped_relation_id_list.size();a++)
    {
        Local<Number> v8_grouped_relation=Number::New(v8::Isolate::GetCurrent(),relation_data.grouped_relation_id_list.at(a));
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
    return relation_obj;
}

void get_last_entered_relation_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Object> relation_obj=relation_to_v8_relation(isolate,db.file_handler.last_entered_relation);
    args.GetReturnValue().Set(relation_obj);
}

void edit_relation(const FunctionCallbackInfo<Value>& args)
{
    relation relation_obj=v8_to_relation(args);
    relation_obj.relation_id=args[5].As<Number>()->Value();
    op_class.edit_relation(db,relation_obj);
}

void delete_relation(const FunctionCallbackInfo<Value>& args)
{
    int relation_id=args[0].As<Number>()->Value();
    op_class.delete_relation(db,relation_id);
}

Local<Object> node_to_v8_node(Isolate* isolate,data_node node)
{
    Local<Context> context=isolate->GetCurrentContext();
    Local<Object> obj=Object::New(isolate);
    v8::Local<v8::String> v8_node_name;

    Local<Number> v8_node_id=Number::New(v8::Isolate::GetCurrent(),node.node_id);
    Local<Number> v8_node_type_id=Number::New(v8::Isolate::GetCurrent(),node.node_type_id);
    v8::String::NewFromUtf8(v8::Isolate::GetCurrent(),node.node_name.c_str()).ToLocal(&v8_node_name);

    Local<Object> node_obj=Object::New(isolate);
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_id").ToLocalChecked(),v8_node_id).FromJust();
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_type_id").ToLocalChecked(),v8_node_type_id).FromJust();
    node_obj->Set(context,v8::String::NewFromUtf8(isolate,"node_name").ToLocalChecked(),v8_node_name).FromJust();
    return node_obj;
}

void get_last_entered_node_data(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Object> node_obj=node_to_v8_node(isolate,db.file_handler.last_entered_node);
    args.GetReturnValue().Set(node_obj);
}

void edit_node(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    int node_id = args[0].As<Number>()->Value();
    int node_type_id = args[1].As<Number>()->Value();
    v8::Local<v8::String> v8_node_name=args[2].As<v8::String>();
    v8::String::Utf8Value str(isolate, v8_node_name);
    string node_name(*str);
    op_class.edit_node(db,node_id,node_type_id,node_name);
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
        Local<Boolean> v8_vectored=Boolean::New(v8::Isolate::GetCurrent(),db.file_handler.relation_types.at(a).vectored);

        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"id").ToLocalChecked(),v8_id).FromJust();
        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_type").ToLocalChecked(),v8_type_String).FromJust();
        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"color_code").ToLocalChecked(),v8_color_code_String).FromJust();
        relation_type_obj->Set(context,v8::String::NewFromUtf8(isolate,"vectored").ToLocalChecked(),v8_vectored).FromJust();

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
    bool vectored=args[3].As<Boolean>()->Value();
    db.file_handler.add_node_relation_type(type,node_or_relation,color_code,vectored);
}

void edit_node_relation_type(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    int node_or_relation=args[0].As<Number>()->Value();
    int node_relation_id=args[1].As<Number>()->Value();
    v8::Local<v8::String> v8_type=args[2].As<v8::String>();
    v8::String::Utf8Value str(isolate, v8_type);
    string type(*str);
    v8::Local<v8::String> v8_color_code=args[3].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_color_code);
    string color_code(*str2);
    bool vectored=args[4].As<Boolean>()->Value();
    op_class.edit_node_relation_type(db,node_or_relation,node_relation_id,type,color_code,vectored);
}

void find_shortest_path(const FunctionCallbackInfo<Value>& args)
{
    int source_node_id=args[0].As<Number>()->Value();
    int destination_node_id=args[1].As<Number>()->Value();
    tree new_tree=op_class.dijkstra(db,source_node_id,destination_node_id);

    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Array> v8_node_id_list=Array::New(isolate);
    for(int a=0;a<new_tree.node_ids.size();a++)
    {
        Local<Number> v8_node_id=Number::New(v8::Isolate::GetCurrent(),new_tree.node_ids.at(a));
        v8_node_id_list->Set(context,a,v8_node_id);
    }
    Local<Array> v8_relation_id_list=Array::New(isolate);
    for(int a=0;a<new_tree.relation_ids.size();a++)
    {
        Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),new_tree.relation_ids.at(a));
        v8_relation_id_list->Set(context,a,v8_relation_id);
    }

    Local<Object> obj=Object::New(isolate);
    obj->Set(context,v8::String::NewFromUtf8(isolate,"node_id_list").ToLocalChecked(),v8_node_id_list).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),v8_relation_id_list).FromJust();
    args.GetReturnValue().Set(obj);
}

void find_mst(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    Local<Context> context=isolate->GetCurrentContext();
    Local<Array> v8_node_id_list = Local<Array>::Cast(args[0]);
    vector<unsigned int> node_ids;
    for(int a=0;a<v8_node_id_list->Length();a++)
    {
        Local<Value> localKey=v8_node_id_list->Get(context,a).ToLocalChecked();
        unsigned int node_id=localKey.As<Number>()->Value();
        node_ids.push_back(node_id);
    }
    
    mst new_mst=op_class.find_minimum_spanning_tree(db,node_ids);
    set<unsigned int>::iterator it;

    Local<Array> v8_node_id_list2=Array::New(isolate);
    unsigned int a=0;
    for(it=new_mst.node_ids.begin();it!=new_mst.node_ids.end();it++)
    {
        Local<Number> v8_node_id=Number::New(v8::Isolate::GetCurrent(),*it);
        v8_node_id_list2->Set(context,a,v8_node_id);
        a++;
    }
    Local<Array> v8_relation_id_list=Array::New(isolate);
    a=0;
    for(it=new_mst.relation_ids.begin();it!=new_mst.relation_ids.end();it++)
    {
        Local<Number> v8_relation_id=Number::New(v8::Isolate::GetCurrent(),*it);
        v8_relation_id_list->Set(context,a,v8_relation_id);
        a++;
    }
    Local<Object> obj=Object::New(isolate);
    obj->Set(context,v8::String::NewFromUtf8(isolate,"node_id_list").ToLocalChecked(),v8_node_id_list2).FromJust();
    obj->Set(context,v8::String::NewFromUtf8(isolate,"relation_id_list").ToLocalChecked(),v8_relation_id_list).FromJust();
    args.GetReturnValue().Set(obj);
}

void save_file(const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    int relation_id=args[0].As<Number>()->Value();
    v8::Local<v8::String> v8_file_name=args[1].As<v8::String>();
    v8::String::Utf8Value str1(isolate, v8_file_name);
    string file_name(*str1);
    v8::Local<v8::String> v8_dest_dir=args[2].As<v8::String>();
    v8::String::Utf8Value str2(isolate, v8_dest_dir);
    string dest_dir(*str2);
    db.file_handler.save_file(relation_id,file_name,dest_dir);
}

void Initialize(Local<Object> exports)
{
    NODE_SET_METHOD(exports,"change_password",change_password);
    NODE_SET_METHOD(exports,"shutdown_engine",shutdown_engine);
    NODE_SET_METHOD(exports,"create_new_odb",create_new_odb);   
    NODE_SET_METHOD(exports,"initialize_engine",initialize_engine);
    NODE_SET_METHOD(exports,"load_settings",load_settings);
    NODE_SET_METHOD(exports,"change_settings",change_settings);
    NODE_SET_METHOD(exports,"get_type_data",get_type_data);
    NODE_SET_METHOD(exports,"delete_node_relation_type",delete_node_relation_type);
    NODE_SET_METHOD(exports,"add_node_relation_type",add_node_relation_type);
    NODE_SET_METHOD(exports,"edit_node_relation_type",edit_node_relation_type);
    NODE_SET_METHOD(exports,"get_node_relation_data",get_node_relation_data);
    NODE_SET_METHOD(exports,"get_last_entered_node_data",get_last_entered_node_data);
    NODE_SET_METHOD(exports,"add_new_node",add_new_node);
    NODE_SET_METHOD(exports,"delete_node",delete_node);
    NODE_SET_METHOD(exports,"add_new_relation",add_new_relation);
    NODE_SET_METHOD(exports,"get_last_entered_relation_data",get_last_entered_relation_data);
    NODE_SET_METHOD(exports,"delete_relation",delete_relation);
    NODE_SET_METHOD(exports,"edit_node",edit_node);
    NODE_SET_METHOD(exports,"edit_relation",edit_relation);    
    NODE_SET_METHOD(exports,"find_shortest_path",find_shortest_path); 
    NODE_SET_METHOD(exports,"find_mst",find_mst); 
    NODE_SET_METHOD(exports,"save_file",save_file); 
}

NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
