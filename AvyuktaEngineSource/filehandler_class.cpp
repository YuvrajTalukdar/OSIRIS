#include "filehandler_class.h"

bool filehandler_class::strcasestr(string str,string substr)
{
    transform(str.begin(), str.end(), str.begin(),::toupper);
    transform(substr.begin(), substr.end(), substr.begin(),::toupper);
    if(str.find(substr) != string::npos)
    {   return true;}
    else 
    {   return false;}
}

string filehandler_class::convert_to_windows_path(string path)
{
    string new_path;
    for(int a=path.length()-1;a>=0;a--)
    {
        if(path.at(a)=='/')
        {   new_path="\\"+new_path;}
        else
        {   new_path=path.at(a)+new_path;}
    }
    return new_path;
}

string filehandler_class::get_name_from_path(string path,bool is_windows)
{
    string name;
    if(is_windows)
    {
        for(int a=path.length()-1;a>=0;a--)
        {
            if(path.at(a)!='\\')
            {   name=path.at(a)+name;}
            else
            {   break;}
        }
    }
    else
    {
        for(int a=path.length()-1;a>=0;a--)
        {
            if(path.at(a)!='/')
            {   name=path.at(a)+name;}
            else
            {   break;}
        }
    }
    return name;
}

bool filehandler_class::password_same(string current_passowrd)
{
    if(strcmp(password.c_str(),current_passowrd.c_str())==0)
    {   return true;}
    else
    {   return false;}
}

bool filehandler_class::is_whitespace(const string& s) 
{   return std::all_of(s.begin(), s.end(), isspace);}

void filehandler_class::close_db()
{
    password="";
    database_dir="";
    node_file_list_dir="";
    relation_file_list_dir="";
    relation_type_file_dir="";
    node_type_file_dir="";

    node_file_list.clear();
    gap_node_id_map.clear();
    gap_relation_id_map.clear();
    relation_file_list.clear();
    node_types.clear();
    relation_types.clear();
    data_node_list.clear();
    node_meta_list.clear();
    relation_list.clear();
    authors.clear();
}

