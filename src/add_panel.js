import {Tooltip,Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,ListItemText,Box} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Switch from '@material-ui/core/Switch';

export function add_add_panel_func(CLASS)
{
    CLASS.prototype.delete_node = delete_node;
    CLASS.prototype.search_node_name = search_node_name;
    CLASS.prototype.add_new_node_body = add_new_node_body;
    CLASS.prototype.add_new_node = add_new_node;
    CLASS.prototype.delete_relation = delete_relation;
    CLASS.prototype.delete_multiple_relation = delete_multiple_relation;
    CLASS.prototype.add_new_relation = add_new_relation;
    CLASS.prototype.search_source_url = search_source_url;
    CLASS.prototype.add_source_url_to_list = add_source_url_to_list;
    CLASS.prototype.delete_source_url_from_list = delete_source_url_from_list;
    CLASS.prototype.add_file_dir = add_file_dir; 
    CLASS.prototype.remove_dir_from_file_dir_list = remove_dir_from_file_dir_list;  
    CLASS.prototype.add_new_relation_body = add_new_relation_body;
    CLASS.prototype.search_grouped_relation = search_grouped_relation;//will be used later   
    CLASS.prototype.edit_relation_switch_toggle = edit_relation_switch_toggle;
    CLASS.prototype.get_filename_from_path = get_filename_from_path;
    CLASS.prototype.enable_disable_save_relation_button = enable_disable_save_relation_button;
}

