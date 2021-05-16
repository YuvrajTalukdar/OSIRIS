#include "database_class.h"


int database_class::is_dir_empty(string dir)
{
    int a;
    for(a=dir.size()-1;a>=0;a--)
    {
        if(dir.at(a)=='/')
        {   break;}
    }
    current_db_dir=dir.substr(0,a+1);

    struct dirent *de;
    DIR *dr=opendir(current_db_dir.c_str());
    int empty=1;
    if(dr!=NULL)
    {
        int count=0;
        while((de=readdir(dr))!=NULL)
        {
            count++;
            if(count>=3)
            {   empty=0;break;}
        }
    }
    else
    {   empty=2;}
    return empty;
}

string database_class::currentDateTime() {
    time_t     now = time(0);
    struct tm  tstruct;
    char       buf[80];
    tstruct = *localtime(&now);
    strftime(buf, sizeof(buf), "%Y-%m-%d.%X", &tstruct);
    return buf;
}

error database_class::create_odb(string dir,string database_name1,string password)
{
    error obj;
    int empty=is_dir_empty(dir);
    if(empty==1)
    {
        //create odb file
        database_name=database_name1;    
        string data;
        data+="DATABASE_NAME:,";
        data+=database_name1;
        data+=",\n";
        data+="CREATED_ON:,";
        data+=currentDateTime();
        data+=",\n";
        data+="LAST_MODIFIED_ON:,";
        data+=currentDateTime();
        data+=",\n";
        data+="ENCRYPTION_CHECKER:,";
        data+=encrypt_text(database_name1,password);
        data+=",\n";
        ofstream out_file(dir,ios::out);
        out_file<<data;
        out_file.close();

        //create settings file with default settings
        settings_file_dir=current_db_dir;
        settings_file_dir.append("settings.csv");
        ofstream out_file2(settings_file_dir,ios::out);
        data="";
        data+="ENCRYPTION:,true,\n";
        data+="PERCENT_OF_NODE_IN_MEMORY:,100.000000,\n";
        data+="AUTHORS:,";
        char username[32];
        cuserid(username);
        data+=username;
        data+=",\n";
        data+="NODES_IN_ONE_NODEFILE:,3,\n";
        data+="RELATION_IN_ONE_RELATIONFILE:,3,\n";
        data+="#END\n";
        out_file2<<data;
        out_file2.close();

        obj.error_code-1;
    }
    else if(empty==0)
    {
        obj.error_code=1;
        obj.error_statement=error_statement[1];
    }
    else if(empty==2)
    {
        obj.error_code=3;
        obj.error_statement=error_statement[3];
    }
    return obj;
}

string database_class::get_data_from_line(string line)
{
    int comma_count=0;
    string word;
    for(int a=0;a<line.size();a++)
    {
        if(line.at(a)!=',')
        {   word.push_back(line.at(a));}
        else
        {
            if(comma_count==1)
            {   break;}
            word="";
            comma_count++;
        }
    }
    return word;
}

error database_class::open_odb(string dir,string password)
{
    error obj;
    int empty=is_dir_empty(dir);
    if(empty==0)
    {
        ifstream in_file(dir,ios::in);
        string line;
        string encryption_checker;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(strcasestr(line.c_str(),"DATABASE_NAME"))
            {   database_name=get_data_from_line(line);}
            else if(strcasestr(line.c_str(),"CREATED_ON"))
            {   created_on=get_data_from_line(line);}
            else if(strcasestr(line.c_str(),"LAST_MODIFIED_ON"))
            {   last_modified=get_data_from_line(line);}
            else if(strcasestr(line.c_str(),"ENCRYPTION_CHECKER"))
            {   encryption_checker=get_data_from_line(line);}
        }
        in_file.close();
        decrypted_data obj2=decrypt_text(encryption_checker,password);
        if(obj2.decryption_successful)
        {   
            obj.error_code=-1;
            initialize_db(password);
        }
        else
        {   
            obj.error_code=2;
            obj.error_statement=error_statement[2];
        }
    }
    else if(empty==1)
    {   
        obj.error_code=1;
        obj.error_statement=error_statement[1];
    }
    else if(empty==2)
    {   
        obj.error_code=3;
        obj.error_statement=error_statement[3];
    }
    
    return obj;
}

void database_class::initialize_db(string password)
{   
    file_handler.set_password_and_dir(current_db_dir,password);

    file_handler.load_db_settings();

    file_handler.load_node_relation_type(0);
    file_handler.load_node_relation_type(1);
    
    file_handler.load_nodes();
    file_handler.load_relations();

    
    //data write testing
    /*
    //data load testing    
    file_handler.test();//for settings

    file_handler.test4();//for type data

    file_handler.test2();//node file list
    file_handler.test3();//data node list
    file_handler.test5();//node multimap

    file_handler.test6();//relation file list
    file_handler.test7();//for relation data
    */
}

void database_class::close_db()
{   file_handler.close_db();}