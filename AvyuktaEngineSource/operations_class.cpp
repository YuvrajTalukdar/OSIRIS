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