import {Grid} from '@material-ui/core';
import {Network} from 'vis-network/standalone';
import {DataSet} from "vis-data/peer/esm/vis-data";

export function add_network_func(CLASS)
{
    CLASS.prototype.init_network = init_network;
    CLASS.prototype.create_full_network = create_full_network;
    CLASS.prototype.get_relation_type = get_relation_type;
    CLASS.prototype.add_node_to_network = add_node_to_network;
    CLASS.prototype.delete_node_from_network = delete_node_from_network;
    CLASS.prototype.add_relation_to_network = add_relation_to_network;
    CLASS.prototype.delete_relation_from_network = delete_relation_from_network;
    CLASS.prototype.center_focus = center_focus;
}
//----------------------network structure functions------------------------------------
var nodes = new DataSet();
var edges = new DataSet();
var data = {
    nodes: nodes,
    edges: edges
};

var options = {autoResize: true,height:'100%',width:'100%', 
    edges:
    {
        arrows: 
        {
            to: 
            {
                enabled: true,
                scaleFactor: 0.5,
                type: "arrow"
            },
        },/*
        physics: {
            "enabled": true
        }*/
        //chosen:true,
    },
    interaction: {
        hover: true
    },
    nodes:{
        borderWidth: 4,
        borderWidthSelected: 3,
        chosen:true,
        chosen:
        {
            node:function(values, id, selected, hovering)
            {
                values.shadow=true;
                values.borderColor='#00FFE8';
                if(selected)
                {
                    values.borderColor='orange';
                    values.shadowColor='orange';
                }
            }
        },
        color: 
        {
            border: '#087167',
            background: '#00CBB7',
        },
        shadow:
        {
            enabled: false,
            color: '#00FFE8',
            size:100,
            x:0,
            y:0
        },
    }
};

function add_relation_to_network(relation)
{
    try
    {
        //const div = document.createElement("div");
        //div.className="tooltip";
        //div.parentNode.className="tooltip";
        var relation_type=this.get_relation_type(relation.relation_type_id);
        //div.innerText=relation_type.relation_type;
        var edge={
            id:relation.relation_id,
            from:relation.source_node_id,
            to:relation.destination_node_id,
            width:1,
            color:relation_type.color_code,
            title:relation_type.relation_type
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
            shape:'circle',
        };
        nodes.add(node);
    }
    catch(e)
    {}
}

function delete_node_from_network(node_id)
{   nodes.remove(node_id);}

function get_relation_type(relation_type_id)
{
    var a=0;
    var relation;
    for(a=0;a<this.state.relation_type_data_list.length;a++)
    {
        if(this.state.relation_type_data_list[a].id==relation_type_id)
        {   relation=this.state.relation_type_data_list[a];break;}
    } 
    return relation;
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
    this.create_full_network();
    this.network = new Network(this.state.net_ref.current,data,options);
    var height = Math.round(window.innerHeight * 0.00) + 'px';
    this.state.net_ref.current.style.height = height;
    this.center_focus();   
}
//------------------------------Network Focus Functions-------------------------------
function center_focus()
{
    var fit_options={
        nodes:nodes.getIds(),
        minZoomLevel: 1.5,
        maxZoomLevel: 1.5,
        animation: {             
            duration: 250,                 
            easingFunction: "easeInOutQuad"
        } 
    }
    this.network.fit(fit_options);
    
    //this.network.focus(3,{scale: '5%', offset:{x: -(6/3)}});
    //var scaleOption = { scale : 0.5 };
    //this.network.moveTo(scaleOption);
    /*this.network.once('stabilized', function() {
        var scaleOption = { scale : 0.5 };
        //this.network.moveTo(scaleOption);
        this.network.fit(fit_options);
    })*/
}

export function add_network(THIS)
{
    return(
        <Grid container direction="row" xs={12} alignItems="center" justify="center">
            <div id="net" ref={THIS.state.net_ref} className="net"></div>  
        </Grid> 
    );
}