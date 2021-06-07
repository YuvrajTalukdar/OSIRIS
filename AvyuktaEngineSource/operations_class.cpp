#include "operations_class.h"

void operation_class::change_settings(database_class &db,int nodes_in_one_file,int relations_in_one_file,float percent_of_data_in_ram,bool encryption)
{
    if(nodes_in_one_file!=db.file_handler.no_of_nodes_in_one_node_file)
    {
        db.file_handler.no_of_nodes_in_one_node_file=nodes_in_one_file;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"NODES_IN_ONE_NODEFILE",to_string(nodes_in_one_file));
    }
    if(relations_in_one_file!=db.file_handler.no_of_relation_in_one_file)
    {
        db.file_handler.no_of_relation_in_one_file=relations_in_one_file;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"RELATION_IN_ONE_RELATIONFILE",to_string(relations_in_one_file));
    }
    if(percent_of_data_in_ram!=db.file_handler.percent_of_node_in_memory)
    {
        db.file_handler.percent_of_node_in_memory=percent_of_data_in_ram;
        db.file_handler.change_settings(db.file_handler.settings_file_dir,"PERCENT_OF_NODE_IN_MEMORY",to_string(percent_of_data_in_ram));
    }
    if(encryption!=db.file_handler.encryption)
    {
        db.file_handler.encryption=encryption;
        if(encryption)
        {   db.file_handler.change_settings(db.file_handler.settings_file_dir,"ENCRYPTION","true");}
        else
        {   db.file_handler.change_settings(db.file_handler.settings_file_dir,"ENCRYPTION","false");}
    }
}

void operation_class::change_node(database_class &db,data_node &new_node)
{
    db.file_handler.delete_node(new_node.node_id);
    db.file_handler.add_new_node(new_node);
}

void operation_class::change_relation(database_class &db,relation &new_relation)
{
    db.file_handler.delete_relation(new_relation.relation_id);
    db.file_handler.add_new_relation(new_relation);
}

void operation_class::add_new_node(database_class &db,string node_name,unsigned int node_type_id)
{
    data_node new_node;
    
    new_node.node_name=node_name;
    new_node.node_type_id=node_type_id;

    db.file_handler.add_new_node(new_node);
}

void operation_class::delete_node(database_class &db,unsigned int node_id)
{
    db.file_handler.delete_node(node_id);
}

void operation_class::add_relation(database_class &db,relation &relation_obj)
{
    db.file_handler.add_new_relation(relation_obj);
}

void operation_class::delete_relation(database_class &db,unsigned int relation_id)
{
    db.file_handler.delete_relation(relation_id);
}

void operation_class::edit_node(database_class &db,unsigned int node_id,unsigned int node_type_id,string node_name)
{
    data_node node;
    node.node_id=node_id;
    node.node_type_id=node_type_id;
    node.node_name=node_name;
    db.file_handler.edit_node(node);
}

void operation_class::edit_relation(database_class &db,relation &relation_obj)
{
    db.file_handler.edit_relation(relation_obj);
}

void operation_class::edit_node_relation_type(database_class &db,int node_or_relation,unsigned int id,string type,string color_code,bool vectored)
{
    node_relation_type obj1;
    obj1.id=id;
    obj1.type_name=type;
    obj1.color_code=color_code;
    obj1.vectored=vectored;
    db.file_handler.edit_node_relation_type(obj1,node_or_relation);
}