void filehandler_class::change_password(string new_password)
{
    string temp_dir=database_dir+"temp_files";
    decrypted_data obj;
    //setting the new password
    string old_password=password;
    //re-encrypting node_file_list
    obj=decrypt_file_text(node_file_list_dir);
    password=new_password;
    encrypt_file(temp_dir+"/node_file_list.csv",obj.decrypted_text);
    //re-encrypting relation_file_list
    password=old_password;
    obj=decrypt_file_text(relation_file_list_dir);
    password=new_password;
    encrypt_file(temp_dir+"/relation_file_list.csv",obj.decrypted_text);
    //re-encrypting node_type_file
    password=old_password;
    obj=decrypt_file_text(node_type_file_dir);
    password=new_password;
    encrypt_file(temp_dir+"/node_type_list.csv",obj.decrypted_text);
    //re-encrypting relation_type_file
    password=old_password;
    obj=decrypt_file_text(relation_type_file_dir);
    password=new_password;
    encrypt_file(temp_dir+"/relation_type_list.csv",obj.decrypted_text);

    //re-encrypting node_files
    string file_dir;
    for(int a=0;a<node_file_list.size();a++)
    {
        password=old_password;
        obj=decrypt_file_text(database_dir+"/"+node_file_list.at(a).file_name);
        password=new_password;
        encrypt_file(temp_dir+"/"+node_file_list.at(a).file_name,obj.decrypted_text);
    }
    //re-encrypting relation_files
    for(int a=0;a<relation_file_list.size();a++)
    {
        password=old_password;
        obj=decrypt_file_text(database_dir+"/"+relation_file_list.at(a).file_name);
        password=new_password;
        encrypt_file(temp_dir+"/"+relation_file_list.at(a).file_name,obj.decrypted_text);
    }
    //re encrypting attached files
    string attached_file_dir=database_dir+"attached_files\\";
    for(auto& p: fs::recursive_directory_iterator(attached_file_dir))
    {  
        if(!p.is_directory())
        {
            password=old_password;
            obj=decrypt_file_text(p.path().string());
            password=new_password;
            //get folder name from path
            string folder_name,path=p.path().string();
            int count=0;
            for(int a=path.length()-1;a>=0;a--)
            {
                if(path.at(a)!='\\')
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
            folder_name=decrypt_text(folder_name,old_password).decrypted_text;
            folder_name=encrypt_text(folder_name,new_password);
            string file_name=encrypt_text(decrypt_text(get_name_from_path(p.path().string(),true),old_password).decrypted_text,new_password);
            encrypt_file(temp_dir+"/attached_files/"+folder_name+"/"+file_name,obj.decrypted_text);
        }
        else
        {   
            string folder_name=encrypt_text(decrypt_text(get_name_from_path(p.path().string(),true),old_password).decrypted_text,new_password);
            fs::create_directory(temp_dir+"\\attached_files\\"+folder_name);
        }
    }
}

void filehandler_class::set_password_and_dir(string current_db_dir,string pass)
{   
    password=pass;
    database_dir=current_db_dir;
    node_file_list_dir=current_db_dir;
    node_file_list_dir.append("node_file_list.csv");
    relation_file_list_dir=current_db_dir;
    relation_file_list_dir.append("relation_file_list.csv");
    relation_type_file_dir=current_db_dir;
    relation_type_file_dir.append("relation_type_list.csv");
    node_type_file_dir=current_db_dir;
    node_type_file_dir.append("node_type_list.csv");
    settings_file_dir=current_db_dir;
    settings_file_dir.append("settings.csv");
}

decrypted_data filehandler_class::decrypt_file_text(string file_dir)
{
    ifstream in_file(file_dir,ios::in);
    string data,line;
    while(in_file)
    {
        getline(in_file,line);
        data+=line;
        data+="\n";
        if(in_file.eof())
        {   break;}
    }
    in_file.close();
    decrypted_data obj=decrypt_text(data,password);
    
    return obj;
}

stringstream filehandler_class::decrypt_file(string file_dir)
{
    ifstream in_file(file_dir,ios::in);
    string data,line;
    while(in_file)
    {
        getline(in_file,line);
        data+=line;
        data+="\n";
        if(in_file.eof())
        {   break;}
    }
    in_file.close();
    decrypted_data obj=decrypt_text(data,password);
    stringstream ss;
    ss<<obj.decrypted_text;
    return ss;
}

void filehandler_class::encrypt_file(string file_dir,string data)
{
    ofstream out_file(file_dir,ios::out);
    string encrypted_text=encrypt_text(data,password);
    out_file<<encrypted_text;
    out_file.close();
    //cout<<"\n\ncheck11---  dir==="<<file_dir<<" data=\n"<<data;
}

error filehandler_class::load_db_settings()
{
    error obj;
    bool settings_file_found=check_if_file_is_present("settings.csv");
    if(settings_file_found)
    {
        ifstream settings_file(settings_file_dir,ios::in);
        string line;
        while(settings_file)
        {
            getline(settings_file,line);//space problem is fixed here.
            if(settings_file.eof())
            {   break;}
            if(strcmp(line.c_str(),"#END")==0)
            {   break;}
            else
            {
                int count=0;
                string word="";
                short int option=-1;
                for(int a=0;a<line.length();a++)
                {
                    if(line.at(a)!=',')
                    {   word.push_back(line.at(a));}
                    else
                    {
                        if(count==0)
                        {
                            for(int b=0;b<5;b++)
                            {
                                string settings_name=settings_list[b]+":";
                                if(strcmp(word.c_str(),settings_name.c_str())==0)
                                {   option=b;break;}
                            }
                        }
                        else
                        {
                            if(option==0)
                            {   
                                if(strcmp(word.c_str(),"true")==0)
                                {   encryption=true;}
                                else
                                {   encryption=false;}
                            }
                            else if(option==1)
                            {   percent_of_node_in_memory=stof(word);}
                            else if(option==2)
                            {   authors.push_back(word);}
                            else if(option==3)
                            {   no_of_nodes_in_one_node_file=stoi(word);}
                            else if(option==4)
                            {   no_of_relation_in_one_file=stoi(word);}
                        }
                        word="";
                        count++;
                    }
                }
            }
        }
        settings_file.close();
        obj.error_code=-1;
    }
    else
    {   obj.error_code=0;}

    return obj;
}

void filehandler_class::change_settings(string file_dir,string settings_name,string settings_value)
{
    if(strcmp(file_dir.c_str(),settings_file_dir.c_str())==0)
    {
        ifstream settings_file(file_dir,ios::in);
        string line,temp_data;
        while(settings_file)
        {
            getline(settings_file,line);
            if(settings_file.eof())
            {   break;}
            if(strcasestr(line,settings_name))
            {
                temp_data+=settings_name;
                temp_data+=":,";
                temp_data+=settings_value;
                temp_data+=",\n";
            }
            else
            {
                temp_data+=line;
                temp_data+="\n";
            }
        }
        settings_file.close();
        ofstream new_settings_file(file_dir,ios::out);
        new_settings_file<<temp_data;
        new_settings_file.close();
    }
    else
    {
        stringstream settings_file=decrypt_file(file_dir);
        string line,temp_data;
        while(settings_file)
        {
            getline(settings_file,line);
            if(settings_file.eof())
            {   break;}
            if(strcasestr(line,settings_name))
            {
                temp_data+=settings_name;
                temp_data+=":,";
                temp_data+=settings_value;
                temp_data+=",\n";
            }
            else
            {
                temp_data+=line;
                temp_data+="\n";
            }
        }
        settings_file.clear();
        encrypt_file(file_dir,temp_data);
    }
    
}

void filehandler_class::load_node_relation_file_list(int node_or_relation)
{
    string dir;
    if(node_or_relation==0)
    {   dir=node_file_list_dir;}
    else if(node_or_relation==1)
    {   dir=relation_file_list_dir;}
    stringstream list_file=decrypt_file(dir);
    string line;
    unsigned int line_count=0;
    while(list_file)
    {
        getline(list_file,line);
        if(list_file.eof())
        {   break;}
        if(line_count<=2)//for total no of nodes and total no of nodefile
        {   
            string word="";
            int comma_count=0;
            for(int b=0;b<line.length();b++)
            {
                if(line.at(b)!=',')
                {   word.push_back(line.at(b));}
                else
                {
                    comma_count++;
                    if(comma_count==2)
                    {   
                        if(line_count==0)
                        {   
                            if(node_or_relation==0)
                            {   total_no_of_nodes=stoi(word);}
                            else if(node_or_relation==1)
                            {   total_no_of_relations=stoi(word);}
                        }
                        else if(line_count==1)
                        {   
                            if(node_or_relation==0)
                            {   total_no_of_nodefile=stoi(word);}
                            else if(node_or_relation==1)
                            {   total_on_of_relationfile=stoi(word);}
                        }
                    }
                    word="";
                }
            }
        }
        else if(line_count>2 && !is_whitespace(line) && line.at(0)!=NULL)//for the file data
        {   
            string word="";
            int comma_count=0;
            file_info obj1;
            for(int b=0;b<line.length();b++)
            {
                if(line.at(b)!=',')
                {   word.push_back(line.at(b));}
                else
                {
                    comma_count++;
                    if(comma_count==1)
                    {   obj1.file_id=stoi(word);}
                    else if(comma_count==2)
                    {   obj1.file_name=word;}
                    else if(comma_count==3)
                    {   obj1.start_id=stoi(word);}
                    else if(comma_count==4)
                    {   obj1.end_id=stoi(word);}
                    else if(comma_count==5)
                    {
                        if(stoi(word)==0)
                        {   obj1.file_full=false;}
                        else
                        {   obj1.file_full=true;}
                    }
                    word="";
                }
            }
            if(node_or_relation==0)
            {   node_file_list.push_back(obj1);}
            else if(node_or_relation==1)
            {   relation_file_list.push_back(obj1);}
        }
        line_count++;
    }
    list_file.clear();
}

void filehandler_class::add_new_data_to_node_filelist(file_info &new_data)
{
    node_file_list.push_back(new_data);
    bool file_found=check_if_file_is_present("node_file_list.csv");
    stringstream list_file_in=decrypt_file(node_file_list_dir);
    unsigned int line_count=0;
    string temp_data,line;
    while(list_file_in && file_found)
    {   
        getline(list_file_in,line);
        if(list_file_in.eof())
        {   break;}
        if(line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
        {
            if(line_count==0)//change the no_of_node_data
            {
                temp_data+="NO_OF_NODES:,";
                total_no_of_nodes++;
                temp_data+=to_string(total_no_of_nodes);
                temp_data+=",\n";
            }
            else if(line_count==1)//change the no of files
            {
                temp_data+="NO_OF_NODEFILE:,";
                total_no_of_nodefile++;
                temp_data+=to_string(total_no_of_nodefile);
                temp_data+=",\n";
            }
            else
            {
                temp_data+=line;
                temp_data+="\n";
            }
            line_count++;
        }
    }
    if(!file_found)
    {
        temp_data+="NO_OF_NODES:,";
        total_no_of_nodes++;
        temp_data+=to_string(total_no_of_nodes);
        temp_data+=",\n";

        temp_data+="NO_OF_NODEFILE:,";
        total_no_of_nodefile++;
        temp_data+=to_string(total_no_of_nodefile);
        temp_data+=",\nFILE_ID,FILE_NAME,NODE_START_ID,NODE_END_ID,FILE_FULL,\n";
    }
    list_file_in.clear();
    temp_data+=to_string(new_data.file_id);
    temp_data+=",";
    temp_data+=new_data.file_name;
    temp_data+=",";
    temp_data+=to_string(new_data.start_id);
    temp_data+=",";
    temp_data+=to_string(new_data.end_id);
    temp_data+=",";
    if(new_data.file_full)
    {   temp_data+=to_string(1);}
    else
    {   temp_data+=to_string(0);}
    temp_data+=",\n";
    encrypt_file(node_file_list_dir,temp_data);
}

void filehandler_class::load_nodes()
{
    //gap node
    data_node gap_node;
    gap_node.node_name="gap_node";
    gap_node.node_type_id=0;
    
    load_node_relation_file_list(0);
    string node_file_dir,line,word;
    unsigned int line_count,comma_count,previous_id=0;
    bool is_prev_id_neg=true;
    for(int a=0;a<node_file_list.size();a++)
    {
        node_file_dir=database_dir+node_file_list.at(a).file_name;
        stringstream in_file=decrypt_file(node_file_dir);

        line_count=0;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(strcmp(line.c_str(),"")==0)//for taking care of bland space at the end of the file.
            {   continue;}
            if(line_count>1)
            {
                comma_count=0;
                data_node node;
                for(int b=0;b<line.size();b++)
                {  
                    if(line.at(b)!=',')
                    {   word.push_back(line.at(b));}
                    else
                    {   
                        if(comma_count==0)
                        {   node.node_id=stoi(word);}
                        else if(comma_count==1)
                        {   node.node_name=word;}
                        else if(comma_count==2)
                        {   node.node_type_id=stoi(word);}
                        word="";
                        comma_count++;
                    }
                }
                if(node.node_id-previous_id>1)//0+ bug may be present
                {
                    unsigned int b;
                    if(is_prev_id_neg)//if first and the next node is missing.
                    {   b=previous_id;}
                    else
                    {   b=previous_id+1;}
                    for(b;b<node.node_id;b++)
                    {
                        gap_node_id_map.insert(make_pair(b,gap_node_id_map.size()));
                        gap_node.node_id=b;
                        data_node_list.push_back(gap_node);
                    }
                }
                else
                {
                    if(node.node_id-previous_id==1 && previous_id==0 && is_prev_id_neg)//if the first node is missing
                    {
                        gap_node_id_map.insert(make_pair(0,gap_node_id_map.size()));
                        gap_node.node_id=0;
                        data_node_list.push_back(gap_node);
                    }
                }
                is_prev_id_neg=false;
                node_meta_list.insert(make_pair(node.node_name,data_node_list.size()));
                data_node_list.push_back(node);
                previous_id=node.node_id;
            }
            line_count++;
        }
        in_file.clear();
    }
}

bool filehandler_class::check_if_file_is_present(string file_name)
{
    bool file_found=false;
    for(auto& p: fs::directory_iterator(database_dir))
    {
        if(strcmp(file_name.c_str(),get_name_from_path(p.path().string(),true).c_str())==0)
        {   file_found=true;break;}
    }
    return file_found;
}

unsigned int filehandler_class::write_nodedata_to_file(string file_name,data_node &node)
{
    bool file_found=check_if_file_is_present(file_name);
    file_name=database_dir+file_name;
    stringstream in_file=decrypt_file(file_name);
    string temp_data,line,line2;
    unsigned int no_of_nodes_in_this_file,insertion_index=0;
    temp_data+="NO_OF_NODES_IN_THIS_FILE:,";
    string word="";
    unsigned int comma_count=0,line_count=0,id;
    if(file_found)
    {
        getline(in_file,line);
        for(int a=0;a<line.length();a++)
        {
            if(line.at(a)!=',')
            {   word.push_back(line.at(a));}
            else
            {
                comma_count++;
                if(comma_count==2)
                {   no_of_nodes_in_this_file=stoi(word);break;}
                word="";
            }
        }
        no_of_nodes_in_this_file++;
        temp_data+=to_string(no_of_nodes_in_this_file);
        temp_data+=",\n";
        getline(in_file,line);//for the FILE_ID,FILE_NAME,NODE_START_ID,NODE_END_ID,FILE_FULL, line.
        temp_data+=line;
        temp_data+="\n";
    }
    else
    {   
        temp_data+=to_string(1);
        no_of_nodes_in_this_file=1;
        temp_data+=",\n";
        string heading_line;
        heading_line="NODE_ID,NODE_NAME,NODE_TYPE_ID,RELATION_LIST:-,\n";
        temp_data+=heading_line;
    }
    if(gap_node_id_map.size()>0)
    {   
        gap_node_iterator=gap_node_id_map.begin();
        insertion_index=gap_node_iterator->first;
    }
    else
    {   insertion_index=total_no_of_nodes;}
    node.node_id=insertion_index;
    
    line2=to_string(node.node_id)+","+node.node_name+","+to_string(node.node_type_id)+",";
    line2+="\n";
    
    bool insertion_done=false;
    while (in_file)
    {   
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        if(strcmp(line.c_str(),"")!=0)
        {
            word="";
            for(unsigned int a=0;a<line.length();a++)
            {
                if(line.at(a)!=',')
                {   word.push_back(line.at(a));}
                else
                {   id=stoi(word);break;}
            }
            if(insertion_index<id && !insertion_done)
            {   
                temp_data+=line2;
                insertion_done=true;
            }
            temp_data+=line;
            temp_data+="\n";
        }
    }
    if(!insertion_done)
    {   temp_data+=line2;}
    in_file.clear();

    encrypt_file(file_name,temp_data);
    node_meta_list.insert(make_pair(node.node_name,data_node_list.size()));
    data_node_list.push_back(node);

    return no_of_nodes_in_this_file;
}

void filehandler_class::add_new_node(data_node &node)
{
    //get the node file name
    // if file not available or if file full create new file
    unsigned int no_of_nodes_in_current_file=0,current_file_id;
    if(node_file_list.size()==0)//if no file available
    {   //cout<<"\n\ncheck1";
        file_info new_file;
        new_file.file_id=0;
        new_file.file_name="nf"+to_string(0);
        new_file.start_id=0;
        new_file.end_id=0;
        node.node_id=0;
        if(no_of_nodes_in_one_node_file==1)
        {   new_file.file_full=true;}
        else
        {   new_file.file_full=false;}
        no_of_nodes_in_current_file=write_nodedata_to_file(new_file.file_name,node);
        add_new_data_to_node_filelist(new_file);
        current_file_id=0;
    }
    else if(gap_node_id_map.size()>0)//if gap present.
    {   //cout<<"\n\ncheck2";
        gap_node_iterator=gap_node_id_map.begin();
        data_node_list.at(gap_node_iterator->first).node_id=gap_node_iterator->first;
        data_node_list.at(gap_node_iterator->first).node_name=node.node_name;
        data_node_list.at(gap_node_iterator->first).node_type_id=node.node_type_id;
        string file_name=node_file_list.at(gap_node_iterator->first/no_of_nodes_in_one_node_file).file_name;
        current_file_id=gap_node_iterator->first/no_of_nodes_in_one_node_file;
        node.node_id=gap_node_iterator->first;
        no_of_nodes_in_current_file=write_nodedata_to_file(file_name,node);
        gap_node_id_map.erase(gap_node_iterator->first);
        total_no_of_nodes++;
        change_settings(node_file_list_dir,"NO_OF_NODES",to_string(total_no_of_nodes));
    }
    else if(gap_node_id_map.size()==0 && node_file_list.at(node_file_list.size()-1).file_full)//if file is full
    {   //cout<<"\n\ncheck3";
        file_info new_file;
        new_file.file_id=node_file_list.at(node_file_list.size()-1).file_id+1;
        new_file.file_name="nf"+to_string(new_file.file_id);
        //node.node_id=node_file_list.at(node_file_list.size()-1).end_id+1;
        new_file.start_id=total_no_of_nodes;
        new_file.end_id=total_no_of_nodes;
        if(no_of_nodes_in_one_node_file==1)
        {   new_file.file_full=true;}
        else
        {   new_file.file_full=false;}
        no_of_nodes_in_current_file=write_nodedata_to_file(new_file.file_name,node);
        add_new_data_to_node_filelist(new_file);
        current_file_id=node_file_list.size()-1;
    }
    else//if file available and file not full. 
    {   //cout<<"\n\ncheck4";
        unsigned int free_file_index;
        for(unsigned int a=0;a<node_file_list.size();a++)
        {
            if(!node_file_list.at(a).file_full)
            {   free_file_index=a;break;}
        }
        no_of_nodes_in_current_file=write_nodedata_to_file(node_file_list.at(free_file_index).file_name,node);
        change_settings(node_file_list_dir,"NO_OF_NODES",to_string((free_file_index)*no_of_nodes_in_one_node_file+no_of_nodes_in_current_file));
        total_no_of_nodes++;
        current_file_id=free_file_index;
    }
    if(no_of_nodes_in_current_file==no_of_nodes_in_one_node_file)//for turning the file full value to true in node_file_list.csv. 
    {   set_file_full_status(current_file_id,true,0);}

    last_entered_node=node;
}

void filehandler_class::set_file_full_status(unsigned int file_id,bool file_full,int node_or_relation)
{
    string dir;
    if(node_or_relation==0)
    {
        dir=node_file_list_dir;
        node_file_list.at(file_id).file_full=file_full;
    }
    else if(node_or_relation==1)
    {
        dir=relation_file_list_dir;
        relation_file_list.at(file_id).file_full=file_full;
    }
    stringstream in_file=decrypt_file(dir);
    string temp_data="",line;
    vector<string> line_list;
    while(in_file)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        line_list.push_back(line);
    }        
    in_file.clear();

    for(int a=0;a<line_list.size();a++)
    {
        if((a-3)!=file_id)
        {
            temp_data+=line_list.at(a);
            temp_data+="\n";
        }
        else
        {
            if(node_or_relation==0)
            {
                temp_data+=to_string(node_file_list.at(file_id).file_id);
                temp_data+=",";
                temp_data+=node_file_list.at(file_id).file_name;
                temp_data+=",";
                temp_data+=to_string(node_file_list.at(file_id).start_id);
                temp_data+=",";
                temp_data+=to_string(node_file_list.at(file_id).start_id+no_of_nodes_in_one_node_file-1);
                node_file_list.at(file_id).end_id=node_file_list.at(file_id).start_id+no_of_nodes_in_one_node_file-1;
                temp_data+=",";
            }
            else if(node_or_relation==1)
            {
                temp_data+=to_string(relation_file_list.at(file_id).file_id);
                temp_data+=",";
                temp_data+=relation_file_list.at(file_id).file_name;
                temp_data+=",";
                temp_data+=to_string(relation_file_list.at(file_id).start_id);
                temp_data+=",";
                temp_data+=to_string(relation_file_list.at(file_id).start_id+no_of_relation_in_one_file-1);
                relation_file_list.at(file_id).end_id=relation_file_list.at(file_id).start_id+no_of_relation_in_one_file-1;
                temp_data+=",";
            }
            if(file_full)
            {   temp_data+="1,\n";}
            else
            {   temp_data+="0,\n";}
        }
    }
    encrypt_file(dir,temp_data);
}

