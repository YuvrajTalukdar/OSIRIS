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

    int empty=1;
    try
    {
        for(auto& p: fs::directory_iterator(current_db_dir))
        {   empty=0;break;}
    }
    catch(std::exception e)
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

bool database_class::strcasestr(string str,string substr)
{
    transform(str.begin(), str.end(), str.begin(),::toupper);
    transform(substr.begin(), substr.end(), substr.begin(),::toupper);
    if(str.find(substr) != string::npos)
    {   return true;}
    else 
    {   return false;}
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
        fs::create_directory(temp_dir+"/attached_files");
        current_db_dir=dir_temp;
        file_handler.change_password(new_password);
        //remove the old files
        for(auto& p: fs::directory_iterator(current_db_dir))
        {
            if(!strcasestr(get_name_from_path(p.path()),"temp_files"))
            {   fs::remove_all(p.path());}   
        }
        fs::create_directory(current_db_dir+"attached_files");
        for(auto& p: fs::recursive_directory_iterator(temp_dir))
        {
            if(!p.is_directory())
            {   
                string folder_name="",path=p.path().string();
                int count=0;
                for(int a=path.length()-1;a>=0;a--)
                {
                    if(path.at(a)!='/')
                    {   folder_name=path.at(a)+folder_name;}
                    else
                    {   
                        if(count!=1)
                        {   folder_name="";}
                        count++;
                    }
                    if(count==2)
                    {   break;}
                }
                if(strcmp(folder_name.c_str(),"temp_files")==0)
                {   fs::rename(p.path(),current_db_dir+get_name_from_path(p.path()));}
                else
                {   fs::rename(p.path(),current_db_dir+"attached_files/"+folder_name+"/"+get_name_from_path(p.path()));}
            }
            else
            {   fs::create_directory(current_db_dir+"attached_files/"+get_name_from_path(p.path()));}
        }
        fs::remove_all(current_db_dir+"attached_files/attached_files");
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
    data_node n1;
    n1.node_type_id=0;
    n1.node_name="test";
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    file_handler.delete_node(0);
    file_handler.delete_node(1);
    file_handler.delete_node(2);
    file_handler.delete_node(3);
    file_handler.test3();
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    file_handler.add_new_node(n1);
    
    relation r1,r2,r3,r4,r5;
    r1.source_node_id=0;
    r1.destination_node_id=1;
    r2.source_node_id=0;
    r2.destination_node_id=2;
    r3.source_node_id=0;
    r3.destination_node_id=3;
    r4.source_node_id=0;
    r4.destination_node_id=4;
    r5.source_node_id=5;
    r5.destination_node_id=6;

    file_handler.add_new_relation(r1);
    file_handler.add_new_relation(r2);
    file_handler.add_new_relation(r3);
    file_handler.add_new_relation(r4);
    file_handler.add_new_relation(r5);
    file_handler.delete_relation(0);
    file_handler.delete_relation(1);
    file_handler.delete_relation(2);
    file_handler.delete_relation(3);
    file_handler.test7();
    file_handler.add_new_relation(r1);
    file_handler.add_new_relation(r2);
    file_handler.add_new_relation(r3);
    //data load testing    
    file_handler.test();//for settings

    file_handler.test4();//for type data
    
    file_handler.test2();//node file list
    */
    //file_handler.test3();//data node list
    /*file_handler.test5();//node multimap

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