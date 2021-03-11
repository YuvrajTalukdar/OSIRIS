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
    db.initialize_db();
    return 0;
}