function enable_disable_save_relation_button()
{
    var disabled=true;
    try{
    if((this.source_node_id!=this.state.source_node.node_id)||
       (this.destination_node_id!=this.state.destination_node.node_id)||
       (this.relation_type_id!=this.state.new_relation_type.id))
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
                if(this.source_local[a].new_file_dir.localeCompare(this.state.file_dir_list[a].new_file_dir)!=0)
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

function edit_relation_switch_toggle(switch_on)
{   
    if(switch_on)
    {
        var all_is_well=false;
        try{
            var obj=this.check_if_relation_is_already_present(this.state.destination_node.node_id,this.state.source_node.node_id,this.state.new_relation_type.id);
            all_is_well=true;
        }
        catch(error)
        {}
        if(all_is_well && obj.relation_found)
        {
            var a=0;
            var url_list=[];
            for(a=0;a<this.state.relation_data_list[obj.js_index].source_url_list.length;a++)
            {
                var url={
                    'id':url_list.length,
                    'url':this.state.relation_data_list[obj.js_index].source_url_list[a],
                    'show':true
                }
                url_list.push(url);
            }
            var file_dir_list=[];
            for(a=0;a<this.state.relation_data_list[obj.js_index].source_local.length;a++)
            {
                var data={
                    'id':file_dir_list.length,
                    'file_name':this.get_filename_from_path(this.state.relation_data_list[obj.js_index].source_local[a]),
                    'new_file_dir':this.state.relation_data_list[obj.js_index].source_local[a],
                    'file_dir':""+this.state.relation_data_list[obj.js_index].source_local[a]
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
            this.source_node_id=this.state.source_node.node_id;
            this.destination_node_id=this.state.destination_node.node_id;
            this.relation_type_id=this.state.new_relation_type.id;
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
    this.sleep(1).then(() => {
        this.enable_disable_save_relation_button();
    });
}

function delete_relation()
{
    const relation_data_list=[...this.state.relation_data_list];
    const new_relation_data_list=relation_data_list.filter(item=>item.relation_id!=this.delete_relation_id);

    window.ipcRenderer.send('delete_relation',this.delete_relation_id);
    this.delete_relation_from_network(this.delete_relation_id);

    this.setState({
        relation_data_list:new_relation_data_list
    });

    this.delete_relation_id=-1;
    this.delete_relation_source_node_name="";
    this.delete_relation_destination_node="";
    this.delete_relation_type="";
    this.reset_context_menu_settings();
}

function delete_multiple_relation(edgeIds)
{
    const relation_data_list=[...this.state.relation_data_list];
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
        this.delete_relation_from_network(edgeIds[a]);
    }

    this.setState({relation_data_list:new_relation_data_list});

    this.delete_relation_id=-1;
    this.delete_relation_source_node_name="";
    this.delete_relation_destination_node="";
    this.delete_relation_type="";
    this.reset_context_menu_settings();
}

function delete_node()
{
    const node_data_list=[...this.state.node_data_list];
    const new_node_data_list=node_data_list.filter(item=>item.node_id!=this.delete_node_id);

    window.ipcRenderer.send('delete_node',this.delete_node_id);
    var edgeIds=this.delete_node_from_network(this.delete_node_id);
    
    this.delete_multiple_relation(edgeIds);

    this.setState({
        node_data_list:new_node_data_list
    });

    this.delete_node_id=-1;
    this.delete_node_name="";
    this.reset_context_menu_settings();
}

function search_node_name(data)
{
    if(data.length>0)
    {   this.setState({new_node_name_close_button_visible:"block"});}
    else
    {   this.setState({new_node_name_close_button_visible:"none"});}

    const node_data_list=[...this.state.node_data_list];
    var no_of_match=0;
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
    var name_matched=false;
    if(no_of_match==1)
    {
        if(node_data_list[this.match_found_at].node_name.toUpperCase().localeCompare(data.toUpperCase())==0)
        {   name_matched=true;}
    }
    if(name_matched==true)
    {   
        var a;
        for(a=0;a<this.state.node_type_data_list.length;a++)
        {
            if(this.state.node_type_data_list[a].id==matched_node.node_type_id)
            {break;}
        }
        this.setState({
            add_button_text:'Save Changes',
            new_node_type:this.state.node_type_data_list[a],
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
    this.setState({node_data_list:node_data_list});
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

function add_new_node()
{
    if(this.state.new_node_name.length==0)
    {
        this.setState({
            alert_dialog_text:"Node Name not entered !",
            alert_dialog_open:true
        });
    }
    else if(this.state.new_node_type==null || typeof this.state.new_node_type.node_type=='undefined')
    {
        this.setState({
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
            const node_data_list=[...this.state.node_data_list];
            node_data_list[this.match_found_at].node_type_id=this.state.new_node_type.id;
            node_data_list[this.match_found_at].node_name=this.state.edit_node_name;
            //Here another js chamatkar is going on, without setting the state on node_data_list the particular variable gets changed.
            this.delete_node_from_network(this.state.matched_node.node_id);
            this.add_node_to_network(edited_node,node_data_list.length-1);
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

function add_new_relation_body(last_entered_relation)
{
    const relation_data_list=[...this.state.relation_data_list];
    relation_data_list.push(last_entered_relation);
    this.setState({
        relation_data_list:relation_data_list
    });
    this.add_relation_to_network(last_entered_relation,relation_data_list.length-1);
}

function add_new_relation()
{
    if(this.state.source_node==null || typeof this.state.source_node.node_name=='undefined')
    {
        this.setState({
            alert_dialog_text:"Source Node not selected !",
            alert_dialog_open:true
        });
    }
    else if(this.state.destination_node==null || typeof this.state.destination_node.node_name=='undefined')
    {
        this.setState({
            alert_dialog_text:"Destination Node not selected !",
            alert_dialog_open:true
        });
    }
    else if(this.state.new_relation_type==null || typeof this.state.new_relation_type.relation_type=='undefined')
    {
        this.setState({
            alert_dialog_text:"Relation Type not specified !",
            alert_dialog_open:true
        });
    }
    else if(this.state.source_node.node_id==this.state.destination_node.node_id)
    {
        this.setState({
            alert_dialog_text:"Source and Destination nodes cannot be the same !",
            alert_dialog_open:true
        });
    }
    else
    {
        const relation_data_list=[...this.state.relation_data_list];
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
        if(source_found && destination_found && relation_type_found /*&& !this.state.edit_mode_on*/)
        {
            this.setState({
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
                var relation_index=this.get_relation_indexed_from_relation_id(relation.relation_id);
                relation_data_list[relation_index].relation_type_id=relation.relation_type_id;
                relation_data_list[relation_index].source_node_id=relation.source_node_id;
                relation_data_list[relation_index].destination_node_id=relation.destination_node_id;
                relation_data_list[relation_index].source_url_list=relation.source_url_list;
                relation_data_list[relation_index].source_local=[];
                for(var a=0;a<relation.source_local.length;a++)
                {   relation_data_list[relation_index].source_local.push(relation.source_local[a].new_file_dir);}
                this.setState({relation_data_list});
                //edit the relation in the network.
                this.delete_relation_from_network(relation.relation_id);
                this.add_relation_to_network(relation,relation_index);
            }
        }
    }
}

function add_source_url_to_list()
{
    if(this.state.source_url.length==0)
    {
        this.setState({
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
            this.setState({
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
            this.sleep(1).then(() => {
                this.enable_disable_save_relation_button();
            });
        }
    }
}

function delete_source_url_from_list(id)
{
    const url_list=[...this.state.source_url_list];
    const new_url_list=url_list.filter(item=>item.id!=id);
    this.setState({source_url_list:new_url_list});
    this.sleep(1).then(() => {
        this.enable_disable_save_relation_button();
    });
}

function search_source_url(data)
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

function add_file_dir(data)
{
    const file_dir_list=[...this.state.file_dir_list];
    var data={
        'id':file_dir_list.length,
        'file_name':data.file_name,
        'new_file_dir':data.new_file_dir,
        'file_dir':""+data.file_dir
    };
    file_dir_list.push(data);
    this.setState({file_dir_list});
    this.sleep(1).then(() => {
        this.enable_disable_save_relation_button();
    });
}

function remove_dir_from_file_dir_list(id)
{
    const file_dir_list=[...this.state.file_dir_list];
    const new_file_dir_list=file_dir_list.filter(item=>item.id!=id);
    this.setState({file_dir_list:new_file_dir_list});
    this.sleep(1).then(() => {
        this.enable_disable_save_relation_button();
    });
}

function search_grouped_relation(type)//will be used later
{
   
}

export function add_panel(THIS)
{
    return(
        <Drawer variant="persistent"
            anchor="left"
            open={THIS.state.add_drawer_open}
            className={THIS.props.classes.drawer}
            classes={{paper: THIS.props.classes.drawerPaper2,}}>
            <Toolbar variant="dense" ref={THIS.add_node_ref}/>
        
            <Grid container direction="column" className={THIS.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                <List className={THIS.props.classes.list_class} > 
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Typography
                        color="primary"
                        display="block"
                        variant="caption">
                        New Node
                        </Typography>
                    </Grid>
                    <ListItem>
                        <TextField 
                        label='Node Name'
                        variant='outlined' 
                        size='small' 
                        value={THIS.state.new_node_name}
                        onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                        onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                        onChange={
                            e => {
                                THIS.setState({new_node_name:e.target.value});
                                THIS.search_node_name(e.target.value);
                            }}                                            
                        style={{width:300}} 
                        InputLabelProps={
                        {   className: THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: THIS.props.classes.valueTextField,
                            classes:{
                                root:THIS.props.classes.root,
                                notchedOutline: THIS.props.classes.valueTextField,
                                disabled: THIS.props.classes.valueTextField
                            },
                            endAdornment: 
                            (
                                <Box display={THIS.state.new_node_name_close_button_visible}> 
                                    <IconButton color='primary' size='small'
                                    onClick={
                                        e=>{
                                            THIS.search_node_name("");
                                            THIS.setState({new_node_name:""});
                                        }
                                    }>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box> 
                            ),
                        }}/>
                    </ListItem>
                    <ListItem>
                        <List className={THIS.props.classes.properties_list_class}>
                        {
                            THIS.state.node_data_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                        <ListItem button key={item.node_id}>
                                            <ListItemText primary={<Typography type="body2" style={{ color:'#FFFFFF'}}>{item.node_name}</Typography>} />
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    THIS.delete_node_id=item.node_id;
                                                    THIS.delete_node_name=item.node_name;
                                                    THIS.permission_dialog_purpose_code=3;
                                                    THIS.permission_dialog_options(1);
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
                    </ListItem>
                    <ListItem>
                        <Box display={THIS.state.edit_node_name_box_visible} style={{width:300}}> 
                            <TextField 
                            label='New Node Name'
                            variant='outlined' 
                            size='small' 
                            value={THIS.state.edit_node_name}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e => 
                                {
                                    var disable_add_button;
                                    if(e.target.value.toUpperCase().localeCompare(THIS.state.new_node_name.toUpperCase())==0)
                                    {   disable_add_button=true;}
                                    else
                                    {   
                                        disable_add_button=false;
                                        for(let a=0;a<THIS.state.node_data_list.length;a++)
                                        {
                                            if(THIS.state.node_data_list[a].node_name.toUpperCase().localeCompare(e.target.value.toUpperCase())==0)
                                            {   disable_add_button=true;break;}
                                        }
                                    }
                                    THIS.setState({
                                        edit_node_name:e.target.value,
                                        disable_add_button:disable_add_button
                                    });
                                    if(e.target.value.length!=0)
                                    {   THIS.setState({edit_node_name_close_button:'block'});}
                                    else
                                    {   THIS.setState({edit_node_name_close_button:'none'});}
                                }}
                            InputLabelProps={
                            {   className: THIS.props.classes.textfield_label}}
                            InputProps={{
                                className: THIS.props.classes.valueTextField,
                                classes:{
                                    root:THIS.props.classes.root,
                                    notchedOutline: THIS.props.classes.valueTextField,
                                    disabled: THIS.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <Box display={THIS.state.edit_node_name_close_button}> 
                                        <IconButton color='primary' size='small'
                                        onClick={e=>{THIS.setState({edit_node_name:"",edit_node_name_close_button:'none'})}}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                        </Box>                
                    </ListItem>
                    <ListItem>
                        <Autocomplete
                        size="small"
                        classes={THIS.props.classes}
                        options={THIS.state.node_type_data_list}
                        getOptionLabel={(option) => option.node_type}
                        style={{ width: 300 }}
                        onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                        onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                        value={THIS.state.new_node_type}
                        onChange={(event,value)=>
                            {
                                THIS.setState({new_node_type:value});
                                if(THIS.state.matched_node!=undefined)
                                {
                                    var found=false;
                                    if(value.id==THIS.state.matched_node.node_type_id)
                                    {found=true;}
                                    THIS.setState({disable_add_button:found});
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
                                        className: THIS.props.classes.textfield_label
                                }}
                                />
                        }
                        />
                    </ListItem>
                    <ListItem ref={THIS.add_relation_ref}>
                        <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                            onClick={e=>{THIS.add_new_node();}}
                            classes={{root: THIS.props.classes.button, disabled: THIS.props.classes.disabled_button }}
                            disabled={THIS.state.disable_add_button}>{THIS.state.add_button_text}</Button>
                    </ListItem>
                    <Divider light classes={{root:THIS.props.classes.divider}}/>
                    <ListItem>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Typography
                            color="primary"
                            display="block"
                            variant="caption"
                            >
                            New Relation
                            </Typography>
                        </Grid>
                    </ListItem>
                    <ListItem>
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
                            value={THIS.state.edit_relation_id}
                            style={{width:'34%'}} 
                            InputLabelProps={
                            {   className: THIS.props.classes.textfield_label}}
                            InputProps={{
                                className: THIS.props.classes.valueTextField,
                                classes:{
                                    root:THIS.props.classes.root,
                                    notchedOutline: THIS.props.classes.valueTextField,
                                    disabled: THIS.props.classes.valueTextField
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
                            classes={{track:THIS.props.classes.track,}}
                            checked={THIS.state.edit_mode_on}
                            onClick={()=>{  THIS.edit_relation_switch_toggle(!THIS.state.edit_mode_on);}}
                            />
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                From:
                            </Typography>
                            <Autocomplete
                            id="combo-box-demo"
                            classes={THIS.props.classes}
                            size="small"
                            options={THIS.state.node_data_list}
                            getOptionLabel={(option) => option.node_name}
                            style={{ width: '85%' }}
                            value={THIS.state.source_node}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={(event,value)=>
                                {
                                    THIS.setState({source_node:value});
                                    THIS.sleep(1).then(() => {
                                        THIS.enable_disable_save_relation_button();
                                    });
                                }}
                            renderInput=
                            {
                                (params) => 
                                    <TextField {...params} label="Source Node.." variant="outlined" 
                                    InputLabelProps=
                                    {{   
                                            ...params.InputLabelProps,
                                            className: THIS.props.classes.textfield_label
                                    }}
                                    />
                            }
                            />
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                To:
                            </Typography>
                            <Autocomplete
                            id="combo-box-demo"
                            classes={THIS.props.classes}
                            size="small"
                            options={THIS.state.node_data_list}
                            getOptionLabel={(option) => option.node_name}
                            style={{ width: '85%' }}
                            value={THIS.state.destination_node}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={(event,value)=>
                                {
                                    THIS.setState({destination_node:value});
                                    THIS.sleep(1).then(() => {
                                        THIS.enable_disable_save_relation_button();
                                    });
                                }}
                            renderInput=
                            {
                                (params) => 
                                    <TextField {...params} label="Destination Node.." variant="outlined" 
                                    InputLabelProps=
                                    {{   
                                            ...params.InputLabelProps,
                                            className: THIS.props.classes.textfield_label
                                    }}
                                    />
                            }
                            />
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                Type:
                            </Typography>
                            <Autocomplete
                            id="combo-box-demo"
                            classes={THIS.props.classes}
                            size="small"
                            options={THIS.state.relation_type_data_list}
                            getOptionLabel={(option) => option.relation_type}
                            style={{ width: '85%' }}
                            value={THIS.state.new_relation_type}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={(event,value)=>
                                {
                                    THIS.setState({new_relation_type:value});
                                    THIS.sleep(1).then(() => {
                                        THIS.enable_disable_save_relation_button();
                                    });
                                }}
                            renderInput=
                            {
                                (params) => 
                                    <TextField {...params} label="Relation Type.." variant="outlined" 
                                    InputLabelProps=
                                    {{   
                                            ...params.InputLabelProps,
                                            className: THIS.props.classes.textfield_label
                                    }}
                                    />
                            }
                            />
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <IconButton color='primary' size="small"
                                onClick={e=>{THIS.add_source_url_to_list();}}>
                                <AddIcon/>
                            </IconButton>
                            <TextField         
                            label='Source URL' 
                            variant='outlined' 
                            size='small'                                          
                            style={{ width: '85%' }}
                            value={THIS.state.source_url}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e=>{
                                    THIS.setState({
                                        source_url:e.target.value
                                    });
                                    THIS.search_source_url(e.target.value);
                                }
                            }
                            InputLabelProps={
                            {   className: THIS.props.classes.textfield_label}}
                            InputProps={{
                                className: THIS.props.classes.valueTextField,
                                classes:{
                                    root:THIS.props.classes.root,
                                    notchedOutline: THIS.props.classes.valueTextField,
                                    disabled: THIS.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <Box display={THIS.state.source_url_close_button_visible}> 
                                        <IconButton color='primary' size='small'
                                        onClick={
                                            e=>{
                                                THIS.search_source_url("");
                                                THIS.setState({source_url:""})
                                            }
                                        }>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                            
                        </Grid>
                    </ListItem>
                    <ListItem> 
                        <List className={THIS.props.classes.properties_list_class}> 
                        {
                            THIS.state.source_url_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                        <ListItem button key={item.id}>
                                            <TextField         
                                            variant='outlined' 
                                            size='small'                                          
                                            style={{ width: '85%' }}
                                            value={item.url}
                                            InputLabelProps={
                                            {   className: THIS.props.classes.textfield_label}}
                                            InputProps={{
                                                className: THIS.props.classes.valueTextField,
                                                classes:{
                                                    root:THIS.props.classes.root,
                                                    notchedOutline: THIS.props.classes.valueTextField,
                                                    disabled: THIS.props.classes.valueTextField
                                                }
                                            }}/>

                                            <IconButton color='primary' size='small'
                                            onClick={e=>{THIS.delete_source_url_from_list(item.id);}}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItem>
                                    )
                                }
                            })
                        }
                        </List>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                Attached Files:
                            </Typography>
                            <IconButton color='primary' 
                            onClick={e=>{window.ipcRenderer.send("open_file_picker","");}}>
                                <NoteAddIcon/>
                            </IconButton>  
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <List className={THIS.props.classes.properties_list_class}> 
                        {
                            THIS.state.file_dir_list.map(item=>
                            {
                                return(
                                    <ListItem button key={item.id}>
                                        <Tooltip title={item.file_dir}>
                                        <TextField         
                                        variant='outlined' 
                                        size='small'                                          
                                        style={{ width: '85%' }}
                                        value={item.file_name}
                                        InputLabelProps={
                                        {   className: THIS.props.classes.textfield_label}}
                                        InputProps={{
                                            className: THIS.props.classes.valueTextField,
                                            classes:{
                                                root:THIS.props.classes.root,
                                                notchedOutline: THIS.props.classes.valueTextField,
                                                disabled: THIS.props.classes.valueTextField
                                            }
                                        }}/>
                                        </Tooltip>
                                        <IconButton color='primary' size='small'
                                        onClick={e=>{THIS.remove_dir_from_file_dir_list(item.id)}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItem>
                                )
                            })
                        }
                        </List>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                        classes={{root: THIS.props.classes.button, disabled: THIS.props.classes.disabled_button }}
                        disabled={THIS.state.disable_relation_add_button}
                        onClick={e=>{THIS.add_new_relation();}}>{THIS.state.relation_add_button_text}</Button>
                    </ListItem>
                </List>
            </Grid>
        </Drawer>
    );
}