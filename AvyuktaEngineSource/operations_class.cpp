#include "operations_class.h"

void operation_class::change_settings(database_class &db,int nodes_in_one_file,int relations_in_one_file,float percent_of_data_in_ram,bool encryption)
{
    if(nodes_in_one_file!=db.file_handler.no_of_nodes_in_one_node_file)
    {
        db.file_handler.no_of_nodes_in_one_node_file=nodes_in_one_file;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"NODES_IN_ONE_NODEFILE",to_string(nodes_in_one_file));
    }
    if(relations_in_one_file!=db.file_handler.no_of_relation_in_one_file)
    {
        db.file_handler.no_of_relation_in_one_file=relations_in_one_file;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"RELATION_IN_ONE_RELATIONFILE",to_string(relations_in_one_file));
    }
    if(percent_of_data_in_ram!=db.file_handler.percent_of_node_in_memory)
    {
        db.file_handler.percent_of_node_in_memory=percent_of_data_in_ram;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"PERCENT_OF_NODE_IN_MEMORY",to_string(percent_of_data_in_ram));
    }
    if(encryption!=db.file_handler.encryption)
    {
        db.file_handler.encryption=encryption;
        if(encryption)
        {   db.file_handler.change_settings(db.file_handler.settings_file_dir,"ENCRYPTION","true");}
        else
        {   db.file_handler.change_settings(db.file_handler.settings_file_dir,"ENCRYPTION","false");}
    }
}

void operation_class::change_node(database_class &db,data_node &new_node)
{
    db.file_handler.delete_node(new_node.node_id);
    db.file_handler.add_new_node(new_node);
}

void operation_class::change_relation(database_class &db,relation &new_relation)
{
    db.file_handler.delete_relation(new_relation.relation_id);
    db.file_handler.add_new_relation(new_relation);
}

void operation_class::add_new_node(database_class &db,string node_name,unsigned int node_type_id)
{
    data_node new_node;
    
    new_node.node_name=node_name;
    new_node.node_type_id=node_type_id;
    vector<unsigned int> relation_id_list;
    new_node.relation_id_list=relation_id_list;

    db.file_handler.add_new_node(new_node);
}

void operation_class::delete_node(database_class &db,unsigned int node_id)
{
    db.file_handler.delete_node(node_id);
}

void operation_class::add_relation(database_class &db,relation &relation_obj)
{
    db.file_handler.add_new_relation(relation_obj);
}

void operation_class::delete_relation(database_class &db,unsigned int relation_id)
{
    db.file_handler.delete_relation(relation_id);
}

void operation_class::edit_node(database_class &db,unsigned int node_id,unsigned int node_type_id,string node_name)
{
    data_node node;
    node.node_id=node_id;
    node.node_type_id=node_type_id;
    node.node_name=node_name;
    db.file_handler.edit_node(node);
}

void operation_class::edit_relation(database_class &db,relation &relation_obj)
{
    db.file_handler.edit_relation(relation_obj);
}