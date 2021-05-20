/*
1. It is for handling the file read write operations.
2. In future it will be connected to the encryption class.
3. File formats are handled here.
*/
#include<fstream>
#include<algorithm>
#include<map>
#include "data_structure_definition.h"
#include "aes.h"

#include<stdlib.h>
#include<unistd.h>
#include<sstream>

using std::ofstream;
using std::ifstream;
using std::fstream;
using std::ios;
using std::stringstream;
using std::make_pair;

namespace fs = std::filesystem;

class filehandler_class
{
    private:
    string password;
    //dir data
    string database_dir;
    string node_file_list_dir;//="./database/node_file_list.csv";
    string relation_file_list_dir;//="./database/relation_file_list.csv";
    string relation_type_file_dir;//="./database/relation_type_list.csv";
    string node_type_file_dir;//="./database/node_type_list.csv";
    //node related data
    vector<file_info> node_file_list;
    multimap<int,int> gap_node_id_map;
    multimap<int,int>::iterator gap_node_iterator;
    //relation related data
    multimap<int,int> gap_relation_id_map;
    multimap<int,int>::iterator gap_relation_iterator;
    vector<file_info> relation_file_list;
    //file encryption related functions
    decrypted_data decrypt_file_text(string file_dir);
    stringstream decrypt_file(string file_dir);
    void encrypt_file(string file_dir,string data);
    //mics functions
    bool is_whitespace(const string& s); 
    bool check_if_file_is_present(string);
    string get_name_from_path(string path);
    //node related private functions
    unsigned int write_nodedata_to_file(string file_name,data_node&);//aes ok tested
    void delete_node_data_from_file(string file_name,unsigned int node_index);//aes ok tested
    void add_new_data_to_node_filelist(file_info&);//ok tested
    //relation related file
    unsigned int write_relationdata_to_file(string file_name,relation &relation);
    void add_new_data_to_relation_file_list(file_info &new_file);
    //both node_relation_functions
    void load_node_relation_file_list(int node_or_relation);//aes ok tested 0 means node 1 means relation.
    void set_file_full_status(unsigned int file_id,bool file_full,int node_or_relation);//aes ok tested

    public:
    //type related data
    vector<node_relation_type> node_types;
    vector<node_relation_type> relation_types;
    //node related data
    vector<data_node> data_node_list;
    multimap<string,int> node_meta_list;//nodename, file_list index. This is used for fast search.
    data_node last_entered_node;
    //relation related data
    vector<relation> relation_list;
    relation last_entered_relation;
    //settings data
    string settings_file_dir;//="./database/settings.csv";
    unsigned int total_no_of_nodes=0;
    unsigned int total_no_of_nodefile=0;
    float percent_of_node_in_memory=100.0;
    unsigned int no_of_nodes_in_one_node_file=10;
    vector<string> authors;
    unsigned int total_no_of_relations;
    unsigned int total_on_of_relationfile;
    unsigned int no_of_relation_in_one_file=10;
    const string settings_list[5]={"ENCRYPTION","PERCENT_OF_NODE_IN_MEMORY","AUTHORS","NODES_IN_ONE_NODEFILE","RELATION_IN_ONE_RELATIONFILE"};
    //file related data
    bool encryption=true;
    void close_db();//ok tested
    void set_password_and_dir(string current_db_dir,string password);
    bool password_same(string current_passowrd);
    void change_password(string new_password);

    //settings related functions
    void change_settings(string file_dir,string settings_name,string settings_value);//aes ok tested, Function for changing individual settings of a file.
    error load_db_settings();//ok tested
    //node related public functions
    void add_new_node(data_node&);//aes ok tested
    void load_nodes();//aes ok tested
    void delete_node(unsigned int node_id);//aes ok tested
    void edit_node(data_node &node);//aes ok tested
    //node relation type related functions
    void load_node_relation_type(int node_or_relation);//aes ok tested 0 means node 1 means relation.
    void add_node_relation_type(string type,int node_or_relation,string color_code,bool vectored);//aes ok tested
    void delete_node_relation_type(unsigned int id,int node_or_relation);//aes ok tested
    void edit_node_relation_type(node_relation_type &type_data,int node_or_relation);//aes ok tested
    //relation related functions
    void load_relations();//aes ok tested
    void add_new_relation(relation&);//aes ok tested
    void delete_relation(unsigned int relation_id);//aes ok tested
    void edit_relation(relation& relation_obj);//aes ok tested

    //test functions
    void test()//for settings
    {
        cout<<"\n\nsettings:--------\n";
        cout<<"percent_nodes_in_memory="<<percent_of_node_in_memory<<endl;
        cout<<"encryption="<<encryption<<endl;
        cout<<"author="<<authors[0]<<endl;
        cout<<"NO OF NODES IN 1 FILE="<<no_of_nodes_in_one_node_file<<endl;
        cout<<"\nRELATION IN ONE RELATIONFILE: "<<no_of_relation_in_one_file<<endl;
    }

    void test2()//for node file list
    {
        cout<<"\n\nnode file list:-----\n";
        for(int a=0;a<node_file_list.size();a++)
        {
            cout<<node_file_list.at(a).file_id<<","<<node_file_list.at(a).file_name<<","<<node_file_list.at(a).start_id<<","<<node_file_list.at(a).end_id<<endl;
        }
    }

    void test3()//for node data and gap node data.
    {
        cout<<"\n\nnode data list:----------\n";
        for(int a=0;a<data_node_list.size();a++)
        {
            cout<<data_node_list.at(a).node_id<<","<<data_node_list.at(a).node_name<<","<<data_node_list.at(a).node_type_id<<",";
            for(int b=0;b<data_node_list.at(a).relation_id_list.size();b++)
            {
                cout<<data_node_list.at(a).relation_id_list.at(b)<<",";
            }
            cout<<"\n";
        }
        cout<<"size="<<gap_node_id_map.size();
        gap_node_iterator=gap_node_id_map.begin();
        for(;gap_node_iterator!=gap_node_id_map.end();gap_node_iterator++)
        {
            cout<<"\nid="<<gap_node_iterator->first;
        }
    }

    void test4()//for type functions data
    {
        cout<<"\n\nnode type list:-\n";
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
        cout<<"\n\nnode multimap:--------\n";
        multimap<string,int>::iterator i;
        i=node_meta_list.begin();
        for(;i!=node_meta_list.end();i++)
        {
            cout<<"name="<<i->first<<" ,index="<<i->second<<endl;
        }
    }

    void test6()//for relation file list
    {
        cout<<"\n\ntotal no of_relations="<<total_no_of_relations;
        cout<<"\nno of relation file="<<total_on_of_relationfile;
        cout<<"\nfiles:-";
        for(int a=0;a<relation_file_list.size();a++)
        {
            cout<<"\n"<<relation_file_list.at(a).file_id<<","<<relation_file_list.at(a).file_name<<","<<relation_file_list.at(a).start_id<<","<<relation_file_list.at(a).end_id<<","<<relation_file_list.at(a).file_full;
        }
    }

    void test7()//for relation data and relation gap data
    {
        cout<<"\n\nRelation:-----------";
        for(int a=0;a<relation_list.size();a++)
        {
            if(!relation_list.at(a).gap_relation)
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
        }
        cout<<"\n\ngap relation:-";
        gap_relation_iterator=gap_relation_id_map.begin();
        for(;gap_relation_iterator!=gap_relation_id_map.end();gap_relation_iterator++)
        {
            cout<<"\n"<<gap_relation_iterator->first;
        }
    }
};