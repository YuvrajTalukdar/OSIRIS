#include "filehandler_class.h"

void filehandler_class::calc_node_list_size(float percent)
{   no_of_nodes_in_memory=total_no_of_nodes*percent/100;}

unsigned int filehandler_class::load_db_settings()
{
    struct dirent *de;
    DIR *dr=opendir(database_dir.c_str());
    if(dr==NULL)
    {   return 1;}
    else
    {
        bool settings_file_found=false;
        while((de=readdir(dr))!=NULL)
        {
            if(strcmp("settings.csv",de->d_name)==0)
            {
                settings_file_found=true;

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
                                    for(int b=0;b<4;b++)
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
                                }
                                word="";
                                count++;
                            }
                        }
                    }
                }
                settings_file.close();
                break;
            }
        }
        if(settings_file_found)
        {   return 0;}
        else
        {   return 2;}
    }
}

void filehandler_class::change_settings(string file_dir,string settings_name,string settings_value)
{
    ifstream settings_file(file_dir,ios::in);
    string line,temp_data;
    while(settings_file)
    {
        getline(settings_file,line);
        if(settings_file.eof())
        {   break;}
        if(strcasestr(line.c_str(),settings_name.c_str()))
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

void filehandler_class::load_file_list()
{
    ifstream list_file(file_list_dir,ios::in);
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
                        {   total_no_of_nodes=stoi(word);}
                        else if(line_count==1)
                        {   total_no_of_nodefile=stoi(word);}
                    }
                    word="";
                }
            }
        }
        else if(line_count>2)//for the file data
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
            file_list.push_back(obj1);
        }
        line_count++;
    }
    list_file.close();
}

void filehandler_class::add_new_data_to_filelist(file_info &new_data)
{
    file_list.push_back(new_data);
    fstream list_file_in(file_list_dir,ios::in);
    unsigned int line_count=0;
    string temp_data,line;
    while(list_file_in)
    {   
        getline(list_file_in,line);
        if(list_file_in.eof())
        {   break;}
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
    list_file_in.close();
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
    ofstream list_file_out(file_list_dir,ios::out);
    list_file_out<<temp_data;
    list_file_out.close();
}

void filehandler_class::load_nodes()
{
    string node_file_dir,line,word;
    unsigned int line_count,comma_count;
    for(int a=0;a<file_list.size();a++)
    {
        node_file_dir=database_dir+file_list.at(a).file_name;
        ifstream in_file(node_file_dir,ios::in);
        line_count=0;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
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
                        else
                        {   node.relation_id_list.push_back(stoi(word));};
                        word="";
                        comma_count++;
                    }
                }
                data_node_list.push_back(node);
            }
            line_count++;
        }
        in_file.close();
    }
}

unsigned int filehandler_class::write_nodedata_to_file(string file_name,data_node &node)
{
    struct dirent *de;
    DIR *dr=opendir(database_dir.c_str());
    bool file_found=false;
    while((de=readdir(dr))!=NULL)
    {
        if(strcmp(file_name.c_str(),de->d_name)==0)
        {   file_found=true;break;}
    }
    file_name=database_dir+file_name;
    ifstream in_file(file_name,ios::in);
    string temp_data,line;
    unsigned int no_of_nodes_in_this_file;
    temp_data+="NO_OF_NODES_IN_THIS_FILE:,";
    string word="";
    unsigned int comma_count=0;
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
    }
    else
    {   
        temp_data+=to_string(0);
        temp_data+=",\n";
        string heading_line;
        heading_line="NODE_ID,NODE_NAME,NODE_TYPE_ID,RELATION_LIST:-,\n";
        temp_data+=heading_line;
    }
    string last_line;
    while(in_file)
    {
        getline(in_file,line);
        if(in_file.eof())
        {   break;}
        temp_data+=line;
        last_line=line;
        temp_data+="\n";
    }
    in_file.close();
    word="";
    comma_count=0;
    unsigned int last_node_id=0;
    for(int a=0;a<last_line.length();a++)
    {
        if(last_line.at(a)!=',')
        {   word.push_back(last_line.at(a));}
        else
        {
            comma_count++;
            if(comma_count==1)
            {
                last_node_id=stoi(word);
                word="";
                break;
            }
        }
    }
    if(!file_found)
    {   node.node_id=last_node_id;}
    else
    {   node.node_id=last_node_id+1;}
    line="";
    line+=to_string(node.node_id);
    line+=",";
    line+=node.node_name;
    line+=",";
    line+=to_string(node.node_type_id);
    line+=",";
    for(int a=0;a<node.relation_id_list.size();a++)
    {
        line+=to_string(node.relation_id_list.at(a));
        line+=",";
    }
    line+="\n";
    temp_data+=line;

    ofstream out_file(file_name,ios::out);
    out_file<<temp_data;
    out_file.close();
    data_node_list.push_back(node);

    return no_of_nodes_in_this_file;
}

