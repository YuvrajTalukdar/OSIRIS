#include "database_class.h"

void database_class::initialize_db()
{   
    file_handler.load_db_settings();
    file_handler.load_node_relation_type(0);
    file_handler.load_node_relation_type(1);
    /*file_handler.load_nodes();
    file_handler.load_relations();*/
    //cout<<"\n\ntesting from deep inside cpp\n";
    /*struct dirent *de;
    DIR *dr=opendir(".");
    bool file_found=false;
    while((de=readdir(dr))!=NULL)
    {
        cout<<de->d_name<<endl;
    }*/
    //file_handler.test3();
    
    data_node obj1;
    obj1.node_name="test_node1";
    obj1.node_type_id=0;
    obj1.relation_id_list.push_back(0);
    obj1.relation_id_list.push_back(1);
    obj1.relation_id_list.push_back(2);
    //file_handler.add_new_node(obj1);
    
    data_node obj2;
    obj2.node_name="test_node2";
    obj2.node_type_id=1;
    obj2.relation_id_list.push_back(2);
    obj2.relation_id_list.push_back(3);
    obj2.relation_id_list.push_back(4);
    //file_handler.add_new_node(obj2);
    //for(int a=0;a<6;a++)
    //file_handler.delete_node(4);
    
    relation r1;
    r1.source_node_id=0;
    r1.destination_node_id=1;
    r1.weight=1.1;
    r1.relation_type_id=2;
    r1.relation_id_list.push_back(4);
    r1.relation_id_list.push_back(5);
    r1.grouped_relation_id_list.push_back(1);
    r1.grouped_relation_id_list.push_back(2);
    r1.grouped_relation_id_list.push_back(3);
    r1.source_url_list.push_back("url1");
    r1.source_url_list.push_back("url2");
    r1.source_local.push_back("dir1");
    r1.source_local.push_back("dir2");
    r1.source_local.push_back("dir3");
    //file_handler.add_new_relation(r1);
    //for(int a=0;a<6;a++)
    //file_handler.delete_relation(a);
    //file_handler.test6();
    //file_handler.test7();
    
    //file_handler.add_node_relation_type("Place",0,"");
    //file_handler.add_node_relation_type("Financial",1,"#FFAa00");
    
    //file_handler.delete_node_relation_type(1,1);//id, node_or_relation
    

    //file_handler.test3();
    
    //file_handler.test();
    //file_handler.test2();
    //file_handler.test4();
    
    //file_handler.test5();
    //file_handler.change_settings(file_handler.settings_list[2],"100");
    
}