void filehandler_class::delete_node_data_from_file(string file_name,unsigned int node_id)
{
    file_name=database_dir+file_name;
    stringstream in_file=decrypt_file(file_name);
    unsigned int line_count=0,id=0,comma_count=0,no_of_nodes_in_this_file=0;
    string line,word,temp_data;
    while (in_file)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        if(line_count==0)
        {
            temp_data;
            for(int a=0;a<line.length();a++)
            {
                if(line.at(a)!=',')
                {   word.push_back(line.at(a));}
                else
                {   
                    if(comma_count==1)
                    {   
                        no_of_nodes_in_this_file=stoi(word);
                        no_of_nodes_in_this_file--;
                        temp_data+=to_string(no_of_nodes_in_this_file);
                        temp_data+=",";
                    }
                    else
                    {   
                        temp_data+=word;
                        temp_data+=",";
                    }
                    word="";
                    comma_count++;
                }
            }
            temp_data+="\n";
        }
        else if(line_count==1)
        {   temp_data+=line;temp_data+="\n";}
        else
        {
            word="";
            for(int a=0;a<line.length();a++)
            {
                if(line.at(a)!=',')
                {   word.push_back(line.at(a));}
                else
                {   id=stoi(word);break;}
            }
            if(id!=node_id)
            {   temp_data+=line;temp_data+="\n";}
        }
        line_count++;
    }
    in_file.clear();
    encrypt_file(file_name,temp_data);
}

