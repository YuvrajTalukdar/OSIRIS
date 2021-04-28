import {Grid,Popover,Typography,List,ListItem} from '@material-ui/core';
import {Network} from 'vis-network/standalone';
import {DataSet} from "vis-data/peer/esm/vis-data";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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
    CLASS.prototype.get_node_type = get_node_type;
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
                if(selected)
                {
                    values.borderColor='orange';
                    values.shadowColor='orange';
                }
                else
                {
                    values.shadow=true;
                    values.borderColor='#00FFE8';
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
        var relation_type=this.get_relation_type(relation.relation_type_id);
        const div = document.createElement("div");
        div.className="tooltip";
        div.innerText=relation_type.relation_type;
        var edge={
            id:relation.relation_id,
            from:relation.source_node_id,
            to:relation.destination_node_id,
            width:1,
            color:relation_type.color_code,
            title:div
        };
        edges.add(edge);
    }
    catch(e)
    {}
}

function delete_relation_from_network(relation_id)
{   edges.remove(relation_id);}

function get_node_type(node_type_id)
{
    var a=0;
    var node_type;
    for(a=0;a<this.state.node_type_data_list.length;a++)
    {
        if(this.state.node_type_data_list[a].id==node_type_id)
        {   node_type=this.state.node_type_data_list[a];break;}
    }
    return node_type;
}

function add_node_to_network(node)
{   try{
        var node_type=this.get_node_type(node.node_type_id);
        const div = document.createElement("div");
        div.className="tooltip";
        div.innerText=node_type.node_type;
        var node={
            id:node.node_id,
            label:node.node_name,
            shape:'circle',
            title:div,
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
    this.network.on('oncontext',(values)=>{
        var node=this.network.getNodeAt(values.pointer.DOM);
        if(node!=undefined)
        {
            this.context_node_id=node;
            this.context_node_name=nodes.get(node).label;
            this.setState({
                open_network_popup:true,
                network_popup_top:values.pointer.DOM.y,
                network_popup_bottom:values.pointer.DOM.x,
            });
        }
        var edge=this.network.getEdgeAt(values.pointer.DOM);
        if(edge!=undefined && node==undefined)
        {
            this.context_edge_id=edge;
            this.source_node_name=nodes.get(edges.get(edge).from).label;
            this.destination_node_name=nodes.get(edges.get(edge).to).label;
            this.setState({
                open_network_popup:true,
                network_popup_top:values.pointer.DOM.y,
                network_popup_bottom:values.pointer.DOM.x,
            }); 
        }
    }); 
    //context menu handling
    var context_menu_list=[];
    var menuItem1={
        'id':0,
        'text':'Edit',
        'icon':EditIcon
    }  
    var menuItem2={
        'id':1,
        'text':'Delete',
        'icon':DeleteIcon
    }  
    context_menu_list.push(menuItem1);
    context_menu_list.push(menuItem2);
    this.setState({context_menu_list});
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

export function Add_Network(THIS)
{
    return(
        <div>
            <Grid container direction="row" xs={12} alignItems="center" justify="center">
                <div id="net" ref={THIS.state.net_ref} className="net"></div>  
            </Grid>
            <Popover
            id={'id'}
            open={THIS.state.open_network_popup}
            anchorReference="anchorPosition"
            anchorPosition={{top:THIS.state.network_popup_top,left:THIS.state.network_popup_bottom}}
            onClose={
                e=>
                {
                    THIS.setState({open_network_popup:false});
                    THIS.reset_context_menu_settings();
                }}>
                <div className="contextMenu">
                    <List>
                    {
                        THIS.state.context_menu_list.map(item=>
                        {
                            return(
                                <ListItem button
                                onClick={
                                    e=>
                                    {
                                        THIS.setState({open_network_popup:false});
                                        if(THIS.context_node_id!=-1)
                                        {   
                                            if(item.id==0)
                                            {   
                                                THIS.sleep(1).then(() => {
                                                    THIS.scroll_to_location(0,0);
                                                });
                                            }
                                            else if(item.id==1)
                                            {   
                                                THIS.delete_node_id=THIS.context_node_id;
                                                THIS.delete_node_name=THIS.context_node_name;
                                                THIS.permission_dialog_purpose_code=3;
                                                THIS.permission_dialog_options(1);
                                            }
                                        }
                                        else if(THIS.context_edge_id!=-1)
                                        {   
                                            if(item.id==0)
                                            {    
                                                THIS.sleep(1).then(() => {
                                                    THIS.scroll_to_location(0,1);
                                                });
                                            }
                                            else if(item.id==1)
                                            {   
                                                THIS.delete_relation_id=THIS.context_edge_id;
                                                THIS.delete_relation_source_node_name=THIS.source_node_name;
                                                THIS.delete_relation_destination_node=THIS.destination_node_name;
                                                var a=0;
                                                var relation_type_id;
                                                for(a=0;a<THIS.state.relation_data_list.length;a++)
                                                {
                                                    if(THIS.state.relation_data_list[a].relation_id==THIS.delete_relation_id)
                                                    {   relation_type_id=THIS.state.relation_data_list[a].relation_type_id;break;}
                                                }
                                                var relation_type=THIS.get_relation_type(relation_type_id);
                                                THIS.delete_relation_type=relation_type.relation_type;
                                                THIS.permission_dialog_purpose_code=4;
                                                THIS.permission_dialog_options(1);
                                            }
                                        }
                                    }}
                                >
                                    <item.icon/>
                                    <Typography className={THIS.props.classes.typography}>
                                        {item.text}
                                    </Typography>
                                </ListItem>
                            );
                        })
                    }   
                    </List>
                </div>
            </Popover>
        </div> 
    );
}