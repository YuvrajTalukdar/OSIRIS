#include "database_class.h"

void database_class::initialize_db()
{
    file_handler.load_db_settings();
    file_handler.load_node_relation_type(0);
    file_handler.load_node_relation_type(1);
    file_handler.load_nodes();

    //file_handler.test3();
    
    data_node obj1;
    obj1.node_name="test_node1";
    obj1.node_type_id=0;
    obj1.relation_id_list.push_back(0);
    obj1.relation_id_list.push_back(1);
    obj1.relation_id_list.push_back(2);
    //file_handler.add_new_node(obj1);
    /*
    data_node obj2;
    obj2.node_name="test_node2";
    obj2.node_type_id=1;
    obj2.relation_id_list.push_back(2);
    obj2.relation_id_list.push_back(3);
    obj2.relation_id_list.push_back(4);
    file_handler.add_new_node(obj2);*/
    
   
    //file_handler.add_node_relation_type("Blood",1);
    //file_handler.add_node_relation_type("Financial",1);
    file_handler.delete_node_relation_type(1,1);

    //file_handler.delete_node(5);
    //file_handler.test3();
    //file_handler.test();
    //file_handler.test2();
    file_handler.test4();
    //file_handler.change_settings(file_handler.settings_list[2],"100");
}