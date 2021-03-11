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
    unsigned int total_no_of_nodes;
    unsigned int no_of_nodes_in_memory;
    unsigned int node_id_upper_range;//includes this value
    unsigned int node_id_lower_range;//includes this value
    vector<string> authors;
    vector<string> node_file_list;
    vector<string> relation_file_list;
    bool encryption;

    void calc_node_list_size(float);

    public:
    const string settings_list[4]={"ENCRYPTION","NO_OF_NODES","PERCENT_OF_NODE_IN_MEMORY","AUTHORS"};

    void add_new_node(data_node&);
    void load_nodes();
    void change_settings(string settings_name,string settings_value);//ok tested
    unsigned int load_db_settings();//ok tested

    void test()//temporary testing function
    {
        cout<<"no_of_nodes="<<total_no_of_nodes<<endl;
        cout<<"no_of_nodes_in_memory="<<no_of_nodes_in_memory<<endl;
        cout<<"encryption="<<encryption<<endl;
        cout<<"author="<<authors[0];
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
};