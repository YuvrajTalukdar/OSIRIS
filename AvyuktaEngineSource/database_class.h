/*
1. It is for handling the basic database functions 
*/
#include<time.h>
#include<filesystem>
#include<cstdio>
#include<stdio.h>
#include "filehandler_class.h"

class database_class
{
    private:
    string current_db_dir="";
    string settings_file_dir="";
    string error_statement[5]={"Settings file not found.","Directory not empty.","Wrong Password.","Invalid Directory.",""};
    string database_name="",created_on="",last_modified="";

    string get_name_from_path(string path);
    string currentDateTime();
    string get_data_from_line(string line);
    int is_dir_empty(string dir);
    bool strcasestr(string str,string substr);
    public:
    filehandler_class file_handler;

    error open_odb(string dir,string password);
    error create_odb(string dir,string database_name,string password);
    error change_password(string current_password,string new_password);

    void initialize_db(string password);

    void close_db();
};