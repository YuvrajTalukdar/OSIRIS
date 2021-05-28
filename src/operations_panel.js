import {Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,Box,FormControl,Select,MenuItem} from '@material-ui/core';
import ColorPicker from "material-ui-color-picker";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

export function add_operations_func(CLASS)
{
    CLASS.prototype.search_operation = search_operation;
    CLASS.prototype.find_sortest_path = find_sortest_path;
    CLASS.prototype.find_MST = find_MST;
}

function search_operation(op_name)
{
    let operation_list=[...this.state.operation_list];
    for(let a=0;a<operation_list.length;a++)
    {
        if(op_name.length==0 || operation_list[a].name.toUpperCase().includes(op_name.toUpperCase()))
        {   operation_list[a].display='block';}
        else
        {   operation_list[a].display='none';}
    }
    this.setState({operation_list});
}

function find_sortest_path()
{

}

function find_MST()
{

}

export function add_operations_panel(THIS)
{   
    return(
        <Drawer variant="persistent"
            anchor="left"
            open={THIS.state.operation_drawer_open}
            className={THIS.props.classes.drawer}
            classes={{paper: THIS.props.classes.drawerPaper2,}}>
            <Toolbar variant="dense"/>
            <Grid container direction="column" className={THIS.props.classes.gridDrawer} xs={12} alignItems="center" justify="flex-start">
                <TextField         
                label='Search Operations' 
                variant='outlined' 
                size='small'                                          
                style={{ width: '90%'}}
                value={THIS.state.search_operation_text}
                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                onChange={
                    e=>{
                        let display_close_btn;
                        if(e.target.value.length>0)
                        {   display_close_btn='block';}
                        else
                        {   display_close_btn='none';}
                        THIS.setState({
                            search_operations_text_close_btn:display_close_btn,
                            search_operation_text:e.target.value
                        });
                        THIS.search_operation(e.target.value);
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
                        <Box display={THIS.state.search_operations_text_close_btn}> 
                            <IconButton color='primary' size='small'
                            onClick={
                                e=>{
                                    THIS.search_operation("");
                                    THIS.setState({
                                        search_operation_text:"",
                                        search_operations_text_close_btn:'none'
                                    })
                                }
                            }>
                                <CloseIcon/>
                            </IconButton>
                        </Box> 
                    ),
                }}/>
                <List className={THIS.props.classes.list_class}> 
                    <Box display={THIS.state.operation_list[0].display}>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                    {THIS.state.operation_list[0].name}
                                </Typography>
                                <Autocomplete
                                size="small"
                                classes={THIS.props.classes}
                                options={THIS.state.node_data_list}
                                getOptionLabel={(option) => option.node_name}
                                style={{ width: 300, paddingTop:10}}
                                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                value={THIS.state.node1}
                                onChange={(event,value)=>
                                    {
                                        THIS.setState({sortest_path_node_source:value});
                                    }}
                                renderInput=
                                {
                                    (params) => 
                                        <TextField 
                                        {...params} label="Source Node.." variant="outlined" 
                                        InputLabelProps=
                                        {{   
                                                ...params.InputLabelProps,
                                                className: THIS.props.classes.textfield_label
                                        }}
                                        />
                                }
                                />
                                <Autocomplete
                                size="small"
                                classes={THIS.props.classes}
                                options={THIS.state.node_data_list}
                                getOptionLabel={(option) => option.node_name}
                                style={{ width: 300, paddingTop:10,paddingBottom:10 }}
                                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                value={THIS.state.new_node_type}
                                onChange={(event,value)=>
                                    {
                                        THIS.setState({sortest_path_node_destination:value});
                                    }}
                                renderInput=
                                {
                                    (params) => 
                                        <TextField 
                                        {...params} label="Destination Node.." variant="outlined" 
                                        InputLabelProps=
                                        {{   
                                                ...params.InputLabelProps,
                                                className: THIS.props.classes.textfield_label
                                        }}
                                        />
                                }
                                />
                                <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                                onClick={e=>{THIS.find_sortest_path();}}
                                classes={{root: THIS.props.classes.button}}>
                                    Find Sortest Path
                                </Button>
                            </Grid>
                        </ListItem>
                        <Divider light style={{paddingTop:1}} classes={{root:THIS.props.classes.divider}}/>
                    </Box>
                    <Box display={THIS.state.operation_list[1].display}>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                    {THIS.state.operation_list[1].name}
                                </Typography>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <IconButton color='primary' size="small"
                                        onClick={
                                            e=>
                                            {   if(THIS.state.mst_node!=undefined)
                                                {
                                                    let mst_node_list=[...THIS.state.mst_node_list];
                                                    let found=false;
                                                    for(let a=0;a<mst_node_list.length;a++)
                                                    {
                                                        if(mst_node_list[a].node_id==THIS.state.mst_node.node_id)
                                                        {   found=true;break;}
                                                    }
                                                    if(!found)
                                                    {
                                                        mst_node_list.push(THIS.state.mst_node);
                                                        THIS.setState({
                                                            mst_node:undefined,
                                                            mst_node_list
                                                        });
                                                    }
                                                }
                                            }}>
                                        <AddIcon/>
                                    </IconButton>
                                    <Autocomplete
                                    size="small"
                                    classes={THIS.props.classes}
                                    options={THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width:'86%', paddingTop:10,paddingBottom:10 }}
                                    onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                    value={THIS.state.new_node_type}
                                    onChange={(event,value)=>
                                        {
                                            THIS.setState({mst_node:value});
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField 
                                            {...params} label="Select Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                                <List className={THIS.props.classes.properties_list_class}> 
                                {
                                    THIS.state.mst_node_list.map(item=>
                                    {
                                        return(
                                            <ListItem button key={item.node_id}>
                                                <TextField         
                                                variant='outlined' 
                                                size='small'                                          
                                                style={{ width: '85%' }}
                                                value={item.node_name}
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
                                                onClick={
                                                    e=>
                                                    {
                                                        let mst_node_list=[...THIS.state.mst_node_list];
                                                        let new_mst_list=mst_node_list.filter(item2=>item2.node_id!=item.node_id);
                                                        THIS.setState({mst_node_list:new_mst_list});
                                                    }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItem>
                                        );
                                    })
                                }
                                </List>
                                <Button variant="contained" size="small" color="primary" style={{width:'100%',marginTop:10}}
                                onClick={e=>{THIS.find_MST();}}
                                classes={{root: THIS.props.classes.button}}>
                                    Find MST
                                </Button>
                            </Grid>
                        </ListItem>
                        <Divider light style={{paddingTop:1}} classes={{root:THIS.props.classes.divider}}/>
                    </Box>
                    <Box display={THIS.state.operation_list[2].display}>
                        <ListItem>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                    {THIS.state.operation_list[2].name}
                                </Typography>
                                <div className="colorPickerStyle">
                                    <ColorPicker
                                        name="color"
                                        variant='outlined' 
                                        size="small"
                                        style={{paddingTop:10}}
                                        onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                        onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                        onChange={color => {THIS.setState({cluster_color:color});}}
                                        InputProps={{
                                            value:THIS.state.cluster_color, 
                                            style:{color:THIS.state.cluster_color},
                                            classes:{
                                                root:THIS.props.classes.root,
                                                notchedOutline: THIS.props.classes.valueTextField,
                                                disabled: THIS.props.classes.valueTextField
                                            }
                                        }}
                                        value={THIS.state.cluster_color}
                                    />
                                </div>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <IconButton color='primary' size="small"
                                        onClick={
                                            e=>
                                            {   if(THIS.state.clustering_node!=undefined)
                                                {
                                                    let clustering_node_list=[...THIS.state.clustering_node_list];
                                                    let found=false;
                                                    for(let a=0;a<clustering_node_list.length;a++)
                                                    {
                                                        if(clustering_node_list[a].node_id==THIS.state.clustering_node.node_id)
                                                        {   found=true;break;}
                                                    }
                                                    if(!found)
                                                    {
                                                        clustering_node_list.push(THIS.state.clustering_node);
                                                        THIS.setState({
                                                            clustering_node:undefined,
                                                            clustering_node_list
                                                        });
                                                    }
                                                }
                                            }}>
                                        <AddIcon/>
                                    </IconButton>
                                    <Autocomplete
                                    size="small"
                                    classes={THIS.props.classes}
                                    options={THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width:'86%', paddingTop:10,paddingBottom:10 }}
                                    onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                    value={THIS.state.new_node_type}
                                    onChange={(event,value)=>
                                        {
                                            THIS.setState({clustering_node:value});
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField 
                                            {...params} label="Select Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                                <List className={THIS.props.classes.properties_list_class}> 
                                {
                                    THIS.state.clustering_node_list.map(item=>
                                    {
                                        return(
                                            <ListItem button key={item.node_id}>
                                                <TextField         
                                                variant='outlined' 
                                                size='small'                                          
                                                style={{ width: '85%' }}
                                                value={item.node_name}
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
                                                onClick={
                                                    e=>
                                                    {
                                                        let clustering_node_list=[...THIS.state.clustering_node_list];
                                                        let new_mst_list=clustering_node_list.filter(item2=>item2.node_id!=item.node_id);
                                                        THIS.setState({clustering_node_list:new_mst_list});
                                                    }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItem>
                                        );
                                    })
                                }
                                </List>
                                <Button variant="contained" size="small" color="primary" style={{width:'100%',marginTop:10}}
                                onClick={e=>{THIS.find_MST();}}
                                classes={{root: THIS.props.classes.button}}>
                                    Create Cluster
                                </Button>
                            </Grid>
                        </ListItem>
                    </Box>
                </List>
            </Grid>
        </Drawer>
    );
}