void filehandler_class::delete_node(unsigned int node_id)
{   
    if(data_node_list.size()-1>=node_id)
    {
        multimap<string,int>::iterator it=node_meta_list.find(data_node_list.at(node_id).node_name);
        if(it!=node_meta_list.end())
        {
            node_meta_list.erase(it);
            
            //remove the node data from node_file.
            delete_node_data_from_file(node_file_list.at(node_id/no_of_nodes_in_one_node_file).file_name,node_id);
            total_no_of_nodes--;
            //change the particular node to gap node
            
            data_node_list.at(node_id).node_name="gap_node";
            /*for(int a=0;a<data_node_list.at(node_id).relation_id_list.size();a++)
            {   //delete the relations. Enable the line below when dealing with actual data.
                //delete_relation(data_node_list.at(node_id).relation_id_list.at(a));
            }*/
            //data_node_list.at(node_id).relation_id_list.clear();//this is redundant now
            gap_node_id_map.insert(make_pair(node_id,gap_node_id_map.size()));
            //change all the settings from node_file_list.csv
            change_settings(node_file_list_dir,"NO_OF_NODES",to_string(total_no_of_nodes));
            set_file_full_status(node_id/no_of_nodes_in_one_node_file,false,0);
        }
    }
    else 
    {
        cout<<"ERROR!: Index not matching with id.";
    }
}

void filehandler_class::edit_node(data_node &node)
{
    //editing the multimap
    multimap<string,int>::iterator it=node_meta_list.find(data_node_list.at(node.node_id).node_name);
    node_meta_list.insert(make_pair(node.node_name,it->second));
    node_meta_list.erase(it);
    //editing data_node_list
    data_node_list.at(node.node_id).node_name=node.node_name;
    data_node_list.at(node.node_id).node_type_id=node.node_type_id;
    //edit the node file
    string node_file_name=database_dir+node_file_list.at(node.node_id/no_of_nodes_in_one_node_file).file_name;
    stringstream in_file=decrypt_file(node_file_name);
    string line,word,new_data;
    int line_count=0,comma_count=0;
    bool found=false;
    while(in_file)
    {   
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        found=false;
        if(line_count>1)
        {
            word="";
            comma_count=0;
            for(int a=0;a<line.length();a++)
            {
                if(line.at(a)!=',')
                {   word.push_back(line.at(a));}
                else
                {  
                    if(stoi(word)==node.node_id)
                    {   
                        line="";
                        line+=(to_string(node.node_id)+",");
                        line+=(node.node_name+",");
                        line+=(to_string(node.node_type_id)+",");
                        line+="\n";
                        new_data+=line;
                        found=true;
                    }
                    break;
                }
            }
        }
        if(!found)
        {
            new_data+=line;
            new_data+='\n';
        }
        line_count++;
    }
    in_file.clear();
    encrypt_file(node_file_name,new_data);
}

void filehandler_class::load_node_relation_type(int node_or_relation)
{
    string dir,file_name;
    if(node_or_relation==0)
    {   dir=node_type_file_dir;file_name="node_type_list.csv";}
    else if(node_or_relation==1)
    {   dir=relation_type_file_dir;file_name="relation_type_list.csv";}

    if(check_if_file_is_present(file_name))
    {
        stringstream in_file=decrypt_file(dir);
        unsigned int line_count=0,comma_count;
        string line,word;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(line_count>0 && line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
            {   
                node_relation_type obj;
                comma_count=0;
                for(int a=0;a<line.length();a++)
                {
                    if(line.at(a)!=',')
                    {   word.push_back(line.at(a));}
                    else
                    {
                        if(comma_count==0)
                        {   obj.id=stoi(word);}
                        else if(comma_count==1)
                        {   obj.type_name=word;}
                        else if(comma_count==2 && node_or_relation==1)
                        {   obj.color_code=word;}
                        else if(comma_count==3 && node_or_relation==1)
                        {
                            int vectored=stoi(word);
                            if(vectored==0)
                            {   obj.vectored=false;}
                            else if(vectored==1)
                            {   obj.vectored=true;}
                        }
                        comma_count++;
                        word="";
                    }
                }
                if(node_or_relation==0)
                {   node_types.push_back(obj);}
                else if(node_or_relation==1)
                {   relation_types.push_back(obj);}
            }
            line_count++;
        }
        in_file.clear();
    }
}

void filehandler_class::add_node_relation_type(string type,int node_or_relation,string color_code,bool vectored)
{
    //check if file node_type_list.csv is present
    string dir,file_name;
    if(node_or_relation==0)
    {   dir=node_type_file_dir;file_name="node_type_list.csv";}
    else if(node_or_relation==1)
    {   dir=relation_type_file_dir;file_name="relation_type_list.csv";}

    bool file_found=check_if_file_is_present(file_name);
    string temp_data;
    int last_id=-1,line_count=0;
    if(file_found)
    {
        stringstream in_file=decrypt_file(dir);
        string line,word,last_line;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
            {
                temp_data+=line;
                temp_data+="\n";
                last_line=line;
                line_count++;
            }   
        }
        if(line_count>1)
        {
            for(int a=0;a<last_line.length();a++)
            {
                if(last_line.at(a)!=',')
                {   word.push_back(last_line.at(a));}
                else
                {
                    last_id=stoi(word);
                    break;
                }
            }
        }
        in_file.clear();
    }
    else
    {   
        if(node_or_relation==0)
        {   temp_data+="ID,NODE_TYPE,\n";}
        else if(node_or_relation==1)
        {   temp_data+="ID,RELATION_TYPE,COLOR_CODE,VECTORED,\n";}
    }
    temp_data+=to_string(last_id+1);
    temp_data+=",";
    transform(type.begin(), type.end(), type.begin(), ::toupper);
    temp_data+=type;
    temp_data+=",";
    if(node_or_relation==1)
    {
        transform(color_code.begin(),color_code.end(),color_code.begin(),::toupper);
        temp_data+=color_code;
        temp_data+=",";
        if(vectored)
        {   temp_data+="1,";}
        else
        {   temp_data+="0,";}
    }
    temp_data+="\n";
    encrypt_file(dir,temp_data);
    node_relation_type obj;
    obj.id=last_id+1;
    obj.type_name=type;
    if(node_or_relation==0)
    {   node_types.push_back(obj);}
    else if(node_or_relation==1)
    {   
        obj.color_code=color_code;
        obj.vectored=vectored;
        relation_types.push_back(obj);
    }
}

