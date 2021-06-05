import {Tooltip,Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,ListItemText,Box} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Switch from '@material-ui/core/Switch';
import React from 'react';

export function add_add_panel_func(CLASS)
{
    CLASS.prototype.add_new_node_body = add_new_node_body;//do not shift
    CLASS.prototype.add_new_relation_body = add_new_relation_body;//do not shift
    CLASS.prototype.search_grouped_relation = search_grouped_relation;//will be used later   
    CLASS.prototype.get_filename_from_path = get_filename_from_path;//do not shift
}

function get_filename_from_path(path)
{
    var file_name="";
    for(var a=path.length-1;a>=0;a--)
    {
        if(path[a].localeCompare("/")!=0)
        {   file_name=path[a]+file_name;}
        else
        {   break;}
    }
    return file_name;
}

function add_new_node_body(last_entered_node)
{
    const node_data_list=[...this.state.node_data_list];
    node_data_list.push(last_entered_node);
    this.setState({
        node_data_list:node_data_list
    });
    this.add_node_to_network(last_entered_node,node_data_list.length-1);
}

function add_new_relation_body(last_entered_relation)
{
    const relation_data_list=[...this.state.relation_data_list];
    relation_data_list.push(last_entered_relation);
    this.setState({
        relation_data_list:relation_data_list
    });
    this.add_relation_to_network(last_entered_relation,relation_data_list.length-1);
}

function search_grouped_relation(type)//will be used later
{
   
}

