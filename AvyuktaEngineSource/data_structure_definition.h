#include<iostream>
#include<string>
#include<vector>

using namespace std;

struct relation
{
    unsigned int relation_id;
    unsigned int relation_type_id;

    unsigned int source_node_id;
    unsigned int destination_node_id;

    vector<string> source_url_list;
    vector<string> source_local;// if the data is available locally in hdd.
    vector<unsigned int> relation_id_list;//for relation on relation
    vector<unsigned int> grouped_relation_id_list;//Person A pays to person B. Person A pays $40000 to person B. 
};

struct data_node
{
    unsigned int node_id;
    string node_name;
    unsigned int node_type_id;
    vector<relation> relation_list;
};

struct general_data
{
    vector<string> relation_type;//financial, blood, dob, 
    vector<string> node_types;//person,animal,place what node is this? 
    //If it is a person than what is its sex or dob? this kind of info will be implemented using relations and not by node_types.
};