void filehandler_class::delete_node_relation_type(unsigned int id,int node_or_relation)//gap ignorance technique is used here
{
    string dir;
    if(node_or_relation==0)
    {   dir=node_type_file_dir;}
    else if(node_or_relation==1)
    {   dir=relation_type_file_dir;}

    stringstream in_file=decrypt_file(dir);
    string temp_data,line,word;
    unsigned int line_count=0;
    while(in_file)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        if(line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
        {
            if(line_count>0)
            {
                for(int a=0;a<line.length();a++)
                {
                    if(line.at(a)!=',')
                    {   word.push_back(line.at(a));}
                    else
                    {
                        if(stoi(word)!=id)
                        {   
                            temp_data+=line;
                            temp_data+="\n";
                        }
                        word="";
                        break;
                    }
                }
            }
            else
            {   
                temp_data+=line;
                temp_data+="\n";
            }
            line_count++;
        }
    }
    in_file.clear();
    encrypt_file(dir,temp_data);
    //Binary search is done here
    if(node_or_relation==0)
    {
        int left=0,right=node_types.size()-1,mid;
        bool found=false;
        while(left <= right)
        {   
            mid=left+(right-left)/2;
            if(node_types.at(mid).id==id)
            {   found=true;break;}
            else if(node_types.at(mid).id>id)
            {   right=mid-1;}
            else if(node_types.at(mid).id<id)
            {   left=mid+1;}
        }
        if(found)
        {   node_types.erase(node_types.begin()+mid);}
    }
    else if(node_or_relation==1)
    {
        int left=0,right=relation_types.size()-1,mid;
        bool found=false;
        while(left <= right)
        {
            mid=left+(right-left)/2;
            if(relation_types.at(mid).id==id)
            {   found=true;break;}
            else if(relation_types.at(mid).id>id)
            {   right=mid-1;}
            else if(relation_types.at(mid).id<id)
            {   left=mid+1;}
        }
        if(found)
        {   relation_types.erase(relation_types.begin()+mid);}
    }
}

void filehandler_class::edit_node_relation_type(node_relation_type &type_data,int node_or_relation)
{   
    string dir;
    if(node_or_relation==0)
    {   dir=node_type_file_dir;}
    else if(node_or_relation==1)
    {   dir=relation_type_file_dir;}

    stringstream in_file=decrypt_file(dir);
    string temp_data,line,word="";
    unsigned int line_count=0;
    while(in_file)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        if(line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
        {
            if(line_count>0)
            {
                for(int a=0;a<line.length();a++)
                {
                    if(line.at(a)!=',')
                    {   word.push_back(line.at(a));}
                    else
                    {   
                        if(stoi(word)!=type_data.id)
                        {
                            temp_data+=line;
                            temp_data+="\n";
                        }
                        else
                        {
                            temp_data+=to_string(type_data.id);
                            temp_data+=",";
                            temp_data+=type_data.type_name;
                            if(node_or_relation==1)
                            {
                                temp_data+=",";
                                temp_data+=type_data.color_code;
                                temp_data+=",";
                                if(type_data.vectored)
                                {   temp_data+=to_string(1);}
                                else
                                {   temp_data+=to_string(0);}
                            }
                            temp_data+=",\n";
                        }
                        word="";
                        break;
                    }
                }
            }
            else
            {
                temp_data+=line;
                temp_data+="\n";
            }
            line_count++;
        }
    }
    in_file.clear();
    encrypt_file(dir,temp_data);
    //Binary search is done here
    if(node_or_relation==0)
    {
        int left=0,right=node_types.size()-1,mid;
        bool found=false;
        while(left <= right)
        {   
            mid=left+(right-left)/2;
            if(node_types.at(mid).id==type_data.id)
            {   found=true;break;}
            else if(node_types.at(mid).id>type_data.id)
            {   right=mid-1;}
            else if(node_types.at(mid).id<type_data.id)
            {   left=mid+1;}
        }
        if(found)
        {   node_types.at(mid).type_name=type_data.type_name;}
    }
    else if(node_or_relation==1)
    {
        int left=0,right=relation_types.size()-1,mid;
        bool found=false;
        while(left <= right)
        {
            mid=left+(right-left)/2;
            if(relation_types.at(mid).id==type_data.id)
            {   found=true;break;}
            else if(relation_types.at(mid).id>type_data.id)
            {   right=mid-1;}
            else if(relation_types.at(mid).id<type_data.id)
            {   left=mid+1;}
        }
        if(found)
        {   
            relation_types.at(mid).color_code=type_data.color_code;
            relation_types.at(mid).type_name=type_data.type_name;
            relation_types.at(mid).vectored=type_data.vectored;
        }
    }
}

void filehandler_class::load_relations()
{
    load_node_relation_file_list(1);
    relation gap_relation;
    gap_relation.gap_relation=true;
    string dir,line,word;
    unsigned int comma_count=0,line_count=0,previous_id=0;
    bool is_prev_id_neg=true;
    for(int a=0;a<relation_file_list.size();a++)
    {
        dir=database_dir+relation_file_list.at(a).file_name;
        stringstream in_file=decrypt_file(dir);
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(strcasestr(line,"RELATION_ID"))
            {
                relation r1;
                line_count=0;
                unsigned int current_line=0;
                bool local_source_list_lock=false,source_url_list_lock=false;
                while(!strcasestr(line,"#END"))
                {   
                    comma_count=0;
                    if(strcasestr(line,"SOURCE_URL_LIST"))
                    {   current_line=line_count;source_url_list_lock=true;local_source_list_lock=false;}
                    else if(strcasestr(line,"LOCAL_SOURCE_LIST"))
                    {   current_line=line_count;source_url_list_lock=false;local_source_list_lock=true;}
                    if(!source_url_list_lock && !local_source_list_lock)
                    {   
                        for(int b=0;b<line.length();b++)
                        {
                            if(line.at(b)!=',')
                            {   word.push_back(line.at(b));}
                            else
                            {
                                if(comma_count==1 && line_count==0)//RELATION_ID
                                {   r1.relation_id=stoi(word);}
                                else if(comma_count==1 && line_count==1)//RELATION_TYPE_ID
                                {   r1.relation_type_id=stoi(word);}
                                else if(comma_count==1 && line_count==2)//SOURCE_NODE
                                {   r1.source_node_id=stoi(word);}
                                else if(comma_count==1 && line_count==3)//DESTINATION_NODE_ID
                                {   r1.destination_node_id=stoi(word);}
                                else if(comma_count==1 && line_count==4)//WEIGHT
                                {   r1.weight=stod(word);}
                                else if(comma_count>0 && line_count==5)//RELATION_ID_LIST
                                {   r1.relation_id_list.push_back(stoi(word));}
                                else if(comma_count>0 && line_count==6)//GROUPED_RELATION_ID_LIST
                                {   r1.grouped_relation_id_list.push_back(stoi(word));}
                                word="";
                                comma_count++;
                            }
                        }
                    }
                    if(current_line<line_count && source_url_list_lock)//source url list
                    {   r1.source_url_list.push_back(line);}
                    else if(current_line<line_count && local_source_list_lock)//source local
                    {   r1.source_local.push_back(line);}
                    getline(in_file,line);
                    line_count++;
                }
                if(r1.relation_id-previous_id>1)
                {
                    unsigned int b;
                    if(is_prev_id_neg)
                    {   b=previous_id;}
                    else
                    {   b=previous_id+1;}
                    for(b;b<r1.relation_id;b++)
                    {
                        gap_relation_id_map.insert(make_pair(b,gap_relation_id_map.size()));
                        gap_relation.relation_id=b;
                        relation_list.push_back(gap_relation);
                    }
                }
                if(r1.relation_id-previous_id==1 && previous_id==0 && is_prev_id_neg)
                {
                    gap_relation_id_map.insert(make_pair(0,gap_relation_id_map.size()));
                    gap_relation.relation_id=0;
                    relation_list.push_back(gap_relation);
                }
                relation_list.push_back(r1);
                previous_id=r1.relation_id;
                is_prev_id_neg=false;
                //graph creation
                data_node_list.at(r1.source_node_id).relations.push_back(r1.relation_id);
                data_node_list.at(r1.destination_node_id).relations.push_back(r1.relation_id);
            }
        }
        in_file.clear();
    }
}

