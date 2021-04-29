/*
1. It contails the operation functions which will be performed on the data.
2. Operations like graph transversal, MST, sortest path etc.
*/
#include "database_class.h"

class operation_class
{
    public:
    void change_settings(database_class &db,int nodes_in_one_file,int relations_in_one_file,float percent_of_data_in_ram,bool encryption);

    void change_node(database_class &db,data_node &new_node);

    void change_relation(database_class &db,relation &relation);

    void add_new_node(database_class &db,string node_name,unsigned int node_type_id);

    void delete_node(database_class &db,unsigned int node_id);

    void add_relation(database_class &db,unsigned int source_node_id,unsigned int destination_node_id,unsigned int relation_type_id,vector<string>& source_url_list,vector<string>& source_local);

    void delete_relation(database_class &db,unsigned int relation_id);

    void edit_node(database_class &db,unsigned int node_id,unsigned int node_type_id,string node_name);
};