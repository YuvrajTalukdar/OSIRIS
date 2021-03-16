/*
1. It is for handling the file read write operations.
2. In future it will be connected to the encryption class.
3. File formats are handled here.
*/
#include<fstream>
#include<dirent.h>
#include "data_structure_definition.h"

#include<stdlib.h>
#include<unistd.h>

class filehandler_class
{
    private:
    string database_dir="./database/";
    string settings_file_dir="./database/settings.csv";
    string file_list_dir="./database/node_file_list.csv";
    unsigned int total_no_of_nodes;
    unsigned int total_no_of_nodefile;
    float percent_of_node_in_memory;
    unsigned int no_of_nodes_in_memory;
    unsigned int no_of_nodes_in_one_node_file;
    unsigned int node_id_upper_range;//includes this value
    unsigned int node_id_lower_range;//includes this value
    vector<string> authors;
    vector<string> node_file_list;
    vector<string> relation_file_list;
    bool encryption;
    vector<file_info> file_list;
    vector<data_node> data_node_list;
    vector<unsigned int> gap_node_id_list;
    vector<relation> relation_list;
    vector<unsigned int> gap_relation_id_list;

    void calc_node_list_size(float);
    //node related private functions
    unsigned int write_nodedata_to_file(string file_name,data_node&);//ok tested
    void delete_node_data_from_file(string file_name,unsigned int node_index);
    void add_new_data_to_filelist(file_info&);//ok tested
    void load_file_list();//ok tested
    void set_file_full_status(unsigned int file_id,bool file_full);
    
    public:
    const string settings_list[5]={"ENCRYPTION","PERCENT_OF_NODE_IN_MEMORY","AUTHORS","NODES_IN_ONE_NODEFILE"};
    //settings related functions
    void change_settings(string file_dir,string settings_name,string settings_value);//ok tested, Function for changing individual settings of a file.
    unsigned int load_db_settings();//ok tested
    //node related public functions
    void add_new_node(data_node&);
    void load_nodes();//ok tested
    void delete_node(unsigned int node_id);//need to be implemented
    
    //relkation related functions
    void add_new_relation();

    void test()//temporary testing function
    {
        //cout<<"no_of_nodes="<<total_no_of_nodes<<endl;
        cout<<"percent_nodes_in_memory="<<percent_of_node_in_memory<<endl;
        cout<<"encryption="<<encryption<<endl;
        cout<<"author="<<authors[0]<<endl;
        cout<<"NO OF NODES IN 1 FILE="<<no_of_nodes_in_one_node_file<<endl;
        cout<<"\nNODE FILES:"<<endl;
        for(int a=0;a<node_file_list.size();a++)
        {
            cout<<node_file_list.at(a)<<endl;
        }
        cout<<"RELATION FILE LIST:"<<endl;
        for(int a=0;a<relation_file_list.size();a++)
        {
            cout<<relation_file_list[a]<<endl;
        }
    }

    void test2()
    {
        for(int a=0;a<file_list.size();a++)
        {
            cout<<file_list.at(a).file_id<<","<<file_list.at(a).file_name<<","<<file_list.at(a).start_id<<","<<file_list.at(a).end_id<<endl;
        }
    }

    void test3()
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
};