unsigned int filehandler_class::write_relationdata_to_file(string file_name,relation &relation)
{
    bool file_found=check_if_file_is_present(file_name);
    file_name=database_dir+file_name;
    stringstream in_file=decrypt_file(file_name);
    string temp_data,line;
    unsigned int no_of_relation_in_this_file,relation_count=0;
    temp_data+="NO_OF_RELATIONS_IN_THIS_FILE:,";
    string word="";
    unsigned int comma_count=0,id;
    if(file_found)//for getting the no of_nodes_in_this_file.
    {
        getline(in_file,line);
        for(int a=0;a<line.length();a++)
        {
            if(line.at(a)!=',')
            {   word.push_back(line.at(a));}
            else
            {
                if(comma_count==1)
                {   no_of_relation_in_this_file=stoi(word);}
                word="";
                comma_count++;
            }
        }
        no_of_relation_in_this_file++;
        temp_data+=to_string(no_of_relation_in_this_file);
        temp_data+=",\n";
    }
    else
    {
        no_of_relation_in_this_file=1;
        temp_data+=to_string(1);
        temp_data+=",\n";
    }
    unsigned int insertion_point=0,block_size=4,end_counter=0;
    if(gap_relation_id_map.size()>0)//gap erasing will be donw later.
    {
        gap_relation_iterator=gap_relation_id_map.begin();
        insertion_point=gap_relation_iterator->first%no_of_relation_in_one_file;
    }
    else
    {   insertion_point=no_of_relation_in_this_file-1;}
    bool last_entry=false;
    while(in_file || !file_found)
    {   
        getline(in_file,line);
        if(in_file.eof() && no_of_relation_in_this_file!=1)
        {   break;}
        point1:
        if((strcasestr(line,"RELATION_ID") && !strcasestr(line,"GROUPED_RELATION_ID_LIST") && !strcasestr(line,"RELATION_ID_LIST")) || !file_found || last_entry || no_of_relation_in_this_file==1)
        {
            if(relation_count==insertion_point)
            {
                temp_data+="RELATION_ID:,";
                temp_data+=to_string(relation.relation_id);
                temp_data+=",\n";
                temp_data+="RELATION_TYPE_ID:,";
                temp_data+=to_string(relation.relation_type_id);
                temp_data+=",\n";
                temp_data+="SOURCE_NODE_ID:,";
                temp_data+=to_string(relation.source_node_id);
                temp_data+=",\n";
                temp_data+="DESTINATION_NODE_ID:,";
                temp_data+=to_string(relation.destination_node_id);
                temp_data+=",\n";
                temp_data+="WEIGHT:,";
                temp_data+=to_string(relation.weight);
                temp_data+=",\n";
                temp_data+="RELATION_ID_LIST:,";
                for(int a=0;a<relation.relation_id_list.size();a++)
                {
                    temp_data+=to_string(relation.relation_id_list.at(a));
                    temp_data+=",";
                }
                temp_data+="\n";
                temp_data+="GROUPED_RELATION_ID_LIST:,";
                for(int a=0;a<relation.grouped_relation_id_list.size();a++)
                {
                    temp_data+=to_string(relation.grouped_relation_id_list.at(a));
                    temp_data+=",";
                }
                temp_data+="\n";
                temp_data+="SOURCE_URL_LIST:,\n";
                for(int a=0;a<relation.source_url_list.size();a++)
                {
                    temp_data+=relation.source_url_list.at(a);
                    temp_data+="\n";
                }
                temp_data+="LOCAL_SOURCE_LIST:,\n";
                for(int a=0;a<relation.source_local.size();a++)
                {
                    temp_data+=relation.source_local.at(a);
                    temp_data+="\n";
                }
                temp_data+="#END\n";
            }
            relation_count++;
        }
        if(strcmp(line.c_str(),"")!=0 && !last_entry)
        {
            temp_data+=line;
            temp_data+="\n";
        }
        last_entry=false;
        if(strcasestr(line,"#END"))
        {
            end_counter++;
            if(end_counter==insertion_point)
            {   last_entry=true;goto point1;}
        }
        file_found=true;
    }
    in_file.clear();
    encrypt_file(file_name,temp_data);
    relation_list.push_back(relation);
    last_entered_relation=relation;
    //graph creation
    data_node_list.at(relation.source_node_id).relations.push_back(relation.relation_id);
    data_node_list.at(relation.destination_node_id).relations.push_back(relation.relation_id);
    return no_of_relation_in_this_file;
}

void filehandler_class::add_new_data_to_relation_file_list(file_info &new_file)
{
    relation_file_list.push_back(new_file);
    bool file_found=check_if_file_is_present("relation_file_list.csv");
    stringstream in_file=decrypt_file(relation_file_list_dir);
    unsigned int line_count=0;
    string temp_data,line;
    while(in_file && file_found)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        if(line.length()>0 && !is_whitespace(line) && line.at(0)!=NULL)
        {
            if(line_count==0)
            {
                temp_data+="NO_OF_RELATIONS:,";
                total_no_of_relations++;//this value will be read druing the relation loading process.
                temp_data+=to_string(total_no_of_relations);
                temp_data+=",\n";
            }
            else if(line_count==1)
            {
                temp_data+="NO_OF_RELATIONFILE:,";
                total_on_of_relationfile++;
                temp_data+=to_string(total_on_of_relationfile);
                temp_data+=",\n";
            }
            else 
            {
                temp_data+=line;
                temp_data+="\n";
            }
            line_count++;
        }
    }
    in_file.clear();
    if(!file_found)
    {
        temp_data+="NO_OF_RELATIONS:,";
        total_no_of_relations++;//this value will be read druing the relation loading process.
        temp_data+=to_string(total_no_of_relations);
        temp_data+=",\n";

        temp_data+="NO_OF_RELATIONFILE:,";
        total_on_of_relationfile++;
        temp_data+=to_string(total_on_of_relationfile);
        temp_data+=",\nFILE_ID,FILE_NAME,RELATION_START_ID,RELATION_END_ID,FILE_FULL,\n";
    }
    temp_data+=to_string(new_file.file_id);
    temp_data+=",";
    temp_data+=new_file.file_name;
    temp_data+=",";
    temp_data+=to_string(new_file.start_id);
    temp_data+=",";
    temp_data+=to_string(new_file.end_id);
    temp_data+=",";
    if(new_file.file_full)
    {   temp_data+=to_string(1);}
    else
    {   temp_data+=to_string(0);}
    temp_data+=",\n";
    encrypt_file(relation_file_list_dir,temp_data);
}

void filehandler_class::check_size_encrypt_copy_file(relation& relation_obj)//the problem of duplicate file is prevented in js body.
{
    string attached_file_dir=database_dir+"attached_files\\";
    if(!check_if_file_is_present("attached_files"))
    {   fs::create_directory(attached_file_dir);}
    attached_failed_files.clear();
    for(int a=relation_obj.source_local.size()-1;a>=0;a--)
    {
        if(!strcasestr(relation_obj.source_local.at(a),"attached_files/r"))
        {
            auto fsize = fs::file_size(relation_obj.source_local.at(a));
            if((float)(((float)fsize)/(1024.0*1024.0))>attached_file_size_in_MiB)
            {
                attached_failed_files.push_back(relation_obj.source_local.at(a));
                relation_obj.source_local.erase(relation_obj.source_local.begin()+a);
            }
            else
            {
                //orig file meta data
                string orig_file_name=get_name_from_path(relation_obj.source_local.at(a),false);
                string relation_folder_name="r"+to_string(relation_obj.relation_id);
                //encrypted file meta data
                string encrypted_file_name=encrypt_text(orig_file_name,password);
                string encrypted_relation_folder_name;//=encrypt_text(relation_folder_name,password);
                for(auto& p: fs::directory_iterator(attached_file_dir))
                {
                    string cur_folder=get_name_from_path(p.path().string(),true);
                    if(strcmp(relation_folder_name.c_str(),decrypt_text(cur_folder,password).decrypted_text.c_str())==0)
                    {   encrypted_relation_folder_name=cur_folder;break;}
                }
                if(encrypted_relation_folder_name.length()==0)
                {   encrypted_relation_folder_name=encrypt_text(relation_folder_name,password);}
                if(!check_if_file_is_present(attached_file_dir+encrypted_relation_folder_name))
                {   fs::create_directory(attached_file_dir+encrypted_relation_folder_name);}
                //encrypt and copy the file
                string data="";
                ifstream in_file(convert_to_windows_path(relation_obj.source_local.at(a)),ios::binary);
                stringstream in_file2;
                in_file2<<in_file.rdbuf();
                in_file.close();
                data=in_file2.str();
                in_file2.clear();
                encrypt_file(attached_file_dir+encrypted_relation_folder_name+"\\"+encrypted_file_name,data);
                relation_obj.source_local.at(a)="attached_files/"+relation_folder_name+"/"+orig_file_name;
            }
        }
        else
        {   cout<<"\ndup file!!";}
    }
}

