#include "database_class.h"

void database_class::initialize_db()
{
    int error_code=file_handler.load_db_settings();
    file_handler.load_file_list();
    file_handler.load_nodes();

    data_node obj1;
    obj1.node_name="test_node1";
    obj1.node_type_id=0;
    relation r1,r2,r3;
    r1.relation_id=0;
    r2.relation_id=1;
    r3.relation_id=2;
    obj1.relation_list.push_back(r1);
    obj1.relation_list.push_back(r2);
    obj1.relation_list.push_back(r3);
    file_handler.add_new_node(obj1);
    //file_handler.test2();
    //file_handler.change_settings(file_handler.settings_list[2],"100");
}