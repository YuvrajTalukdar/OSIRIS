import {Tooltip,Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,ListItemText,Box} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { Alert } from '@material-ui/lab';

export function add_add_panel_func(CLASS)
{
    CLASS.prototype.delete_node = delete_node;
    CLASS.prototype.search_node_name = search_node_name;
    CLASS.prototype.add_new_node_body = add_new_node_body;
    CLASS.prototype.add_new_node = add_new_node;
    CLASS.prototype.delete_relation = delete_relation;
    CLASS.prototype.add_new_relation = add_new_relation;
    CLASS.prototype.search_source_url = search_source_url;
    CLASS.prototype.add_source_url_to_list = add_source_url_to_list;
    CLASS.prototype.delete_source_url_from_list = delete_source_url_from_list;
    CLASS.prototype.add_file_dir = add_file_dir; 
    CLASS.prototype.remove_dir_from_file_dir_list = remove_dir_from_file_dir_list;  
    CLASS.prototype.add_new_relation_body = add_new_relation_body;
    CLASS.prototype.search_grouped_relation = search_grouped_relation;//will be used later   
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
}

function delete_node()
{
    const node_data_list=[...this.state.node_data_list];
    const new_node_data_list=node_data_list.filter(item=>item.node_id!=this.delete_node_id);

    window.ipcRenderer.send('delete_node',this.delete_node_id);
    this.delete_node_from_network(this.delete_node_id);

    this.delete_node_id=-1;
    this.delete_node_name="";

    this.setState({
        node_data_list:new_node_data_list
    });
}

function search_node_name(data)
{
    if(data.length>0)
    {   this.setState({new_node_name_close_button_visible:"block"});}
    else
    {   this.setState({new_node_name_close_button_visible:"none"});}

    const node_data_list=[...this.state.node_data_list];
    for(var a=0;a<node_data_list.length;a++)
    {
        if(node_data_list[a].node_name.toUpperCase().includes(data.toUpperCase()))
        {   node_data_list[a].show=true;}
        else
        {   node_data_list[a].show=false;}
        this.setState({
            node_data_list:node_data_list
        });
    }
}

function add_new_node_body(last_entered_node)
{
    const node_data_list=[...this.state.node_data_list];
    node_data_list.push(last_entered_node);
    this.setState({
        node_data_list:node_data_list
    });
    //alert("name="+last_entered_node.node_name+" id="+last_entered_node.node_id+" size="+this.state.node_data_list.length);
    this.add_node_to_network(last_entered_node);
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
        const node_data_list=[...this.state.node_data_list];
        var found=false;
        for(var a=0;a<node_data_list.length;a++)
        {
            if(node_data_list[a].node_name.toUpperCase().localeCompare(this.state.new_node_name.toUpperCase())==0)
            {   found=true;break;}
        }
        if(found)
        {   
            this.setState({
                alert_dialog_text:"Node Name "+this.state.new_node_name+" already present!",
                alert_dialog_open:true
            })
        }
        else
        {   
            var new_node={
                'node_type_id':this.state.new_node_type.id,
                'node_name':this.state.new_node_name
            };
            window.ipcRenderer.send('add_new_node',new_node);
        }
    
    }
}

function add_new_relation_body(last_entered_relation)
{
    const relation_data_list=[...this.state.relation_data_list];
    relation_data_list.push(last_entered_relation);
    this.setState({
        relation_data_list:relation_data_list
    });
    this.add_relation_to_network(last_entered_relation);
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

        if(source_found && destination_found && relation_type_found)
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
        }
    }
}

function delete_source_url_from_list(id)
{
    const url_list=[...this.state.source_url_list];
    const new_url_list=url_list.filter(item=>item.id!=id);
    this.setState({source_url_list:new_url_list});
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
}

function remove_dir_from_file_dir_list(id)
{
    const file_dir_list=[...this.state.file_dir_list];
    const new_file_dir_list=file_dir_list.filter(item=>item.id!=id);
    this.setState({file_dir_list:new_file_dir_list});
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
            <Toolbar variant="dense"/>
        
            <Grid container direction="column" className={THIS.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                <List className={THIS.props.classes.list_class}> 
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
                        label='New Node Name'
                        variant='outlined' 
                        size='small' 
                        value={THIS.state.new_node_name}
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
                                            THIS.setState({new_node_name:""})
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
                        <Autocomplete
                        size="small"
                        classes={THIS.props.classes}
                        options={THIS.state.node_type_data_list}
                        getOptionLabel={(option) => option.node_type}
                        style={{ width: 300 }}
                        value={THIS.state.new_node_type}
                        onChange={(event,value)=>
                            {THIS.setState({new_node_type:value,});}}
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
                    <ListItem>
                        <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                            onClick={e=>{THIS.add_new_node();}}>Add</Button>
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
                            onChange={(event,value)=>
                                {THIS.setState({source_node:value});}}
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
                            onChange={(event,value)=>
                                {THIS.setState({destination_node:value});}}
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
                            onChange={(event,value)=>
                                {THIS.setState({new_relation_type:value});}}
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
                        onClick={e=>{THIS.add_new_relation();}}>Add</Button>
                    </ListItem>
                </List>
            </Grid>
        </Drawer>
    );
}