void filehandler_class::save_file(unsigned int relation_id,string file_name,string destination_dir)
{
    string attached_file_dir=database_dir+"attached_files\\";
    string folder_name="r"+to_string(relation_id),encrypted_folder_name,encrypted_file_name;
    //getting encrypted folder name
    for(auto& p: fs::directory_iterator(attached_file_dir))
    {
        string cur_folder=get_name_from_path(p.path().string(),true);
        if(strcmp(folder_name.c_str(),decrypt_text(cur_folder,password).decrypted_text.c_str())==0)
        {   encrypted_folder_name=cur_folder;break;}
    }
    //getting encrypted file name
    for(auto& p: fs::directory_iterator(attached_file_dir+encrypted_folder_name))
    {
        string cur_file=get_name_from_path(p.path().string(),true);
        if(strcmp(file_name.c_str(),decrypt_text(cur_file,password).decrypted_text.c_str())==0)
        {   encrypted_file_name=cur_file;break;}
    }
    string encrypted_dir=attached_file_dir+encrypted_folder_name+"\\"+encrypted_file_name;
    stringstream in_file=decrypt_file(encrypted_dir);
    ofstream out_file(destination_dir,ios::binary);
    out_file<<in_file.rdbuf();
    out_file.close();
    in_file.clear();
}

void filehandler_class::add_new_relation(relation &relation)
{
    unsigned int no_of_relation_in_current_file=0,current_file_id;
    if(relation_file_list.size()==0)//ok tested. if no file available
    {   //cout<<"\n\ncheck1";
        total_no_of_relations=0;
        total_on_of_relationfile=0;
        file_info new_file;
        new_file.file_id=0;
        new_file.file_name="rf"+to_string(0);
        new_file.start_id=0;
        new_file.end_id=0;
        relation.relation_id=0;
        //check size encrypt and copy file
        check_size_encrypt_copy_file(relation);
        if(no_of_nodes_in_one_node_file==1)
        {   new_file.file_full=true;}
        else
        {   new_file.file_full=false;}
        add_new_data_to_relation_file_list(new_file);//total_no_of_relations++; this happens here.
        no_of_relation_in_current_file=write_relationdata_to_file(new_file.file_name,relation);
        current_file_id=0;
    }
    else if(gap_relation_id_map.size()>0)
    {   //cout<<"\n\ncheck2";
        gap_relation_iterator=gap_relation_id_map.begin();
        relation.relation_id=gap_relation_iterator->first;
        //check size encrypt and copy file
        check_size_encrypt_copy_file(relation);
        relation_list.at(gap_relation_iterator->first).relation_id=gap_relation_iterator->first;
        relation_list.at(gap_relation_iterator->first).gap_relation=false;
        relation_list.at(gap_relation_iterator->first).weight=relation.weight;
        relation_list.at(gap_relation_iterator->first).source_node_id=relation.source_node_id;
        relation_list.at(gap_relation_iterator->first).destination_node_id=relation.destination_node_id;
        relation_list.at(gap_relation_iterator->first).relation_type_id=relation.relation_type_id;

        relation_list.at(gap_relation_iterator->first).source_url_list.assign(relation.source_url_list.begin(),relation.source_url_list.end());
        relation_list.at(gap_relation_iterator->first).source_local.assign(relation.source_local.begin(),relation.source_local.end());
        relation_list.at(gap_relation_iterator->first).relation_id_list.assign(relation.relation_id_list.begin(),relation.relation_id_list.end());
        relation_list.at(gap_relation_iterator->first).grouped_relation_id_list.assign(relation.grouped_relation_id_list.begin(),relation.grouped_relation_id_list.end());

        string file_name=relation_file_list.at(gap_relation_iterator->first/no_of_relation_in_one_file).file_name;
        current_file_id=gap_relation_iterator->first/no_of_relation_in_one_file;
        no_of_relation_in_current_file=write_relationdata_to_file(file_name,relation);
        gap_relation_id_map.erase(gap_relation_iterator->first);
        total_no_of_relations++;
        change_settings(relation_file_list_dir,"NO_OF_RELATIONS",to_string(total_no_of_relations));
    }
    else if(gap_relation_id_map.size()==0 && relation_file_list.at(relation_file_list.size()-1).file_full)//ok tested. if file is full
    {   //cout<<"\n\ncheck3";
        file_info new_file;
        new_file.file_id=relation_file_list.at(relation_file_list.size()-1).file_id+1;
        new_file.file_name="rf"+to_string(new_file.file_id);
        relation.relation_id=relation_file_list.at(relation_file_list.size()-1).end_id+1;
        new_file.start_id=total_no_of_relations;
        new_file.end_id=total_no_of_relations;
        if(no_of_relation_in_one_file==1)
        {   new_file.file_full=true;}
        else
        {   new_file.file_full=false;}
        add_new_data_to_relation_file_list(new_file);
        //check size encrypt and copy file
        check_size_encrypt_copy_file(relation);
        no_of_relation_in_current_file=write_relationdata_to_file(new_file.file_name,relation);
        current_file_id=relation_file_list.size()-1;
    }
    else //ok tested. if file available and file not full
    {   //cout<<"\n\ncheck4";
        relation.relation_id=total_no_of_relations;
        unsigned int free_file_index;
        for(unsigned int a=0;a<relation_file_list.size();a++)//optimization may be done here in future
        {
            if(!relation_file_list.at(a).file_full)
            {   free_file_index=a;break;}
        }
        //check size encrypt and copy file
        check_size_encrypt_copy_file(relation);
        no_of_relation_in_current_file=write_relationdata_to_file(relation_file_list.at(free_file_index).file_name,relation);
        change_settings(relation_file_list_dir,"NO_OF_RELATIONS",to_string((free_file_index)*no_of_relation_in_one_file+no_of_relation_in_current_file));
        total_no_of_relations++;
        current_file_id=free_file_index;
    }
    if(no_of_relation_in_one_file==no_of_relation_in_current_file)
    {   set_file_full_status(current_file_id,true,1);}
}

void filehandler_class::delete_relation(unsigned int relation_id)
{
    if(relation_list.size()>relation_id)
    {
        string file_dir=database_dir+relation_file_list.at(relation_id/no_of_relation_in_one_file).file_name;
        stringstream in_file=decrypt_file(file_dir);
        string word,temp_data,line;
        unsigned int comma_count=0,current_id;
        unsigned int no_of_relation_in_this_file;
        getline(in_file,line);
        for(int a=0;a<line.size();a++)
        {
            if(line.at(a)!=',')
            {   word.push_back(line.at(a));}
            else
            {
                if(comma_count==1)
                {   no_of_relation_in_this_file=stoi(word);break;}
                word="";
                comma_count++;
            }
        }
        no_of_relation_in_this_file--;
        temp_data+="NO_OF_RELATIONS_IN_THIS_FILE:,";
        temp_data+=to_string(no_of_relation_in_this_file);
        temp_data+=",\n";
        //deletion_index=relation_id%no_of_relation_in_one_file;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            if(strcasestr(line,"RELATION_ID") && !strcasestr(line,"GROUPED_RELATION_ID_LIST") && !strcasestr(line,"RELATION_ID_LIST"))
            {   
                word="";
                comma_count=0;
                for(int a=0;a<line.length();a++)
                {
                    if(line.at(a)!=',')
                    {   word.push_back(line.at(a));}
                    else
                    {
                        if(comma_count==1)
                        {   current_id=stoi(word);break;}
                        comma_count++;
                        word="";
                    }
                }
            }
            if(relation_id==current_id)
            {
                while(!strcasestr(line,"#END"))
                {   getline(in_file,line);}
            }
            else
            {
                temp_data+=line;
                temp_data+="\n";
            }
        }
        in_file.clear();
        encrypt_file(file_dir,temp_data);
        //graph editing
        int position;
        for(int a=0;a<data_node_list.at(relation_list.at(relation_id).source_node_id).relations.size();a++)
        {
            if(data_node_list.at(relation_list.at(relation_id).source_node_id).relations.at(a)==relation_list.at(relation_id).relation_id)
            {   position=a;break;}
        }
        data_node_list.at(relation_list.at(relation_id).source_node_id).relations.erase(data_node_list.at(relation_list.at(relation_id).source_node_id).relations.begin()+position);

        for(int a=0;a<data_node_list.at(relation_list.at(relation_id).destination_node_id).relations.size();a++)
        {
            if(data_node_list.at(relation_list.at(relation_id).destination_node_id).relations.at(a)==relation_list.at(relation_id).relation_id)
            {   position=a;break;}
        }
        data_node_list.at(relation_list.at(relation_id).destination_node_id).relations.erase(data_node_list.at(relation_list.at(relation_id).destination_node_id).relations.begin()+position);

        //post processing
        relation_list.at(relation_id).gap_relation=true;
        total_no_of_relations--;
        gap_relation_id_map.insert(make_pair(relation_id,gap_relation_id_map.size()));
        //delete files
        relation r_temp=relation_list.at(relation_id);
        r_temp.source_local.clear();
        delete_attached_file_if_required(r_temp);
        //change all the settings from node_file_list.csv
        change_settings(relation_file_list_dir,"NO_OF_RELATIONS",to_string(total_no_of_relations));
        set_file_full_status(relation_id/no_of_relation_in_one_file,false,1);
    }
    else
    {
        cout<<"ERROR!: Insex not matching."<<relation_id;
    }
}

