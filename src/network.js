import {Grid} from '@material-ui/core';
import {Network} from "vis-network/peer/esm/vis-network";
import {DataSet} from "vis-data/peer/esm/vis-data";

export function add_network_func(CLASS)
{
    CLASS.prototype.init_network = init_network;
    CLASS.prototype.create_full_network = create_full_network;
    CLASS.prototype.get_relation_color_code = get_relation_color_code;
    CLASS.prototype.add_node_to_network = add_node_to_network;
    CLASS.prototype.delete_node_from_network = delete_node_from_network;
    CLASS.prototype.add_relation_to_network = add_relation_to_network;
    CLASS.prototype.delete_relation_from_network = delete_relation_from_network;
}

var nodes = new DataSet();

// create an array with edges
var edges = new DataSet();

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {autoResize: true,height:'100%',width:'100%', edges:{
    arrows: 
    {
        to: 
        {
            enabled: true,
            imageHeight: undefined,
            imageWidth: undefined,
            scaleFactor: 0.5,
            src: undefined,
            type: "arrow"
        },
    },
}};

function add_relation_to_network(relation)
{
    try
    {
        var edge={
            id:relation.relation_id,
            from:relation.source_node_id,
            to:relation.destination_node_id,
            width:2,
            color:this.get_relation_color_code(relation.relation_type_id),
        };
        edges.add(edge);
    }
    catch(e)
    {}
}

function delete_relation_from_network(relation_id)
{

}

function add_node_to_network(node)
{   try{
        var node={
            id:node.node_id,
            label:node.node_name,
            shape:'circle'
        };
        nodes.add(node);
    }
    catch(e)
    {}
}

function delete_node_from_network(node_id)
{   nodes.remove(node_id);}

function get_relation_color_code(relation_type_id)
{
    var a=0;
    var color_code="";
    for(a=0;a<this.state.relation_type_data_list.length;a++)
    {
        if(this.state.relation_type_data_list[a].id==relation_type_id)
        {   color_code=this.state.relation_type_data_list[a].color_code;break;}
    } 
    return color_code;
}

function create_full_network()
{
    var a=0;
    for(a=0;a<this.state.node_data_list.length;a++)
    {   this.add_node_to_network(this.state.node_data_list[a]);}
    for(a=0;a<this.state.relation_data_list.length;a++)
    {   this.add_relation_to_network(this.state.relation_data_list[a]);}
}

function init_network()
{
    this.network = new Network(this.state.net_ref.current,data,options);
    var height = Math.round(window.innerHeight * 0.00) + 'px';
    this.state.net_ref.current.style.height = height;   
    this.create_full_network();
}

export function add_network(THIS)
{
    return(
        <Grid container direction="row" xs={12} alignItems="center" justify="center">
            <div id="net" ref={THIS.state.net_ref} className="net"></div>  
        </Grid> 
    );
}