/*
1. This file is mainly for testing the library directly in c++ environment.
2. It contains dummy data and functions related to it.
3. It has specialised console based data viewing functions.
*/
#include<iostream>
#include<string>
#include "operations_class.h"

using namespace std;

int main()
{
    operation_class operations;
    database_class db;
    //db.create_odb("/media/yuvraj/Fast Disk/projects/react_electron/osiris/AvyuktaEngineSource/database/test.odb","test.odb","bikiclass7");
    db.open_odb("//media/yuvraj/Fast Disk/projects/react_electron/osiris/star wars database/star wars.odb","test1234");
    //operations.dijkstra(db,0,26);//14,3
    vector<unsigned int> node_ids;
    node_ids.push_back(0);
    node_ids.push_back(15);
    node_ids.push_back(23);
    //node_ids.push_back(24);
    operations.find_minimum_spanning_tree(db,node_ids);
    return 0;
}