void filehandler_class::delete_attached_file_if_required(relation& relation)
{   
    string attached_file_dir=database_dir+"attached_files\\";
    for(int a=0;a<relation_list.at(relation.relation_id).source_local.size();a++)
    {   
        string old_file_name=get_name_from_path(relation_list.at(relation.relation_id).source_local.at(a),false);
        bool file_found=false;
        for(int b=0;b<relation.source_local.size();b++)
        {
            if(strcmp(old_file_name.c_str(),get_name_from_path(relation.source_local.at(b),false).c_str())==0)
            {   file_found=true;break;}
        }
        if(!file_found)//delete the file
        {
            //finding the relation folder name
            int count=0;
            string relation_folder_name="";
            for(int b=relation_list.at(relation.relation_id).source_local.at(a).size()-1;b>=0;b--)
            {
                if(relation_list.at(relation.relation_id).source_local.at(a).at(b)=='/')
                {
                    if(count!=1)
                    {   relation_folder_name="";}
                    count++;
                }
                else
                {   relation_folder_name=relation_list.at(relation.relation_id).source_local.at(a).at(b)+relation_folder_name;}
                if(count==2)
                {   break;}
            }
            //getting encrypted folder name
            string encrypted_folder_name;
            for(auto& p: fs::recursive_directory_iterator(attached_file_dir))
            {   
                string cur_folder=get_name_from_path(p.path().string(),true);
                if(strcmp(relation_folder_name.c_str(),decrypt_text(cur_folder,password).decrypted_text.c_str())==0)
                {   encrypted_folder_name=cur_folder;break;}
            }
            //getting encrypted file name
            string encrypted_file_name;
            for(auto& p: fs::directory_iterator(attached_file_dir+encrypted_folder_name))
            {   
                string cur_file=get_name_from_path(p.path().string(),true);
                if(strcmp(old_file_name.c_str(),decrypt_text(cur_file,password).decrypted_text.c_str())==0)
                {   encrypted_file_name=cur_file;break;}
            }
            fs::remove(attached_file_dir+encrypted_folder_name+"\\"+encrypted_file_name);
        }
    }
}

void filehandler_class::edit_relation(relation& relation_obj)
{
    //file delete
    delete_attached_file_if_required(relation_obj);
    check_size_encrypt_copy_file(relation_obj);
    //check size encrypt and copy file
    //graph editing
    int position;
    for(int a=0;a<data_node_list.at(relation_list.at(relation_obj.relation_id).source_node_id).relations.size();a++)
    {
        if(data_node_list.at(relation_list.at(relation_obj.relation_id).source_node_id).relations.at(a)==relation_list.at(relation_obj.relation_id).relation_id)
        {   position=a;break;}
    }
    data_node_list.at(relation_list.at(relation_obj.relation_id).source_node_id).relations.erase(data_node_list.at(relation_list.at(relation_obj.relation_id).source_node_id).relations.begin()+position);

    for(int a=0;a<data_node_list.at(relation_list.at(relation_obj.relation_id).destination_node_id).relations.size();a++)
    {
        if(data_node_list.at(relation_list.at(relation_obj.relation_id).destination_node_id).relations.at(a)==relation_list.at(relation_obj.relation_id).relation_id)
        {   position=a;break;}
    }
    data_node_list.at(relation_list.at(relation_obj.relation_id).destination_node_id).relations.erase(data_node_list.at(relation_list.at(relation_obj.relation_id).destination_node_id).relations.begin()+position);
    
    data_node_list.at(relation_obj.source_node_id).relations.push_back(relation_obj.relation_id);
    data_node_list.at(relation_obj.destination_node_id).relations.push_back(relation_obj.relation_id);
    //change the relation data
    relation_list.at(relation_obj.relation_id).destination_node_id=relation_obj.destination_node_id;
    relation_list.at(relation_obj.relation_id).source_node_id=relation_obj.source_node_id;
    relation_list.at(relation_obj.relation_id).gap_relation=relation_obj.gap_relation;
    relation_list.at(relation_obj.relation_id).grouped_relation_id_list=relation_obj.grouped_relation_id_list;
    relation_list.at(relation_obj.relation_id).relation_id_list=relation_obj.relation_id_list;
    relation_list.at(relation_obj.relation_id).relation_type_id=relation_obj.relation_type_id;
    relation_list.at(relation_obj.relation_id).source_local=relation_obj.source_local;
    relation_list.at(relation_obj.relation_id).source_url_list=relation_obj.source_url_list;
    relation_list.at(relation_obj.relation_id).weight=relation_obj.weight;
    //write the changes to the file
    string file_dir=database_dir+relation_file_list.at(relation_obj.relation_id/no_of_relation_in_one_file).file_name;
    stringstream infile=decrypt_file(file_dir);
    string word,line,temp_data;
    int comma_count=0,current_rid;
    while(infile)
    {
        getline(infile,line);
        if(infile.eof())
        {   break;}
        if(strcasestr(line,"RELATION_ID"))
        {
            word="";
            comma_count=0;
            current_rid=-1;
            for(int a=0;a<line.size();a++)
            {
                if(line.at(a)!=',')
                {   word.push_back(line.at(a));}
                else
                {
                    if(comma_count==1)
                    {   current_rid=stoi(word);break;}
                    comma_count++;
                    word="";
                }
            }
            if(current_rid==relation_obj.relation_id)
            {
                temp_data+=line;
                temp_data+="\n";
                line="RELATION_TYPE_ID:,"+to_string(relation_obj.relation_type_id)+",\n";
                temp_data+=line;
                line="SOURCE_NODE_ID:,"+to_string(relation_obj.source_node_id)+",\n";
                temp_data+=line;
                line="DESTINATION_NODE_ID:,"+to_string(relation_obj.destination_node_id)+",\n";
                temp_data+=line;
                line="WEIGHT:,"+to_string(relation_obj.weight)+",\n";
                temp_data+=line;
                line="RELATION_ID_LIST:,\n";
                for(int a=0;a<relation_obj.relation_id_list.size();a++)
                {   line+=(to_string(relation_obj.relation_id_list.at(a))+",");}
                temp_data+=line;
                line="GROUPED_RELATION_ID_LIST:,\n";
                for(int a=0;a<relation_obj.grouped_relation_id_list.size();a++)
                {   line+=(to_string(relation_obj.grouped_relation_id_list.at(a))+",");}
                temp_data+=line;
                line="SOURCE_URL_LIST:,\n";
                temp_data+=line;
                for(int a=0;a<relation_obj.source_url_list.size();a++)
                {
                    temp_data+=relation_obj.source_url_list.at(a);
                    temp_data+="\n";
                }
                line="LOCAL_SOURCE_LIST,\n";
                temp_data+=line;
                for(int a=0;a<relation_obj.source_local.size();a++)
                {
                    temp_data+=relation_obj.source_local.at(a);
                    temp_data+="\n";
                }
                temp_data+="#END\n";
                while(infile)
                {
                    getline(infile,line);
                    if(infile.eof())
                    {   break;}
                    if(strcasestr(line,"#END"))
                    {   break;}
                }
            }
            else
            {   
                temp_data+=line;
                temp_data+="\n";
            }
        }
        else
        {
            temp_data+=line;
            temp_data+="\n";
        }
    }
    infile.clear();
    encrypt_file(file_dir,temp_data);
}