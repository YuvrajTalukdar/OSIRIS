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
    CLASS.prototype.check_if_relation_is_already_present = check_if_relation_is_already_present;
    CLASS.prototype.get_node_indexes_from_edge_id = get_node_indexes_from_edge_id;
    CLASS.prototype.get_relation_indexed_from_relation_id = get_relation_indexed_from_relation_id;
    CLASS.prototype.focus_on_node = focus_on_node;
    CLASS.prototype.set_speed = set_speed;
    CLASS.prototype.change_node_type = change_node_type;
    CLASS.prototype.change_relation_type = change_relation_type;
    CLASS.prototype.enable_keyboard_navigation = enable_keyboard_navigation;
    CLASS.prototype.highlight_path = highlight_path; 
    CLASS.prototype.highlight_mst = highlight_mst;
    CLASS.prototype.reset_node_color_settings = reset_node_color_settings;
    CLASS.prototype.highlight_node = highlight_node;
    CLASS.prototype.cluster_by_connection = cluster_by_connection;
    CLASS.prototype.cluster_by_id = cluster_by_id;
    CLASS.prototype.generate_cluster_id = generate_cluster_id;
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
            from: 
            {
                scaleFactor: 0.5,
                type: "arrow"
            },
        },
        selectionWidth: 5,
    },
    interaction: {
        hover: true,
        keyboard: 
        {
            enabled: true,
            speed: {x: 10, y: 10,zoom: 0.05},
            bindToWindow: true
        },
        zoomSpeed: 1,
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
    },
    physics:{
        enabled:true,
        barnesHut: {
            theta: 0.5,
            gravitationalConstant: -5000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        },
        solver: 'barnesHut',
    }
};

function generate_cluster_id()
{
    let cluster_id;
    if(this.cluster_id_list.length==0)
    {   cluster_id=0;}
    else
    {   
        let last_cluster_id=this.cluster_id_list[this.cluster_id_list.length-1];
        let num="";
        for(let a=last_cluster_id.length-1;a>=0;a--)
        {
            if(last_cluster_id[a].localeCompare("_")!=0)
            {   num=last_cluster_id[a]+num;}
            else
            {   break;}
        }
        cluster_id= Number(num);
        cluster_id++;
    }
    return cluster_id;
}

function cluster_by_connection(node_id,cluster_name,cluster_color)
{
    let cluster_id=this.generate_cluster_id();
    let cluster_options={
        clusterNodeProperties: {
            id:'cluster_'+cluster_id,
            shape: 'circle',
            label:cluster_name,
            allowSingleNodeCluster: true,//i dont know what this is
            color: {    border: cluster_color,},
        }
    }
    this.network.clusterByConnection(node_id,cluster_options);
    this.cluster_id_list.push('cluster_'+cluster_id);
    let obj={
        cid:'cluster_'+cluster_id,
        node_id_list:[]
    }
    this.cluster_id_with_nodes.push(obj);
}

function cluster_by_id(node_list,cluster_name,cluster_color)
{
    let cluster_id=this.generate_cluster_id();
    let node_id_list=[];
    for(let a=0;a<node_list.length;a++)
    {
        let node=nodes.get(node_list[a].node_id);
        node.cid=cluster_id;
        nodes.update(node);
        node_id_list.push(node_list[a].node_id);
    }
    let cluster_option={
        joinCondition: function (childOptions) 
        {   return childOptions.cid == cluster_id;},
        clusterNodeProperties: {
            id: "cluster_"+cluster_id,
            shape: "circle",
            label:cluster_name,
            allowSingleNodeCluster: true,//i dont know what this is
            color: {    border: cluster_color,},
        },
    }
    this.network.cluster(cluster_option);
    this.cluster_id_list.push('cluster_'+cluster_id);
    let obj={
        cid:'cluster_'+cluster_id,
        node_id_list:node_id_list
    }
    this.cluster_id_with_nodes.push(obj);
}

