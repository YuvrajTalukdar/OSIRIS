#include "database_class.h"

void database_class::initialize_db()
{
    int error_code=file_handler.load_db_settings();
    file_handler.load_file_list();
    file_handler.load_nodes();

    //file_handler.test3();

    data_node obj1;
    obj1.node_name="test_node1";
    obj1.node_type_id=0;
    /*relation r1,r2,r3;
    r1.relation_id=0;
    r2.relation_id=1;
    r3.relation_id=2;*/
    obj1.relation_id_list.push_back(0);
    obj1.relation_id_list.push_back(1);
    obj1.relation_id_list.push_back(2);
    file_handler.add_new_node(obj1);
    
    data_node obj2;
    obj2.node_name="test_node2";
    obj2.node_type_id=1;
    obj2.relation_id_list.push_back(2);
    obj2.relation_id_list.push_back(3);
    obj2.relation_id_list.push_back(4);
    file_handler.add_new_node(obj2);

    file_handler.test3();

    //file_handler.test2();
    //file_handler.change_settings(file_handler.settings_list[2],"100");
}