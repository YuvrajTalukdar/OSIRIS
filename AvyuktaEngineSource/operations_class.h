/*
1. It contails the operation functions which will be performed on the data.
2. Operations like graph transversal, MST, sortest path etc.
*/
#include "database_class.h"

class operation_class
{
    public:
    void change_settings(database_class &db,int nodes_in_one_file,int relations_in_one_file,float percent_of_data_in_ram,bool encryption);
};