function change_relation_type(data)
{
    const div = document.createElement("div");
    div.className="tooltip";
    div.innerText=data.type;
    var edge;
    for(var a=0;a<this.state.relation_data_list.length;a++)
    {
        if(this.state.relation_data_list[a].relation_type_id==data.id)
        {
            edge=edges.get(this.state.relation_data_list[a].relation_id);
            edge.title=div;
            edge.color=data.color_code;
            edge.arrows={from:{enabled:!data.vectored}};
            edges.update(edge);
        }
    }
}

function change_node_type(node_type)
{
    const div = document.createElement("div");
    div.className="tooltip";
    div.innerText=node_type.type;
    var node;
    for(var a=0;a<this.state.node_data_list.length;a++)
    {
        if(this.state.node_data_list[a].node_type_id==node_type.id)
        {
            node=nodes.get(this.state.node_data_list[a].node_id);
            node.title=div;
            nodes.update(node);
        }
    }
}

function get_node_indexes_from_edge_id(edge_id)
{
    var edge=edges.get(edge_id);
    var to_node=nodes.get(edge.to);
    var from_node=nodes.get(edge.from);
    var obj={
        to_node_index:to_node.js_index,
        from_node_index:from_node.js_index,
        relation_type:this.get_relation_type(edge.relation_type_id)
    }
    return obj;
}

function get_relation_indexed_from_relation_id(relation_id)
{   
    var edge=edges.get(relation_id);
    return edge.js_index;
}

function check_if_relation_is_already_present(node1_id,node2_id,relation_type_id)
{
    var relation_found=false;
    var node1_edge_ids=this.network.getConnectedEdges(node1_id);
    var a=0;
    var edge_between_nodes=[];
    for(a=0;a<node1_edge_ids.length;a++)
    {
        var edge=edges.get(node1_edge_ids[a]);
        if((edge.from==node2_id && edge.to==node1_id)||(edge.to==node2_id && edge.from==node1_id))
        {   edge_between_nodes.push(edge);}
    }
    var relation_id,js_index;
    for(a=0;a<edge_between_nodes.length;a++)
    {   
        if(edge_between_nodes[a].relation_type_id==relation_type_id)
        {   
            relation_found=true;
            relation_id=edge_between_nodes[a].id;
            js_index=edge_between_nodes[a].js_index;
            break;
        }
    }
    var obj={
        relation_id:relation_id,
        relation_found:relation_found,
        js_index:js_index,
    }
    return obj;
}

function add_relation_to_network(relation,js_index)
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
            title:div,
            arrows:{from:{enabled:!relation_type.vectored}},
            relation_type_id:relation.relation_type_id,//used in my finctions
            js_index:js_index//used in my finctions
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

function add_node_to_network(node,js_index)
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
            js_index:js_index,
            node_type_id:node_type.id,
            cid:-1,
        };
        nodes.add(node);
    }
    catch(e)
    {}
}

function delete_node_from_network(node_id)
{   
    var edgeIds=this.network.getConnectedEdges(node_id);
    nodes.remove(node_id);
    return edgeIds;
}

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
    {   this.add_node_to_network(this.state.node_data_list[a],a);}
    for(a=0;a<this.state.relation_data_list.length;a++)
    {   this.add_relation_to_network(this.state.relation_data_list[a],a);}
}

