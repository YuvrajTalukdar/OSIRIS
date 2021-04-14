/*
1. It is for handling the file read write operations.
2. In future it will be connected to the encryption class.
3. File formats are handled here.
*/
#include<fstream>
#include<dirent.h>
#include<algorithm>
#include "data_structure_definition.h"

#include<stdlib.h>
#include<unistd.h>

class filehandler_class
{
    private:
    //dir data
    string database_dir="./database/";
    string node_file_list_dir="./database/node_file_list.csv";
    string relation_file_list_dir="./database/relation_file_list.csv";
    string relation_type_file_dir="./database/relation_type_list.csv";
    string node_type_file_dir="./database/node_type_list.csv";
    //node related data
    vector<file_info> node_file_list;
    vector<data_node> data_node_list;
    multimap<string,int> node_meta_list;//nodename, file_list index. This is used for fast search.
    vector<unsigned int> gap_node_id_list;
    //relation related data
    vector<relation> relation_list;
    vector<unsigned int> gap_relation_id_list;
    vector<file_info> relation_file_list;

    void calc_node_list_size(float);
    bool check_if_file_is_present(string);
    //node related private functions
    unsigned int write_nodedata_to_file(string file_name,data_node&);//ok tested
    void delete_node_data_from_file(string file_name,unsigned int node_index);//ok tested
    void add_new_data_to_node_filelist(file_info&);//ok tested
    //relation related file
    unsigned int write_relationdata_to_file(string file_name,relation &relation);
    void add_new_data_to_relation_file_list(file_info &new_file);
    //both node_relation_functions
    void load_node_relation_file_list(int node_or_relation);//ok tested 0means node 1 means relation.
    void set_file_full_status(unsigned int file_id,bool file_full,int node_or_relation);//ok tested

    public:
    string settings_file_dir="./database/settings.csv";
    //settings data
    unsigned int total_no_of_nodes;
    unsigned int total_no_of_nodefile;
    float percent_of_node_in_memory;
    unsigned int no_of_nodes_in_memory;
    unsigned int no_of_nodes_in_one_node_file;
    vector<string> authors;
    unsigned int total_no_of_relations;
    unsigned int total_on_of_relationfile;
    unsigned int no_of_relation_in_one_file;
    //file related data
    bool encryption;

    const string settings_list[5]={"ENCRYPTION","PERCENT_OF_NODE_IN_MEMORY","AUTHORS","NODES_IN_ONE_NODEFILE","RELATION_IN_ONE_RELATIONFILE"};
    vector<node_relation_type> node_types;
    vector<node_relation_type> relation_types;
    //settings related functions
    void change_settings(string file_dir,string settings_name,string settings_value);//ok tested, Function for changing individual settings of a file.
    void load_db_settings();//ok tested
    //node related public functions
    void add_new_node(data_node&);//ok tested
    void load_nodes();//ok tested
    void delete_node(unsigned int node_id);//relation part need to be implemented
    //node relation type related functions
    void load_node_relation_type(int node_or_relation);//ok tested 0 means node 1 means relation.
    void add_node_relation_type(string,int,string color_code);//ok tested
    void delete_node_relation_type(unsigned int id,int node_or_relation);//ok tested
    //relation related functions
    void load_relations();
    void add_new_relation(relation&);
    void delete_relation(unsigned int relation_id);

    //test functions
    void test()//for settings
    {
        cout<<"percent_nodes_in_memory="<<percent_of_node_in_memory<<endl;
        cout<<"encryption="<<encryption<<endl;
        cout<<"author="<<authors[0]<<endl;
        cout<<"NO OF NODES IN 1 FILE="<<no_of_nodes_in_one_node_file<<endl;
        cout<<"\nRELATION IN ONE RELATIONFILE: "<<no_of_relation_in_one_file<<endl;
    }

    void test2()//for node file list
    {
        for(int a=0;a<node_file_list.size();a++)
        {
            cout<<node_file_list.at(a).file_id<<","<<node_file_list.at(a).file_name<<","<<node_file_list.at(a).start_id<<","<<node_file_list.at(a).end_id<<endl;
        }
    }

    void test3()//for node data and gap node data.
    {
        for(int a=0;a<data_node_list.size();a++)
        {
            cout<<data_node_list.at(a).node_id<<","<<data_node_list.at(a).node_name<<","<<data_node_list.at(a).node_type_id<<",";
            for(int b=0;b<data_node_list.at(a).relation_id_list.size();b++)
            {
                cout<<data_node_list.at(a).relation_id_list.at(b)<<",";
            }
            cout<<"\n";
        }
        cout<<"size="<<gap_node_id_list.size()<<endl;
        for(int a=0;a<gap_node_id_list.size();a++)
        {
            cout<<"\nid="<<gap_node_id_list[a];
        }
    }

    void test4()//for type functions data
    {
        cout<<"node type list:-\n";
        for(int a=0;a<node_types.size();a++)
        {
            cout<<"id="<<node_types.at(a).id<<" type="<<node_types.at(a).type_name<<endl;
        }
        cout<<"relation type list:-\n";
        for(int a=0;a<relation_types.size();a++)
        {
            cout<<"id="<<relation_types.at(a).id<<" type="<<relation_types.at(a).type_name<<" color="<<relation_types.at(a).color_code<<endl;
        }
    }

    void test5()//for node multimap
    {
        cout<<"\n\n";
        multimap<string,int>::iterator i;
        i=node_meta_list.begin();
        for(;i!=node_meta_list.end();i++)
        {
            cout<<"name="<<i->first<<" ,index="<<i->second<<endl;
        }
    }

    void test6()//for relation file list
    {
        cout<<"\ntotal no of_relations="<<total_no_of_relations;
        cout<<"\nno of relation file="<<total_on_of_relationfile;
        cout<<"\nfiles:-";
        for(int a=0;a<relation_file_list.size();a++)
        {
            cout<<"\n"<<relation_file_list.at(a).file_id<<","<<relation_file_list.at(a).file_name<<","<<relation_file_list.at(a).start_id<<","<<relation_file_list.at(a).end_id<<","<<relation_file_list.at(a).file_full;
        }
    }

    void test7()//for relation data and relation gap data
    {
        cout<<"\nRelation:-";
        for(int a=0;a<relation_list.size();a++)
        {
            cout<<"\n\nid="<<relation_list.at(a).relation_id;
            cout<<"\ntype id="<<relation_list[a].relation_type_id;
            cout<<"\nsource node="<<relation_list[a].source_node_id;
            cout<<"\ndest node="<<relation_list[a].destination_node_id;
            cout<<"\nweight="<<relation_list[a].weight;
            cout<<"\nRELATION ID LIST:";
            for(int b=0;b<relation_list[a].relation_id_list.size();b++)
            {   cout<<","<<relation_list[a].relation_id_list[b];}
            cout<<"\nGROUPED RELATION ID LIST:";
            for(int b=0;b<relation_list[a].grouped_relation_id_list.size();b++)
            {   cout<<","<<relation_list[a].grouped_relation_id_list[b];}
            cout<<"\nURL LIST:";
            for(int b=0;b<relation_list[a].source_url_list.size();b++)
            {   cout<<"\n"<<relation_list[a].source_url_list[b];}
            cout<<"\nLOCAL LIST4:";
            for(int b=0;b<relation_list[a].source_local.size();b++)
            {   cout<<"\n"<<relation_list[a].source_local[b];}
        }
        cout<<"\n\ngap relation:-";
        for(int a=0;a<gap_relation_id_list.size();a++)
        {
            cout<<"\n"<<gap_relation_id_list.at(a);
        }
    }
};