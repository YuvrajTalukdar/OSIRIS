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
                    if(strcmp(line.c_str(),"NODE_FILE_LIST:")==0)
                    {   break;}
                    else
                    {
                        int count=0;
                        string word="";
                        short int option=-1;
                        for(int a=0;a<line.length();a++)
                        {
                            if(line.at(a)!=',')
                            {
                                word.push_back(line.at(a));
                            }
                            else
                            {
                                if(count==0)
                                {
                                    if(strcmp(word.c_str(),"ENCRYPTION:")==0)
                                    {   option=1;}
                                    else if(strcmp(word.c_str(),"NO_OF_NODES:")==0)
                                    {   option=2;}
                                    else if(strcmp(word.c_str(),"PERCENT_OF_NODE_IN_MEMORY:")==0)
                                    {   option=3;}
                                    else if(strcmp(word.c_str(),"AUTHORS:")==0)
                                    {   option=4;}
                                }
                                else
                                {
                                    if(option==1)
                                    {   
                                        if(strcmp(word.c_str(),"true")==0)
                                        {   encryption=true;}
                                        else
                                        {   encryption=false;}
                                    }
                                    else if(option==2)
                                    {   total_no_of_nodes=stoi(word);cout<<"word1="<<word;}
                                    else if(option==3)
                                    {   calc_node_list_size(stof(word));cout<<"word2="<<word;}
                                    else if(option==4)
                                    {   authors.push_back(word);}
                                }
                                word="";
                                count++;
                            }
                        }
                    }
                }
                while(settings_file)//NODE_FILE_LIST:
                {
                    getline(settings_file,line);
                    if(settings_file.eof() || strcmp(line.c_str(),"RELATION_FILE_LIST:")==0)
                    {   break;}
                    node_file_list.push_back(line);
                }
                while(settings_file)
                {
                    getline(settings_file,line);
                    if(settings_file.eof() || strcmp(line.c_str(),"#END")==0)
                    {   break;}
                    relation_file_list.push_back(line);
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

void filehandler_class::change_settings(string settings_name,string settings_value)
{
    ifstream settings_file(settings_file_dir,ios::in);
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
    ofstream new_settings_file(settings_file_dir,ios::out);
    new_settings_file<<temp_data;
    new_settings_file.close();
}

void filehandler_class::add_new_node(data_node &node)
{

}