void filehandler_class::add_new_node(data_node &node)
{
    //get the node file name
    // if file not available or if file full create new file
    unsigned int no_of_nodes_in_current_file=0;
    if(file_list.size()==0)//if no file available
    {   
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
        add_new_data_to_filelist(new_file);
        no_of_nodes_in_current_file=write_nodedata_to_file(new_file.file_name,node);
        string new_file_dir=database_dir+new_file.file_name;
        change_settings(new_file_dir,"NO_OF_NODES_IN_THIS_FILE","1");
    }
    else if(file_list.at(file_list.size()-1).file_full)//if file is full
    {   
        file_info new_file;
        new_file.file_id=file_list.at(file_list.size()-1).file_id+1;
        new_file.file_name="nf"+to_string(new_file.file_id);
        node.node_id=file_list.at(file_list.size()-1).end_id+1;
        new_file.start_id=node.node_id;
        new_file.end_id=node.node_id;
        if(no_of_nodes_in_one_node_file==1)
        {   new_file.file_full=true;}
        else
        {   new_file.file_full=false;}
        add_new_data_to_filelist(new_file);
        no_of_nodes_in_current_file=write_nodedata_to_file(new_file.file_name,node);
        string new_file_dir=database_dir+new_file.file_name;
        change_settings(new_file_dir,"NO_OF_NODES_IN_THIS_FILE","1");
    }
    else//if file available and file not full. 
    {
        no_of_nodes_in_current_file=write_nodedata_to_file(file_list.at(file_list.size()-1).file_name,node);
        string new_file_dir=database_dir+file_list.at(file_list.size()-1).file_name;
        change_settings(new_file_dir,"NO_OF_NODES_IN_THIS_FILE",to_string(no_of_nodes_in_current_file));
        change_settings(file_list_dir,"NO_OF_NODES",to_string((total_no_of_nodefile-1)*no_of_nodes_in_one_node_file+no_of_nodes_in_current_file));
        total_no_of_nodes++;
    }
    if(no_of_nodes_in_current_file==no_of_nodes_in_one_node_file)//for turning the file full value to true in node_file_list.csv. 
    {
        file_list.at(file_list.size()-1).file_full=true;
        ifstream in_file(file_list_dir,ios::in);
        string temp_data="",line,last_line;
        vector<string> line_list;
        while(in_file)
        {
            getline(in_file,line);
            if(in_file.eof())
            {   break;}
            last_line=line;
            line_list.push_back(line);
        }        
        in_file.close();
        ofstream out_file(file_list_dir,ios::out);
        for(int a=0;a<line_list.size()-1;a++)
        {
            temp_data+=line_list.at(a);
            temp_data+="\n";
        }
        line_list.clear();
        temp_data+=to_string(file_list.at(file_list.size()-1).file_id);
        temp_data+=",";
        temp_data+=file_list.at(file_list.size()-1).file_name;
        temp_data+=",";
        temp_data+=to_string(file_list.at(file_list.size()-1).start_id);
        temp_data+=",";
        temp_data+=to_string(file_list.at(file_list.size()-1).end_id);
        temp_data+=",";
        temp_data+="1,\n";
        out_file<<temp_data;
        out_file.close();
    }
}