tree operation_class::dijkstra(database_class &db,unsigned int source_node_id,unsigned int destination_node_id)
{
    tree new_tree;
    vector<unsigned int> done_ids,parent_node_ids,relation_ids;
    multimap<int,node_dijkstra> piority_queue;
    multimap<int,node_dijkstra>::iterator it,it2;
    node_dijkstra node1;
    node1.node_id=source_node_id;
    node1.parent_node_id=-1;
    node1.relation_id=-1;
    piority_queue.insert(make_pair(0,node1));
    unsigned int node_id_to_look_for,done_position=0,current_node_id;
    it=piority_queue.begin();
    //check all the neighbouring nodes    
    point1:
    current_node_id=it->second.node_id;
    for(int b=0;b<db.file_handler.data_node_list.at(it->second.node_id).relations.size();b++)
    {
        if(db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).source_node_id==current_node_id)
        {   node_id_to_look_for=db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).destination_node_id;}
        else
        {   node_id_to_look_for=db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).source_node_id;}
        //check if already present before entering
        it2=piority_queue.begin();
        bool match_found=false;
        for(;it2!=piority_queue.end();it2++)
        {   
            if(it2->second.node_id==node_id_to_look_for)
            {   
                if(it2->first>it->first+db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).weight)
                {   
                    piority_queue.erase(it2);
                    node_dijkstra node2;
                    node2.node_id=node_id_to_look_for;
                    node2.parent_node_id=it->second.node_id;
                    node2.relation_id=db.file_handler.data_node_list.at(it->second.node_id).relations.at(b);
                    piority_queue.insert(make_pair(it->first+db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).weight,node2));
                }
                match_found=true;
                break;
            }
        }
        for(int b=done_ids.size()-1;b>=0;b--)
        {
            if(done_ids.at(b)==node_id_to_look_for)
            {   match_found=true;break;}
        }
        if(!match_found)
        {   
            node_dijkstra node3;
            node3.node_id=node_id_to_look_for;
            node3.parent_node_id=it->second.node_id;
            node3.relation_id=db.file_handler.data_node_list.at(it->second.node_id).relations.at(b);
            piority_queue.insert(make_pair(it->first+db.file_handler.relation_list.at(db.file_handler.data_node_list.at(it->second.node_id).relations.at(b)).weight,node3));
        }
    }
    done_ids.push_back(it->second.node_id);
    parent_node_ids.push_back(it->second.parent_node_id);
    relation_ids.push_back(it->second.relation_id);
    typedef multimap<int,node_dijkstra>::iterator it3;
    std::pair<it3, it3> iterpair = piority_queue.equal_range(it->first);
    it3 it4 = iterpair.first;
    for (; it4 != iterpair.second; ++it4) 
    {
        if (it4->second.node_id == it->second.node_id) { 
            piority_queue.erase(it4);
            break;
        }
    }
    if(piority_queue.size()!=0)
    {
        it=piority_queue.begin();
        if(it->second.node_id!=destination_node_id)
        {   goto point1;}
        else
        {
            done_ids.push_back(it->second.node_id);
            parent_node_ids.push_back(it->second.parent_node_id);
            relation_ids.push_back(it->second.relation_id);
            //backtracking
            new_tree.node_ids.push_back(it->second.node_id);
            for(int a=parent_node_ids.size()-1;a>=0;a--)
            {
                new_tree.node_ids.push_back(parent_node_ids.at(a));
                new_tree.relation_ids.push_back(relation_ids.at(a));
                for(int b=a;b>=0;b--)
                {
                    if(done_ids.at(b)==parent_node_ids.at(a))
                    {   a=b+1;break;}
                }
            }
            new_tree.node_ids.pop_back();
            new_tree.relation_ids.pop_back();
        }
    }
    /*
    for(int a=0;a<new_tree.node_ids.size();a++)
    {
        cout<<"\nn_id="<<new_tree.node_ids.at(a);
        if(a<new_tree.node_ids.size()-1)
        {   cout<<" r_id="<<new_tree.relation_ids.at(a);}
    }
    cout<<"\n\nn_id size="<<new_tree.node_ids.size()<<" r_id_size="<<new_tree.relation_ids.size();
    */
    return new_tree;
}

mst operation_class::find_minimum_spanning_tree(database_class &db,vector<unsigned int>& node_ids)
{
    mst new_mst;
    vector<tree> shortest_path_vec;
    //finding shortest paths based on sparse matrix
    for(int a=0;a<node_ids.size();a++)
    {
        for(int b=0;b<a;b++)
        {   
            tree new_tree=dijkstra(db,node_ids.at(a),node_ids.at(b));
            shortest_path_vec.push_back(new_tree);
        }
    }
    //union operator for path
    for(int a=0;a<shortest_path_vec.size();a++)
    {   
        for(int b=0;b<shortest_path_vec.at(a).node_ids.size();b++)
        {   new_mst.node_ids.insert(shortest_path_vec.at(a).node_ids.at(b));}
        for(int b=0;b<shortest_path_vec.at(a).relation_ids.size();b++)
        {   new_mst.relation_ids.insert(shortest_path_vec.at(a).relation_ids.at(b));}
    }
    shortest_path_vec.clear();
    return new_mst;
}