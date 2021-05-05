import {Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,ListItemText,Box,FormControl,Select,MenuItem} from '@material-ui/core';
import ColorPicker from "material-ui-color-picker";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

export function add_node_relation_props_func(CLASS)
{
    CLASS.prototype.add_node_type = add_node_type;
    CLASS.prototype.delete_node_type = delete_node_type;
    CLASS.prototype.search_node_type = search_node_type;

    CLASS.prototype.Delete_Relation_Type = Delete_Relation_Type;
    CLASS.prototype.search_relation_type = search_relation_type;
    CLASS.prototype.add_relation_type = add_relation_type;
}

function add_node_type()
{
    const node_type_list=[...this.state.node_type_data_list];
    
    var found=false;
    for(var a=0;a<node_type_list.length;a++)
    {
        if(node_type_list[a].node_type.toUpperCase().localeCompare(this.state.node_type_name.toUpperCase())==0)
        {   found=true;break;}
    }
    if(!found)
    {
        var data={node_or_relation:0,type:this.state.node_type_name,color_code:""};
        window.ipcRenderer.send('add_node_relation_type',data);
        const newData={
            id:node_type_list[node_type_list.length-1].id+1,
            node_type:this.state.node_type_name.toUpperCase(),
            show:true,
        }
        node_type_list.push(newData);
        this.search_node_type("");
        this.setState({
            node_type_data_list:node_type_list
        })
    }
    else
    {
        if(this.state.node_type_name.length==0)
        {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a node type name!"});}
        else
        {   this.setState({alert_dialog_open:true,alert_dialog_text:"Node type already present!"});}
    }
}

function delete_node_type()
{
    const node_type_list=[...this.state.node_type_data_list];
    const new_node_type_list=node_type_list.filter(item=>item.id!=this.delete_node_type_id);
    
    var data={
        'id':this.delete_node_type_id,
        'node_or_relation':0
    }
    window.ipcRenderer.send('delete_node_relation_type',data);
    this.delete_node_type_id=-1;
    this.delete_node_type_name="";
    this.setState({
        node_type_data_list:new_node_type_list
    });
}

function search_node_type(data)
{
    if(data.length>0)
    {   this.setState({node_type_search_close_button_visible:"block"});}
    else
    {   this.setState({node_type_search_close_button_visible:"none"});}

    const node_type_list=[...this.state.node_type_data_list];
    for(var a=0;a<node_type_list.length;a++)
    {
        if(node_type_list[a].node_type.toUpperCase().includes(data.toUpperCase()))
        {   node_type_list[a].show=true;}
        else
        {   node_type_list[a].show=false;}
    }
    this.setState({
        node_type_data_list:node_type_list
    });
}

function Delete_Relation_Type()
{
    const relation_type_list=[...this.state.relation_type_data_list];
    const new_relation_type_list=relation_type_list.filter(item=>item.id!=this.delete_relation_type_id);

    var data={
        'id':this.delete_relation_type_id,
        'node_or_relation':1
    }
    window.ipcRenderer.send('delete_node_relation_type',data);
    this.delete_relation_type_id=-1
    this.delete_relation_type_name="";
    this.setState({
        relation_type_data_list:new_relation_type_list
    });
}

function search_relation_type(data)
{
    if(data.length>0)
    {   this.setState({relation_type_search_close_button_visible:"block"});}
    else
    {   this.setState({relation_type_search_close_button_visible:"none"});}
    
    const relation_type_list=[...this.state.relation_type_data_list];
    for(var a=0;a<relation_type_list.length;a++)
    {
        if(relation_type_list[a].relation_type.toUpperCase().includes(data.toUpperCase()))
        {   relation_type_list[a].show=true;}
        else
        {   relation_type_list[a].show=false;}
        this.setState({
            relation_type_data_list:relation_type_list
        });
    }
}

function add_relation_type()
{
    const relation_type_list=[...this.state.relation_type_data_list];

    var found=false;
    for(var a=0;a<relation_type_list.length;a++)
    {
        if(relation_type_list[a].relation_type.toUpperCase().localeCompare(this.state.relation_type_name.toUpperCase())==0)
        {   found=true;break;}
    }
    if(!found)
    {
        var data={
            node_or_relation:1,
            type:this.state.relation_type_name,
            color_code:this.state.color_picker_hex_value,
            vectored:this.state.vectored_relation
        };
        window.ipcRenderer.send('add_node_relation_type',data);
        const newData={
            id:relation_type_list[relation_type_list.length-1].id+1,
            relation_type:this.state.relation_type_name.toUpperCase(),
            color_code:this.state.color_picker_hex_value,
            show:true,
            vectored:this.state.vectored_relation
        }
        relation_type_list.push(newData);
        this.search_relation_type("");
        this.setState({
            relation_type_data_list:relation_type_list
        })
    }
    else
    {
        if(this.state.relation_type_name.length==0)
        {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a relation type name!"});}
        else
        {   this.setState({alert_dialog_open:true,alert_dialog_text:"Relation type already present!"});}
    }
}

export function relation_node_properties_panel(THIS)
{
    return(
        <Drawer variant="persistent"
                anchor="left"
                open={THIS.state.relation_node_properties_drawer_open}
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
                            Node Type
                            </Typography>
                        </Grid>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <TextField         
                                label='Node Type' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '79%' }}
                                onChange={
                                    e=>{
                                        THIS.setState({
                                            node_type_name:e.target.value
                                        });
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
                                    }
                                }}/>
                                <IconButton color='primary'
                                    onClick={e=>{THIS.add_node_type();}}>
                                    <AddIcon/>
                                </IconButton>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <TextField         
                                label='Search Node Types' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '100%' }}
                                value={THIS.state.node_type_search_text}
                                onChange={
                                    e=>{
                                        THIS.setState({
                                            node_type_search_text:e.target.value
                                        });
                                        THIS.search_node_type(e.target.value);
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
                                        <Box display={THIS.state.node_type_search_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    THIS.search_node_type("");
                                                    THIS.setState({node_type_search_text:""})
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
                                THIS.state.node_type_data_list.map(item=>
                                {
                                    if(item.show)
                                    {
                                        return(
                                        <ListItem button key={item.id}>
                                            <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{item.node_type}</Typography>} />
                                            <IconButton color='primary' size='small'
                                                onClick={
                                                e=>{
                                                    THIS.delete_node_type_id=item.id;
                                                    THIS.delete_node_type_name=item.node_type;
                                                    THIS.permission_dialog_purpose_code=1;
                                                    THIS.permission_dialog_options(1);
                                                } 
                                                }>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItem>
                                        );
                                    }
                                })
                            }
                            </List>
                        </ListItem>
                        <Divider light classes={{root:THIS.props.classes.divider}}/>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                Relation Properties
                                </Typography>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <TextField         
                                label='Relation Type' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '100%' }}
                                value={THIS.state.relation_type_name}
                                onChange={
                                    e=>{THIS.setState({relation_type_name:e.target.value});}
                                }
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
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <div className="colorPickerStyle">
                                <ColorPicker
                                    name="color"
                                    variant='outlined' 
                                    size="small"
                                    onChange={color => 
                                        {
                                            console.log(color);
                                            THIS.color_picker_handler(color);
                                        }}
                                    InputProps={{
                                        value:THIS.state.color_picker_hex_value, 
                                        style:{color:THIS.state.color_picker_hex_value},
                                        classes:{
                                            root:THIS.props.classes.root,
                                            notchedOutline: THIS.props.classes.valueTextField,
                                            disabled: THIS.props.classes.valueTextField
                                        }
                                    }}
                                    value={THIS.state.color_picker_hex_value}
                                />
                            </div>
                        </ListItem>
                        <ListItem>
                            <Grid container direction="row" justify="space-between" alignItems="center">
                                <Grid xs={6}>
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        Vectored Relation:
                                    </Typography>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl variant="outlined" 
                                    className={THIS.props.classes.formControl}
                                    size='small'>
                                        <Select
                                        labelId="encryption_status_select"
                                        id="encryption_status_select"
                                        size='small'
                                        value={THIS.state.vectored_relation}
                                        onChange={e=>{THIS.setState({vectored_relation:e.target.value});}}
                                        style={{width:'100%' }}
                                        MenuProps={{classes:{paper: THIS.props.classes.menu_dropdown_style}}}
                                        className={THIS.props.classes.select_style}
                                        inputProps={{
                                            classes: {
                                                root: THIS.props.classes.select_style,
                                                icon:THIS.props.classes.select_style
                                            },
                                        }}>
                                            <MenuItem value={true}>True</MenuItem>
                                            <MenuItem value={false}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                            onClick={
                                e=>{THIS.add_relation_type();}
                            }>Add</Button>
                        </ListItem>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <TextField         
                                label='Search Relation Types' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '100%' }}
                                value={THIS.state.relation_type_search_text}
                                onChange={
                                    e=>{
                                        THIS.setState({
                                            relation_type_search_text:e.target.value
                                        });
                                        THIS.search_relation_type(e.target.value);
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
                                        <Box display={THIS.state.relation_type_search_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    THIS.search_relation_type("");
                                                    THIS.setState({relation_type_search_text:""})
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
                                THIS.state.relation_type_data_list.map(item=>
                                {
                                    if(item.show)
                                    {
                                        return(
                                        <ListItem button key={item.id}>
                                            <ListItemText primary={<Typography type="body2" style={{ color: item.color_code }}>{item.relation_type}</Typography>} />
                                            <IconButton color='primary' size='small'
                                                onClick={
                                                e=>{
                                                    THIS.delete_relation_type_id=item.id;
                                                    THIS.delete_relation_type_name=item.relation_type;
                                                    THIS.permission_dialog_purpose_code=2;
                                                    THIS.permission_dialog_options(1);
                                                } 
                                                }>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItem>
                                        );
                                    }
                                })
                            }
                            </List>
                        </ListItem>
                    </List>
                </Grid>
            </Drawer>
    );
}