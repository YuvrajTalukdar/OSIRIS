#include "database_class.h"


string database_class::get_name_from_path(string path)
{
    string name;
    for(int a=path.length()-1;a>=0;a--)
    {
        if(path.at(a)!='/')
        {   name=path.at(a)+name;}
        else
        {   break;}
    }
    return name;
}

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
        if(created_on.length()==0)
        {   data+=currentDateTime();}
        else
        {   data+=created_on;}
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
        data+="ENCRYPTION:,";
        if(file_handler.encryption)
        {   data+="true,\n";}
        else
        {   data+="false,\n";}
        data+="PERCENT_OF_NODE_IN_MEMORY:,";
        data+=to_string(file_handler.percent_of_node_in_memory);
        data+=",\n";
        data+="AUTHORS:,";
        char username[32];
        cuserid(username);
        data+=username;
        data+=",\n";
        data+="NODES_IN_ONE_NODEFILE:,";
        data+=to_string(file_handler.no_of_nodes_in_one_node_file);
        data+=",\n";
        data+="RELATION_IN_ONE_RELATIONFILE:,";
        data+=to_string(file_handler.no_of_relation_in_one_file);
        data+=",\n";
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

error database_class::change_password(string current_password,string new_password)
{
    error err;
    if(!file_handler.password_same(current_password))
    {
        err.error_code=2;
        err.error_statement=error_statement[2];
    }
    else
    {
        string dir_temp=current_db_dir;
        string temp_dir=current_db_dir+"temp_files";
        fs::create_directory(temp_dir);
        create_odb(temp_dir+"/"+database_name,database_name,new_password);
        current_db_dir=dir_temp;
        file_handler.change_password(new_password);
        for(auto& p: fs::directory_iterator(current_db_dir))
        {
            if(!p.is_directory())
            {
                fs::remove(p.path());
                string file_name=get_name_from_path(p.path());
                fs::copy_file(temp_dir+"/"+file_name,current_db_dir+file_name);
            }
        }
        fs::remove_all(temp_dir);
        err.error_code=-1;
    }

    return err;
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
{   
    current_db_dir="";
    settings_file_dir="";
    database_name="";
    created_on="";
    last_modified="";
    file_handler.close_db();
}