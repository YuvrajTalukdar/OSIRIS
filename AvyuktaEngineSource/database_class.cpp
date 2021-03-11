#include "database_class.h"

void database_class::initialize_db()
{
    int error_code=file_handler.load_db_settings();
    if(error_code==0)
    {   cout<<"error 0";}
    else if(error_code==1)
    {   cout<<"error 1";}
    else if(error_code==2)
    {   cout<<"error 2";}
    file_handler.test();
    file_handler.change_settings(file_handler.settings_list[2],"100");
}