#include "database_class.h"

void database_class::initialize_db()
{   
    file_handler.load_db_settings();

    file_handler.load_node_relation_type(0);
    file_handler.load_node_relation_type(1);
    
    file_handler.load_nodes();
    file_handler.load_relations();

    //testing    
    /*
    file_handler.test5();
    data_node node;
    node.node_id=4;
    node.node_name="test1";
    node.node_type_id=3;
    file_handler.edit_node(node);
    cout<<"\nnext:-\n";
    file_handler.test5();
    */
}