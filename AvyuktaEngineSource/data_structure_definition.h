#include<iostream>
#include<string>
#include<string.h>//fpr strcasestr
#include<vector>
#include<bits/stdc++.h>//for multimap

using namespace std;

struct relation
{
    unsigned int relation_id;
    unsigned int relation_type_id;

    unsigned int source_node_id;
    unsigned int destination_node_id;

    double weight=0;

    bool gap_relation=false;

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
    vector<unsigned int> relation_id_list;
};

struct node_relation_type
{
    unsigned int id;
    bool vectored=false;
    string type_name,color_code;
};

struct file_info
{
    string file_name;
    unsigned int file_id,start_id,end_id;
    bool file_full=false;
};