export class Add_Panel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            add_drawer_open:false,

            new_node_name_close_button_visible:'none',
            new_node_name:"",
            new_node_type:"",
            add_button_text:'Add',
            disable_add_button:false,
            matched_node:undefined,
            edit_node_name_box_visible:'none',
            edit_node_name_close_button:'none',
            edit_node_name:'',

            source_node:"",
            destination_node:"",
            new_relation_type:"",
            source_url:"",
            source_url_close_button_visible:'none',
            source_url_list:[],
            file_dir:"",
            file_dir_list:[],
            //grouped_relation_search:"",//will bw used later
            edit_relation_id:'',
            edit_mode_on:false,
            relation_add_button_text:'Add',
            disable_relation_add_button:false,
        }
        this.search_node_name=this.search_node_name.bind(this);
        this.add_new_node=this.add_new_node.bind(this);
        this.delete_node=this.delete_node.bind(this);
        this.delete_multiple_relation=this.delete_multiple_relation.bind(this);

        this.add_new_relation=this.add_new_relation.bind(this);
        this.enable_disable_save_relation_button=this.enable_disable_save_relation_button.bind(this);
        this.search_source_url=this.search_source_url.bind(this);
        this.add_source_url_to_list=this.add_source_url_to_list.bind(this);
        this.delete_source_url_from_list=this.delete_source_url_from_list.bind(this);
        this.edit_relation_switch_toggle=this.edit_relation_switch_toggle.bind(this);
        this.add_file_dir=this.add_file_dir.bind(this);
        this.remove_dir_from_file_dir_list=this.remove_dir_from_file_dir_list.bind(this);
        this.delete_relation=this.delete_relation.bind(this);
    }

    match_found_at=-1;//for edit node
    url_list=[];
    source_local=[];

    node_name_search_handler = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.search_node_name(this.state.new_node_name);
        }, 250);
    }

    url_search_handler = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.search_source_url(this.state.source_url);
        }, 250);
    }

    delete_relation()
    {
        const relation_data_list=[...this.props.THIS.state.relation_data_list];
        const new_relation_data_list=relation_data_list.filter(item=>item.relation_id!=this.props.THIS.delete_relation_id);

        window.ipcRenderer.send('delete_relation',this.props.THIS.delete_relation_id);
        this.props.THIS.delete_relation_from_network(this.props.THIS.delete_relation_id);

        this.props.THIS.setState({relation_data_list:new_relation_data_list});

        this.props.THIS.delete_relation_id=-1;
        this.props.THIS.delete_relation_source_node_name="";
        this.props.THIS.delete_relation_destination_node="";
        this.props.THIS.delete_relation_type="";
        this.props.THIS.reset_context_menu_settings();
    }

    remove_dir_from_file_dir_list(id)
    {
        const file_dir_list=[...this.state.file_dir_list];
        const new_file_dir_list=file_dir_list.filter(item=>item.id!=id);
        this.setState({file_dir_list:new_file_dir_list});
        this.props.THIS.sleep(1).then(() => {
            this.enable_disable_save_relation_button();
        });
    }

    add_file_dir(data)
    {
        const file_dir_list=[...this.state.file_dir_list];
        let duplicate=false;
        for(let a=0;a<file_dir_list.length;a++)
        {
            if(data.file_name.localeCompare(file_dir_list[a].file_name)==0)
            {   duplicate=true;break;}
        }
        if(duplicate)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Another file with name '"+data.file_name+"' already present !",
                alert_dialog_open:true
            });
        }
        else
        {
            var data={
                'id':file_dir_list.length,
                'file_name':data.file_name,
                'file_dir':""+data.file_dir,
            };
            file_dir_list.push(data);
            this.setState({file_dir_list});
            this.props.THIS.sleep(1).then(() => {
                this.enable_disable_save_relation_button();
            });
        }
    }

    edit_relation_switch_toggle(switch_on)
    {   
        if(switch_on)
        {  
            var all_is_well=false;
            try{
                var obj=this.props.THIS.check_if_relation_is_already_present(this.state.destination_node.node_id,this.state.source_node.node_id,this.state.new_relation_type.id);
                all_is_well=true;
            }
            catch(error)
            {}
            if(all_is_well && obj.relation_found)
            {
                var a=0;
                var url_list=[];
                for(a=0;a<this.props.THIS.state.relation_data_list[obj.js_index].source_url_list.length;a++)
                {
                    var url={
                        'id':url_list.length,
                        'url':this.props.THIS.state.relation_data_list[obj.js_index].source_url_list[a],
                        'show':true
                    }
                    url_list.push(url);
                }
                var file_dir_list=[];
                for(a=0;a<this.props.THIS.state.relation_data_list[obj.js_index].source_local.length;a++)
                {
                    var data={
                        'id':file_dir_list.length,
                        'file_name':this.props.THIS.get_filename_from_path(this.props.THIS.state.relation_data_list[obj.js_index].source_local[a]),
                        'file_dir':""+this.props.THIS.state.relation_data_list[obj.js_index].source_local[a],
                    };
                    file_dir_list.push(data);
                }
                this.setState({
                    edit_mode_on:switch_on,
                    edit_relation_id:obj.relation_id,
                    file_dir_list:file_dir_list,
                    source_url_list:url_list,
                    relation_add_button_text:'Save Changes',
                });
                this.props.THIS.source_node_id=this.state.source_node.node_id;
                this.props.THIS.destination_node_id=this.state.destination_node.node_id;
                this.props.THIS.relation_type_id=this.state.new_relation_type.id;
                this.url_list=url_list;
                this.source_local=file_dir_list;
            }
        }
        else
        {
            this.setState({
                edit_mode_on:switch_on,
                edit_relation_id:'',
                file_dir_list:[],
                source_url_list:[],
                relation_add_button_text:'Add',
            });
        }
        this.props.THIS.sleep(1).then(() => {
            this.enable_disable_save_relation_button();
        });
    }

    delete_source_url_from_list(id)
    {
        const url_list=[...this.state.source_url_list];
        const new_url_list=url_list.filter(item=>item.id!=id);
        this.setState({source_url_list:new_url_list});
        this.props.THIS.sleep(1).then(() => {
            this.enable_disable_save_relation_button();
        });
    }

    add_source_url_to_list()
    {
        if(this.state.source_url.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Enter the source url first !",
                alert_dialog_open:true
            });
        }
        else
        {
            var found=false;
            var a=0;
            const url_list=[...this.state.source_url_list];
            for(a=0;a<url_list.length;a++)
            {
                if(url_list[a].url.localeCompare(this.state.source_url)==0)
                {   found=true;}
                url_list[a].show=true;
            }
            if(found)
            {
                this.props.THIS.setState({
                    alert_dialog_text:"URL '"+this.state.source_url+"' is already present on the list.",
                    alert_dialog_open:true
                });
            }
            else
            {
                var url={
                    'id':url_list.length,
                    'url':this.state.source_url,
                    'show':true
                }
                url_list.push(url);
                this.setState({source_url_list:url_list,source_url:"",source_url_close_button_visible:"none"});
                this.props.THIS.sleep(1).then(() => {
                    this.enable_disable_save_relation_button();
                });
            }
        }
    }

    search_source_url(data)
    {
        if(data.length>0)
        {   this.setState({source_url_close_button_visible:"block"});}
        else
        {   this.setState({source_url_close_button_visible:"none"});}
        const source_url_list=[...this.state.source_url_list];
        for(var a=0;a<source_url_list.length;a++)
        {
            if(source_url_list[a].url.toUpperCase().includes(data.toUpperCase()))
            {   source_url_list[a].show=true;}
            else
            {   source_url_list[a].show=false;}
        }
        this.setState({source_url_list:source_url_list});
    }

    enable_disable_save_relation_button()
    {
        var disabled=true;
        try{
        if((this.props.THIS.source_node_id!=this.state.source_node.node_id)||
        (this.props.THIS.destination_node_id!=this.state.destination_node.node_id)||
        (this.props.THIS.relation_type_id!=this.state.new_relation_type.id))
        {   disabled=false;}
        }
        catch(error)
        {}
        var a=0;
        if(disabled)
        {
            if(this.url_list.length==this.state.source_url_list.length)
            {
                for(a=0;a<this.url_list.length;a++)
                {
                    if(this.url_list[a].url.localeCompare(this.state.source_url_list[a].url)!=0)
                    {   disabled=false;break;}
                }
            }
            else
            {   disabled=false;}
        }
        if(disabled)
        {   
            if(this.source_local.length==this.state.file_dir_list.length)
            {
                for(a=0;a<this.source_local.length;a++)
                {
                    if(this.source_local[a].file_name.localeCompare(this.state.file_dir_list[a].file_name)!=0)
                    {   disabled=false;break;}
                }
            }
            else
            {   disabled=false;}
        }
        if(!this.state.edit_mode_on)
        {   disabled=false;}
        this.setState({disable_relation_add_button:disabled});
    }

    add_new_relation()
    {
        if(this.state.source_node==null || typeof this.state.source_node.node_name=='undefined')
        {
            this.props.THIS.setState({
                alert_dialog_text:"Source Node not selected !",
                alert_dialog_open:true
            });
        }
        else if(this.state.destination_node==null || typeof this.state.destination_node.node_name=='undefined')
        {
            this.props.THIS.setState({
                alert_dialog_text:"Destination Node not selected !",
                alert_dialog_open:true
            });
        }
        else if(this.state.new_relation_type==null || typeof this.state.new_relation_type.relation_type=='undefined')
        {
            this.props.THIS.setState({
                alert_dialog_text:"Relation Type not specified !",
                alert_dialog_open:true
            });
        }
        else if(this.state.source_node.node_id==this.state.destination_node.node_id)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Source and Destination nodes cannot be the same !",
                alert_dialog_open:true
            });
        }
        else
        {
            const relation_data_list=[...this.props.THIS.state.relation_data_list];
            var source_found=false,destination_found=false,relation_type_found=false;
            for(var a=0;a<relation_data_list.length;a++)
            {
                source_found=false;destination_found=false;relation_type_found=false;
                if(relation_data_list[a].source_node_id==this.state.source_node.node_id)
                {   source_found=true;}
                if(relation_data_list[a].destination_node_id==this.state.destination_node.node_id)
                {   destination_found=true;}
                if(relation_data_list[a].relation_type_id==this.state.new_relation_type.id)
                {   relation_type_found=true;}
                if(source_found && destination_found && relation_type_found)
                {   break;}
            }
            if(source_found && destination_found && relation_type_found && !this.state.edit_mode_on)
            {
                this.props.THIS.setState({
                    alert_dialog_text:"This relation is already present !",
                    alert_dialog_open:true
                });
            }
            else
            {
                var url_list=[];
                for(var a=0;a<this.state.source_url_list.length;a++)
                {   url_list.push(this.state.source_url_list[a].url);}
                var relation={
                    "source_node_id":this.state.source_node.node_id,
                    "destination_node_id":this.state.destination_node.node_id,
                    "relation_type_id":this.state.new_relation_type.id,
                    "source_url_list":url_list,
                    "source_local":this.state.file_dir_list
                }
                if(!this.state.edit_mode_on)
                {
                    window.ipcRenderer.send('add_new_relation',relation);
                    this.setState({
                        source_node:"",
                        destination_node:"",
                        new_relation_type:"",
                        source_url:"",
                        source_url_close_button_visible:'none',
                        source_url_list:[],
                        file_dir:"",
                        file_dir_list:[],
                    });
                }
                else
                {
                    relation.relation_id=this.state.edit_relation_id;
                    //send edited relation to db
                    window.ipcRenderer.send('edit_relation',relation);
                    this.setState({
                        source_node:"",
                        destination_node:"",
                        new_relation_type:"",
                        source_url:"",
                        source_url_close_button_visible:'none',
                        source_url_list:[],
                        file_dir:"",
                        file_dir_list:[],
                        edit_mode_on:false,
                        edit_relation_id:''
                    });
                    //edit the particular relation in the body
                    var relation_index=this.props.THIS.get_relation_indexed_from_relation_id(relation.relation_id);
                    relation_data_list[relation_index].relation_type_id=relation.relation_type_id;
                    relation_data_list[relation_index].source_node_id=relation.source_node_id;
                    relation_data_list[relation_index].destination_node_id=relation.destination_node_id;
                    relation_data_list[relation_index].source_url_list=relation.source_url_list;
                    relation_data_list[relation_index].source_local=[];
                    for(var a=0;a<relation.source_local.length;a++)
                    {   relation_data_list[relation_index].source_local.push(relation.source_local[a].file_dir);}
                    this.props.THIS.setState({relation_data_list});
                    //edit the relation in the network.
                    this.props.THIS.delete_relation_from_network(relation.relation_id);
                    this.props.THIS.add_relation_to_network(relation,relation_index);
                }
            }
        }
    }

    delete_multiple_relation(edgeIds)
    {
        const relation_data_list=[...this.props.THIS.state.relation_data_list];
        const new_relation_data_list=relation_data_list.filter(function(value,index)
        {
            let edge_found=false;
            for(var a=0;a<edgeIds.length;a++)
            {
                if(value.relation_id==edgeIds[a])
                {   edge_found=true;break;}
            }
            if(!edge_found)
            {   return value;}
        });
        for(var a=0;a<edgeIds.length;a++)
        {
            window.ipcRenderer.send('delete_relation',edgeIds[a]);
            this.props.THIS.delete_relation_from_network(edgeIds[a]);
        }

        this.props.THIS.setState({relation_data_list:new_relation_data_list});

        this.props.THIS.delete_relation_id=-1;
        this.props.THIS.delete_relation_source_node_name="";
        this.props.THIS.delete_relation_destination_node="";
        this.props.THIS.delete_relation_type="";
        this.props.THIS.reset_context_menu_settings();
    }

    delete_node()
    {
        const node_data_list=[...this.props.THIS.state.node_data_list];
        const new_node_data_list=node_data_list.filter(item=>item.node_id!=this.props.THIS.delete_node_id);

        window.ipcRenderer.send('delete_node',this.props.THIS.delete_node_id);
        var edgeIds=this.props.THIS.delete_node_from_network(this.props.THIS.delete_node_id);
        
        this.delete_multiple_relation(edgeIds);//START FROM HERE

        this.props.THIS.setState({
            node_data_list:new_node_data_list
        });

        this.props.THIS.delete_node_id=-1;
        this.props.THIS.delete_node_name="";
        this.props.THIS.reset_context_menu_settings();
    }

    add_new_node()
    {
        if(this.state.new_node_name.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Node Name not entered !",
                alert_dialog_open:true
            });
        }
        else if(this.state.new_node_type==null || typeof this.state.new_node_type.node_type=='undefined')
        {
            this.props.THIS.setState({
                alert_dialog_text:"Node Type not selected !",
                alert_dialog_open:true
            });
        }
        else
        {   
            if(this.state.matched_node!=undefined)
            {   
                //edit node handler:-
                var edited_node={
                    'node_id':this.state.matched_node.node_id,
                    'node_type_id':this.state.new_node_type.id,
                    'node_name':this.state.edit_node_name
                };
                const node_data_list=[...this.props.THIS.state.node_data_list];
                node_data_list[this.match_found_at].node_type_id=this.state.new_node_type.id;
                node_data_list[this.match_found_at].node_name=this.state.edit_node_name;
                //Here another js chamatkar is going on, without setting the state on node_data_list the particular variable gets changed.
                this.props.THIS.delete_node_from_network(this.state.matched_node.node_id);
                this.props.THIS.add_node_to_network(edited_node,node_data_list.length-1);
                window.ipcRenderer.send('edit_node',edited_node);
            }
            else
            {   
                var new_node={
                    'node_type_id':this.state.new_node_type.id,
                    'node_name':this.state.new_node_name
                };
                window.ipcRenderer.send('add_new_node',new_node);
            }
            this.setState({new_node_name:""});
            this.search_node_name("");
        }
    }

    search_node_name(data)
    {
        if(data.length>0)
        {   this.setState({new_node_name_close_button_visible:"block"});}
        else
        {   this.setState({new_node_name_close_button_visible:"none"});}

        const node_data_list=[...this.props.THIS.state.node_data_list];
        let no_of_match=0;
        var matched_node;
        for(var a=0;a<node_data_list.length;a++)
        {
            if(node_data_list[a].node_name.toUpperCase().includes(data.toUpperCase()))
            {   
                node_data_list[a].show=true;
                matched_node=node_data_list[a];
                this.match_found_at=a;
                no_of_match++;
            }
            else
            {   node_data_list[a].show=false;}
        }
        let name_matched=false;
        if(no_of_match==1)
        {
            if(node_data_list[this.match_found_at].node_name.toUpperCase().localeCompare(data.toUpperCase())==0)
            {   name_matched=true;}
        }
        if(name_matched==true)
        {   
            var a;
            for(a=0;a<this.props.THIS.state.node_type_data_list.length;a++)
            {
                if(this.props.THIS.state.node_type_data_list[a].id==matched_node.node_type_id)
                {break;}
            }
            this.setState({
                add_button_text:'Save Changes',
                new_node_type:this.props.THIS.state.node_type_data_list[a],
                disable_add_button:true,
                matched_node:matched_node,
                edit_node_name_box_visible:'block',
                edit_node_name_close_button:'block',
                edit_node_name:matched_node.node_name
            });
        }
        else
        {   
            this.setState({
                add_button_text:'Add',
                new_node_type:'',
                disable_add_button:false,
                matched_node:undefined,
                edit_node_name_close_button:'none',
                edit_node_name_box_visible:'none',
                edit_node_name:''
            });
        }
        this.props.THIS.setState({node_data_list:node_data_list});
    }

    render()
    {
        return(
            <Drawer variant="persistent"
                anchor="left"
                open={this.state.add_drawer_open}
                className={this.props.THIS.props.classes.drawer}
                classes={{paper: this.props.THIS.props.classes.drawerPaper2,}}>
                <Toolbar variant="dense" ref={this.props.THIS.add_node_ref}/>
            
                <Grid container direction="column" className={this.props.THIS.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                    <List className={this.props.THIS.props.classes.list_class} > 
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Typography
                            color="primary"
                            display="block"
                            variant="caption">
                            New Node
                            </Typography>
                        </Grid>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <TextField 
                                label='Node Name'
                                variant='outlined' 
                                size='small' 
                                value={this.state.new_node_name}
                                onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                onChange={
                                    e => {
                                        this.setState({new_node_name:e.target.value});
                                        this.node_name_search_handler();
                                    }}                                            
                                style={{width:300,marginBottom:15}} 
                                InputLabelProps={
                                {   className: this.props.THIS.props.classes.textfield_label}}
                                InputProps={{
                                    className: this.props.THIS.props.classes.valueTextField,
                                    classes:{
                                        root:this.props.THIS.props.classes.root,
                                        notchedOutline: this.props.THIS.props.classes.valueTextField,
                                        disabled: this.props.THIS.props.classes.valueTextField
                                    },
                                    endAdornment: 
                                    (
                                        <Box display={this.state.new_node_name_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    this.search_node_name("");
                                                    this.setState({new_node_name:""});
                                                }
                                            }>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box> 
                                    ),
                                }}/>
                                <List className={this.props.THIS.props.classes.properties_list_class}>
                                {
                                    this.props.THIS.state.node_data_list.map(item=>
                                    {
                                        if(item.show)
                                        {
                                            return(
                                                <ListItem button key={item.node_id}>
                                                    <ListItemText primary={<Typography type="body2" style={{ color:'#FFFFFF'}}>{item.node_name}</Typography>} 
                                                    onClick={
                                                        e=>
                                                        {
                                                            this.search_node_name(item.node_name);
                                                            this.setState({new_node_name:item.node_name});
                                                    }}/>
                                                    <IconButton color='primary' size='small'
                                                    onClick={
                                                        e=>{
                                                            this.props.THIS.delete_node_id=item.node_id;
                                                            this.props.THIS.delete_node_name=item.node_name;
                                                            this.props.THIS.permission_dialog_purpose_code=3;
                                                            this.props.THIS.permission_dialog_options(1);
                                                        } 
                                                    }>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }
                                    })
                                }
                                </List>
                                    <Box display={this.state.edit_node_name_box_visible} style={{width:300,marginBottom:15}}> 
                                    <TextField 
                                    label='New Node Name'
                                    variant='outlined' 
                                    size='small' 
                                    value={this.state.edit_node_name}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={
                                        e => 
                                        {
                                            var disable_add_button;
                                            if(e.target.value.toUpperCase().localeCompare(this.state.new_node_name.toUpperCase())==0)
                                            {   disable_add_button=true;}
                                            else
                                            {   
                                                disable_add_button=false;
                                                for(let a=0;a<this.props.THIS.state.node_data_list.length;a++)
                                                {
                                                    if(this.props.THIS.state.node_data_list[a].node_name.toUpperCase().localeCompare(e.target.value.toUpperCase())==0)
                                                    {   disable_add_button=true;break;}
                                                }
                                            }
                                            this.setState({
                                                edit_node_name:e.target.value,
                                                disable_add_button:disable_add_button
                                            });
                                            if(e.target.value.length!=0)
                                            {   this.setState({edit_node_name_close_button:'block'});}
                                            else
                                            {   this.setState({edit_node_name_close_button:'none'});}
                                        }}
                                    InputLabelProps={
                                    {   className: this.props.THIS.props.classes.textfield_label}}
                                    InputProps={{
                                        className: this.props.THIS.props.classes.valueTextField,
                                        classes:{
                                            root:this.props.THIS.props.classes.root,
                                            notchedOutline: this.props.THIS.props.classes.valueTextField,
                                            disabled: this.props.THIS.props.classes.valueTextField
                                        },
                                        endAdornment: 
                                        (
                                            <Box display={this.state.edit_node_name_close_button}> 
                                                <IconButton color='primary' size='small'
                                                onClick={e=>{this.setState({edit_node_name:"",edit_node_name_close_button:'none'})}}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Box> 
                                        ),
                                    }}/>
                                </Box>  
                                <Autocomplete
                                size="small"
                                classes={this.props.THIS.props.classes}
                                options={this.props.THIS.state.node_type_data_list}
                                getOptionLabel={(option) => option.node_type}
                                style={{ width: 300,marginBottom:15 }}
                                onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                value={this.state.new_node_type}
                                onChange={(event,value)=>
                                    {
                                        this.setState({new_node_type:value});
                                        if(this.state.matched_node!=undefined)
                                        {
                                            var found=false;
                                            if(value.id==this.state.matched_node.node_type_id)
                                            {found=true;}
                                            this.setState({disable_add_button:found});
                                        }
                                    }}
                                renderInput=
                                {
                                    (params) => 
                                        <TextField 
                                        {...params} label="Node Type.." variant="outlined" 
                                        InputLabelProps=
                                        {{   
                                                ...params.InputLabelProps,
                                                className: this.props.THIS.props.classes.textfield_label
                                        }}
                                        />
                                }
                                /> 
                                <Button variant="contained" size="small" color="primary" style={{width:'100%',marginBottom:15}}
                                onClick={e=>{this.add_new_node();}}
                                ref={this.props.THIS.add_relation_ref}
                                classes={{root: this.props.THIS.props.classes.button, disabled: this.props.THIS.props.classes.disabled_button }}
                                disabled={this.state.disable_add_button}>{this.state.add_button_text}</Button>     
                            </Grid>
                        </ListItem>
                        <Divider light style={{paddingTop:1}} classes={{root:this.props.THIS.props.classes.divider}}/>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption"
                                    >
                                    New Relation
                                </Typography>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption"
                                        >
                                        ID:
                                    </Typography>
                                    <TextField 
                                    variant='outlined' 
                                    size='small' 
                                    value={this.state.edit_relation_id}
                                    style={{width:'34%',marginTop:15,marginBottom:15}} 
                                    InputLabelProps={
                                    {   className: this.props.THIS.props.classes.textfield_label}}
                                    InputProps={{
                                        className: this.props.THIS.props.classes.valueTextField,
                                        classes:{
                                            root:this.props.THIS.props.classes.root,
                                            notchedOutline: this.props.THIS.props.classes.valueTextField,
                                            disabled: this.props.THIS.props.classes.valueTextField
                                        },
                                    }}/>
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption"
                                        >
                                        Edit:
                                    </Typography>
                                    <Switch
                                    color='primary'
                                    classes={{track:this.props.THIS.props.classes.track,}}
                                    checked={this.state.edit_mode_on}
                                    onClick={()=>{  this.edit_relation_switch_toggle(!this.state.edit_mode_on);}}
                                    />
                                </Grid>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        From:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.THIS.props.classes}
                                    size="small"
                                    options={this.props.THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: '85%',marginBottom:15}}
                                    value={this.state.source_node}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={(event,value)=>
                                        {
                                            this.setState({source_node:value});
                                            this.props.THIS.sleep(1).then(() => {
                                                this.enable_disable_save_relation_button();
                                            });
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Source Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        To:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.THIS.props.classes}
                                    size="small"
                                    options={this.props.THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: '85%',marginBottom:15 }}
                                    value={this.state.destination_node}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={(event,value)=>
                                        {
                                            this.setState({destination_node:value});
                                            this.props.THIS.sleep(1).then(() => {
                                                this.enable_disable_save_relation_button();
                                            });
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Destination Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        Type:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.THIS.props.classes}
                                    size="small"
                                    options={this.props.THIS.state.relation_type_data_list}
                                    getOptionLabel={(option) => option.relation_type}
                                    style={{ width: '85%',marginBottom:15 }}
                                    value={this.state.new_relation_type}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={(event,value)=>
                                        {
                                            this.setState({new_relation_type:value});
                                            this.props.THIS.sleep(1).then(() => {
                                                this.enable_disable_save_relation_button();
                                            });
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Relation Type.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <IconButton color='primary' size="small"
                                        onClick={e=>{this.add_source_url_to_list();}}>
                                        <AddIcon/>
                                    </IconButton>
                                    <TextField         
                                    label='Source URL' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '85%',marginBottom:15}}
                                    value={this.state.source_url}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={
                                        e=>{
                                            this.setState({source_url:e.target.value});
                                            this.url_search_handler();
                                        }
                                    }
                                    InputLabelProps={
                                    {   className: this.props.THIS.props.classes.textfield_label}}
                                    InputProps={{
                                        className: this.props.THIS.props.classes.valueTextField,
                                        classes:{
                                            root:this.props.THIS.props.classes.root,
                                            notchedOutline: this.props.THIS.props.classes.valueTextField,
                                            disabled: this.props.THIS.props.classes.valueTextField
                                        },
                                        endAdornment: 
                                        (
                                            <Box display={this.state.source_url_close_button_visible}> 
                                                <IconButton color='primary' size='small'
                                                onClick={
                                                    e=>{
                                                        this.search_source_url("");
                                                        this.setState({source_url:""})
                                                    }
                                                }>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Box> 
                                        ),
                                    }}/>
                                </Grid>
                                <List className={this.props.THIS.props.classes.properties_list_class}> 
                                {
                                    this.state.source_url_list.map(item=>
                                    {
                                        if(item.show)
                                        {
                                            return(
                                                <ListItem key={item.id}>
                                                    <TextField         
                                                    variant='outlined' 
                                                    size='small'                                          
                                                    style={{ width: '85%' }}
                                                    value={item.url}
                                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                                    InputLabelProps={
                                                    {   className: this.props.THIS.props.classes.textfield_label}}
                                                    InputProps={{
                                                        className: this.props.THIS.props.classes.valueTextField,
                                                        classes:{
                                                            root:this.props.THIS.props.classes.root,
                                                            notchedOutline: this.props.THIS.props.classes.valueTextField,
                                                            disabled: this.props.THIS.props.classes.valueTextField
                                                        }
                                                    }}/>
                                                    <IconButton color='primary' size='small'
                                                    onClick={e=>{this.delete_source_url_from_list(item.id);}}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }
                                    })
                                }
                                </List>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        Attached Files:
                                    </Typography>
                                    <IconButton color='primary' style={{marginBottom:15}}
                                    onClick={e=>{window.ipcRenderer.send("open_file_picker","");}}>
                                        <NoteAddIcon/>
                                    </IconButton>  
                                </Grid>
                                <List className={this.props.THIS.props.classes.properties_list_class}> 
                                {
                                    this.state.file_dir_list.map(item=>
                                    {
                                        return(
                                            <ListItem key={item.id}>
                                                <Tooltip title={item.file_dir}>
                                                    <TextField         
                                                    variant='outlined' 
                                                    size='small'                                          
                                                    style={{ width: '85%'}}
                                                    value={item.file_name}
                                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                                    InputLabelProps={
                                                    {   className: this.props.THIS.props.classes.textfield_label}}
                                                    InputProps={{
                                                        className: this.props.THIS.props.classes.valueTextField,
                                                        classes:{
                                                            root:this.props.THIS.props.classes.root,
                                                            notchedOutline: this.props.THIS.props.classes.valueTextField,
                                                            disabled: this.props.THIS.props.classes.valueTextField
                                                        }
                                                    }}/>
                                                </Tooltip>
                                                <IconButton color='primary' size='small'
                                                onClick={e=>{this.remove_dir_from_file_dir_list(item.id)}}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItem>
                                        )
                                    })
                                }
                                </List>
                                <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                                classes={{root: this.props.THIS.props.classes.button, disabled: this.props.THIS.props.classes.disabled_button }}
                                disabled={this.state.disable_relation_add_button}
                                onClick={e=>{this.add_new_relation();}}>{this.state.relation_add_button_text}</Button>
                            </Grid>
                        </ListItem>
                    </List>
                </Grid>
            </Drawer>
        );
    }
}