function init_network()
{
    this.create_full_network();
    this.network = new Network(this.net_ref.current,data,options);
    let height = Math.round(window.innerHeight * 0.00) + 'px';
    this.net_ref.current.style.height = height;
    this.center_focus(); 
    this.network.on('oncontext',(values)=>{
        let node=this.network.getNodeAt(values.pointer.DOM);
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
        let edge=this.network.getEdgeAt(values.pointer.DOM);
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
    this.network.on('deselectNode',(values)=>{
        this.reset_node_color_settings();
    });
    this.network.on('doubleClick',(values)=>{
        let node=this.network.getNodeAt(values.pointer.DOM);
        if(node!=undefined)
        {
            if(this.network.isCluster(node) == true)
            {   
                this.network.openCluster(node);
                this.cluster_id_list=this.cluster_id_list.filter(item=>item!=node);
                let index;
                for(let a=0;a<this.cluster_id_with_nodes.length;a++)
                {
                    if(this.cluster_id_with_nodes[a].cid.localeCompare(node)==0)
                    {
                        for(let b=0;b<this.cluster_id_with_nodes[a].node_id_list.length;b++)
                        {
                            let node_obj=nodes.get(this.cluster_id_with_nodes[a].node_id_list[b]);
                            node_obj.cid=-1;
                            nodes.update(node_obj);
                        }
                        index=a;
                        break;
                    }
                }
                this.cluster_id_with_nodes.splice(index,1);
            }
        }
    });
    //context menu handling
    this.context_menu_list=[];
    let menuItem1={
        'id':0,
        'text':'Edit',
        'icon':EditIcon
    }  
    let menuItem2={
        'id':1,
        'text':'Delete',
        'icon':DeleteIcon
    }  
    this.context_menu_list.push(menuItem1);
    this.context_menu_list.push(menuItem2);
}
//------------------------------Network Style Functions-------------------------------
function enable_keyboard_navigation(enable)
{
    options.interaction.keyboard.enabled=enable;
    this.network.setOptions(options);
}

function reset_node_color_settings()
{
    for(let a=0;a<this.color_changed_node_id.length;a++)
    {
        let node=nodes.get(this.color_changed_node_id[a]);
        node.chosen={
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
        }
        nodes.update(node);
    }
    this.color_changed_node_id=[];
}

function highlight_node(node_id,color_code)
{
    let node=nodes.get(node_id);
    node.chosen={
        node:function(values, id, selected, hovering)
        {
            if(selected)
            {
                values.borderColor=color_code;
                values.shadowColor=color_code;
            }
            else
            {
                values.shadow=true;
                values.borderColor='#00FFE8';
            }
        }
    }
    nodes.update(node);
    this.color_changed_node_id.push(node_id);
}

function highlight_mst(mst,mst_node_list)
{   
    for(let a=0;a<mst_node_list.length;a++)
    {   mst.node_id_list.push(mst_node_list[a].node_id);}
    this.network.setSelection({nodes:mst.node_id_list,edges:mst.relation_id_list},{
        unselectAll: true,
        highlightEdges: false
    });
    this.reset_node_color_settings();
    for(let a=0;a<mst_node_list.length;a++)
    {   this.highlight_node(mst_node_list[a].node_id,"red");}
}

function highlight_path(path,shortest_path_node_source,shortest_path_node_destination)
{
    if(path.relation_id_list.length==0)
    {
        this.setState({
            alert_dialog_text:"Path not found !",
            alert_dialog_open:true
        });
    }
    else
    {
        this.network.setSelection({nodes:path.node_id_list,edges:path.relation_id_list},{
            unselectAll: true,
            highlightEdges: false
        });
        this.reset_node_color_settings();
        this.highlight_node(shortest_path_node_source.node_id,"red");
        this.highlight_node(shortest_path_node_destination.node_id,"red");
    }
}

function focus_on_node(node_id)
{
    var focus_options={
        scale:2,
        animation: {             
            duration: 250,                 
            easingFunction: "easeInOutQuad"
        } 
    }
    this.network.focus(node_id,focus_options);
    this.network.unselectAll();
    var nodeIds=[];
    nodeIds.push(node_id);
    this.network.selectNodes(nodeIds,true);
}

function center_focus()
{
    var fit_options={
        nodes:nodes.getIds(),
        minZoomLevel: 1,
        maxZoomLevel: 1,
        animation: {             
            duration: 250,                 
            easingFunction: "easeInOutQuad"
        } 
    }
    this.network.fit(fit_options);
}

function set_speed()
{
    options.interaction.keyboard.speed.x=this.state.navigation_speed;
    options.interaction.keyboard.speed.y=this.state.navigation_speed;
    options.interaction.zoomSpeed=this.state.mouse_zoom;
    options.interaction.keyboard.speed.zoom=this.state.keyboard_zoom;
    this.network.setOptions(options);
}

export function Add_Network(THIS)
{
    return(
        <div>
            <Grid container direction="row" xs={12} alignItems="center" justify="center">
                <div id="net" ref={THIS.net_ref} className="net"></div>  
            </Grid>
            <Popover
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
                        THIS.context_menu_list.map(item=>
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